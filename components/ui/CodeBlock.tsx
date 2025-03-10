"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 bg-[#282c34] rounded-lg shadow-lg text-white">
      {/* Botón para copiar */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-sm px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>

      {/* Resaltado de código */}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`p-4 overflow-auto rounded-md text-sm ${className}`} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line }); // ✅ Quitamos `key`
              return (
                <div key={i} {...lineProps}>
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token }); // ✅ Quitamos `key`
                    return <span key={key} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
