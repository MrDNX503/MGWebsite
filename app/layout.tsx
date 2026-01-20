import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';
import './globals.css'; // Asegúrate de que globals.css tenga @tailwind base; @tailwind components; @tailwind utilities;

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
        {children}
        <Footer />
      </body>
    </html>
  );
}