import { initCE, basePath } from '../bra-ket.js';
import { AdoptAChild } from '../adopt-a-child.js';
export class XtalRadioGroupMD extends AdoptAChild {
    static get is() { return 'xtal-radio-group-md'; }
    constructor() {
        super();
    }
}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, basePath + '/radio-group');
//# sourceMappingURL=xtal-radio-group-md.js.map