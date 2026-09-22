import Editor from "@monaco-editor/react";

function CodeEditor({ value, onChange, readOnly = false }) {
    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme("atom-one-dark", {
            base: "vs-dark",
            inherit: true,

            rules: [
                {
                    token: "comment",
                    foreground: "5C6370",
                    fontStyle: "italic",
                },
                {
                    token: "string",
                    foreground: "98C379",
                },
                {
                    token: "number",
                    foreground: "D19A66",
                },
                {
                    token: "keyword",
                    foreground: "C678DD",
                },
                {
                    token: "type",
                    foreground: "E5C07B",
                },
                {
                    token: "delimiter",
                    foreground: "ABB2BF",
                },
                {
                    token: "identifier",
                    foreground: "E06C75",
                },
            ],

            colors: {
                "editor.background": "#000000",
                "editor.foreground": "#ABB2BF",

                "editorLineNumber.foreground": "#4B5263",
                "editorLineNumber.activeForeground": "#ABB2BF",

                "editorCursor.foreground": "#528BFF",

                "editor.selectionBackground": "#3E4451",

                "editor.lineHighlightBackground": "#2C313C",

                "editor.inactiveSelectionBackground": "#3E4451",

                "editorIndentGuide.background": "#3B4048",
                "editorIndentGuide.activeBackground": "#4B5263",

                "editorWhitespace.foreground": "#3B4048",

                "editorBracketMatch.background": "#3E4451",
                "editorBracketMatch.border": "#528BFF",
            },
        });
    };

    return (
        <div className="h-[500px] w-full">

            {/* Your traffic lights */}

            <div className="h-[420px] w-[96%] rounded-3xl overflow-hidden">
                <Editor
                    height="100%"
                    width="100%"
                    value={value}
                    onChange={(value) => onChange?.(value)}
                    defaultLanguage="json"
                    theme="atom-one-dark"
                    beforeMount={handleEditorWillMount}
                    options={{
                        readOnly,
                        fontSize: 15,
                        mouseWheelZoom: true,

                        minimap: {
                            enabled: false,
                        },

                        automaticLayout: true,

                        padding: {
                            top: 15,
                            bottom: 15,
                        },

                        scrollbar: {
                            vertical: "hidden",
                            horizontal: "hidden",
                            verticalScrollbarSize: 0,
                            horizontalScrollbarSize: 0,
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default CodeEditor;