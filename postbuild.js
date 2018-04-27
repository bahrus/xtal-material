//@ts-check
const fs = require('fs')
function processFile(filePath, newLines){
    const contents = fs.readFileSync(filePath, 'utf8');
    const lines = contents.split('\n');
    lines.forEach(line =>{
        const tl = line.trimLeft();
        if(tl.startsWith('import ')) return;
        if(tl.startsWith('export ')){
            newLines.push(line.replace('export ', ''));
        }else{
            newLines.push(line);
        }
        
    })
}
const newLines = [];
processFile('bra-ket.js', newLines);
processFile('xtal-text-input-md.js', newLines);
processFile('xtal-checkbox-input-md.js', newLines);
let newContent = `
//@ts-check
(function () {
${newLines.join('\n')}
})();  
    `;
fs.writeFileSync("xtal-material.js", newContent, 'utf8');



