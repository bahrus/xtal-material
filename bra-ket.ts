import { getESModuleUrl } from './xtal-temp-workaround.js';
import { loadTemplate } from './templ-mount.js';
export function getBasePath(tagName: string) {
    let path: string;
    const link = self[lispToSnakeCase(tagName)];
    if (link) {
        path = link.href;
    } else {
        const cs = document.currentScript as HTMLScriptElement;
        if (cs) {
            path = cs.src;
        } else {
            path = getESModuleUrl();
        }
    }
    return path.split('/').slice(0, -1).join('/');
}


export function lispToSnakeCase(s: string) {
    return s.split('-').join('_');
}
export function BraKetMixin(superClass) {
    return class extends superClass {
        static get is() { return 'bra-ket'; }
        get tn() {
            return this.tagName.toLowerCase();
        }
        looksLike() { }
        _ce;
        get dynamicSlots(): string[] {
            return null;
        }
        get CE() {
            if (!this._ce) this._ce = customElements.get(this.tn);
            return this._ce;
        }

        customizeClone(clonedNode: DocumentFragment) { }
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
            const clonedNode = this.CE._template[tn].content.cloneNode(true) as DocumentFragment;
            this.customizeClone(clonedNode);
            this.shadowRoot.appendChild(clonedNode);
            this.initShadowRoot();
        }
    }
}
export class BraKet extends BraKetMixin(HTMLElement) {
    constructor() {
        super();
        if (Object.getPrototypeOf(this) === BraKet.prototype) {

        } else {
            
            this.addTemplate();
        }


    }
}





export function initCE(tagName: string, cls: any, basePath: string, sharedTemplateTagName?: string) {
    if (customElements.get(tagName)) return;
    const templateTagName = sharedTemplateTagName || tagName;
    const templateID = lispToSnakeCase(templateTagName) + '_template';
    let template = self[templateID] as HTMLTemplateElement;
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
export const basePath = getBasePath(BraKet.is);
customElements.define(BraKet.is, BraKet);
//initCE(XtalShadow.is, XtalShadow, basePath);
