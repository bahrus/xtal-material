import {getESModuleUrl} from './xtal-temp-workaround.js';
export function getBasePath(tagName: string){
    let path: string;
    const link = self[lispToSnakeCase(tagName)];
    if(link){
        path = link.href;
    }else{
        const cs = document.currentScript as HTMLScriptElement;
        if(cs){
            path = cs.src;
        }else{
            path = getESModuleUrl();
        } 
    }
    return path.split('/').slice(0, -1).join('/');
}

export function lispToSnakeCase(s: string){
    return s.split('-').join('_');
}
export abstract class BraKet extends HTMLElement{
    static get is(){return 'bra-ket';}
    get tn(){
        return this.tagName.toLowerCase();
    }
    looksLike(){}
    _ce;
    get CE(){
        if(!this._ce) this._ce = customElements.get(this.tn);
        return this._ce;
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addTemplate();
    }
    customizeClone(clonedNode: DocumentFragment){}
    initShadowRoot(){}
    addTemplate(){
        if(!this.CE._template){
            this.CE._template = {};
        }
        const tn = this.looksLike() || this.tn;
        if(!this.CE._template[tn]){
            const templateId = lispToSnakeCase(tn) + '_template';
            this.CE._template[tn] = self[lispToSnakeCase(tn) + '_template'];
        }
        const clonedNode = this.CE._template[tn].content.cloneNode(true) as DocumentFragment;
        this.customizeClone(clonedNode);
        this.shadowRoot.appendChild(clonedNode);
        this.initShadowRoot();               
    }
}
const cachedTemplates : {[key:string] : string} = {};
const fetchInProgress : {[key:string] : boolean} = {};
export function initCE(tagName: string, cls: any, basePath: string, sharedTemplateTagName?: string){
    if(customElements.get(tagName)) return;
    const templateTagName = sharedTemplateTagName || tagName;
    const templateID = lispToSnakeCase( templateTagName) + '_template';
    let template = self[templateID] as HTMLTemplateElement;
    if(!template){
        template = document.createElement('template');
        template.id = templateID;
        template.dataset.src = basePath + '/' + templateTagName + '.html';
        document.head.appendChild(template);
    }
    const src = template.dataset.src;
    if(src){
        if(cachedTemplates[src]){
            template.innerHTML = cachedTemplates[src];
            customElements.define(tagName, cls);
        }else{
            if(fetchInProgress[src]){
                setTimeout(() =>{
                    initCE(tagName, cls, basePath, sharedTemplateTagName)
                }, 100);
                return;
            }
            fetchInProgress[src] = true;
            fetch(src, {
                credentials: 'include'
            }).then(resp =>{
                resp.text().then(txt =>{
                    fetchInProgress[src] = false;
                    cachedTemplates[src] = txt;
                    template.innerHTML = txt;
                    customElements.define(tagName, cls);
                })
            })
        }

    }else{
        customElements.define(tagName, cls);
    }
    
}
export const basePath = getBasePath(BraKet.is);
//initCE(XtalShadow.is, XtalShadow, basePath);
