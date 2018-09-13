
import { initCE, BraKet } from 'bra-ket/bra-ket.js';
import {getBasePath} from '../getBasePath.js';
import {AdoptAChild} from '../adopt-a-child.js';

/**
 * `xtal-radio-group-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalRadioGroupMD extends AdoptAChild {
    static get is() { return 'xtal-radio-group-md'; }
    constructor(){
        super();
    }


}
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group');