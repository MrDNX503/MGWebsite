const withPWA = require('next-pwa')({
  dest: 'public',                   // carpeta donde se genera el service worker
  register: true,                   // registra el SW automáticamente
  skipWaiting: true,                // nuevo SW toma control inmediatamente
  disable: process.env.NODE_ENV === 'development', // no activa PWA en dev
  buildExcludes: [/middleware-manifest.json$/], // evita errores comunes
});

const nextConfig = {
  reactStrictMode: true,
  // aquí puedes agregar otras configs si necesitas (ej. images, etc.)
};

module.exports = withPWA(nextConfig);