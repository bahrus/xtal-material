
    //@ts-check
    (function () {
    function getBasePath(tagName) {
    let path;
    const link = self[lispToSnakeCase(tagName)];
    if (link) {
        path = link.href;
    } else {
        const cs = document.currentScript;
        if (cs) {
            path = cs.src;
        } else {
            //path = import.meta.url;
        }
    }
    return path.split('/').slice(0, -1).join('/');
}

function lispToSnakeCase(s) {
    return s.split('-').join('_');
}
const _cachedTemplates = {};
const fetchInProgress = {};
function loadTemplate(template, params) {
    const src = template.dataset.src;
    if (src) {
        if (_cachedTemplates[src]) {
            template.innerHTML = _cachedTemplates[src];
            if (params)
                customElements.define(params.tagName, params.cls);
        }
        else {
            if (fetchInProgress[src]) {
                if (params) {
                    setTimeout(() => {
                        loadTemplate(template, params);
                    }, 100);
                }
                return;
            }
            fetchInProgress[src] = true;
            fetch(src, {
                credentials: 'include'
            }).then(resp => {
                resp.text().then(txt => {
                    fetchInProgress[src] = false;
                    _cachedTemplates[src] = txt;
                    template.innerHTML = txt;
                    template.setAttribute('loaded', '');
                    if (params)
                        customElements.define(params.tagName, params.cls);
                });
            });
        }
    }
    else {
        if (params)
            customElements.define(params.tagName, params.cls);
    }
}
function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
class TemplMount extends HTMLElement {
    constructor() {
        super();
        if (!TemplMount._alreadyDidGlobalCheck) {
            TemplMount._alreadyDidGlobalCheck = true;
            this.loadTemplatesOutsideShadowDOM();
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.loadTemplatesOutsideShadowDOM();
                    this.monitorHeadForTemplates();
                });
            }
            else {
                this.monitorHeadForTemplates();
            }
        }
    }
    static get is() { return 'templ-mount'; }
    getHost() {
        const parent = this.parentNode;
        return parent['host'];
        // if(parent.nodeType !== 11){
        //     return;
        // }
    }
    loadTemplates(from) {
        qsa('template[data-src]', from).forEach(externalRefTemplate => {
            loadTemplate(externalRefTemplate);
        });
    }
    loadTemplatesOutsideShadowDOM() {
        this.loadTemplates(document);
    }
    loadTemplateInsideShadowDOM() {
        const host = this.getHost();
        if (!host)
            return;
        this.loadTemplates(host);
    }
    monitorHeadForTemplates() {
        const config = { childList: true };
        this._observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutationRecord => {
                mutationRecord.addedNodes.forEach((node) => {
                    if (node.tagName === 'TEMPLATE')
                        loadTemplate(node);
                });
            });
        });
    }
    connectedCallback() {
        this.loadTemplateInsideShadowDOM();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.loadTemplateInsideShadowDOM();
            });
        }
    }
}
TemplMount._alreadyDidGlobalCheck = false;
customElements.define(TemplMount.is, TemplMount);
//# sourceMappingURL=templ-mount.js.map
const pass_down = 'pass-down';
const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled, pass_down];
        }
        get passDown() {
            return this._passDown;
        }
        set passDown(val) {
            this.setAttribute(pass_down, val);
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            if (val) {
                this.setAttribute(disabled, '');
            }
            else {
                this.removeAttribute(disabled);
            }
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case pass_down:
                    if (newVal && newVal.endsWith('}'))
                        newVal += ';';
                    this._passDown = newVal;
                    this.parsePassDown();
                    break;
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            return newEvent;
        }
        updateResultProp(val, eventName, propName, callBackFn) {
            if (callBackFn) {
                val = callBackFn(val, this);
                if (!val)
                    return;
            }
            this[propName] = val;
            if (this._cssPropMap) {
                this.passDownProp(val);
            }
            else {
                this.de(eventName, val);
            }
        }
        parsePassDown() {
            this._cssPropMap = [];
            const splitPassDown = this._passDown.split('};');
            splitPassDown.forEach(passDownSelectorAndProp => {
                if (!passDownSelectorAndProp)
                    return;
                const splitPassTo2 = passDownSelectorAndProp.split('{');
                this._cssPropMap.push({
                    cssSelector: splitPassTo2[0],
                    propTarget: splitPassTo2[1]
                });
            });
        }
        passDownProp(val) {
            let nextSibling = this.nextElementSibling;
            while (nextSibling) {
                this._cssPropMap.forEach(map => {
                    if (nextSibling.matches(map.cssSelector)) {
                        nextSibling[map.propTarget] = val;
                    }
                });
                nextSibling = nextSibling.nextElementSibling;
            }
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
    };
}
//# sourceMappingURL=xtal-latx.js.map
function lispToSnakeCase(s) {
    return s.split('-').join('_');
}
function BraKetMixin(superClass) {
    return class extends superClass {
        static get is() { return 'bra-ket'; }
        get tn() {
            return this.tagName.toLowerCase();
        }
        looksLike() { }
        get dynamicSlots() {
            return null;
        }
        get CE() {
            if (!this._ce)
                this._ce = customElements.get(this.tn);
            return this._ce;
        }
        customizeClone(clonedNode) { }
        initShadowRoot() { }
        addTemplate() {
            this.attachShadow({ mode: 'open' });
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
    };
}
class BraKet extends BraKetMixin(HTMLElement) {
    constructor() {
        super();
        if (Object.getPrototypeOf(this) === BraKet.prototype) {
        }
        else {
            this.addTemplate();
        }
    }
}
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
    //TODO:  line below shouldn't be necessary with templ-mount?
    loadTemplate(template, {
        cls: cls,
        sharedTemplateTagName: sharedTemplateTagName,
        tagName: tagName
    });
}
// export const basePath = getBasePath(BraKet.is);
// customElements.define(BraKet.is, BraKet);
//initCE(XtalShadow.is, XtalShadow, basePath);
//# sourceMappingURL=bra-ket.js.map
class AdoptAChild extends BraKet {
    constructor() {
        super();
        this._rootElement = 'div';
        this._targetElementSelector = '[target]';
    }
    get dynamicSlots() {
        return ['slot'];
    }
    postAdopt() { }
    addTemplate() {
        super.addTemplate();
        if (!this.dynamicSlots)
            return;
        this.dynamicSlots.forEach(slotSelector => {
            const slots = qsa(slotSelector, this.shadowRoot).forEach(slot => {
                slot.addEventListener('slotchange', e => {
                    slot['assignedElements']().forEach((node) => {
                        const rootEl = document.createElement(this._rootElement);
                        rootEl.innerHTML = node.outerHTML;
                        this.shadowRoot.appendChild(rootEl);
                        //const targetEl = document.createElement(this._targetElement);
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        //slot.insertAdjacentElement('afterend', targetEl);
                        //this.shadowRoot.appendChild(targetEl);
                        const imex = rootEl.firstElementChild;
                        if (imex['disabled'] && (typeof (imex['target'] !== 'undefined'))) {
                            imex['target'] = targetEl;
                            imex.removeAttribute('disabled');
                        }
                        else {
                            const imexnew = rootEl.removeChild(rootEl.firstElementChild);
                            targetEl.appendChild(imexnew.cloneNode(true));
                            slot.style.display = 'none';
                        }
                        this.postAdopt();
                    });
                });
            });
        });
    }
}
//# sourceMappingURL=adopt-a-child.js.map
/**
 * `xtal-text-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalTextInputMD extends XtallatX(BraKet) {
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
        const newEvent = new CustomEvent('value-changed', {
            detail: {
                value: this._inputElement.value
            },
            bubbles: true,
            composed: false
        });
        this.dispatchEvent(newEvent);
    }
    // _upgradeProperties(props: string[]) {
    //     props.forEach(prop => {
    //         if (this.hasOwnProperty(prop)) {
    //             let value = this[prop];
    //             delete this[prop];
    //             this[prop] = value;
    //         }
    //     })
    // }
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
class XtalEmailInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-email-input-md'; }
    looksLike() {
        return XtalTextInputMD.is;
    }
}
initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is);
//# sourceMappingURL=xtal-text-input-md.js.map
class XtalCheckboxInputMD extends XtalTextInputMD {
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
initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, getBasePath(XtalCheckboxInputMD.is) + '/checkbox-input');
//# sourceMappingURL=xtal-checkbox-input-md.js.map
class XtalRadioGroupMD extends AdoptAChild {
    static get is() { return 'xtal-radio-group-md'; }
    constructor() {
        super();
    }
}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group');
//# sourceMappingURL=xtal-radio-group-md.js.map
const styleFn = (n, t) => `
input[type="radio"][name="tabs"]:nth-of-type(${n + 1}):checked~.slide {
    left: calc((100% / ${t}) * ${n});
}
`;
class XtalRadioTabsMD extends AdoptAChild {
    static get is() { return 'xtal-radio-tabs-md'; }
    constructor() {
        super();
    }
    postAdopt() {
        const q = qsa('input', this.shadowRoot);
        if (q.length === 0) {
            setTimeout(() => {
                this.postAdopt();
            }, 100);
            return;
        }
        const styles = [];
        for (let i = 0, ii = q.length; i < ii; i++) {
            styles.push(styleFn(i, ii));
        }
        const style = document.createElement('style');
        style.innerHTML = styles.join('');
        this.shadowRoot.appendChild(style);
    }
}
initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs');
//# sourceMappingURL=xtal-radio-tabs-md.js.map
/**
 * `xtal-text-area-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalTextAreaMD extends XtalTextInputMD {
    static get is() { return 'xtal-text-area-md'; }
    //_textArea: HTMLTextAreaElement;
    customizeClone(clonedNode) {
        const textArea = this._inputElement = clonedNode.querySelector('textarea');
        for (let i = 0, ii = this.attributes.length; i < ii; i++) {
            const attrib = this.attributes[i];
            textArea.setAttribute(attrib.name, attrib.value);
        }
    }
}
initCE(XtalTextAreaMD.is, XtalTextAreaMD, getBasePath(XtalTextAreaMD.is) + '/text-area');
//# sourceMappingURL=xtal-text-area-md.js.map
    })();  
        