import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import PreviewList from "@/components/ui/Preview/index";

export default async function ComponentsPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise; // 🔥 Esto evita el error

  const componentDir = path.join(process.cwd(), "componentsDB", slug);
  let mdxFiles: { filename: string; source: any }[] = [];

  try {
    const files = fs.readdirSync(componentDir).filter((f) => f.endsWith(".mdx"));

    mdxFiles = await Promise.all(
      files.map(async (file) => {
        const content = fs.readFileSync(path.join(componentDir, file), "utf-8");
        const { content: mdxContent } = matter(content);

        return {
          filename: file.replace(".mdx", ""),
          source: await serialize(mdxContent),
        };
      })
    );
  } catch (err) {
    console.error(err);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Componentes de {slug}</h1>
      <PreviewList mdxFiles={mdxFiles} />
    </div>
  );
}
