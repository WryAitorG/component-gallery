"use client";

import React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import SyntaxHighlight from "./SyntaxHeighlight";

// Si quisieras usar componentes MDX personalizados:
const mdxComponents = {
  code: SyntaxHighlight,
  // ...aquí podrías mapear más componentes MDX
};

interface MDXRemoteClientProps {
  source: MDXRemoteSerializeResult;
}

export default function MDXRemoteClient({ source }: MDXRemoteClientProps) {
  return <MDXRemote {...source} components={mdxComponents} />;
}
