import { Link } from 'react-router-dom';
import { SITES } from './sites.js';
import { useSiteMeta } from './shared/useSiteMeta.js';

export default function NotFound() {
  useSiteMeta({ title: 'Page not found', background: '#f4f3ef' });
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, font: '400 16px/1.5 system-ui, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 420 }}>
        <p style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#777' }}>404</p>
        <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: '8px 0 16px', fontWeight: 600 }}>This page doesn’t exist.</h1>
        <p style={{ color: '#555', marginBottom: 20 }}>Try one of the six concepts instead:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {SITES.map(s => (
            <li key={s.slug}><Link to={`/${s.slug}`} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>{s.name}</Link> <span style={{ color: '#888' }}>— {s.kind}</span></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
