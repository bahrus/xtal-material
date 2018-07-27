import { XtalTextInputMD } from '../text-input/xtal-text-input-md.js';
import { initCE } from 'bra-ket/bra-ket.js';
import { getBasePath } from '../getBasePath.js';
export class XtalCheckboxInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-checkbox-input-md'; }
    // getType() {
    //     return 'checkbox';
    // }
    get checked() {
        return this._inputElement.checked;
    }
    set checked(val) {
        this._inputElement.checked = val;
    }
    emitEvent() {
        const val = this._inputElement.checked;
        this.value = val ? 'on' : 'off';
        this.de('value', {
            value: val
        });
    }
    addInputListener() {
        //some browsers don't support 'input' change on checkbox yet
        this._inputElement.addEventListener('change', e => {
            this.emitEvent();
        });
    }
}
initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, getBasePath(XtalCheckboxInputMD.is) + '/checkbox-input');
//# sourceMappingURL=xtal-checkbox-input-md.js.map