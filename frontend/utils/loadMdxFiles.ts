import { getRawTsx } from "@/utils/rawfiles";

export async function loadMdxComponents(mdxFiles: { filename: string }[], category: string) {
  if (!category) return {};

  const imports = await Promise.all(
    mdxFiles.map(async ({ filename }) => {
      try {
        // 📌 ✅ Importar el MDX como componente
        const module = await import(`@/componentsDB/${category}/${filename}.mdx`);

        // 📌 ✅ Obtener el código TSX como string desde utils/rawfiles.ts
        const tsxSource = await getRawTsx(filename); // 👈 Importante usar `await`

        return { [filename]: { component: module.default, tsxSource } };
      } catch (error) {
        console.error(`❌ Error al cargar ${category}/${filename}:`, error);
        return { [filename]: { component: null, tsxSource: "Error al cargar código TSX." } };
      }
    })
  );

  return imports.reduce((acc, item) => ({ ...acc, ...item }), {});
}
