"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { loadMdxComponents } from "@/utils/loadMdxFiles";
import CodeBlock from "@/components/ui/CodeBlock";

interface MdxData {
  filename: string;
  source: MDXRemoteSerializeResult;
}

interface MdxComponentData {
  component: React.ComponentType<Record<string, unknown>>; // Ajustado
  tsxSource: string;
}

interface PreviewListProps {
  mdxFiles: MdxData[];
}

export default function PreviewList({ mdxFiles }: PreviewListProps) {
  // Tipamos correctamente el state:
  const [components, setComponents] = useState<
    Record<string, MdxComponentData>
  >({});

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<Record<string, "preview" | "tsx">>(
    {}
  );

  const pathname = usePathname();
  const category = pathname.split("/").filter(Boolean).pop();

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      const loadedComponents = await loadMdxComponents(mdxFiles, category || "");
      setComponents(loadedComponents);
      setLoading(false);
    };

    fetchComponents();
  }, [mdxFiles, category]);

  if (loading)
    return <p className="text-gray-500 text-center">Cargando componentes...</p>;

  return (
    <div className="w-full">
      <div className="text-black py-8">
        <h1 className="text-3xl font-bold capitalize">{category} Components</h1>
        <p className="text-gray-400 text-lg">
          Explora diseños modernos y responsivos en {category}
        </p>
      </div>

      <div className="space-y-8 px-4">
        {!mdxFiles.length ? (
          <p className="text-gray-500 text-center">
            No hay componentes en esta categoría.
          </p>
        ) : (
          mdxFiles.map(({ filename }) => {
            const ComponentData = components[filename];
            if (!ComponentData || !ComponentData.component) return null;

            const { component: PreviewComponent, tsxSource } = ComponentData;
            const mode = viewMode[filename] || "preview";

            return (
              <section
                key={filename}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 relative"
              >
                {/* Título y Botones */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {filename.replace("-", " ")}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        mode === "preview"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setViewMode((prev) => ({
                          ...prev,
                          [filename]: "preview",
                        }))
                      }
                    >
                      Vista previa
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        mode === "tsx"
                          ? "bg-green-800 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setViewMode((prev) => ({ ...prev, [filename]: "tsx" }))
                      }
                    >
                      Código TSX
                    </button>
                  </div>
                </div>

                {/* Alternar entre Vista previa y Código TSX */}
                {mode === "preview" && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <PreviewComponent />
                  </div>
                )}

                {mode === "tsx" && <CodeBlock code={tsxSource} language="tsx" />}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
