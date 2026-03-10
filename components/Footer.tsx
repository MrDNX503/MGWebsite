import Link from 'next/link';
import NextImage from 'next/image';

export default function Footer() {
  // Configuración del enlace de WhatsApp
  const whatsappNumber = "50369388836";
  const whatsappMessage = "Hola MG MakeUp, me gustaría solicitar información.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="bg-neutral-900 py-8 text-center text-neutral-400 border-t border-neutral-800">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} MG MakeUp. Todos los derechos reservados.
      </p>
      
      <div className="flex justify-center items-center space-x-8 mt-6">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/meryguzman77/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
          aria-label="Instagram de MG MakeUp"
        >
          <NextImage 
            src="/instagram-icon.png" 
            alt="Instagram"
            width={32} 
            height={32}
            className="opacity-80 hover:opacity-100"
          />
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
          aria-label="Contactar por WhatsApp"
        >
          <NextImage 
            src="/whatsapp-icon.png" 
            alt="WhatsApp"
            width={32} 
            height={32}
            className="opacity-80 hover:opacity-100"
          />
        </a>
      </div>
    </footer>
  );
}