declare var xtal_input: HTMLLinkElement;
(function () {
    const cs_src = self['xtal_input'] ? xtal_input.href : (document.currentScript as HTMLScriptElement).src;
    const base = cs_src.split('/').slice(0, -1).join('/');
    fetch(base + '/xtal-material.css', { credentials: 'include' }).then(resp => {
        resp.text().then(txt => {
            initXtalInput(txt);
        })
    });
    function initXtalInput(css: string) {
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
                // const slot = this.shadowRoot.querySelector('slot');
                // slot.addEventListener('slotchange', e => {
                //     this._slotted = true;
                //     this.onPropsChange();
                // });
            }
            getType() {
                return 'input';
            }

            addTemplate(type: string) {
                const clonedNode = template.content.cloneNode(true) as HTMLFrameElement;
                // const inp = clonedNode.querySelector('input');
                // inp.setAttribute('type', type);
                for (let i = 0, ii = this.attributes.length; i < ii; i++) {
                    const attrib = this.attributes[i];
                    const inp = clonedNode.querySelector('input');
                    inp.setAttribute(attrib.name, attrib.value);
                }
                this.shadowRoot.appendChild(clonedNode);
                
            }
        }
        customElements.define(XtalInput.is, XtalInput);
        class XtalEmailInput extends XtalInput {
            static get is() { return 'xtal-input-email'; }
            getType() {
                return 'email'
            }
        }
        customElements.define(XtalEmailInput.is, XtalEmailInput);
    }


})();