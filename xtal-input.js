(function () {
    const cs_src = self['xtal_input'] ? xtal_input.href : document.currentScript.src;
    const base = cs_src.split('/').slice(0, -1).join('/');
    fetch(base + '/xtal-material.css', { credentials: 'include' }).then(resp => {
        resp.text().then(txt => {
            initXtalInput(txt);
        });
    });
    function initXtalInput(css) {
        const template = document.createElement('template');
        template.innerHTML = `
<style>
     :host {
        display: block;
    }
    ${css}
</style>
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
         *  Web component wrapper around billboard.js charting library
         *
         * @customElement
         * @polymer
         * @demo demo/index.html
         */
        class XtalInput extends HTMLElement {
            static get is() { return 'xtal-input'; }
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.addTemplate(this.getType());
            }
            getType() {
                return 'input';
            }
            get value() {
                return this._inputElement.value;
            }
            set value(val) {
                this._inputElement.value = val;
            }
            addTemplate(type) {
                const clonedNode = template.content.cloneNode(true);
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
                    });
                    this.dispatchEvent(newEvent);
                });
            }
            _upgradeProperties(props) {
                props.forEach(prop => {
                    if (this.hasOwnProperty(prop)) {
                        let value = this[prop];
                        delete this[prop];
                        this[prop] = value;
                    }
                });
            }
        }
        customElements.define(XtalInput.is, XtalInput);
        class XtalEmailInput extends XtalInput {
            static get is() { return 'xtal-input-email'; }
            getType() {
                return 'email';
            }
        }
        customElements.define(XtalEmailInput.is, XtalEmailInput);
    }
})();
//# sourceMappingURL=xtal-input.js.map