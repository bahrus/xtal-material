import {initCE} from 'bra-ket/bra-ket.js';
import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {getBasePath} from '../getBasePath.js';
import {AdoptAChild} from '../adopt-a-child.js';
export class XtalSelectMD extends XtallatX(AdoptAChild) {
    static get is(){return 'xtal-select-md';}
}

const basePath = getBasePath(XtalSelectMD.is);
initCE(XtalSelectMD.is, XtalSelectMD, basePath  + '/select');