import { initCE } from 'bra-ket/bra-ket.js';
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
import { qsa } from 'templ-mount/templ-mount.js';
const styleFn = (n, t) => `
input[type="radio"][name="tabs"]:nth-of-type(${n + 1}):checked~.slide {
    left: calc((100% / ${t}) * ${n});
}
`;
export class XtalRadioTabsMD extends AdoptAChild {
    static get is() { return 'xtal-radio-tabs-md'; }
    constructor() {
        super();
    }
    postAdopt() {
        const q = qsa('input', this.shadowRoot);
        if (q.length === 0) {
            setTimeout(() => {
                this.postAdopt();
            }, 100);
            return;
        }
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
    }
}
initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs');
//# sourceMappingURL=xtal-radio-tabs-md.js.map