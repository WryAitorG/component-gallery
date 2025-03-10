"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">🚀 Bienvenido a la Galería de Componentes</h1>
      <Link
        href="/components"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-500 transition"
      >
        Ver Componentes →
      </Link>
    </div>
  );
}
