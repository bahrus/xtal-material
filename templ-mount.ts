interface ICEParams{
    tagName: string,
    cls: any,
    sharedTemplateTagName: string
}
const _cachedTemplates : {[key:string] : string} = {};
const fetchInProgress : {[key:string] : boolean} = {};
export function loadTemplate(template: HTMLTemplateElement, params?: ICEParams){
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
                    template.setAttribute('loaded', '');
                    if(params) customElements.define(params.tagName, params.cls);
                })
            })
        }

    }else{
        if(params) customElements.define(params.tagName, params.cls);
    }
}
export class TemplMount extends HTMLElement{
    static get is(){return 'templ-mount';}
    constructor() {
        super();
        this.loadTemplatesOutsideShadowDOM();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.loadTemplatesOutsideShadowDOM();
                this.monitorHeadForTemplates();
            });
        }else{
            this.monitorHeadForTemplates();
        }
    }

    getHost(){
        const parent = this.parentNode as HTMLElement;
        return parent['host'];
        // if(parent.nodeType !== 11){
        //     return;
        // }
        
    }
    loadTemplates(from: DocumentFragment){
        const externalRefTemplates = from.querySelectorAll('template[data-src]');
        for(let i = 0, ii = externalRefTemplates.length; i < ii; i++){
            loadTemplate(externalRefTemplates[i] as HTMLTemplateElement);
        }        
    }
    loadTemplatesOutsideShadowDOM(){
        this.loadTemplates(document);
        // const externalRefTemplates = document.querySelectorAll('template[data-src]');
        // for(let i = 0, ii = externalRefTemplates.length; i < ii; i++){
        //     loadTemplate(externalRefTemplates[i] as HTMLTemplateElement);
        // }
    }
    loadTemplateInsideShadowDOM(){
        const host = this.getHost();
        if(!host) return;
        this.loadTemplates(host);
    }
    monitorHeadForTemplates(){

    }
    connectedCallback(){
        this.loadTemplateInsideShadowDOM();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", e => {
                this.loadTemplateInsideShadowDOM();
            });
        }
    }
}
customElements.define(TemplMount.is, TemplMount)