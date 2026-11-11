// The studio credit in every concept's footer note: a plain link to the studio that made these concepts.
const style = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' };

export default function Credit() {
  return (
    <a href="https://teseract.pro/" target="_blank" rel="noopener" style={style}>
      TESERACT Creative Studios
    </a>
  );
}
