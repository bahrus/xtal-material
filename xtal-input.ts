declare var xtal_input: HTMLLinkElement;
export interface IXtalInputProperties {
    value: string
}
(function () {
    const cs_src = self['xtal_input'] ? xtal_input.href : (document.currentScript as HTMLScriptElement).src;
    const base = cs_src.split('/').slice(0, -1).join('/');
    fetch(base + '/xtal-material.css', { credentials: 'include' }).then(resp => {
        resp.text().then(txt => {
            initXtalInput(txt);
        })
    });
    function initXtalInput(css: string) {
        const cssTemplate = document.createElement('template');
        cssTemplate.innerHTML = `
<style>
     :host {
        display: block;
    }
    ${css}
</style>
        `;
        const templateFormElement = document.createElement('template');
        templateFormElement.innerHTML = `

<div class="form-element form-input">
    
    <input id="input_field" class="form-element-field" placeholder=" " required/>
    <div class="form-element-bar"></div>
    <label class="form-element-label" for="input_field">
    <slot name="label"></slot>
    </label>
    <small class="form-element-hint">
        <slot name="hint"></slot>
    </small>
</div>
`;
        const templateCheckbox = document.createElement('template');
        templateCheckbox.innerHTML = `
        <div class="form-checkbox form-checkbox-inline">
        <label class="form-checkbox-label">
            <input id="input_field" class="form-checkbox-field" type="checkbox" />
            <i class="form-checkbox-button"></i>
            <slot name="label"></slot>
        </label>
        </div>
        `;
        /**
         * `xtal-input`
         *  Web component wrapper around https://codepen.io/jonnitto/pen/OVmvPB
         *
         * @customElement
         * @polymer
         * @demo demo/index.html
         */
        class XtalInput extends HTMLElement implements IXtalInputProperties {
            static get is() { return 'xtal-input'; }
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.addTemplate(this.getType());

            }
            getType() {
                return 'input';
            }
            getTemplate(){
                return templateFormElement;
            }
            get value() {
                return this._inputElement.value;
            }
            set value(val) {
                this._inputElement.value = val;
            }
            _inputElement: HTMLInputElement;
            addTemplate(type: string) {
                const clonedCssNode = cssTemplate.content.cloneNode(true) as DocumentFragment;
                this.shadowRoot.appendChild(clonedCssNode);
                const clonedNode = this.getTemplate().content.cloneNode(true) as DocumentFragment;
                this._inputElement = clonedNode.querySelector('input');
                this._inputElement.setAttribute('type', type);
                for (let i = 0, ii = this.attributes.length; i < ii; i++) {
                    const attrib = this.attributes[i];
                    //const inp = clonedNode.querySelector('input');
                    this._inputElement.setAttribute(attrib.name, attrib.value);
                }
                this.shadowRoot.appendChild(clonedNode);
                this._inputElement.addEventListener('input', e => {
                    const newEvent = new CustomEvent('value-changed', {
                        detail: {
                            value: this._inputElement.value
                        },
                        bubbles: true,
                        composed: false
                    } as CustomEventInit);
                    this.dispatchEvent(newEvent);
                    
                    
                     
                })
                this._inputElement.addEventListener('change', e =>{
                    
                    let element =  this._inputElement;// e.target as HTMLInputElement;
                    if (element && element.matches(".form-element-field")) {
                        element.classList[element.value ? "add" : "remove"]("-hasvalue");
                    }
                })
            }
            _upgradeProperties(props: string[]) {
                props.forEach(prop => {
                    if (this.hasOwnProperty(prop)) {
                        let value = this[prop];
                        delete this[prop];
                        this[prop] = value;
                    }
                })

            }
            connectedCallback() {
                this._upgradeProperties(['value']);
            }
        }
        customElements.define(XtalInput.is, XtalInput);
        class XtalInputEmail extends XtalInput {
            static get is() { return 'xtal-input-email'; }
            getType() {
                return 'email'
            }
        }
        customElements.define(XtalInputEmail.is, XtalInputEmail);
        class XtalInputCheckbox extends XtalInput{
            static get is(){return 'xtal-input-checkbox'}
            getType(){
                return 'checkbox';
            }
            getTemplate(){
                return templateCheckbox;
            }
        }
        customElements.define(XtalInputCheckbox.is, XtalInputCheckbox);
    }


})();