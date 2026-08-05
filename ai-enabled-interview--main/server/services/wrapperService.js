// =========================================
// Wrapper Service
// Production Version
// =========================================

// -----------------------------------------
// Language Type Maps
// -----------------------------------------

const JAVA_TYPES = {
    int: "int",
    string: "String",
    boolean: "boolean",
    intArray: "int[]",
    stringArray: "String[]",
    ListNode: "ListNode",
    TreeNode: "TreeNode"
};

const CPP_TYPES = {
    int: "int",
    string: "string",
    boolean: "bool",
    intArray: "vector<int>",
    stringArray: "vector<string>",
    ListNode: "ListNode*",
    TreeNode: "TreeNode*"
};

// -----------------------------------------
// Helpers
// -----------------------------------------

function getFunctionName(problem) {
    if (!problem.boilerPlate || !problem.boilerPlate.length) return "solve";
    try {
        const javaBoilerplate = problem.boilerPlate.find(bp => bp.language === 'java' || bp.language === 'javascript' || bp.language === 'python');
        if (!javaBoilerplate) return "solve";
        const code = javaBoilerplate.code;
        const functionMatch = code.match(/(?:public\s+\w+\s+|function\s+|def\s+)(\w+)\s*\(/);
        if (functionMatch) return functionMatch[1];
    } catch (e) {}
    return "solve";
}

function getParameters(problem) {
    if (!problem.testCases || !problem.testCases.length) return [];
    try {
        const sampleCase = problem.testCases[0];
        const inputs = sampleCase.input;
        if (typeof inputs === "string") {
            return [{ name: "input", type: "string" }];
        }
        if (Array.isArray(inputs)) {
            let type = "stringArray";
            if (inputs.length > 0 && typeof inputs[0] === "number") type = "intArray";
            return [{ name: "input", type: type }];
        }
        if (typeof inputs !== 'object' || inputs === null) {
            let type = "string";
            if (typeof inputs === "number") type = "int";
            else if (typeof inputs === "boolean") type = "boolean";
            return [{ name: "input", type: type }];
        }

        const params = [];
        for (const [key, value] of Object.entries(inputs)) {
            let type = "string";
            if (typeof value === "number") type = "int";
            else if (typeof value === "boolean") type = "boolean";
            else if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === "number") type = "intArray";
                else type = "stringArray";
            }
            if (key.toLowerCase().includes("list") || key.toLowerCase().includes("head")) type = "ListNode";
            if (key.toLowerCase().includes("tree") || key.toLowerCase().includes("root")) type = "TreeNode";
            params.push({ name: key, type: type });
        }
        return params;
    } catch (e) {}
    return [];
}

function hasListNode(problem) {
    return getParameters(problem).some(p => p.type === 'ListNode');
}

function hasTreeNode(problem) {
    return getParameters(problem).some(p => p.type === 'TreeNode');
}

function escapeBackslashes(str) {
    return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
}

function normalizeCode(code) {
    return code.replace(/\r\n/g, "\n").trim();
}

// -----------------------------------------
// Dispatcher
// -----------------------------------------
function generateWrapper(language, code, problem) {
    switch (language) {
        case "java": return buildJavaWrapper(code, problem);
        case "javascript": return buildJavascriptWrapper(code, problem);
        case "python": return buildPythonWrapper(code, problem);
        case "cpp": return buildCppWrapper(code, problem);
        case "c": return buildCWrapper(code, problem);
        default: return code;
    }
}

// =========================================
// Java Wrapper
// =========================================
function ensureJavaClass(code) {
    if (code.includes("class Solution")) return code;
    return `class Solution {\n${code}\n}`;
}

function buildJavaWrapper(userCode, problem) {
    userCode = ensureJavaClass(normalizeCode(userCode));
    const functionName = getFunctionName(problem);
    const params = getParameters(problem);

    let parserCode = `
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine().trim();
            if (!line.isEmpty()) lines.add(line);
        }
        if (lines.isEmpty()) return;
`;

    let callArgs = [];
    params.forEach((p, i) => {
        const name = p.name || `arg${i}`;
        if (p.type === 'int') {
            parserCode += `        int ${name} = Integer.parseInt(lines.get(${i}));\n`;
        } else if (p.type === 'intArray') {
            parserCode += `        int[] ${name} = parseIntArray(lines.get(${i}));\n`;
        } else if (p.type === 'stringArray') {
            parserCode += `        String[] ${name} = parseStringArray(lines.get(${i}));\n`;
        } else if (p.type === 'ListNode') {
            parserCode += `        ListNode ${name} = parseListNode(lines.get(${i}));\n`;
        } else if (p.type === 'TreeNode') {
            parserCode += `        TreeNode ${name} = parseTreeNode(lines.get(${i}));\n`;
        } else if (p.type === 'boolean') {
            parserCode += `        boolean ${name} = Boolean.parseBoolean(lines.get(${i}));\n`;
        } else {
            parserCode += `        String ${name} = lines.get(${i});\n`;
        }
        callArgs.push(name);
    });

    parserCode += `
        Solution sol = new Solution();
        Object result = sol.${functionName}(${callArgs.join(', ')});
        System.out.println(formatOutput(result));
    }

    static int[] parseIntArray(String s) {
        s = s.replace("[", "").replace("]", "").trim();
        if (s.isEmpty()) return new int[0];
        String[] parts = s.split(",");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim());
        return arr;
    }
    
    static String[] parseStringArray(String s) {
        s = s.replace("[", "").replace("]", "").replace("\\"", "").trim();
        if (s.isEmpty()) return new String[0];
        String[] parts = s.split(",");
        for (int i = 0; i < parts.length; i++) parts[i] = parts[i].trim();
        return parts;
    }
    
    static String formatOutput(Object o) {
        if (o == null) return "null";
        if (o instanceof int[]) return Arrays.toString((int[])o).replace(" ", "");
        if (o instanceof String[]) return Arrays.toString((String[])o).replace(" ", "");
`;
    
    if (hasListNode(problem)) {
        parserCode += `        if (o instanceof ListNode) {
            List<Integer> lst = new ArrayList<>();
            ListNode curr = (ListNode)o;
            while (curr != null) { lst.add(curr.val); curr = curr.next; }
            return lst.toString().replace(" ", "");
        }\n`;
    }
    if (hasTreeNode(problem)) {
        parserCode += `        if (o instanceof TreeNode) {
            List<Integer> lst = new ArrayList<>();
            Queue<TreeNode> q = new LinkedList<>();
            q.add((TreeNode)o);
            while (!q.isEmpty()) {
                TreeNode curr = q.poll();
                if (curr != null) {
                    lst.add(curr.val);
                    q.add(curr.left); q.add(curr.right);
                }
            }
            return lst.toString().replace(" ", "");
        }\n`;
    }

    parserCode += `        return String.valueOf(o);
    }
`;

    if (hasListNode(problem)) {
        parserCode += `
    static ListNode parseListNode(String s) {
        int[] arr = parseIntArray(s);
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }\n`;
    }

    if (hasTreeNode(problem)) {
        parserCode += `
    static TreeNode parseTreeNode(String s) {
        s = s.replace("[", "").replace("]", "").trim();
        if (s.isEmpty()) return null;
        String[] parts = s.split(",");
        if (parts[0].trim().equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(parts[0].trim()));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < parts.length) {
            TreeNode curr = q.poll();
            if (!parts[i].trim().equals("null")) {
                curr.left = new TreeNode(Integer.parseInt(parts[i].trim()));
                q.add(curr.left);
            }
            i++;
            if (i < parts.length && !parts[i].trim().equals("null")) {
                curr.right = new TreeNode(Integer.parseInt(parts[i].trim()));
                q.add(curr.right);
            }
            i++;
        }
        return root;
    }\n`;
    }

    parserCode += `}\n`;

    let helperCode = "";
    if (hasListNode(problem)) {
        helperCode += `class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }\n`;
    }
    if (hasTreeNode(problem)) {
        helperCode += `class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int x) { val = x; } }\n`;
    }

    return `
import java.util.*;
${helperCode}
${userCode}
${parserCode}
`;
}

// =========================================
// Javascript Wrapper
// =========================================
function buildJavascriptWrapper(userCode, problem) {
    userCode = normalizeCode(userCode);
    const functionName = getFunctionName(problem);
    const params = getParameters(problem);

    let helperCode = "";
    if (hasListNode(problem)) {
        helperCode += `class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }\n`;
    }
    if (hasTreeNode(problem)) {
        helperCode += `class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }\n`;
    }

    let parserCode = `
const fs = require('fs');
function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const lines = input.split('\n').map(l => l.trim()).filter(l => l);
`;

    let callArgs = [];
    params.forEach((p, i) => {
        const name = p.name || `arg${i}`;
        if (p.type === 'int') {
            parserCode += `    const ${name} = parseInt(lines[${i}], 10);\n`;
        } else if (p.type === 'intArray' || p.type === 'stringArray' || p.type === 'boolean') {
            parserCode += `    const ${name} = JSON.parse(lines[${i}]);\n`;
        } else if (p.type === 'ListNode') {
            parserCode += `    const ${name} = parseListNode(JSON.parse(lines[${i}]));\n`;
        } else if (p.type === 'TreeNode') {
            parserCode += `    const ${name} = parseTreeNode(JSON.parse(lines[${i}]));\n`;
        } else {
            parserCode += `    const ${name} = lines[${i}];\n`;
        }
        callArgs.push(name);
    });

    parserCode += `
    const result = ${functionName}(${callArgs.join(', ')});
    console.log(formatOutput(result));
}

function formatOutput(o) {
    if (o === null || o === undefined) return "null";
    if (Array.isArray(o)) return JSON.stringify(o).replace(/\\s/g, "");
`;
    if (hasListNode(problem)) {
        parserCode += `    if (o instanceof ListNode || (o.val !== undefined && o.next !== undefined)) {
        const lst = [];
        let curr = o;
        while (curr) { lst.push(curr.val); curr = curr.next; }
        return JSON.stringify(lst);
    }\n`;
    }
    if (hasTreeNode(problem)) {
        parserCode += `    if (o instanceof TreeNode || (o.val !== undefined && (o.left !== undefined || o.right !== undefined))) {
        const lst = [];
        const q = [o];
        while (q.length > 0) {
            const curr = q.shift();
            if (curr) {
                lst.push(curr.val);
                q.push(curr.left); q.push(curr.right);
            }
        }
        return JSON.stringify(lst);
    }\n`;
    }
    parserCode += `    return JSON.stringify(o);
}
`;

    if (hasListNode(problem)) {
        parserCode += `
function parseListNode(arr) {
    if (!arr || !arr.length) return null;
    let head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}\n`;
    }

    if (hasTreeNode(problem)) {
        parserCode += `
function parseTreeNode(arr) {
    if (!arr || !arr.length) return null;
    let root = new TreeNode(arr[0]);
    let q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {
        let curr = q.shift();
        if (arr[i] !== null) { curr.left = new TreeNode(arr[i]); q.push(curr.left); }
        i++;
        if (i < arr.length && arr[i] !== null) { curr.right = new TreeNode(arr[i]); q.push(curr.right); }
        i++;
    }
    return root;
}\n`;
    }

    parserCode += `main();\n`;

    return `
${helperCode}
${userCode}
${parserCode}
`;
}

// =========================================
// Python Wrapper
// =========================================
function ensurePythonFunction(code) {
    return code;
}

function buildPythonWrapper(userCode, problem) {
    userCode = ensurePythonFunction(normalizeCode(userCode));
    const functionName = getFunctionName(problem);
    const params = getParameters(problem);

    let helperCode = "";
    if (hasListNode(problem)) {
        helperCode += `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n`;
    }
    if (hasTreeNode(problem)) {
        helperCode += `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n`;
    }

    let parserCode = `
import sys
import json
from collections import deque

def formatOutput(o):
    if o is None: return "null"
    if isinstance(o, list): return json.dumps(o).replace(" ", "")
`;
    if (hasListNode(problem)) {
        parserCode += `    if isinstance(o, ListNode):
        lst = []
        curr = o
        while curr:
            lst.append(curr.val)
            curr = curr.next
        return json.dumps(lst).replace(" ", "")
`;
    }
    if (hasTreeNode(problem)) {
        parserCode += `    if isinstance(o, TreeNode):
        lst = []
        q = deque([o])
        while q:
            curr = q.popleft()
            if curr:
                lst.append(curr.val)
                q.append(curr.left)
                q.append(curr.right)
        return json.dumps(lst).replace(" ", "")
`;
    }
    parserCode += `    if isinstance(o, bool): return "true" if o else "false"
    return str(o)
`;

    if (hasListNode(problem)) {
        parserCode += `
def parseListNode(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head
`;
    }

    if (hasTreeNode(problem)) {
        parserCode += `
def parseTreeNode(arr):
    if not arr: return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        curr = q.popleft()
        if arr[i] is not None:
            curr.left = TreeNode(arr[i])
            q.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            q.append(curr.right)
        i += 1
    return root
`;
    }

    let callArgs = [];
    let parseArgs = ``;
    params.forEach((p, i) => {
        const name = `arg${i}`;
        if (p.type === 'int') {
            parseArgs += `    ${name} = int(lines[${i}])\n`;
        } else if (p.type === 'intArray' || p.type === 'stringArray' || p.type === 'boolean') {
            parseArgs += `    ${name} = json.loads(lines[${i}])\n`;
        } else if (p.type === 'ListNode') {
            parseArgs += `    ${name} = parseListNode(json.loads(lines[${i}]))\n`;
        } else if (p.type === 'TreeNode') {
            parseArgs += `    ${name} = parseTreeNode(json.loads(lines[${i}]))\n`;
        } else {
            parseArgs += `    ${name} = lines[${i}]\n`;
        }
        callArgs.push(name);
    });

    let mainCode = `
if __name__ == '__main__':
    data = sys.stdin.read().strip()
    if not data: sys.exit(0)
    lines = [l.strip() for l in data.splitlines() if l.strip()]
${parseArgs}
    sol = Solution()
    result = getattr(sol, "${functionName}")(${callArgs.join(', ')})
    print(formatOutput(result))
`;

    return `
${helperCode}
${userCode}
${parserCode}
${mainCode}
`;
}

// =========================================
// C++ Wrapper
// =========================================
function ensureCppSolutionClass(code) {
    if (code.includes("class Solution")) return code;
    return `class Solution {\npublic:\n${code}\n};`;
}

function buildCppWrapper(userCode, problem) {
    userCode = ensureCppSolutionClass(normalizeCode(userCode));
    const functionName = getFunctionName(problem);
    const params = getParameters(problem);

    let helperCode = "";
    if (hasListNode(problem)) {
        helperCode += `struct ListNode { int val; ListNode* next; ListNode() : val(0), next(nullptr) {} ListNode(int x) : val(x), next(nullptr) {} ListNode(int x, ListNode* next) : val(x), next(next) {} };\n`;
    }
    if (hasTreeNode(problem)) {
        helperCode += `struct TreeNode { int val; TreeNode* left; TreeNode* right; TreeNode() : val(0), left(nullptr), right(nullptr) {} TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {} };\n`;
    }

    let parserCode = `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>
#include <algorithm>

using namespace std;

int parseInt(const string& s) { return stoi(s); }
string parseString(const string& s) { 
    string str = s; 
    str.erase(0, str.find_first_not_of(" \t\n\r"));
    str.erase(str.find_last_not_of(" \t\n\r") + 1);
    if (str.size() >= 2 && str.front() == '"' && str.back() == '"') return str.substr(1, str.size() - 2);
    return str;
}
bool parseBoolean(const string& s) { return s == "true" || s == "1"; }
vector<int> parseIntArray(const string& s) {
    vector<int> ans; string num;
    for (char c : s) {
        if ((c >= '0' && c <= '9') || c == '-') num += c;
        else if (!num.empty()) { ans.push_back(stoi(num)); num.clear(); }
    }
    if (!num.empty()) ans.push_back(stoi(num));
    return ans;
}
vector<string> parseStringArray(const string& s) {
    vector<string> ans; string curr; bool inside = false;
    for (char c : s) {
        if (c == '"') {
            if (inside) { ans.push_back(curr); curr.clear(); }
            inside = !inside;
        } else if (inside) curr += c;
    }
    return ans;
}
string formatOutput(int val) { return to_string(val); }
string formatOutput(bool val) { return val ? "true" : "false"; }
string formatOutput(const string& val) { return "\\"" + val + "\\""; }
string formatOutput(const vector<int>& arr) {
    string ans = "[";
    for (size_t i = 0; i < arr.size(); i++) { ans += to_string(arr[i]); if (i < arr.size() - 1) ans += ","; }
    ans += "]"; return ans;
}
string formatOutput(const vector<string>& arr) {
    string ans = "[";
    for (size_t i = 0; i < arr.size(); i++) { ans += "\\"" + arr[i] + "\\""; if (i < arr.size() - 1) ans += ","; }
    ans += "]"; return ans;
}
`;

    if (hasListNode(problem)) {
        parserCode += `
ListNode* parseListNode(const string& s) {
    vector<int> arr = parseIntArray(s);
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (size_t i = 1; i < arr.size(); i++) { curr->next = new ListNode(arr[i]); curr = curr->next; }
    return head;
}
string formatOutput(ListNode* head) {
    vector<int> arr;
    while (head) { arr.push_back(head->val); head = head->next; }
    return formatOutput(arr);
}\n`;
    }

    if (hasTreeNode(problem)) {
        parserCode += `
TreeNode* parseTreeNode(const string& s) {
    string t = s;
    t.erase(remove(t.begin(), t.end(), '['), t.end());
    t.erase(remove(t.begin(), t.end(), ']'), t.end());
    stringstream ss(t); vector<string> vals; string token;
    while (getline(ss, token, ',')) {
        token.erase(0, token.find_first_not_of(" \t\n\r")); token.erase(token.find_last_not_of(" \t\n\r") + 1);
        vals.push_back(token);
    }
    if (vals.empty() || vals[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(vals[0]));
    queue<TreeNode*> q; q.push(root); size_t i = 1;
    while (!q.empty() && i < vals.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < vals.size() && vals[i] != "null") { node->left = new TreeNode(stoi(vals[i])); q.push(node->left); } i++;
        if (i < vals.size() && vals[i] != "null") { node->right = new TreeNode(stoi(vals[i])); q.push(node->right); } i++;
    }
    return root;
}
string formatOutput(TreeNode* root) {
    if (!root) return "[]";
    vector<string> arr; queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node) { arr.push_back(to_string(node->val)); q.push(node->left); q.push(node->right); }
        else arr.push_back("null");
    }
    while (!arr.empty() && arr.back() == "null") arr.pop_back();
    string ans = "[";
    for (size_t i = 0; i < arr.size(); i++) { ans += arr[i]; if (i < arr.size() - 1) ans += ","; }
    ans += "]"; return ans;
}\n`;
    }

    let parseArgs = ``;
    let callArgs = [];
    params.forEach((p, i) => {
        const name = `arg${i}`;
        if (p.type === 'int') parseArgs += `    int ${name} = parseInt(lines[${i}]);\n`;
        else if (p.type === 'string') parseArgs += `    string ${name} = parseString(lines[${i}]);\n`;
        else if (p.type === 'boolean') parseArgs += `    bool ${name} = parseBoolean(lines[${i}]);\n`;
        else if (p.type === 'intArray') parseArgs += `    vector<int> ${name} = parseIntArray(lines[${i}]);\n`;
        else if (p.type === 'stringArray') parseArgs += `    vector<string> ${name} = parseStringArray(lines[${i}]);\n`;
        else if (p.type === 'ListNode') parseArgs += `    ListNode* ${name} = parseListNode(lines[${i}]);\n`;
        else if (p.type === 'TreeNode') parseArgs += `    TreeNode* ${name} = parseTreeNode(lines[${i}]);\n`;
        else parseArgs += `    string ${name} = lines[${i}];\n`;
        callArgs.push(name);
    });

    let mainCode = `
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string line; vector<string> lines;
    while (getline(cin, line)) {
        if (!line.empty() && line.find_first_not_of(" \t\n\r") != string::npos) lines.push_back(line);
    }
    if (lines.empty()) return 0;
${parseArgs}
    Solution solution;
    auto result = solution.${functionName}(${callArgs.join(", ")});
    cout << formatOutput(result) << endl;
    return 0;
}
`;

    return `
${helperCode}
${parserCode}
${userCode}
${mainCode}
`;
}

// =========================================
// C Wrapper
// =========================================
function buildCWrapper(userCode, problem) {
    userCode = normalizeCode(userCode);
    
    // C doesn't easily support object serialization. We use a basic wrapper.
    return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${userCode}

int main() {
    // Note: Advanced IO mapping for C is very complex in a short script.
    // Basic execution wrapper.
    return 0;
}
`;
}

module.exports = { generateWrapper, buildJavaWrapper, buildPythonWrapper, buildJavascriptWrapper, buildCppWrapper, buildCWrapper };