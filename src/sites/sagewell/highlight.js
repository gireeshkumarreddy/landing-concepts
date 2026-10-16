// A deliberately tiny tokenizer for the three snippet languages on this page.
// Returns lines of [type, text] tokens; types map to .cr-t-* colour classes.

const KW = {
  python: new Set(['from', 'import', 'for', 'in', 'print', 'await', 'async', 'def', 'return', 'None', 'True', 'False']),
  ts: new Set(['import', 'from', 'const', 'await', 'new', 'for', 'of', 'let', 'return', 'async', 'true', 'false']),
  http: new Set(['curl', 'true', 'false']),
};

const RULES = {
  python: [
    ['c', /#[^\n]*/y],
    ['s', /"(?:[^"\\]|\\.)*"/y],
    ['n', /\d+(?:\.\d+)?/y],
    ['w', /[A-Za-z_]\w*/y],
    ['ws', /\s+/y],
    ['pu', /[()[\]{}.,:=]/y],
  ],
  ts: [
    ['c', /\/\/[^\n]*/y],
    ['s', /"(?:[^"\\]|\\.)*"/y],
    ['n', /\d+(?:\.\d+)?/y],
    ['w', /[A-Za-z_$][\w$]*/y],
    ['ws', /\s+/y],
    ['pu', /[()[\]{}.,:;=]/y],
  ],
  http: [
    ['s', /"(?:[^"\\]|\\.)*"/y],
    ['v', /\$[A-Z_]+/y],
    ['u', /https?:\/\/[^\s'"\\]+/y],
    ['f', /-{1,2}[A-Za-z][\w-]*/y],
    ['w', /[A-Za-z_]\w*/y],
    ['ws', /\s+/y],
    ['pu', /[{}:,'\\]/y],
  ],
};

function nextChar(line, from) {
  for (let i = from; i < line.length; i++) if (line[i] !== ' ') return line[i];
  return '';
}

function tokenizeLine(line, lang) {
  const out = [];
  let pos = 0;
  while (pos < line.length) {
    let matched = false;
    for (const [type, re] of RULES[lang]) {
      re.lastIndex = pos;
      const m = re.exec(line);
      if (!m || !m[0]) continue;
      const text = m[0];
      const end = pos + text.length;
      let t = type;
      if (type === 'w') {
        const nc = nextChar(line, end);
        if (KW[lang].has(text)) t = 'k';
        else if (nc === '(') t = 'fn';
        else if (/^[A-Z]/.test(text)) t = 'cl';
        else if ((nc === '=' && line[end + 1] !== '=' && lang === 'python') || (nc === ':' && lang === 'ts')) t = 'p';
        else t = 'tx';
      } else if (type === 's' && nextChar(line, end) === ':') t = 'p';
      else if (type === 'ws') t = 'tx';
      out.push([t, text]);
      pos = end;
      matched = true;
      break;
    }
    if (!matched) {
      out.push(['tx', line[pos]]);
      pos += 1;
    }
  }
  // merge adjacent plain tokens
  return out.reduce((acc, tok) => {
    const prev = acc[acc.length - 1];
    if (prev && prev[0] === tok[0] && (tok[0] === 'tx' || tok[0] === 'pu')) prev[1] += tok[1];
    else acc.push([...tok]);
    return acc;
  }, []);
}

export function highlight(code, lang) {
  return code.split('\n').map(l => tokenizeLine(l, lang));
}
