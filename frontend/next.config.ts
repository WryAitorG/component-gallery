// next.config.js
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  // Opcional: aquí puedes configurar remark/rehype plugins si quieres
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  webpack: (config) => {
    // Agregar regla para soportar `raw-loader` en archivos .tsx con la query `?raw`
    config.module.rules.push({
      test: /\.tsx?$/,
      resourceQuery: /raw/,
      use: "raw-loader",
    });

    return config;
  },
};

export default withMDX(nextConfig);
