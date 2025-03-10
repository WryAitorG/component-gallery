"use client";

import React from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Estilo de ejemplo

type SyntaxHighlightProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SyntaxHighlight({ children, className }: SyntaxHighlightProps) {
  const codeRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children]);

  // Extraemos el lenguaje de la clase (p.ej. "language-js")
  const language = className?.replace("language-", "") || "";

  return (
    <pre>
      <code ref={codeRef} className={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
}
