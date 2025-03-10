import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const componentsPath = path.join(process.cwd(), 'componentsDB');

  try {
    const sections = fs.readdirSync(componentsPath).filter((dir) => 
      fs.statSync(path.join(componentsPath, dir)).isDirectory()
    );

    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'No se pudieron cargar los componentes' }, { status: 500 });
  }
}
