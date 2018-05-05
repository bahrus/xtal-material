import { initCE, basePath, BraKet } from '../bra-ket.js';
export class XtalRadioGroupMD extends BraKet {
    static get is() { return 'xtal-radio-group-md'; }
    addTemplate() {
        super.addTemplate();
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', e => {
            slot['assignedElements']().forEach((node) => {
                const div = document.createElement('div');
                div.innerHTML = node.outerHTML;
                this.shadowRoot.appendChild(div);
                const targetDiv = document.createElement('div');
                this.shadowRoot.appendChild(targetDiv);
                const imex = div.firstElementChild;
                imex['target'] = targetDiv;
                imex.removeAttribute('disabled');
            });
            //this.shadowRoot.appendChild(this.querySelector('template').content.cloneNode(true));
            //const template = this.querySelector('template');
            // this.shadowRoot.appendChild(template.content.cloneNode(true)['content'].cloneNode(true));
        });
    }
}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, basePath + '/radio-group');
//# sourceMappingURL=xtal-radio-group-md.js.map