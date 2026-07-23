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
}) => {
  const [theme, setTheme] =
    useState("vs-dark");

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
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* Header */}

      <div className="flex justify-between items-center px-5 py-3 border-b bg-slate-100">

        <div className="flex items-center gap-3">

          <h3 className="font-semibold text-gray-700">
            Code Editor
          </h3>

          <span className="text-sm bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full capitalize">
            {language}
          </span>

        </div>

        <div className="flex gap-3">

          <select
            value={theme}
            onChange={(e) =>
              setTheme(
                e.target.value
              )
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="vs-dark">
              Dark
            </option>

            <option value="light">
              Light
            </option>
          </select>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Reset
          </button>

        </div>

      </div>

      <Editor
        height="600px"
        language={language}
        value={code}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 15,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          roundedSelection: true,
          wordWrap: "on",
          padding: {
            top: 15,
          },
        }}
      />

    </div>
  );
};

export default CodeEditor;