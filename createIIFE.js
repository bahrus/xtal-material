//@ts-check
const jiife = require('jiife');
const nm = 'node_modules/';
const xl = nm + 'xtal-latx/';
const tm = nm + 'templ-mount/';
const core = ['getBasePath.js', tm + 'first-templ.js', tm + 'templ-mount.js', xl + 'xtal-latx.js', xl + 'qsa.js', nm + 'bra-ket/bra-ket.js'];
jiife.processFiles(core.concat([ 
    'adopt-a-child.js', 
    'text-input/xtal-text-input-md.js', 
    'checkbox-input/xtal-checkbox-input-md.js', 
    'radio-group/xtal-radio-group-md.js', 
    'radio-tabs/xtal-radio-tabs-md.js',
    'select/xtal-select-md.js', 
    'text-area/xtal-text-area-md.js', 
    'side-nav/xtal-side-nav.js']), 'dist/xtal-material.js');
jiife.processFiles(core.concat(['side-nav/xtal-side-nav.js']), 'dist/xtal-side-nav.iife.js');
jiife.processFiles(core.concat(['text-input/xtal-text-input-md.js']), 'dist/xtal-text-input-md.iife.js');



