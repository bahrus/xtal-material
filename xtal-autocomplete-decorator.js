import { decorate } from 'trans-render/decorate.js';
let count = 0;
const auto = '__autoCompletize__';
export function autoCompletize(txt, vals) {
    if (txt.hasAttribute(auto))
        return;
    txt.setAttribute(auto, '');
    decorate(txt, vals, {
        props: {
            options: undefined
        },
        methods: {
            onPropsChange: function () {
                let nextSib = this.nextElementSibling;
                if (nextSib.localName !== 'datalist') {
                    nextSib = document.createElement('datalist');
                    nextSib.id = auto + count;
                    count++;
                    this.setAttribute('list', nextSib.id);
                    this.insertAdjacentElement('afterEnd', nextSib);
                }
                const options = this.options;
                if (options !== undefined && options !== this._previousOptions) {
                    this._previousOptions = options;
                    const textFld = options.textFld;
                    options.data.forEach(item => {
                        const optionTarget = document.createElement("option");
                        optionTarget.setAttribute("value", item[textFld]);
                        nextSib.appendChild(optionTarget);
                    });
                }
                console.log(this.options);
            }
        }
    });
}
