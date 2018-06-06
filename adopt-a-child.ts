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
        console.log('addTemplate')
        super.addTemplate();
        if(!this.dynamicSlots) return;
        this.dynamicSlots.forEach(slotSelector =>{
            const slots = qsa(slotSelector, this.shadowRoot).forEach((slot : HTMLSlotElement) =>{
                slot.addEventListener('slotchange', e => {
                    // console.log({
                    //     assignedNodes: slot.assignedNodes(),
                    //     shadowRoot: this.shadowRoot
                    // })
                    //const rootEl = document.createElement(this._rootElement);
                    slot.assignedNodes().forEach((node : HTMLElement) => {
                        //if(node.nodeType !==1) return;
                        
                        //rootEl.innerHTML = node.outerHTML;
                        
                        
                        //const targetEl = document.createElement(this._targetElement);
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        //slot.insertAdjacentElement('afterend', targetEl);
                        //this.shadowRoot.appendChild(targetEl);
                        //const imex = rootEl.firstElementChild;
                        if(node['disabled'] && (typeof(node['target'] !== 'undefined'))){
                            console.log(node);
                            node['target'] = targetEl;
                            node.removeAttribute('disabled');
                        }else{
                            
                            targetEl.appendChild(node.cloneNode(true));
                            node.parentElement.removeChild(node);
                            //slot.style.display = 'none'; 
                        }
                        
                    });
                    //this.shadowRoot.appendChild(rootEl);
                    this.postAdopt();
                });
            });
            
        })

    }
}