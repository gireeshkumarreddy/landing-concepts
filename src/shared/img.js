// Unsplash photos are hotlinked from images.unsplash.com, as the Unsplash licence
// and API guidelines expect. Pass the id that follows "photo-" in the CDN URL.
export function unsplash(id, { w = 1600, h, q = 75, fit = 'crop', crop } = {}) {
  const params = new URLSearchParams({ auto: 'format', fit, w: String(w), q: String(q) });
  if (h) params.set('h', String(h));
  if (crop) params.set('crop', crop);
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

// `ratio` is height / width; omit it to keep the photo's own aspect ratio.
export function unsplashSrcSet(id, widths = [480, 800, 1200, 1600, 2200], { ratio, ...opts } = {}) {
  return widths
    .map(w => `${unsplash(id, { ...opts, w, h: ratio ? Math.round(w * ratio) : undefined })} ${w}w`)
    .join(', ');
}
