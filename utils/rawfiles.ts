export async function getRawTsx(filename: string): Promise<string> {
  try {
    const response = await fetch(`/api/getTsx?filename=${encodeURIComponent(filename)}`);
    const data = await response.json();
    return data.content || "Código TSX no disponible.";
  } catch (error) {
    console.warn(`⚠️ Error al obtener el archivo TSX para ${filename}:`, error);
    return "Código TSX no disponible.";
  }
}
