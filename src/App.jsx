import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollManager from './shared/ScrollManager.jsx';
import Hub from './hub/Hub.jsx';
import NotFound from './NotFound.jsx';

const Sagewell = lazy(() => import('./sites/sagewell/index.jsx'));
const Vantline = lazy(() => import('./sites/vantline/index.jsx'));
const Tidings = lazy(() => import('./sites/tidings/index.jsx'));
const Emberpost = lazy(() => import('./sites/emberpost/index.jsx'));
const CreativePortfolio = lazy(() => import('./sites/creative-portfolio/index.jsx'));
const MarenHolt = lazy(() => import('./sites/maren-holt/index.jsx'));

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/sagewell" element={<Sagewell />} />
          <Route path="/vantline" element={<Vantline />} />
          <Route path="/tidings" element={<Tidings />} />
          <Route path="/emberpost" element={<Emberpost />} />
          <Route path="/creative-portfolio" element={<CreativePortfolio />} />
          <Route path="/maren-holt" element={<MarenHolt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
