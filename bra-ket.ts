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
interface ICEParams{
    tagName: string,
    cls: any,
    sharedTemplateTagName: string
}
function loadTemplate(template: HTMLTemplateElement, params?: ICEParams){
    const src = template.dataset.src;
    if(src){
        if(_cachedTemplates[src]){
            template.innerHTML = _cachedTemplates[src];
            if(params) customElements.define(params.tagName, params.cls);
        }else{
            if(fetchInProgress[src]){
                if(params){
                    setTimeout(() =>{
                        loadTemplate(template, params);
                    }, 100);
                }
                return;
            }
            fetchInProgress[src] = true;
            fetch(src, {
                credentials: 'include'
            }).then(resp =>{
                resp.text().then(txt =>{
                    fetchInProgress[src] = false;
                    _cachedTemplates[src] = txt;
                    template.innerHTML = txt;
                    if(params) customElements.define(params.tagName, params.cls);
                })
            })
        }

    }else{
        if(params) customElements.define(params.tagName, params.cls);
    }
}

export function lispToSnakeCase(s: string){
    return s.split('-').join('_');
}
export class BraKet extends HTMLElement{
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
        if(Object.getPrototypeOf(this) === BraKet.prototype){
            const externalRefTemplates = document.querySelectorAll('template[data-src]');
            for(let i = 0, ii = externalRefTemplates.length; i < ii; i++){
                loadTemplate(externalRefTemplates[i] as HTMLTemplateElement);
            }
        }else{
            this.attachShadow({ mode: 'open' });
            this.addTemplate();
        }


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
const _cachedTemplates : {[key:string] : string} = {};
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
    loadTemplate(template,{
        cls: cls,
        sharedTemplateTagName: sharedTemplateTagName,
        tagName: tagName
    });
    
    
}
export const basePath = getBasePath(BraKet.is);
customElements.define(BraKet.is, BraKet);
//initCE(XtalShadow.is, XtalShadow, basePath);
