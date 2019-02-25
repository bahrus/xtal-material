import {decorate} from 'trans-render/decorate.js';

export interface IXtalInputOptions {
    data: any[];
    textFld: string;
    keyFld: string;
}

let count = 0;
const auto = '__autoCompletize__';
export function autoCompletize(txt: HTMLInputElement, vals: HTMLInputElement){
    if(txt.hasAttribute(auto)) return;
    txt.setAttribute(auto, '');
    decorate(txt, vals, {
        props: {
            options: undefined,
            selection: undefined
        },
        methods:{
            onPropsChange: function(){
                let dl: HTMLDataListElement = null;
                if(!this.hasAttribute('list')){
                    const dl = document.createElement('datalist');
                    dl.id = auto + count;
                    count++;
                    this.setAttribute('list', dl.id);
                    dl.style.display='none';
                    document.head.appendChild(dl);
                }
                dl = self[this.getAttribute('list')];
                const options = this.options as IXtalInputOptions;
                if(options!== undefined && options !== this._previousOptions){
                    dl.innerHTML = '';
                    this._previousOptions = options;
                    const textFld = options.textFld;
                    const arr = [];
                    options.data.forEach(item => {
                        arr.push(/* html */`<option value="${item[textFld]}">`);
                    });
                    dl.innerHTML = arr.join('');

                }
            }
        },
        on: {
            input: function(e){
                if(this.options === undefined) return;
                const textFld = this.options.textFld;
                const item = this.options.data.find(item => item[textFld] === this.value);
                if (item !== undefined) {
                    this.selection = item;
                }
            }
        }

    })
}