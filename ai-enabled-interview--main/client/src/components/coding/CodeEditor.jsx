import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const languageTemplates = {
  javascript: `function solve() {

}`,
  java: `public class Main {

    public static void main(String[] args) {

    }

}`,
  python: `def solve():
    pass

solve()`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}`,
  c: `#include <stdio.h>

int main() {

    return 0;
}`,
};

const CodeEditor = ({
  language,
  code,
  setCode,
  theme = "vs-dark"
}) => {
  useEffect(() => {
    if (!code) {
      setCode(
        languageTemplates[language]
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
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          automaticLayout: true,
          scrollBeyondLastLine: true,
          roundedSelection: true,
          wordWrap: "on",
          padding: { top: 15 },
          scrollbar: { alwaysConsumeMouseWheel: false },
        }}
      />
    </div>
  );
};

export default CodeEditor;