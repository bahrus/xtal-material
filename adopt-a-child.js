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
        super.addTemplate();
        if (!this.dynamicSlots)
            return;
        this.dynamicSlots.forEach(slotSelector => {
            const slots = qsa(slotSelector, this.shadowRoot).forEach(slot => {
                slot.addEventListener('slotchange', e => {
                    slot['assignedElements']().forEach((node) => {
                        const rootEl = document.createElement(this._rootElement);
                        rootEl.innerHTML = node.outerHTML;
                        this.shadowRoot.appendChild(rootEl);
                        //const targetEl = document.createElement(this._targetElement);
                        const targetEl = this.shadowRoot.querySelector(this._targetElementSelector);
                        //slot.insertAdjacentElement('afterend', targetEl);
                        //this.shadowRoot.appendChild(targetEl);
                        const imex = rootEl.firstElementChild;
                        if (imex['disabled'] && (typeof (imex['target'] !== 'undefined'))) {
                            imex['target'] = targetEl;
                            imex.removeAttribute('disabled');
                        }
                        else {
                            const imexnew = rootEl.removeChild(rootEl.firstElementChild);
                            targetEl.appendChild(imexnew.cloneNode(true));
                            slot.style.display = 'none';
                        }
                        this.postAdopt();
                    });
                });
            });
        });
    }
}
//# sourceMappingURL=adopt-a-child.js.map