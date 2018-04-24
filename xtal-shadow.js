export class XtalShadow extends HTMLElement {
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
export function initCE(tagName, cls) {
    if (customElements.get(tagName))
        return;
    if (!self[tagName.split('-').join('_') + '_template']) {
        // setTimeout(() =>{
        //     initCE(tagName, cls);
        // }, 100);
        return;
    }
    customElements.define(tagName, cls);
}
initCE(XtalShadow.is, XtalShadow);
//# sourceMappingURL=xtal-shadow.js.map