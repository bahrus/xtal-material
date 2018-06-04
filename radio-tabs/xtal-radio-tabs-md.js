import { initCE } from 'bra-ket/bra-ket.js';
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
export class XtalRadioTabsMD extends AdoptAChild {
    static get is() { return 'xtal-radio-tabs-md'; }
    constructor() {
        super();
    }
}
initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs');
//# sourceMappingURL=xtal-radio-tabs-md.js.map