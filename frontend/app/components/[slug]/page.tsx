import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import PreviewList from "@/components/ui/Preview/index";

export const dynamic = "force-dynamic"; // 🔥 Evita la generación estática en Vercel
export const revalidate = 0; // 🔥 Se asegura que siempre se renderice en el servidor
export const fetchCache = "force-no-store"; // 🔥 Desactiva la caché en producción

interface MdxFile {
  filename: string;
  source: MDXRemoteSerializeResult;
}

// 🔥 Ajustamos `params` para que sea tratado como una `Promise`
export default async function ComponentsPage({ params }: { params: Promise<{ slug?: string }> }) {
  const resolvedParams = await params; // ✅ Esperamos la promesa
  const slug = resolvedParams.slug || "";

  if (!slug) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>Error: No se proporcionó un slug válido</h1>
      </div>
    );
  }

  const componentDir = path.join(process.cwd(), "componentsDB", slug);
  let mdxFiles: MdxFile[] = [];

  try {
    const files = await fs.readdir(componentDir).catch(() => []);
    const mdxFilesFiltered = files.filter((f) => f.endsWith(".mdx"));

    mdxFiles = await Promise.all(
      mdxFilesFiltered.map(async (file) => {
        const content = await fs.readFile(path.join(componentDir, file), "utf-8");
        const { content: mdxContent } = matter(content);

        return {
          filename: file.replace(".mdx", ""),
          source: await serialize(mdxContent),
        };
      })
    );
  } catch (err) {
    console.error("❌ Error al cargar los archivos MDX:", err);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Componentes de {slug}</h1>
      {mdxFiles.length > 0 ? (
        <PreviewList mdxFiles={mdxFiles} />
      ) : (
        <p>No hay archivos MDX disponibles en esta categoría.</p>
      )}
    </div>
  );
}
