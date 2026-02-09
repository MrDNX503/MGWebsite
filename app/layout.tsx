import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // ← nuevo import
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MG MakeUp - Maquillaje Profesional',
  description: 'Servicios de maquillaje para eventos especiales',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-neutral text-gray-800`}>
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        {/* Script para fix hidratación por extensiones como Grammarly */}
        <Script id="fix-hydration" strategy="afterInteractive">
          {`
            if (typeof document !== 'undefined') {
              const body = document.body;
              body.removeAttribute('data-new-gr-c-s-check-loaded');
              body.removeAttribute('data-gr-ext-installed');
              // Agrega más si ves otros atributos inyectados
            }
          `}
        </Script>
      </body>
    </html>
  );
}