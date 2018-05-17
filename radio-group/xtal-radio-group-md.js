import { initCE } from 'bra-ket/bra-ket.js';
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
export class XtalRadioGroupMD extends AdoptAChild {
    static get is() { return 'xtal-radio-group-md'; }
    constructor() {
        super();
    }
}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group');
//# sourceMappingURL=xtal-radio-group-md.js.map