const fs = require('fs');
let c = fs.readFileSync('server/services/wrapperService.js', 'utf8');

let backtickCount = 0;
let braceCount = 0;
let lastBacktickLine = -1;
let inBacktick = false;

const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '`') {
            // check if escaped
            let isEscaped = false;
            let k = j - 1;
            while (k >= 0 && line[k] === '\\') {
                isEscaped = !isEscaped;
                k--;
            }
            if (!isEscaped) {
                inBacktick = !inBacktick;
                if (inBacktick) lastBacktickLine = i + 1;
            }
        }
        if (!inBacktick) {
            if (line[j] === '{') braceCount++;
            if (line[j] === '}') braceCount--;
        }
    }
}
console.log('In backtick?', inBacktick, 'Last started at line:', lastBacktickLine);
console.log('Brace count:', braceCount);
