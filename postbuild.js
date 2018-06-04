//@ts-check
const jiife = require('jiife');
jiife.processFiles(['getBasePath.js', 'node_modules/templ-mount/templ-mount.js', 'node_modules/xtal-latx/xtal-latx.js', 
    'node_modules/bra-ket/bra-ket.js', 'adopt-a-child.js', 'text-input/xtal-text-input-md.js', 
    'checkbox-input/xtal-checkbox-input-md.js', 'radio-group/xtal-radio-group-md.js', 'radio-tabs/xtal-radio-tabs-md.js', 'text-area/xtal-text-area-md.js'], 'xtal-material.js');



