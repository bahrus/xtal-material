declare var xtal_input: HTMLLinkElement;
export interface IXtalInputProperties {
    value: string | boolean;
}
(function () {
    const cs_src = self['xtal_input'] ? xtal_input.href : (document.currentScript as HTMLScriptElement).src;
    const base = cs_src.split('/').slice(0, -1).join('/');
    let materialCss: string;
    fetch(base + '/xtal-material.css', { credentials: 'include' }).then(resp => {
        resp.text().then(txt => {
            materialCss = txt;
            initXtalInput();
        })
    });
    function initXtalInput() {
        const cssTemplate = document.createElement('template');
        cssTemplate.innerHTML = `
<style>
     :host {
        display: block;
    }
    ${materialCss}
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
            emitEvent() {
                const newEvent = new CustomEvent('value-changed', {
                    detail: {
                        value: this._inputElement.value
                    },
                    bubbles: true,
                    composed: false
                } as CustomEventInit);
                this.dispatchEvent(newEvent);
            }
            getType() {
                return 'input';
            }
            getCssTemplate(){
                return cssTemplate;
            }
            getTemplate() {
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
                const clonedCssNode = this.getCssTemplate().content.cloneNode(true) as DocumentFragment;
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
                    this.emitEvent()
                });
                this._inputElement.addEventListener('change', e => {

                    let element = this._inputElement;// e.target as HTMLInputElement;
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
        if (customElements.get(XtalInput.is)) return;
        customElements.define(XtalInput.is, XtalInput);
        class XtalInputEmail extends XtalInput {
            static get is() { return 'xtal-input-email'; }
            getType() {
                return 'email'
            }
        }

        customElements.define(XtalInputEmail.is, XtalInputEmail);
        let checkBoxCss: string;
        fetch(base + '/xtal-material-checkbox-radio.css', { credentials: 'include' }).then(resp => {
            resp.text().then(txt => {
                checkBoxCss = txt;
                initCheckbox();
            })
        }); 
        function initCheckbox() {
            const templateCheckbox = document.createElement('template');
            templateCheckbox.innerHTML = `
            <label class="form-checkbox-label">
                <input id="input_field" class="form-checkbox-field" type="checkbox" />
                <i class="form-checkbox-button"></i>
                <slot name="label"></slot>
            </label>
            `;
            const cssCheckBoxTemplate = document.createElement('template');
            cssCheckBoxTemplate.innerHTML = `
    <style>
         :host {
            display: block;
        }
        ${checkBoxCss}
    </style>
            `;
            class XtalInputCheckbox extends XtalInput {
                static get is() { return 'xtal-input-checkbox' }
                getType() {
                    return 'checkbox';
                }
                getTemplate() {
                    return templateCheckbox;
                }
                get checked() {
                    return this._inputElement.checked;
                }
                set checked(val) {
                    this._inputElement.checked = val;
                }
                getCssTemplate(){
                    return cssCheckBoxTemplate;
                }
                emitEvent() {
                    const newEvent = new CustomEvent('checked-changed', {
                        detail: {
                            value: this._inputElement.checked
                        },
                        bubbles: true,
                        composed: false
                    } as CustomEventInit);
                    this.dispatchEvent(newEvent);
                }
            }
            customElements.define(XtalInputCheckbox.is, XtalInputCheckbox);
        }
    }


})();