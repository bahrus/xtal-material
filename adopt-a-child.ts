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
    _targetElementSelector = '[target]';
    postAdopt(){}
    addTemplate() {
        super.addTemplate();
        if(!this.dynamicSlots) return;
        this.dynamicSlots.forEach(slotSelector =>{
            const slots = qsa(slotSelector, this.shadowRoot).forEach((slot : HTMLSlotElement) =>{
                slot.addEventListener('slotchange', e => {
                    // console.log({
                    //     assignedNodes: slot.assignedNodes(),
                    //     assignedElements: slot['assignedElements']()
                    // })
                    slot.assignedNodes().forEach((node : HTMLElement) => {
                        if(node.nodeType !==1) return;
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

                        }
                        this.postAdopt();
                    });
                   
                });
            });
            
        })

    }
}