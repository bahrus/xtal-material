import { XtalTextInputMD } from './text-input/xtal-text-input-md.js';
import { initCE, basePath } from './bra-ket.js';
export class XtalRadioInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-radio-input-md'; }
}
initCE(XtalRadioInputMD.is, XtalRadioInputMD, basePath);
//# sourceMappingURL=xtal-radio-input-md.js.map