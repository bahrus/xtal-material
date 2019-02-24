import { initCE } from 'bra-ket/bra-ket.js';
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { qsa } from 'xtal-latx/qsa.js';
//import {qsa} from 'templ-mount/templ-mount.js';
const styleFn = (n, t) => `
input[type="radio"][name="tabs"]:nth-of-type(${n + 1}):checked~.slide {
    left: calc((100% / ${t}) * ${n});
}
`;
export class XtalRadioTabsMD extends XtallatX(AdoptAChild) {
    static get is() { return 'xtal-radio-tabs-md'; }
    constructor() {
        super();
    }
    handleChange(e) {
        this.de('selected-tab', e.target);
    }
    postAdopt() {
        const q = qsa('input', this.shadowRoot);
        if (q.length === 0) {
            setTimeout(() => {
                this.postAdopt();
            }, 10);
            return;
        }
        this._changeHandler = this.handleChange.bind(this);
        q.forEach(radio => {
            radio.addEventListener('change', this._changeHandler);
        });
        const styles = [];
        for (let i = 0, ii = q.length; i < ii; i++) {
            styles.push(styleFn(i, ii));
        }
        styles.push(`
        .slide {
            width: calc(100% / ${q.length});
        }
        `);
        const style = document.createElement('style');
        style.innerHTML = styles.join('');
        this.shadowRoot.appendChild(style);
        this.addEventListener('input', e => {
            debugger;
        });
    }
    disconnectedCallback() {
        const q = qsa('input', this.shadowRoot);
        q.forEach(radio => {
            radio.removeEventListener('change', this._changeHandler);
        });
    }
}
initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs');
