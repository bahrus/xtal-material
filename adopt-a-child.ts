import {BraKet} from 'bra-ket/bra-ket.js';
import {qsa} from 'templ-mount/templ-mount.js';
import {LitterGZ} from 'litter-g/litter-gz.js';
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
                    slot.assignedNodes().forEach((node : HTMLElement) => {
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        if(node.nodeType === 3) return;
                        if(node.hasAttribute('disabled')){
                            node.removeAttribute('disabled');
                            node['target'] = targetEl;
                            
                        }
                        // }else{
                        //     if(node.nodeType === 1){
                                
                        //         targetEl.innerHTML = '';
                        //         targetEl.appendChild(node.cloneNode(true));
                        //         if(node.parentElement){
                        //             node.parentElement.removeChild(node);
                        //         }else{
                        //             if(node.nodeType === 1){
                        //                 node.innerHTML = '';
                        //                 node.style.display = 'none';
                        //                 node.removeAttribute('id');
                        //             }
                                    
                        //         }
                        //     }

                            
                        // }
                        
                    });
                    this.postAdopt();
                });
            });
            
        })

    }
}