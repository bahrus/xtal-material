import {BraKet} from 'bra-ket/bra-ket.js';
import {qsa} from 'templ-mount/templ-mount.js';

export class AdoptAChild extends BraKet{
    constructor(){
        super();
        
    }
    get dynamicSlots(){
        return ['slot'];
    }
    
    _rootElement = 'div';
    _targetElementSelector = '[target]'
    addTemplate() {
        super.addTemplate();
        if(!this.dynamicSlots) return;
        this.dynamicSlots.forEach(slotSelector =>{
            const slots = qsa(slotSelector, this.shadowRoot).forEach(slot =>{
                slot.addEventListener('slotchange', e => {
                    slot['assignedElements']().forEach((node : HTMLElement) => {
                        const rootEl = document.createElement(this._rootElement);
                        rootEl.innerHTML = node.outerHTML;
                        this.shadowRoot.appendChild(rootEl);
                        
                        //const targetEl = document.createElement(this._targetElement);
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        //slot.insertAdjacentElement('afterend', targetEl);
                        //this.shadowRoot.appendChild(targetEl);
                        const imex = rootEl.firstElementChild;
                        if(imex['disabled'] && (typeof(imex['target'] !== 'undefined'))){
                            imex['target'] = targetEl;
                            imex.removeAttribute('disabled');
                        }else{
                            const imexnew = rootEl.removeChild(rootEl.firstElementChild) as HTMLElement;
                            targetEl.appendChild(imexnew.cloneNode(true));
                            slot.style.display = 'none';
                            //targetEl.innerHTML = imexnew.outerHTML;
                            // while(imex.firstChild){
                            //     const firstChild = imex.removeChild(imex.firstChild);
                            //     targetEl.appendChild(firstChild.cloneNode(true));
                            // }
                        }
                        
                    });
                    //this.shadowRoot.appendChild(this.querySelector('template').content.cloneNode(true));
                    //const template = this.querySelector('template');
                    // this.shadowRoot.appendChild(template.content.cloneNode(true)['content'].cloneNode(true));
                });
            })
        })

    }
}