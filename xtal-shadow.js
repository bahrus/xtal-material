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
const cachedTemplates = {};
const fetchInProgress = {};
export function initCE(tagName, cls) {
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