import { BraKet, initCE } from 'bra-ket/bra-ket.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { getBasePath } from '../getBasePath.js';
/**
 * `xtal-text-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalTextInputMD extends XtallatX(BraKet) {
    static get is() { return 'xtal-text-input-md'; }
    customizeClone(clonedNode) {
        super.customizeClone(clonedNode);
        const inputEl = this._inputElement = clonedNode.querySelector('input');
        inputEl.setAttribute('type', this.getType());
        for (let i = 0, ii = this.attributes.length; i < ii; i++) {
            const attrib = this.attributes[i];
            //const inp = clonedNode.querySelector('input');
            if (attrib.name === 'type')
                continue;
            inputEl.setAttribute(attrib.name, attrib.value);
        }
    }
    initShadowRoot() {
        this.addInputListener();
        this._inputElement.addEventListener('change', e => {
            let element = this._inputElement; // e.target as HTMLInputElement;
            if (element && element.matches(".form-element-field")) {
                element.classList[element.value ? "add" : "remove"]("-hasvalue");
            }
        });
    }
    get value() {
        return this._inputElement.value;
    }
    set value(val) {
        this._inputElement.value = val;
    }
    getType() {
        return this.constructor['is'].split('-')[1];
    }
    addInputListener() {
        this._inputElement.addEventListener('input', e => {
            this.emitEvent();
        });
    }
    emitEvent() {
        this.value = this._inputElement.value;
        this.de('value', {
            value: this.value
        });
    }
    connectedCallback() {
        this._upgradeProperties(['value']);
        this.addMutationObserver();
    }
    addMutationObserver() {
        const config = { attributes: true };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                this._inputElement[mutation.attributeName] = this[mutation.attributeName];
            });
        });
        this._observer.observe(this, config);
    }
    disconnectedCallback() {
        this._observer.disconnect();
    }
}
const basePath = getBasePath(XtalTextInputMD.is);
initCE(XtalTextInputMD.is, XtalTextInputMD, basePath + '/text-input');
/**
 * `xtal-email-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design email input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalEmailInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-email-input-md'; }
    looksLike() {
        return XtalTextInputMD.is;
    }
}
initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is);
//# sourceMappingURL=xtal-text-input-md.js.map