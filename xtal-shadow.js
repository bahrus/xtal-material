import { getESModuleUrl } from './xtal-temp-workaround.js';
export function getBasePath(tagName) {
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
            path = getESModuleUrl();
        }
    }
    return path.split('/').slice(0, -1).join('/');
}
export function lispToSnakeCase(s) {
    return s.split('-').join('_');
}
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
export function initCE(tagName, cls, basePath) {
    if (customElements.get(tagName))
        return;
    const templateID = tagName.split('-').join('_') + '_template';
    let template = self[templateID];
    if (!template) {
        template = document.createElement('template');
        template.id = templateID;
        template.dataset.src = basePath + '/' + tagName + '.html';
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
                    initCE(tagName, cls, basePath);
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
export const basePath = getBasePath(XtalShadow.is);
//initCE(XtalShadow.is, XtalShadow, basePath);
//# sourceMappingURL=xtal-shadow.js.map