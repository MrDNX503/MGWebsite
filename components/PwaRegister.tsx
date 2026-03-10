"use client";

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    console.log("[PWA] PwaRegister montado – verificando SW");

    if ("serviceWorker" in navigator) {
      console.log("[PWA] ServiceWorker soportado");

      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js");
          console.log("[PWA] SW registrado OK – Scope:", reg.scope);
          console.log("[PWA] Estado:", reg.active ? "activo" : reg.installing ? "instalando" : "esperando");
        } catch (err) {
          console.error("[PWA] Error al registrar SW:", err.message || err);
        }
      };

      register();  // ← Registra YA, sin esperar load

      // Detecta el prompt (para confirmar si Chrome lo considera instalable)
      window.addEventListener('beforeinstallprompt', (e) => {
        console.log("[PWA] beforeinstallprompt FIRED – Chrome quiere mostrar el botón!");
        // e.preventDefault(); // comenta si quieres control manual
      });
    } else {
      console.log("[PWA] SW NO soportado");
    }
  }, []);

  return null;
}