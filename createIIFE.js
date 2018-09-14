//@ts-check
const jiife = require('jiife');
const core = ['getBasePath.js', 'node_modules/templ-mount/first-templ.js', 'node_modules/templ-mount/templ-mount.js', 'node_modules/xtal-latx/xtal-latx.js', 
'node_modules/bra-ket/bra-ket.js'];
jiife.processFiles(core.concat([ 'adopt-a-child.js', 'text-input/xtal-text-input-md.js', 
    'checkbox-input/xtal-checkbox-input-md.js', 'radio-group/xtal-radio-group-md.js', 'radio-tabs/xtal-radio-tabs-md.js',
    'select/xtal-select-md.js', 
    'text-area/xtal-text-area-md.js', 'side-nav/xtal-side-nav.js']), 'xtal-material.js');
jiife.processFiles(core.concat(['side-nav/xtal-side-nav.js']), 'xtal-side-nav.iife.js');



