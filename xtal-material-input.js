import { XtalShadow, initCE } from './xtal-shadow.js';
export class XtalMaterialInput extends XtalShadow {
    static get is() { return 'xtal-material-input'; }
    customizeClone(clonedNode) {
        super.customizeClone(clonedNode);
        this._inputElement = clonedNode.querySelector('input');
        this._inputElement.setAttribute('type', this.getType());
        for (let i = 0, ii = this.attributes.length; i < ii; i++) {
            const attrib = this.attributes[i];
            //const inp = clonedNode.querySelector('input');
            if (attrib.name === 'type')
                continue;
            this._inputElement.setAttribute(attrib.name, attrib.value);
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
        return 'input';
    }
    addEventListener(eventName, callback) {
        if (eventName.endsWith('-changed')) {
            super.addEventListener(eventName, callback);
        }
        else {
            this._inputElement.addEventListener(eventName, callback);
        }
    }
    addInputListener() {
        this._inputElement.addEventListener('input', e => {
            this.emitEvent();
        });
    }
    emitEvent() {
        const newEvent = new CustomEvent('value-changed', {
            detail: {
                value: this._inputElement.value
            },
            bubbles: true,
            composed: false
        });
        this.dispatchEvent(newEvent);
    }
    _upgradeProperties(props) {
        props.forEach(prop => {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
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
initCE(XtalMaterialInput.is, XtalMaterialInput);
export class XtalMaterialEmailInput extends XtalMaterialInput {
    static get is() { return 'xtal-material-email-input'; }
    getType() {
        return 'email';
    }
}
initCE(XtalMaterialEmailInput.is, XtalMaterialEmailInput);
//# sourceMappingURL=xtal-material-input.js.map