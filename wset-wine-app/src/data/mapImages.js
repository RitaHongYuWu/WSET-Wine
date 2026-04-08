// Import all study map PNGs from src/Maps/ using Vite's glob import.
// Each entry: { filename → resolved asset URL }
const rawMaps = import.meta.glob('../Maps/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const MAP_IMAGES = Object.fromEntries(
  Object.entries(rawMaps).map(([path, url]) => [path.split('/').pop(), url])
);
