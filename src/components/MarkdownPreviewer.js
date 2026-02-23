import React, { useState, useEffect } from "react";
import { marked } from "marked";

const MarkdownPreviewer = () => {
  const defaultMarkdown = `# Welcome to the Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`javascript
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)
`;

  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [html, setHtml] = useState("");

  useEffect(() => {
    // Set marked options for security and features
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    setHtml(marked.parse(markdown));
  }, [markdown]);

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col gap-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Markdown Previewer
          </h2>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow h-[500px]">
          {/* Editor Pane */}
          <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden shadow-inner border border-gray-200 group focus-within:ring-4 focus-within:ring-emerald-200 transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editor
            </div>
            <textarea
              id="editor"
              className="w-full h-full p-6 text-gray-700 font-mono text-sm resize-none bg-transparent outline-none leading-relaxed transition-colors duration-200"
              value={markdown}
              onChange={handleMarkdownChange}
              spellCheck="false"
            ></textarea>
          </div>

          {/* Preview Pane */}
          <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </div>
            <div
              id="preview"
              className="w-full h-full p-8 overflow-auto prose prose-emerald prose-sm max-w-none text-gray-800 leading-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          </div>
        </div>

        <div className="flex justify-start items-center gap-4 text-xs font-semibold text-gray-400 tracking-widest uppercase mt-2">
          <span>Live Rendering Enabled</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="ml-auto opacity-60 hover:opacity-100 cursor-help transition-opacity">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Global Custom CSS for Preview Content Styling (Markdown Specifics) */}
      <style jsx>{`
        #preview h1 {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-size: 1.875rem;
          font-weight: 800;
          color: #065f46;
        }
        #preview h2 {
          border-bottom: 1px solid #edf2f7;
          padding-bottom: 0.3rem;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #064e3b;
        }
        #preview pre {
          background-color: #f7fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          margin-top: 1rem;
        }
        #preview code {
          font-family:
            ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          color: #df3b3b;
          background: #fff5f5;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 0.875em;
        }
        #preview blockquote {
          border-left: 4px solid #34d399;
          padding-left: 1rem;
          color: #4a5568;
          margin: 1rem 0;
          background: #f0fdf4;
          border-radius: 0 4px 4px 0;
          padding: 0.75rem 1rem;
          font-style: italic;
        }
        #preview img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        #preview table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        #preview th,
        #preview td {
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          text-align: left;
        }
        #preview th {
          background-color: #f8fafc;
          font-weight: 600;
        }
        #preview ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        #preview ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        #preview a {
          color: #059669;
          text-decoration: underline;
          font-weight: 500;
        }
        #preview a:hover {
          color: #047857;
        }
      `}</style>
    </div>
  );
};

export default MarkdownPreviewer;
