import {XtalShadow, initCE} from './xtal-shadow.js';

export interface IXtalInputProperties {
    value: string | boolean;
}
export class XtalMaterialInput extends XtalShadow implements IXtalInputProperties{
    static get is(){return 'xtal-material-input';}
    _inputElement: HTMLInputElement;
    customizeClone(clonedNode: DocumentFragment){
        super.customizeClone(clonedNode);
        this._inputElement = clonedNode.querySelector('input');
        this._inputElement.setAttribute('type', this.getType());
        for (let i = 0, ii = this.attributes.length; i < ii; i++) {
            const attrib = this.attributes[i];
            //const inp = clonedNode.querySelector('input');
            if(attrib.name === 'type') continue;
            this._inputElement.setAttribute(attrib.name, attrib.value);
        }
    }

    get value() {
        return this._inputElement.value;
    }
    set value(val) {
        this._inputElement.value = val;
    }
    getType() {
        return 'input';
    }
}
initCE(XtalMaterialInput.is, XtalMaterialInput);