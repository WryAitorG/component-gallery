'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSections() {
      try {
        const { data } = await axios.get('/api/components');
        setSections(data);
      } catch (error) {
        console.error('Error cargando secciones:', error);
      }
    }
    fetchSections();
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Componentes</h2>
        <nav>
          <ul>
            {sections.map((section) => (
              <li key={section}>
                <Link 
                  href={`/components/${section}`} 
                  className={`block p-2 rounded ${pathname.startsWith(`/components/${section}`) ? 'bg-gray-700' : ''}`}
                >
                  {section}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
