export class XtalShadow extends HTMLElement{static get is(){return'xtal-shadow'}get tn(){return this.tagName.toLowerCase()}get CE(){return this._ce||(this._ce=customElements.get(this.tn)),this._ce}constructor(){super(),this.attachShadow({mode:'open'}),this.addTemplate()}customizeClone(){}initShadowRoot(){}addTemplate(){this.CE._template||(this.CE._template={});const a=this.tn;this.CE._template[a]||(this.CE._template[a]=self[a.split('-').join('_')+'_template']);const b=this.CE._template[a].content.cloneNode(!0);this.customizeClone(b),this.shadowRoot.appendChild(b),this.initShadowRoot()}}export function initCE(a,b){if(customElements.get(a))return;const c=a.split('-').join('_')+'_template',d=self[c];if(d){const c=d.dataset.src;c?fetch(c).then((c)=>{c.text().then((c)=>{d.innerHTML=c,customElements.define(a,b)})}):customElements.define(a,b)}}initCE(XtalShadow.is,XtalShadow);