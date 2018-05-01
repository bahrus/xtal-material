import { BraKet, initCE, basePath } from '../bra-ket.js';

export interface IXtalInputProperties {
    value: string;
}
export class XtalTextInputMD extends BraKet implements IXtalInputProperties {
    static get is() { return 'xtal-text-input-md'; }
    _inputElement: HTMLInputElement;
    customizeClone(clonedNode: DocumentFragment) {
        super.customizeClone(clonedNode);
        const inputEl = this._inputElement = clonedNode.querySelector('input');
        inputEl.setAttribute('type', this.getType());
        for (let i = 0, ii = this.attributes.length; i < ii; i++) {
            const attrib = this.attributes[i];
            //const inp = clonedNode.querySelector('input');
            if (attrib.name === 'type') continue;
            inputEl.setAttribute(attrib.name, attrib.value);
        }
    }
    initShadowRoot() {
        this.addInputListener();
        this._inputElement.addEventListener('change', e => {
            let element = this._inputElement;// e.target as HTMLInputElement;
            if (element && element.matches(".form-element-field")) {
                element.classList[element.value ? "add" : "remove"]("-hasvalue");
            }
        })
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
    addEventListener(eventName: string, callback) {
        if (eventName.endsWith('-changed')) {
            super.addEventListener(eventName, callback);
        } else {
            this._inputElement.addEventListener(eventName, callback);
        }
    }
    addInputListener() {
        this._inputElement.addEventListener('input', e => {
            this.emitEvent()
        });
    }
    emitEvent() {
        const newEvent = new CustomEvent('value-changed', {
            detail: {
                value: this._inputElement.value
            },
            bubbles: true,
            composed: false
        } as CustomEventInit);
        this.dispatchEvent(newEvent);
    }
    _upgradeProperties(props: string[]) {
        props.forEach(prop => {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        })

    }
    connectedCallback() {
        this._upgradeProperties(['value']);
        this.addMutationObserver();
    }
    _observer: MutationObserver;
    addMutationObserver(){
        const config : MutationObserverInit = { attributes: true};
        this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            mutationsList.forEach(mutation =>{
                this._inputElement[mutation.attributeName] = this[mutation.attributeName];
            })
        });
        this._observer.observe(this, config);
    }
    disconnectedCallback(){
        this._observer.disconnect();
    }
}

initCE(XtalTextInputMD.is, XtalTextInputMD, basePath  + '/text-input');

export class XtalEmailInputMD extends XtalTextInputMD{
    static get is() { return 'xtal-email-input-md'; }
    looksLike(){
        return XtalTextInputMD.is;
    }
}

initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is);