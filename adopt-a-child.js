import { BraKet } from 'bra-ket/bra-ket.js';
import { qsa } from 'templ-mount/templ-mount.js';
export class AdoptAChild extends BraKet {
    constructor() {
        super();
        this._rootElement = 'div';
        this._targetElementSelector = '[target]';
    }
    get dynamicSlots() {
        return ['slot'];
    }
    postAdopt() { }
    addTemplate() {
        console.log('addTemplate');
        super.addTemplate();
        if (!this.dynamicSlots)
            return;
        this.dynamicSlots.forEach(slotSelector => {
            const slots = qsa(slotSelector, this.shadowRoot).forEach((slot) => {
                slot.addEventListener('slotchange', e => {
                    slot.assignedNodes().forEach((node) => {
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        if (node['disabled'] && (typeof (node['target'] !== 'undefined'))) {
                            node['target'] = targetEl;
                            node.removeAttribute('disabled');
                        }
                        else {
                            if (node.nodeType === 1) {
                                targetEl.innerHTML = '';
                                targetEl.appendChild(node.cloneNode(true));
                                if (node.parentElement) {
                                    node.parentElement.removeChild(node);
                                }
                                else {
                                    if (node.nodeType === 1) {
                                        node.innerHTML = '';
                                        node.style.display = 'none';
                                        node.removeAttribute('id');
                                    }
                                }
                            }
                        }
                    });
                    this.postAdopt();
                });
            });
        });
    }
}
//# sourceMappingURL=adopt-a-child.js.map