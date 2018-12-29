import { initCE } from 'bra-ket/bra-ket.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
//import {qsa} from 'templ-mount/templ-mount.js';
export class XtalSelectMD extends XtallatX(AdoptAChild) {
    static get is() { return 'xtal-select-md'; }
    handleChange(e) {
        console.log(this._select[this._select.selectedIndex]);
        this.de('selected-option', this._select[this._select.selectedIndex]);
    }
    postAdopt() {
        this._select = this.shadowRoot.querySelector('select');
        if (!this._select) {
            setTimeout(() => {
                this.postAdopt();
            }, 10);
            return;
        }
        this._changeHandler = this.handleChange.bind(this);
        this._select.addEventListener('change', this._changeHandler);
    }
    disconnectedCallback() {
        if (this._select && this._changeHandler) {
            this._select.removeEventListener('change', this._changeHandler);
        }
    }
}
initCE(XtalSelectMD.is, XtalSelectMD, getBasePath(XtalSelectMD.is) + '/select');
//# sourceMappingURL=xtal-select-md.js.map