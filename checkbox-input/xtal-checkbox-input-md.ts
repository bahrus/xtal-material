import {XtalTextInputMD} from '../text-input/xtal-text-input-md.js';
import {initCE, basePath} from '../bra-ket.js';

export class XtalCheckboxInputMD extends XtalTextInputMD{
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
        const newEvent = new CustomEvent('checked-changed', {
            detail: {
                value: this._inputElement.checked
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
initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, basePath + '/checkbox-input');