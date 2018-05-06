import { constants } from "fs";

//@ts-check
const fs = require('fs');

function combineFiles(root: string){
    const initPath =  root + '/' + root
    const htmlFilePath = initPath + '.html';
    const cssFilePath = initPath + '-md.css';
    const htmlContents = fs.readFileSync(htmlFilePath, 'utf8');
    const cssContents = `<style>
    ${fs.readFileSync(cssFilePath, 'utf8')}
    </style>`;
    const outputFilePath = root + '/xtal-' + root + '-md.html';
    fs.writeFileSync(outputFilePath, cssContents + '\n' + htmlContents, 'utf8');
}

combineFiles('radio-group');