import { getRawTsx } from "@/utils/rawfiles";

export async function loadMdxComponents(mdxFiles: { filename: string }[], category: string) {
  if (!category) return {};

  const imports = await Promise.all(
    mdxFiles.map(async ({ filename }) => {
      try {
        const module = await import(`@/componentsDB/${category}/${filename}.mdx`);

        // ✅ Obtener el código TSX desde la API en vez de leerlo con `fs`
        const tsxSource = await getRawTsx(filename);

        return { [filename]: { component: module.default, tsxSource } };
      } catch (error) {
        console.error(`❌ Error al cargar ${category}/${filename}:`, error);
        return { [filename]: { component: null, tsxSource: "Error al cargar código TSX." } };
      }
    })
  );

  return imports.reduce((acc, item) => ({ ...acc, ...item }), {});
}
