import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import PreviewList from "@/components/ui/Preview/index";

export const dynamic = "force-dynamic"; // 🚀 Evita caché en Vercel
export const revalidate = 0; // 🚀 Asegura renderizado en el servidor

interface MdxFile {
  filename: string;
  source: MDXRemoteSerializeResult;
}

export default async function ComponentsPage({ params }: { params: Promise<{ slug?: string }> }) {
  const { slug } = await params; // ✅ Ahora `params` es asíncrono y se espera antes de usarlo
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
    // ✅ Verificar si la carpeta existe antes de intentar leer archivos
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
