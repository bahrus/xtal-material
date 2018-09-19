import { BraKet } from 'bra-ket/bra-ket.js';
import { qsa } from 'xtal-latx/qsa.js';
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
        super.addTemplate();
        if (!this.dynamicSlots)
            return;
        this.dynamicSlots.forEach(slotSelector => {
            const slots = qsa(slotSelector, this.shadowRoot).forEach((slot) => {
                slot.addEventListener('slotchange', e => {
                    slot.assignedNodes().forEach((node) => {
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        if (node.nodeType === 3)
                            return;
                        if (node.hasAttribute('disabled')) {
                            node.removeAttribute('disabled');
                            node['target'] = targetEl;
                        }
                    });
                    this.postAdopt();
                });
            });
        });
    }
}
//# sourceMappingURL=adopt-a-child.js.map