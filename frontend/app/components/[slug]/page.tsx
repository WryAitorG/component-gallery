import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import PreviewList from "@/components/ui/Preview/index";

export const dynamic = "force-dynamic"; // 🚀 Asegura que siempre se renderice en el servidor
export const revalidate = 0; // 🚀 Evita caché en la build
export const fetchCache = "force-no-store"; // 🚀 No almacena caché en producción

interface MdxFile {
  filename: string;
  source: MDXRemoteSerializeResult;
}

// ✅ `params` ahora es una `Promise` y se resuelve con `await`
export default async function ComponentsPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const params = await paramsPromise; // ✅ Next.js 15 espera esto en producción
  const slug = params.slug ? decodeURIComponent(params.slug) : "";

  if (!slug) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>⚠️ Error: No se proporcionó un slug válido</h1>
      </div>
    );
  }

  const componentDir = path.join(process.cwd(), "componentsDB", slug);
  let mdxFiles: MdxFile[] = [];

  try {
    await fs.access(componentDir); // ✅ Verifica si la carpeta existe en Vercel
    const files = await fs.readdir(componentDir);
    const mdxFilesFiltered = files.filter((f) => f.endsWith(".mdx"));

    if (!mdxFilesFiltered.length) {
      return (
        <div style={{ padding: "1rem" }}>
          <h1>⚠️ No hay archivos en esta categoría</h1>
        </div>
      );
    }

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
    return (
      <div style={{ padding: "1rem" }}>
        <h1>⚠️ Error al cargar los archivos MDX</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>📂 Componentes de {slug}</h1>
      {mdxFiles.length > 0 ? (
        <PreviewList mdxFiles={mdxFiles} />
      ) : (
        <p>⚠️ No hay archivos MDX disponibles en esta categoría.</p>
      )}
    </div>
  );
}
