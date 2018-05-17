import {XtalTextInputMD} from '../text-input/xtal-text-input-md.js';
import {initCE} from 'bra-ket/bra-ket.js';
import {getBasePath} from '../getBasePath.js';

export class XtalCheckboxInputMD extends XtalTextInputMD{
    static get is() { return 'xtal-checkbox-input-md'; }
    // getType() {
    //     return 'checkbox';
    // }

    get checked() {
        return (this._inputElement as HTMLInputElement).checked;
    }
    set checked(val) {
        (this._inputElement as HTMLInputElement).checked = val;
    }

    emitEvent() {
        const newEvent = new CustomEvent('checked-changed', {
            detail: {
                value: (this._inputElement as HTMLInputElement).checked
            },
            bubbles: true,
            composed: false
        } as CustomEventInit);
        this.dispatchEvent(newEvent);
    }

    addInputListener(){
        //some browsers don't support 'input' change on checkbox yet
        this._inputElement.addEventListener('change', e => {
            this.emitEvent()
        });
    }
}
initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, getBasePath(XtalCheckboxInputMD.is) + '/checkbox-input');