import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Falta el nombre del archivo" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "previewsComponents", `${filename}.tsx`);

    // 📌 Verificar si el archivo existe antes de leerlo
    await fs.access(filePath);
    const content = await fs.readFile(filePath, "utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    console.warn("⚠️ No se encontró el archivo TSX:", error);
    return NextResponse.json({ content: "Código TSX no disponible." });
  }
}
