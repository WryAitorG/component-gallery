import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const componentsPath = path.join(process.cwd(), 'componentsDB');

  try {
    const items = await fs.readdir(componentsPath);
    
    // Filtrar solo directorios
    const sections = [];
    for (const item of items) {
      const itemPath = path.join(componentsPath, item);
      const stat = await fs.stat(itemPath);
      if (stat.isDirectory()) {
        sections.push(item);
      }
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error('❌ Error al cargar los componentes:', error);
    return NextResponse.json(
      { error: 'No se pudieron cargar los componentes' },
      { status: 500 }
    );
  }
}
