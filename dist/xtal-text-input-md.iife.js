
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
            path = import.meta['url'];
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
    get doc() {
        if (this.hasAttribute('target-top')) {
            return window.top.document;
        }
        return document;
    }
    cT(clonedNode, tagName, copyAttrs) {
        const doc = this.doc;
        qsa(tagName, clonedNode).forEach(node => {
            //node.setAttribute('clone-me', '');
            const clone = doc.createElement(tagName);
            this.copyAttrs(node, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            doc.head.appendChild(clone);
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
        de(name, detail, asIs = false) {
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
    get options() {
        return this._options;
    }
    set options(nv) {
        this._options = nv;
        if (this._options) {
            const dl = this.shadowRoot.querySelector('#options');
            nv.forEach(option => {
                const optionTarget = document.createElement('option');
                optionTarget.setAttribute('value', option);
                dl.appendChild(optionTarget);
            });
        }
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
        this._upgradeProperties(['value', 'options']);
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
    })();  
        