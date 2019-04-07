import { decorate } from 'trans-render/decorate.js';
let count = 0;
const auto = '__autoCompletize__';
export function autoCompletize(txt, vals) {
    if (txt.hasAttribute(auto))
        return;
    txt.setAttribute(auto, '');
    decorate(txt, {
        propVals: vals,
        propDefs: {
            options: undefined,
            selection: undefined,
            lastVal: undefined
        },
        methods: {
            onPropsChange: function (name) {
                if (name === 'selection')
                    return;
                let dl = null;
                if (!this.hasAttribute('list')) {
                    const dl = document.createElement('datalist');
                    dl.id = auto + count;
                    count++;
                    this.setAttribute('list', dl.id);
                    dl.style.display = 'none';
                    document.head.appendChild(dl);
                }
                dl = self[this.getAttribute('list')];
                const options = this.options;
                if (options !== undefined && (options !== this._previousOptions || this.value !== this._previousValue)) {
                    this._previousOptions = options;
                    this._previousValue = this.value;
                    const viewableOptions = [];
                    let cnt = 0;
                    const textFld = options.textFld;
                    //let exactlyOneExactMatch = false;
                    let exactMatch = null;
                    for (let i = 0, ii = options.data.length; i < ii; i++) {
                        const row = options.data[i];
                        if ((row[textFld]).toLowerCase().indexOf(this.value.toLowerCase()) > -1) {
                            if (cnt === 0) {
                                if (row[textFld] === this.value) {
                                    exactMatch = row;
                                }
                            }
                            else {
                                if (row[textFld] === this.value) {
                                    exactMatch = null;
                                }
                            }
                            viewableOptions.push(row);
                            cnt++;
                            if (cnt > 20)
                                break;
                        }
                    }
                    if (exactMatch !== null) {
                        this.selection = exactMatch;
                        return;
                    }
                    const arr = [];
                    viewableOptions.forEach(item => {
                        arr.push(/* html */ `<option value="${item[textFld]}">`);
                    });
                    dl.innerHTML = arr.join('');
                }
            },
        },
        on: {
            input: function (e) {
                if (this.options === undefined)
                    return;
                const textFld = this.options.textFld;
                const item = this.options.data.find(item => item[textFld] === this.value);
                if (item !== undefined) {
                    this.selection = item;
                }
                this.lastVal = this.value;
            }
        }
    });
}
