//@ts-check
const jiife = require('jiife');
jiife.processFiles(['getBasePath.js', 'node_modules/templ-mount/templ-mount.js', 'adopt-a-child.js', 'text-input/xtal-text-input-md.js', 
    'checkbox-input/xtal-checkbox-input-md.js', 'radio-group/xtal-radio-group-md.js', 'text-area/xtal-text-area-md.js'], 'xtal-material.js');



