import { BraKet, initCE} from 'bra-ket/bra-ket.js';
import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {getBasePath} from '../getBasePath.js';

export class XtalSelectMD extends XtallatX(BraKet){
    static get is(){return 'xtal-select-md';}
}

const basePath = getBasePath(XtalSelectMD.is);
initCE(XtalSelectMD.is, XtalSelectMD, basePath  + '/select');