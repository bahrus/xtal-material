import {BraKet} from './bra-ket.js';
import {qsa} from 'templ-mount/templ-mount.js';

export class AdoptAChild extends BraKet{
    constructor(){
        super();
        
    }
    get dynamicSlots(){
        return ['slot'];
    }
    
    _rootElement = 'div';
    _targetElement = 'div'
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
                        const targetEl = document.createElement(this._targetElement);
                        this.shadowRoot.appendChild(targetEl);
                        const imex = rootEl.firstElementChild;
                        imex['target'] = targetEl;
                        imex.removeAttribute('disabled');
                    });
                    //this.shadowRoot.appendChild(this.querySelector('template').content.cloneNode(true));
                    //const template = this.querySelector('template');
                    // this.shadowRoot.appendChild(template.content.cloneNode(true)['content'].cloneNode(true));
                });
            })
        })

    }
}