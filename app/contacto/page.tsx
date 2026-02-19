"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Estilo básico, personaliza después

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('instagram_username')
        .eq('role', 'admin')
        .maybeSingle();

      if (!error && data?.instagram_username) {
        setInstagramUsername(data.instagram_username);
      }
      setLoading(false);
    }
    fetchAdminData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    // mailto: simple (abre cliente de email)
    const subject = encodeURIComponent(`Consulta desde sitio web - ${formData.name}`);
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\n\nMensaje:\n${formData.message}`
    );
    const mailtoLink = `mailto:tuemailreal@ejemplo.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setStatus('success');
    setFormData({ name: '', email: '', phone: '', message: '' }); // reset
  };

  const whatsappLink = `https://wa.me/50369388836?text=¡Hola!%20Me%20gustaría%20contactarte%20desde%20tu%20sitio%20web%20😊`;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif text-center mb-8 text-white"
        >
          Contáctame
        </motion.h1>

        <p className="text-center text-lg md:text-xl text-neutral-400 mb-12 max-w-3xl mx-auto">
          ¿Quieres agendar una cita, preguntar por un servicio o simplemente charlar? ¡Estoy aquí para ayudarte!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info de contacto */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800"
          >
            <h2 className="text-2xl font-serif text-rose-500 mb-6">Datos de Contacto</h2>

            <ul className="space-y-6 text-neutral-300">
              <li className="flex items-center">
                <span className="text-rose-400 mr-3">WhatsApp:</span>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition">
                  +503 6938 8836
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-rose-400 mr-3">Email:</span>
                <a href="mailto:mgmakeup@ejemplo.com" className="hover:text-rose-300 transition">
                  mgmakeup@ejemplo.com {/* ← CAMBIA A REAL */}
                </a>
              </li>
              <li>
                <span className="text-rose-400 block mb-2">Redes Sociales:</span>
                <div className="flex space-x-6 mt-3">
                  {instagramUsername ? (
                    <a
                      href={`https://www.instagram.com/${instagramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-300 text-3xl transition"
                      aria-label="Instagram"
                    >
                      IG
                    </a>
                  ) : (
                    <span className="text-neutral-500">Cargando IG...</span>
                  )}
                  <a
                    href="https://www.facebook.com/tufacebookreal" // ← CAMBIA A REAL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400 hover:text-rose-300 text-3xl transition"
                    aria-label="Facebook"
                  >
                    FB
                  </a>
                  <a
                    href="https://www.tiktok.com/@tutiktokreal" // ← CAMBIA A REAL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400 hover:text-rose-300 text-3xl transition"
                    aria-label="TikTok"
                  >
                    TT
                  </a>
                </div>
              </li>
            </ul>
          </motion.section>

          {/* Formulario */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800"
          >
            <h2 className="text-2xl font-serif text-rose-500 mb-6">Envíame un mensaje</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Teléfono (opcional)
                </label>
                <PhoneInput
                  country={'sv'} // El Salvador por default
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputClass="!w-full !bg-neutral-800 !border-neutral-700 !text-white !rounded-lg !py-3"
                  containerClass="!w-full"
                  buttonClass="!bg-neutral-700 !border-neutral-600"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-rose-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 text-white py-4 rounded-full font-semibold hover:bg-rose-700 transition shadow-lg hover:shadow-2xl hover:scale-105"
              >
                Enviar Mensaje
              </button>

              {status === 'success' && (
                <p className="text-green-400 text-center mt-4">¡Mensaje preparado! Revisa tu cliente de correo.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-center mt-4">Por favor completa todos los campos requeridos.</p>
              )}
            </form>
          </motion.section>
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-500">O contáctame directamente por WhatsApp para una respuesta más rápida</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Chatear por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}