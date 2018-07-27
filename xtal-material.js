
    //@ts-check
    (function () {
    function getBasePath(tagName) {
    let path;
    const link = self['xtal_material'];
    if (link) {
        path = link.href;
    } else {
        const cs = document.currentScript;
        if (cs) {
            path = cs.src;
        } else {
        }
    }
    return path.split('/').slice(0, -1).join('/');
}

function lispToSnakeCase(s) {
    return s.split('-').join('_');
}
const _cachedTemplates = {};
const fetchInProgress = {};
function delayedLoad(template, delay, params) {
    setTimeout(() => {
        loadTemplate(template, params);
    }, delay);
}
function loadTemplate(template, params) {
    const src = template.dataset.src || template.getAttribute('href');
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
                credentials: 'same-origin'
            }).then(resp => {
                resp.text().then(txt => {
                    fetchInProgress[src] = false;
                    if (params && params.preProcessor)
                        txt = params.preProcessor.process(txt);
                    const split = txt.split('<!---->');
                    if (split.length > 1) {
                        txt = split[1];
                    }
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
        if (params && params.tagName)
            customElements.define(params.tagName, params.cls);
    }
}
//# sourceMappingURL=first-templ.js.map
// const _cachedTemplates : {[key:string] : string} = {};
// const fetchInProgress : {[key:string] : boolean} = {};
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
    }
    loadTemplates(from) {
        qsa('template[data-src]', from).forEach((externalRefTemplate) => {
            const ds = externalRefTemplate.dataset;
            const ua = ds.ua;
            if (ua && navigator.userAgent.indexOf(ua) === -1)
                return;
            if (!ds.dumped) {
                document.head.appendChild(externalRefTemplate.content.cloneNode(true));
                ds.dumped = 'true';
            }
            const delay = ds.delay;
            if (delay) {
                delayedLoad(externalRefTemplate, parseInt(delay));
            }
            else {
                loadTemplate(externalRefTemplate);
            }
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
        this._observer.observe(document.head, config);
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
if (!customElements.get(TemplMount.is)) {
    customElements.define(TemplMount.is, TemplMount);
}
//# sourceMappingURL=templ-mount.js.map
const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr(name, ec[name].toString());
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
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
        addTemplate(noShadow) {
            if (!noShadow) {
                this.attachShadow({ mode: 'open' });
            }
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
            if (!noShadow) {
                this.shadowRoot.appendChild(clonedNode);
                this.initShadowRoot();
            }
            else {
                this.appendChild(clonedNode);
            }
            this.setAttribute("shadowed", true);
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
            const slots = qsa(slotSelector, this.shadowRoot).forEach((slot) => {
                slot.addEventListener('slotchange', e => {
                    slot.assignedNodes().forEach((node) => {
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        if (node['disabled'] && (typeof (node['target'] !== 'undefined'))) {
                            node['target'] = targetEl;
                            node.removeAttribute('disabled');
                        }
                        else {
                            if (node.nodeType === 1) {
                                targetEl.innerHTML = '';
                                targetEl.appendChild(node.cloneNode(true));
                                if (node.parentElement) {
                                    node.parentElement.removeChild(node);
                                }
                                else {
                                    if (node.nodeType === 1) {
                                        node.innerHTML = '';
                                        node.style.display = 'none';
                                        node.removeAttribute('id');
                                    }
                                }
                            }
                        }
                    });
                    this.postAdopt();
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
class XtalRadioTabsMD extends XtallatX(AdoptAChild) {
    static get is() { return 'xtal-radio-tabs-md'; }
    constructor() {
        super();
    }
    handleChange(e) {
        this.de('selected-tab', e.target);
    }
    postAdopt() {
        const q = qsa('input', this.shadowRoot);
        if (q.length === 0) {
            setTimeout(() => {
                this.postAdopt();
            }, 100);
            return;
        }
        this._changeHandler = this.handleChange.bind(this);
        q.forEach(radio => {
            radio.addEventListener('change', this._changeHandler);
        });
        const styles = [];
        for (let i = 0, ii = q.length; i < ii; i++) {
            styles.push(styleFn(i, ii));
        }
        styles.push(`
        .slide {
            width: calc(100% / ${q.length});
        }
        `);
        const style = document.createElement('style');
        style.innerHTML = styles.join('');
        this.shadowRoot.appendChild(style);
        this.addEventListener('input', e => {
            debugger;
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        const q = qsa('input', this.shadowRoot);
        q.forEach(radio => {
            radio.removeEventListener('change', this._changeHandler);
        });
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
class XtalSideNav extends XtallatX(BraKet) {
    static get is() { return 'xtal-side-nav'; }
    openMenu(e) {
        this.setWidth(250);
    }
    setWidth(width) {
        this.shadowRoot.getElementById('mySidenav').style.width = width + 'px';
    }
    closeMenu(e) {
        this.setWidth(0);
    }
    initShadowRoot() {
        this._opener = this.shadowRoot.getElementById('opener');
        this._boundOpener = this.openMenu.bind(this);
        this._opener.addEventListener('click', this._boundOpener);
        this._closer = this.shadowRoot.getElementById('closebtn');
        this._boundCloser = this.closeMenu.bind(this);
        this._closer.addEventListener('click', this._boundCloser);
        this._slot = this.shadowRoot.getElementById('slot');
        this._slot.addEventListener('click', this._boundCloser);
    }
    disconnectedCallback() {
        this._opener.removeEventListener('click', this._boundOpener);
        this._closer.removeEventListener('click', this._boundCloser);
        this._slot.removeEventListener('click', this._boundCloser);
    }
}
initCE(XtalSideNav.is, XtalSideNav, getBasePath(XtalSideNav.is) + '/side-nav');
//# sourceMappingURL=xtal-side-nav.js.map
    })();  
        