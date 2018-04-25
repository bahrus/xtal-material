
//@ts-check
(function () {
class XtalShadow extends HTMLElement {
    static get is() { return 'xtal-shadow'; }
    get tn() {
        return this.tagName.toLowerCase();
    }
    get CE() {
        if (!this._ce)
            this._ce = customElements.get(this.tn);
        return this._ce;
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addTemplate();
    }
    customizeClone(clonedNode) { }
    initShadowRoot() { }
    addTemplate() {
        if (!this.CE._template) {
            this.CE._template = {};
        }
        const tn = this.tn;
        if (!this.CE._template[tn]) {
            this.CE._template[tn] = self[tn.split('-').join('_') + '_template'];
        }
        const clonedNode = this.CE._template[tn].content.cloneNode(true);
        this.customizeClone(clonedNode);
        this.shadowRoot.appendChild(clonedNode);
        this.initShadowRoot();
    }
}
const cachedTemplates = {};
const fetchInProgress = {};
function initCE(tagName, cls) {
    if (customElements.get(tagName))
        return;
    const templateID = tagName.split('-').join('_') + '_template';
    const template = self[templateID];
    if (!template) {
        // setTimeout(() =>{
        //     initCE(tagName, cls);
        // }, 100);
        return;
    }
    const src = template.dataset.src;
    if (src) {
        if (cachedTemplates[src]) {
            template.innerHTML = cachedTemplates[src];
            customElements.define(tagName, cls);
        }
        else {
            if (fetchInProgress[src]) {
                setTimeout(() => {
                    initCE(tagName, cls);
                }, 100);
                return;
            }
            fetchInProgress[src] = true;
            fetch(src, {
                credentials: 'include'
            }).then(resp => {
                resp.text().then(txt => {
                    fetchInProgress[src] = false;
                    cachedTemplates[src] = txt;
                    template.innerHTML = txt;
                    customElements.define(tagName, cls);
                });
            });
        }
    }
    else {
        customElements.define(tagName, cls);
    }
}
initCE(XtalShadow.is, XtalShadow);
//# sourceMappingURL=xtal-shadow.js.map
class XtalMaterialInput extends XtalShadow {
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
class XtalMaterialEmailInput extends XtalMaterialInput {
    static get is() { return 'xtal-material-email-input'; }
    getType() {
        return 'email';
    }
}
initCE(XtalMaterialEmailInput.is, XtalMaterialEmailInput);
//# sourceMappingURL=xtal-material-input.js.map
class XtalMaterialCheckbox extends XtalMaterialInput {
    static get is() { return 'xtal-material-checkbox'; }
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
        });
        this.dispatchEvent(newEvent);
    }
    addInputListener() {
        //some browsers don't support 'input' change on checkbox yet
        this._inputElement.addEventListener('change', e => {
            this.emitEvent();
        });
    }
}
initCE(XtalMaterialCheckbox.is, XtalMaterialCheckbox);
//# sourceMappingURL=xtal-material-checkbox-radio.js.map
})();  
    