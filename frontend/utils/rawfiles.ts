"use server";

import fs from "fs";
import path from "path";

/**
 * Lee un archivo `.tsx` y devuelve su contenido como string.
 * @param filename Nombre del archivo sin extensión (ej. "navbar-1")
 * @returns Promise<string> Contenido del archivo o mensaje de error
 */
export async function getRawTsx(filename: string): Promise<string> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("❌ ERROR: getRawTsx solo puede ejecutarse en el servidor.");
    }

    // 📌 ✅ Asegurar la ruta correcta (ajústala si es necesario)
    const filePath = path.join(process.cwd(), "previewsComponents", `${filename}.tsx`);

    // 📌 ✅ Verificar si el archivo realmente existe
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Advertencia: No se encontró el archivo TSX para ${filename}.tsx en ${filePath}`);
      return "Código TSX no disponible.";
    }

    // 📌 ✅ Leer y retornar el contenido del archivo
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`❌ Error al leer el archivo TSX: ${filename}.tsx`, error);
    return "Error al cargar código TSX.";
  }
}
