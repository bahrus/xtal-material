import { BraKet, initCE } from 'bra-ket/bra-ket.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { getBasePath } from '../getBasePath.js';
export class XtalSideNav extends XtallatX(BraKet) {
    static get is() { return 'xtal-side-nav'; }
    openMenu(e) {
        this.setWidth(250);
    }
    setWidth(width) {
        this.shadowRoot.getElementById('mySidenav').style.width = width + 'px';
    }
    closeMenu(e) {
        this.setWidth(0);
    }
    initShadowRoot() {
        this._opener = this.shadowRoot.getElementById('opener');
        this._boundOpener = this.openMenu.bind(this);
        this._opener.addEventListener('click', this._boundOpener);
        this._closer = this.shadowRoot.getElementById('closebtn');
        this._boundCloser = this.closeMenu.bind(this);
        this._closer.addEventListener('click', this._boundCloser);
        this._slot = this.shadowRoot.getElementById('slot');
        this._slot.addEventListener('click', this._boundCloser);
    }
    disconnectedCallback() {
        this._opener.removeEventListener('click', this._boundOpener);
        this._closer.removeEventListener('click', this._boundCloser);
        this._slot.removeEventListener('click', this._boundCloser);
    }
}
initCE(XtalSideNav.is, XtalSideNav, getBasePath(XtalSideNav.is) + '/side-nav');
//# sourceMappingURL=xtal-side-nav.js.map