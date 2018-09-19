
import { initCE, BraKet } from 'bra-ket/bra-ket.js';
import {getBasePath} from '../getBasePath.js';
import {AdoptAChild} from '../adopt-a-child.js';
import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {qsa} from 'xtal-latx/qsa.js';
/**
 * `xtal-radio-group-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalRadioGroupMD extends XtallatX(AdoptAChild) {
    static get is() { return 'xtal-radio-group-md'; }
    _changeHandler;
    handleChange(e){
        this.de('selected-radio', e.target);
    }
    postAdopt(){
        const q= qsa('input', this.shadowRoot);
        if(q.length === 0){
            setTimeout(()=>{
                this.postAdopt();
            }, 10);
            return;
        }
        this._changeHandler = this.handleChange.bind(this);
        q.forEach(radio =>{
            radio.addEventListener('change', this._changeHandler);
        })
    }
    disconnectedCallback(){
        const q = qsa('input', this.shadowRoot);
        q.forEach(radio => {
            radio.removeEventListener('change', this._changeHandler);
        })
    }
}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group');