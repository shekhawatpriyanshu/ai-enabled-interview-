const fs = require('fs');
let c = fs.readFileSync('server/services/wrapperService.js', 'utf8');
c = c.split('\\`').join('`');
fs.writeFileSync('server/services/wrapperService.js', c);
