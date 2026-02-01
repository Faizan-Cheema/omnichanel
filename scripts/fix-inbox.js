// Quick fix for inbox page syntax error
// Run this to restore the working version

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/inbox/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the missing button tag
content = content.replace(
    /className="absolute right-2 top-1\/2 -translate-y-1\/2 flex items-center gap-1">\r?\n\s+className="p-2\.5/,
    'className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">\r\n                                    <button\r\n                                        className="p-2.5'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed inbox page syntax error!');
