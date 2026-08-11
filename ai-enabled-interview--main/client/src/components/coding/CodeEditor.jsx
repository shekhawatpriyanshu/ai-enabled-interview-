import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const languageTemplates = {
  javascript: `/**
 * @param {any} input
 * @return {any}
 */
var solve = function(input) {
    
};`,
  java: `class Solution {
    public int solve(String input) {
        return 0;
    }
}`,
  python: `class Solution:
    def solve(self, input):
        pass`,
  cpp: `class Solution {
public:
    int solve(string input) {
        return 0;
    }
};`,
  c: `int solve(char* input) {
    return 0;
}`
};

const CodeEditor = ({
  language,
  code,
  setCode,
  theme = "vs-dark",
  onMount
}) => {
  useEffect(() => {
    // Only set default template if code is empty/undefined
    // Don't overwrite existing code (e.g., saved drafts or problem starter code)
    if (!code) {
      setCode(
        languageTemplates[language] || ""
      );
    }
  }, [language]);

  const handleEditorChange = (
    value
  ) => {
    setCode(value || "");
  };

  const handleReset = () => {
    setCode(
      languageTemplates[language]
    );
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={handleEditorChange}
        onMount={onMount}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          roundedSelection: true,
          wordWrap: "on",
          padding: { top: 15 },
          scrollbar: { alwaysConsumeMouseWheel: false },
          suggestOnTriggerCharacters: true,
          quickSuggestions: false,
          formatOnPaste: false,
          formatOnType: false,
          bracketPairColorization: { enabled: true }
        }}
      />
    </div>
  );
};

export default CodeEditor;