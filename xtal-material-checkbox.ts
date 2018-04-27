import {XtalTextInputMD} from './xtal-text-input-md.js';
import {initCE, basePath} from './xtal-mark.js';

export class XtalMaterialCheckbox extends XtalTextInputMD{
    static get is() { return 'xtal-material-checkbox' }
    getType() {
        return 'checkbox';
    }

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
initCE(XtalMaterialCheckbox.is, XtalMaterialCheckbox, basePath);