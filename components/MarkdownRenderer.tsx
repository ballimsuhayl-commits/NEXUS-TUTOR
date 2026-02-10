import React from 'react';
import ReactMarkdown from 'react-markdown';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-blue">
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isMermaid = match && match[1] === 'mermaid';
            
            if (isMermaid) {
                return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
            }

            return match ? (
              <div className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto my-2 text-xs">
                 <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-pink-500" {...props}>
                {children}
              </code>
            );
          },
          ul({ children }) {
            return <ul className="list-disc ml-5 space-y-1 my-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal ml-5 space-y-1 my-2">{children}</ol>;
          },
          h3({ children }) {
              return <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800 border-b pb-1">{children}</h3>
          },
          p({ children }) {
              return <p className="mb-2 leading-relaxed text-gray-700">{children}</p>
          },
          strong({ children }) {
              return <strong className="font-bold text-gray-900">{children}</strong>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;