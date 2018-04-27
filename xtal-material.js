
//@ts-check
(function () {
function getBasePath(tagName) {
    let path;
    const link = self[lispToSnakeCase(tagName)];
    if (link) {
        path = link.href;
    }
    else {
        const cs = document.currentScript;
        if (cs) {
            path = cs.src;
        }
        else {
            throw 'not yet supported';
        }
    }
    return path.split('/').slice(0, -1).join('/');
}
function lispToSnakeCase(s) {
    return s.split('-').join('_');
}
class BraKet extends HTMLElement {
    static get is() { return 'bra-ket'; }
    get tn() {
        return this.tagName.toLowerCase();
    }
    looksLike() { }
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
        const tn = this.looksLike() || this.tn;
        if (!this.CE._template[tn]) {
            const templateId = lispToSnakeCase(tn) + '_template';
            this.CE._template[tn] = self[lispToSnakeCase(tn) + '_template'];
        }
        const clonedNode = this.CE._template[tn].content.cloneNode(true);
        this.customizeClone(clonedNode);
        this.shadowRoot.appendChild(clonedNode);
        this.initShadowRoot();
    }
}
const cachedTemplates = {};
const fetchInProgress = {};
function initCE(tagName, cls, basePath, sharedTemplateTagName) {
    if (customElements.get(tagName))
        return;
    const templateTagName = sharedTemplateTagName || tagName;
    const templateID = lispToSnakeCase(templateTagName) + '_template';
    let template = self[templateID];
    if (!template) {
        template = document.createElement('template');
        template.id = templateID;
        template.dataset.src = basePath + '/' + templateTagName + '.html';
        document.head.appendChild(template);
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
                    initCE(tagName, cls, basePath, sharedTemplateTagName);
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
const basePath = getBasePath(BraKet.is);
//initCE(XtalShadow.is, XtalShadow, basePath);
//# sourceMappingURL=bra-ket.js.map
class XtalTextInputMD extends BraKet {
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
initCE(XtalTextInputMD.is, XtalTextInputMD, basePath);
class XtalEmailInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-email-input-md'; }
    looksLike() {
        return XtalTextInputMD.is;
    }
}
initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath, XtalTextInputMD.is);
//# sourceMappingURL=xtal-text-input-md.js.map
class XtalCheckboxInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-checkbox-input-md'; }
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
initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, basePath);
//# sourceMappingURL=xtal-checkbox-input-md.js.map
})();  
    