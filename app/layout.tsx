import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

// Componente cliente que registra el Service Worker (debes crearlo)
import { PwaRegister } from '@/components/PwaRegister';

const inter = Inter({ subsets: ['latin'] });

// Configuración viewport (themeColor va AQUÍ, no en metadata)
export const viewport: Viewport = {
  themeColor: '#d45b5b',
  // Puedes agregar más si lo necesitas, ej: width: 'device-width', initialScale: 1
};

export const metadata: Metadata = {
  title: 'MG MakeUp - Maquillaje Profesional',
  description: 'Servicios de maquillaje para bodas, 15 años, eventos y más',
  // Soporte PWA
  manifest: '/manifest.json',
  // Soporte iOS / Apple devices
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MG MakeUp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* No necesitas <meta name="theme-color"> aquí si usas viewport */}
      <body className={`${inter.className} bg-neutral text-gray-800`}>
        <Header />
        <main className="pt-16 md:pt-20 min-h-screen">
          {children}
        </main>
        <Footer />

        {/* Registra el Service Worker solo en el cliente */}
        <PwaRegister />

        {/* Fix para hidratación (mantengo tu script) */}
        <Script id="fix-hydration" strategy="afterInteractive">
          {`
            if (typeof document !== 'undefined') {
              const body = document.body;
              body.removeAttribute('data-new-gr-c-s-check-loaded');
              body.removeAttribute('data-gr-ext-installed');
            }
          `}
        </Script>
      </body>
    </html>
  );
}