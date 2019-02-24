//@ts-check
const tiife = require('jiife/tiffe');
const nm = 'node_modules/';
const xe = nm + 'xtal-element/';
const es = nm + 'event-switch/';
const tr = nm + 'trans-render/';
tiife.processFiles([xe + 'define.ts', xe + 'xtal-latx.ts',  xe + 'xtal-element.ts', xe + 'utils.ts',
    es + 'event-switch.d.ts', es + 'event-switch.ts', tr + 'init.d.ts', tr + 'init.ts', 'xtal-text-input-md.ts'
], 'dist/iife.ts');
