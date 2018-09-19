
    //@ts-check
    (function () {
    function getBasePath(tagName) {
    let path;
    const link = self['xtal_material'];
    if (link) {
        path = link.href;
    }
    else {
        const cs = document.currentScript;
        if (cs) {
            path = cs.src;
        }
        else {
        }
    }
    return path.split('/').slice(0, -1).join('/');
}
function lispToSnakeCase(s) {
    return s.split('-').join('_');
}
const _cT = {}; //cachedTemplates
const fip = {}; //fetch in progress
function def(p) {
    if (p && p.tagName && p.cls) {
        if (customElements.get(p.tagName)) {
            console.warn(p.tagName + '!!');
        }
        else {
            customElements.define(p.tagName, p.cls);
        }
    }
}
function loadTemplate(t, p) {
    const src = t.dataset.src || t.getAttribute('href');
    if (src) {
        if (_cT[src]) {
            t.innerHTML = _cT[src];
            def(p);
        }
        else {
            if (fip[src]) {
                if (p) {
                    setTimeout(() => {
                        loadTemplate(t, p);
                    }, 100);
                }
                return;
            }
            fip[src] = true;
            fetch(src, {
                credentials: 'same-origin'
            }).then(resp => {
                resp.text().then(txt => {
                    fip[src] = false;
                    if (p && p.preProcessor)
                        txt = p.preProcessor.process(txt);
                    if (!p || !p.noSnip) {
                        const split = txt.split('<!---->');
                        if (split.length > 1) {
                            txt = split[1];
                        }
                    }
                    _cT[src] = txt;
                    t.innerHTML = txt;
                    t.setAttribute('loaded', '');
                    def(p);
                });
            });
        }
    }
    else {
        def(p);
    }
}
function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
/**
* `templ-mount`
* Dependency free web component that loads templates from data-src (optionally href) attribute
*
* @customElement
* @polymer
* @demo demo/index.html
*/
class TemplMount extends HTMLElement {
    constructor() {
        super();
        if (!TemplMount._adgc) {
            TemplMount._adgc = true;
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", e => {
                    this.mhft();
                    this.ltosd();
                });
            }
            else {
                this.mhft();
            }
        }
    }
    static get is() { return 'templ-mount'; }
    /**
     * Gets host from parent
     */
    getHost() {
        return this.parentNode;
    }
    copyAttrs(src, dest, attrs) {
        attrs.forEach(attr => {
            if (!src.hasAttribute(attr))
                return;
            let attrVal = src.getAttribute(attr);
            if (attr === 'type')
                attrVal = attrVal.replace(':', '');
            dest.setAttribute(attr, attrVal);
        });
    }
    cT(clonedNode, tagName, copyAttrs) {
        qsa(tagName, clonedNode).forEach(node => {
            //node.setAttribute('clone-me', '');
            const clone = document.createElement(tagName);
            this.copyAttrs(node, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            document.head.appendChild(clone);
        });
    }
    iT(template) {
        const ds = template.dataset;
        const ua = ds.ua;
        let noMatch = false;
        if (ua) {
            noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
        }
        if (ua && template.hasAttribute('data-exclude'))
            noMatch = !noMatch;
        if (ua && noMatch)
            return;
        if (!ds.dumped) {
            //This shouldn't be so hard, but Chrome (and other browsers) doesn't seem to consistently like just appending the cloned children of the template
            const clonedNode = template.content.cloneNode(true);
            this.cT(clonedNode, 'script', ['src', 'type', 'nomodule']);
            this.cT(clonedNode, 'template', ['id', 'data-src', 'href', 'data-activate', 'data-ua', 'data-exclude', 'data-methods']);
            this.cT(clonedNode, 'c-c', ['from', 'noshadow', 'copy']);
            ds.dumped = 'true';
        }
        loadTemplate(template, {
            noSnip: template.hasAttribute('nosnip'),
        });
    }
    /**
     *
     * @param from
     */
    lt(from) {
        qsa('template[data-src],template[data-activate]', from).forEach((t) => {
            this.iT(t);
        });
    }
    ltosd() {
        this.lt(document);
    }
    ltisd() {
        const host = this.getHost();
        if (!host)
            return;
        this.lt(host);
    }
    mhft() {
        const config = { childList: true };
        this._observer = new MutationObserver((mL) => {
            mL.forEach(mR => {
                mR.addedNodes.forEach((node) => {
                    if (node.tagName === 'TEMPLATE')
                        this.iT(node);
                });
            });
        });
        this._observer.observe(document.head, config);
    }
    connectedCallback() {
        this.style.display = 'none';
        this.ltisd();
        this.ltosd();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.ltisd();
            });
        }
    }
}
TemplMount._adgc = false; //already did global check
customElements.define(TemplMount.is, TemplMount);
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
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
function qsa(css, from) {
    return [].slice.call(from.querySelectorAll(css));
}
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
            this.setAttribute("shadowed", 'true');
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
                        if (node.nodeType === 3)
                            return;
                        if (node.hasAttribute('disabled')) {
                            node.removeAttribute('disabled');
                            node['target'] = targetEl;
                        }
                    });
                    this.postAdopt();
                });
            });
        });
    }
}
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
class XtalEmailInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-email-input-md'; }
    looksLike() {
        return XtalTextInputMD.is;
    }
}
initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is);
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
        const val = this._inputElement.checked;
        this.value = val ? 'on' : 'off';
        this.de('value', {
            value: val
        });
    }
    addInputListener() {
        //some browsers don't support 'input' change on checkbox yet
        this._inputElement.addEventListener('change', e => {
            this.emitEvent();
        });
    }
}
initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, getBasePath(XtalCheckboxInputMD.is) + '/checkbox-input');
/**
 * `xtal-radio-group-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalRadioGroupMD extends XtallatX(AdoptAChild) {
    static get is() { return 'xtal-radio-group-md'; }
    handleChange(e) {
        this.de('selected-radio', e.target);
    }
    postAdopt() {
        const q = qsa('input', this.shadowRoot);
        if (q.length === 0) {
            setTimeout(() => {
                this.postAdopt();
            }, 10);
            return;
        }
        this._changeHandler = this.handleChange.bind(this);
        q.forEach(radio => {
            radio.addEventListener('change', this._changeHandler);
        });
    }
    disconnectedCallback() {
        const q = qsa('input', this.shadowRoot);
        q.forEach(radio => {
            radio.removeEventListener('change', this._changeHandler);
        });
    }
}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group');
//import {qsa} from 'templ-mount/templ-mount.js';
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
            }, 10);
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
        const q = qsa('input', this.shadowRoot);
        q.forEach(radio => {
            radio.removeEventListener('change', this._changeHandler);
        });
    }
}
initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs');
//import {qsa} from 'templ-mount/templ-mount.js';
class XtalSelectMD extends XtallatX(AdoptAChild) {
    static get is() { return 'xtal-select-md'; }
    handleChange(e) {
        console.log(this._select[this._select.selectedIndex]);
        this.de('selected-option', this._select[this._select.selectedIndex]);
    }
    postAdopt() {
        this._select = this.shadowRoot.querySelector('select');
        if (!this._select) {
            setTimeout(() => {
                this.postAdopt();
            }, 10);
            return;
        }
        this._changeHandler = this.handleChange.bind(this);
        this._select.addEventListener('change', this._changeHandler);
    }
    disconnectedCallback() {
        if (this._select && this._changeHandler) {
            this._select.removeEventListener('change', this._changeHandler);
        }
    }
}
initCE(XtalSelectMD.is, XtalSelectMD, getBasePath(XtalSelectMD.is) + '/select');
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
    })();  
        