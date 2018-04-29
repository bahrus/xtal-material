//@ts-check
const fs = require('fs');
function combineFiles(prefix) {
    const htmlFilePath = prefix + '-input.html';
    const cssFilePath = prefix + '-input-md.css';
    const htmlContents = fs.readFileSync(htmlFilePath, 'utf8');
    const cssContents = `<style>
    ${fs.readFileSync(cssFilePath, 'utf8')}
    </style>`;
    const outputFilePath = 'xtal-' + prefix + '-input-md.html';
    fs.writeFileSync(outputFilePath, cssContents + '\n' + htmlContents, 'utf8');
}
combineFiles('radio');
//# sourceMappingURL=mergeMockup.js.map