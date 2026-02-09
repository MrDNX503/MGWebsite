import Link from 'next/link';
<Link href="/admin/settings">Configuración</Link>

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-4xl md:text-5xl font-serif">Panel de Administración</h1>
          <div className="text-right">
            <p className="text-lg text-gray-300">Bienvenida, Maquilladora</p>
            <button className="mt-2 text-rose-400 hover:text-rose-300 transition">
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 hover:border-rose-600 transition-all duration-300">
            <h2 className="text-2xl font-serif mb-4 text-rose-400">Gestionar Servicios</h2>
            <p className="text-gray-300 mb-6">
              Agregar, editar o eliminar servicios, precios y descripciones.
            </p>
            <Link
              href="/admin/servicios"
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Ir a Servicios →
            </Link>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 hover:border-rose-600 transition-all duration-300">
            <h2 className="text-2xl font-serif mb-4 text-rose-400">Gestionar Galería</h2>
            <p className="text-gray-300 mb-6">
              Subir fotos antes/después, asignar a servicios y organizar la galería.
            </p>
            <Link
              href="/admin/galeria"
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Ir a Galería →
            </Link>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 hover:border-rose-600 transition-all duration-300">
            <h2 className="text-2xl font-serif mb-4 text-rose-400">Gestionar Citas</h2>
            <p className="text-gray-300 mb-6">
              Ver, confirmar, cancelar o bloquear horarios de citas.
            </p>
            <Link
              href="/admin/citas"
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Ir a Citas →
            </Link>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 hover:border-rose-600 transition-all duration-300">
            <h2 className="text-2xl font-serif mb-4 text-rose-400">Instagram & Contenido</h2>
            <p className="text-gray-300 mb-6">
              Configura tu username de Instagram para mostrar tu feed en la página Blog.
            </p>
            <Link
              href="/admin/blog"
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Configurar Instagram →
            </Link>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 hover:border-rose-600 transition-all duration-300">
            <h2 className="text-2xl font-serif mb-4 text-rose-400">Mensajes de Contacto</h2>
            <p className="text-gray-300 mb-6">
              Revisa los mensajes enviados desde el formulario de contacto.
            </p>
            <p className="text-gray-400 italic">(Próximamente: lista completa de mensajes)</p>
          </div>
        </div>
      </div>
    </div>
  );
}