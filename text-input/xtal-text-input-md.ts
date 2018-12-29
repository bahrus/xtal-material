import { BraKet, initCE} from 'bra-ket/bra-ket.js';
import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {getBasePath} from '../getBasePath.js';

export interface IXtalInputProperties {
    value: string;
}

export interface IXtalInputOptions {
    data: any[],
    textFld: string,
    keyFld: string,
}
/**
 * `xtal-text-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalTextInputMD extends XtallatX(BraKet) implements IXtalInputProperties {
    static get is() { return 'xtal-text-input-md'; }
    _inputElement: HTMLInputElement | HTMLTextAreaElement;
    customizeClone(clonedNode: DocumentFragment) {
        super.customizeClone(clonedNode);
        const inputEl = this._inputElement = clonedNode.querySelector('input');
        inputEl.setAttribute('type', this.getType());
        for (let i = 0, ii = this.attributes.length; i < ii; i++) {
            const attrib = this.attributes[i];
            //const inp = clonedNode.querySelector('input');
            if (attrib.name === 'type') continue;
            inputEl.setAttribute(attrib.name, attrib.value);
        }
        
    }
    initShadowRoot() {
        this.addInputListener();
        this._inputElement.addEventListener('change', e => {
            let element = this._inputElement;// e.target as HTMLInputElement;
            if (element && element.matches(".form-element-field")) {
                element.classList[element.value ? "add" : "remove"]("-hasvalue");
            }
        })
    }
    get value() {
        return this._inputElement.value;
    }
    set value(val) {
        this._inputElement.value = val;
    }
    selection: any;
    _options: IXtalInputOptions;
    get options(){
        return this._options;
    }
    set options(nv){
        this._options = nv;
        if(this._options){
            const dl = this.shadowRoot!.querySelector('#options');
            dl.innerHTML = '';
            const textFld = nv.textFld;
            nv.data.forEach(item =>{
                const optionTarget = document.createElement('option');
                optionTarget.setAttribute('value', item[textFld]);
                dl.appendChild(optionTarget);
            })
        }
    }
    // _key: string;
    // get key(){return this._key;}
    // set key(nv){
    //     this._key = nv;
    // }

    getType() {
        return this.constructor['is'].split('-')[1];
    }
    
    addInputListener() {
        this._inputElement.addEventListener('input', e => {
            this.emitEvent()
        });
    }
    emitEvent() {
        const val = this._inputElement.value;
        this.value = val;
        this.de('value',{
            value: val
        });
        if(this._options){
            const textFld = this._options.textFld;
            const item = this._options.data.find(item => item[textFld] === val);
            if(item !== undefined){
                this.selection = item;
                this.de('selection', {
                    value: item,
                })
            }
        }
    }
    connectedCallback() {
        this._upgradeProperties(['value', 'options']);
        this.addMutationObserver();
    }
    _observer: MutationObserver;
    addMutationObserver(){
        const config : MutationObserverInit = { attributes: true};
        this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            mutationsList.forEach(mutation =>{
                const attrName = mutation.attributeName;
                const attrVal = this.getAttribute(attrName);
                switch(attrName){
                    case 'options':
                        this.options = JSON.parse(attrVal);
                        break;
                    default:
                        this._inputElement.setAttribute(attrName, attrVal);
                }attrName
               
            })
        });
        this._observer.observe(<any>this as Node, config);
    }
    disconnectedCallback(){
        this._observer.disconnect();
    }
}
const basePath = getBasePath(XtalTextInputMD.is);
initCE(XtalTextInputMD.is, XtalTextInputMD, basePath  + '/text-input');
/**
 * `xtal-email-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design email input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalEmailInputMD extends XtalTextInputMD{
    static get is() { return 'xtal-email-input-md'; }
    looksLike(){
        return XtalTextInputMD.is;
    }
}

initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is);