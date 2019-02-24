
    (function () {
    function define(custEl: any){
    let tagName = custEl.is;
    if(customElements.get(tagName)){
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';

interface IXtallatXI extends HTMLElement {
    /**
     * Any component that emits events should not do so if it is disabled.
     * Note that this is not enforced, but the disabled property is made available.
     * Users of this mix-in should ensure not to call "de" if this property is set to true.
    */
    disabled: boolean;
    /**
     * Set attribute value.
     * @param name 
     * @param val 
     * @param trueVal String to set attribute if true.
     */
    attr(name: string, val: string | boolean, trueVal?: string): void;
    /**
     * Dispatch Custom Event
     * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
     * @param detail Information to be passed with the event
     * @param asIs If true, don't append event name with '-changed'
     */
    de(name: string, detail: any, asIs?: boolean): CustomEvent;
    /**
     * Needed for asynchronous loading
     * @param props Array of property names to "upgrade", without losing value set while element was Unknown
     */
    _upgradeProperties(props: string[]): void;
    attributeChangedCallback(name: string, oldVal: string, newVal: string): void;
    connectedCallback?(): void;
    // static observedAttributes: string[]; 
}
type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX<TBase extends Constructor<HTMLElement>>(superClass: TBase) {
    return class extends superClass implements IXtallatXI {
        static get observedAttributes() {
            return [disabled];
        }

        _disabled!: boolean;
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name 
         * @param val 
         * @param trueVal String to set attribute if true.
         */
        attr(name: string, val: string | boolean | null, trueVal?: string) {
            const v = val ? 'set' : 'remove';  //verb
            (<any>this)[v + 'Attribute'](name, trueVal || val);
        }
        _evCount: { [key: string]: number } = {};
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n 
         */
        to$(n: number) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name: string) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            } else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name: string, oldVal: string, newVal: string) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }

        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name: string, detail: any, asIs: boolean = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }

        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props: string[]) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = (<any>this)[prop];
                    delete (<any>this)[prop];
                    (<any>this)[prop] = value;
                }
            })

        }
    }
}

abstract class XtalElement extends XtallatX(HTMLElement){
    _initialized!: boolean;

    get noShadow(){
        return false;
    }

    get renderOptions() : RenderOptions{
        return {}
    }

    abstract get mainTemplate(): HTMLTemplateElement;

    abstract get ready(): boolean;

    abstract get renderContext(): RenderContext;

    abstract get eventContext(): EventContext;


    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }


    _connected!: boolean;
    connectedCallback(){
        this._upgradeProperties([disabled])
        this._connected = true;
        this.onPropsChange();
    }

    get root() : HTMLElement | ShadowRoot{
        if(this.noShadow) return this;
        if(this.shadowRoot == null){
            this.attachShadow({mode: 'open'});
        }
        return this.shadowRoot!;
    }

    onPropsChange() : boolean{
        if(this._disabled || !this._connected || !this.ready) return false;
        const rc = this.renderContext;  
        const esc = this.eventContext;
        if(this.mainTemplate !== undefined){
            if(esc && esc.eventManager !== undefined){
                if(!this._initialized){
                    esc.eventManager(this.root, esc);
                }
                
            }
            if(rc && rc.init !== undefined){
                if(this._initialized && rc.update !== undefined){
                    rc.update!(rc, this.root);
                }else if(!this._initialized){
                    rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                    //rc.update = this.update;
                }
                
            }else if(!this._initialized){
                this.root.appendChild(this.mainTemplate.content.cloneNode(true));
            }
            this._initialized = true;
        }
        return true;
    }

}
function createTemplate(innerHTML: string): HTMLTemplateElement {
    const template = document.createElement("template") as HTMLTemplateElement;
    template.innerHTML = innerHTML;
    return template;
}

function newRenderContext(transformRules: TransformRules) : RenderContext{
    return {
        init: init,
        Transform: transformRules,
    } as RenderContext;
}
type EventHandler = (e?: Event, ctx?: EventContext) => void | EventContext | boolean | string | number;

type TestType = 'targetMatch' | 'propMatch';

interface Test{
    type?: TestType,
    expression?: string,
}

type RuleMapping = {[key: string] : Rule | EventHandler};

interface Rule extends Test{
    action?: (e?: Event, ctx?: EventContext) => void | Rule,
    route?: RuleMapping,
}


interface EventContext{
    eventManager?: (target?: EventTarget, ctx?: EventContext) => EventContext;
    eventRules?: RuleMapping;
}

function addEventListeners(target: EventTarget, ctx: EventContext) : EventContext{
    for(const key in ctx.eventRules){
        const rule = ctx.eventRules[key];
        target.addEventListener(key, e =>{
            processRule(rule, e, ctx);
        })
    }
    return ctx;
}
function newEventContext(rules: RuleMapping) : EventContext{
    return {
        eventManager: addEventListeners,
        eventRules: rules
    } as EventContext;
}


function processRule(ruleOrHandler: Rule | EventHandler,  e: Event, ctx: EventContext){
    const target = e.target as HTMLElement;
    if(typeof ruleOrHandler === 'function'){
        ruleOrHandler(e, ctx);
        return;//TODO, deal with return object?
    }
    if(ruleOrHandler.action !== undefined){
        ruleOrHandler.action(e, ctx);
    }
    if(ruleOrHandler.route !== undefined){
        for(const matchRuleKey in ruleOrHandler.route){
            const matchRule = ruleOrHandler.route[matchRuleKey];
            if(typeof matchRule === 'function'){
                matchRule(e, ctx);
                continue;
            }
            if(!matchRule.type) matchRule.type = 'targetMatch';
            switch(matchRule.type){
                case 'targetMatch':
                    if(target.matches && target.matches(matchRuleKey)){
                        processRule(matchRule, e, ctx);
                    }
                    break;
                case 'propMatch':
                    const propTokens = matchRule.expression!.split('.');
                    let val = e as any;
                    propTokens.forEach(token =>{
                        if(val) val = val[token];
                    })
                    if(val && val === matchRuleKey){
                        processRule(matchRule, e, ctx);
                    }
                    break; 
            }
        }
    }
}
type TransformFn = (arg: TransformArg) => TransformRules | NextStep | string | void;
type TransformValueOptions =  TransformRules | TransformFn | string;
type TransformRules = { [key: string]: TransformValueOptions};
interface TransformArg {
    target: Element,
    ctx: RenderContext,
    idx: number,
    level: number,
}

interface NextStep {
    Transform?: TransformRules,
    NextMatch?: string,
    Select?: TransformRules | null,
    MergeTransforms?: boolean,
    SkipSibs?: boolean,
}


interface DecorateArgs{
    props: {[key: string]: any} | undefined,
    methods: {[key: string] : Function} | undefined,
    on: {[key: string] : (e: Event) => void} | undefined,
    class: string | string[] | undefined,
    attribs: {[key: string] : string | boolean}
}

interface RenderContext {
    init?: (template: HTMLElement, ctx: RenderContext, target: HTMLElement | DocumentFragment, options?: RenderOptions) => RenderContext,
    repeatInit?: (template: HTMLTemplateElement, ctx: RenderContext, count: number, target: Element, targetTransform?: TransformValueOptions) => TransformValueOptions;
    repeatUpdate?: (template: HTMLTemplateElement, ctx: RenderContext, count: number, target: HTMLElement, targetTransform?: TransformValueOptions) => TransformValueOptions;
    interpolate?: (target: any, prop: string, obj: any, isAttr: boolean) => void;
    decorate?<T extends HTMLElement>(target: T, vals: T | null, decor?: DecorateArgs) : void;
    leaf?: Element | DocumentFragment,
    Transform?: TransformRules,
    update?: (ctx: RenderContext, target: HTMLElement | DocumentFragment) => RenderContext;
    refs?: {[key: string] : any},
    viewModel?: any,
}

interface RenderOptions{
    prepend?: boolean | undefined;
    initializedCallback?: (ctx: RenderContext, target: HTMLElement | DocumentFragment, options?: RenderOptions) => RenderContext | void,
    updatedCallback?: (ctx: RenderContext, target: HTMLElement | DocumentFragment, options?: RenderOptions) => RenderContext | void,
}

function init(
  template: HTMLElement,
  ctx: RenderContext,
  target: HTMLElement | DocumentFragment,
  options?: RenderOptions
): RenderContext {
  const isTemplate = template.localName === "template";
  const clonedTemplate =
      isTemplate
      ? ((template as HTMLTemplateElement).content.cloneNode(
          true
        ) as DocumentFragment)
      : template;
  //ctx.template = clonedTemplate;
  if (ctx.Transform) {
    const firstChild = clonedTemplate.firstElementChild;
    if (firstChild !== null) {
      ctx.leaf = firstChild;
      process(ctx, 0, 0, options);
    }
  }
  if(isTemplate){
    let verb = "appendChild";
    if (options) {
      if (options.prepend) verb = "prepend";
      const callback = options.initializedCallback;
      if (callback !== undefined) callback(ctx, target, options);
    }
    (<any>target)[verb](clonedTemplate);
  }

  return ctx;
}

function process(
  context: RenderContext,
  idx: number,
  level: number,
  options?: RenderOptions
) {
  const target = context.leaf! as HTMLElement;
  if (target.matches === undefined) return;
  const transform = context.Transform;

  let nextTransform: TransformRules = {};
  let nextSelector = "";
  let firstSelector = true;
  let matchNextSib: boolean = true;
  let inherit = false;
  let nextMatch = [];
  for (const selector in transform) {
    if (target.matches(selector)) {
      const transformTemplateVal = transform[selector];
      let resp2 : string | void | TransformRules | NextStep | TransformFn = transformTemplateVal;
      if(typeof resp2 === 'function'){
        resp2 = resp2({target: target, ctx: context, idx: idx, level: level});
      }
      switch (typeof resp2) {
        case "string":
          target.textContent = resp2;
          break;
        case "object":
          let isTR = true;
          const keys = Object.keys(resp2);
          if (keys.length > 0) {
            const firstCharOfFirstProp = keys[0][0];
            isTR = "SNTM".indexOf(firstCharOfFirstProp) === -1;
          }

          if (isTR) {
            const respAsTransformRules = resp2 as TransformRules;
            nextSelector = "*";
            Object.assign(nextTransform, respAsTransformRules);
          } else {
            const respAsNextStep = resp2 as NextStep;
            inherit = inherit || !!resp2.MergeTransforms;
            if (respAsNextStep.Select !== undefined) {
              nextSelector =
                (firstSelector ? "" : ",") + respAsNextStep.Select;
              firstSelector = false;
            }

            const newTransform = respAsNextStep.Transform;
            if (newTransform === undefined) {
              Object.assign(nextTransform, context.Transform);
            } else {
              Object.assign(nextTransform, newTransform);
            }
            if (respAsNextStep.SkipSibs) matchNextSib = false;
            if (!matchNextSib && resp2.NextMatch) {
              nextMatch.push(resp2.NextMatch);
            }
          }

          break;
      }

    }
  }
  if (matchNextSib) {
    let transform = context.Transform;
    const nextSib = target.nextElementSibling;
    if (nextSib !== null) {
      context.leaf = nextSib;
      process(context, idx + 1, level, options);
    }
    context.Transform = transform;
    if (nextMatch.length > 0) {
      const match = nextMatch.join(",");
      let nextSib = target.nextElementSibling;
      while (nextSib !== null) {
        if (nextSib.matches(match)) {
          context.leaf = nextSib;
          process(context, idx + 1, level, options);
          break;
        }
        nextSib = nextSib.nextElementSibling;
      }
    }
  }

  if (nextSelector.length > 0) {
    let transform = context.Transform;

    const nextChild = target.querySelector(nextSelector);
    if (inherit) {
      Object.assign(nextTransform, context.Transform);
    }
    if (nextChild !== null) {
      context.leaf = nextChild;
      context.Transform = nextTransform;
      process(context, 0, level + 1, options);
      context.Transform = transform;
    }
  }
}


interface IXtalInputProperties {
  value: string;
}

interface IXtalInputOptions {
  data: any[];
  textFld: string;
  keyFld: string;
}

const baseTemplateGenerator = (type: string) => /* html */ `
<div class="form-element form-input">
  <input id="input_field" list="options" type="${type}" class="form-element-field" placeholder=" " required />
  <datalist id="options"></datalist>
  <div class="form-element-bar"></div>
  <label class="form-element-label" for="input_field">
    <slot name="label"></slot>
  </label>
  <small class="form-element-hint">
  </small>
</div>
<style>
  :host {
    display: block;
  }

  .form-element {
    position: relative;
    margin-top: 2.25rem;
    margin-bottom: 2.25rem;
  }

  .form-element-hint {
    font-weight: 400;
    font-size: 0.6875rem;
    color: #a6a6a6;
    display: block;
  }

  .form-element-bar {
    position: relative;
    height: 1px;
    background: #999;
    display: block;
  }

  .form-element-bar::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #337ab7;
    height: 2px;
    display: block;
    transform: rotateY(90deg);
    transition: transform 0.28s ease;
    will-change: transform;
  }

  .form-element-label {
    position: absolute;
    top: 0.75rem;
    line-height: 1.5rem;
    pointer-events: none;
    padding-left: 0.125rem;
    z-index: 1;
    font-size: 1rem;
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    color: #a6a6a6;
    transform: translateY(-50%);
    transform-origin: left center;
    transition: transform 0.28s ease, color 0.28s linear, opacity 0.28s linear;
    will-change: transform, color, opacity;
  }

  .form-element-field {
    outline: none;
    height: 1.5rem;
    display: block;
    background: none;
    padding: 0.125rem 0.125rem 0.0625rem;
    font-size: 1rem;
    border: 0 solid transparent;
    line-height: 1.5;
    width: 100%;
    color: #333;
    box-shadow: none;
    opacity: 0.001;
    transition: opacity 0.28s ease;
    will-change: opacity;
  }

  .form-element-field:-ms-input-placeholder {
    color: #a6a6a6;
    transform: scale(0.9);
    transform-origin: left top;
  }

  .form-element-field::placeholder {
    color: #a6a6a6;
    transform: scale(0.9);
    transform-origin: left top;
  }

  .form-element-field:focus~.form-element-bar::after {
    transform: rotateY(0deg);
  }

  .form-element-field:focus~.form-element-label {
    color: #337ab7;
  }

  .form-element-field.-hasvalue,
  .form-element-field:focus {
    opacity: 1;
  }

  .form-element-field.-hasvalue~.form-element-label,
  .form-element-field:focus~.form-element-label {
    transform: translateY(-100%) translateY(-0.5em) translateY(-2px) scale(0.9);
    cursor: pointer;
    pointer-events: auto;
  }

  .form-has-error .form-element-label.form-element-label,
  .form-has-error .form-element-hint {
    color: #d9534f;
  }

  .form-has-error .form-element-bar,
  .form-has-error .form-element-bar::after {
    background: #d9534f;
  }

  .form-is-success .form-element-label.form-element-label,
  .form-is-success .form-element-hint {
    color: #259337;
  }

  .form-is-success .form-element-bar::after {
    background: #259337;
  }

  input.form-element-field:not(:placeholder-shown),
  textarea.form-element-field:not(:placeholder-shown) {
    opacity: 1;
  }

  input.form-element-field:not(:placeholder-shown)~.form-element-label,
  textarea.form-element-field:not(:placeholder-shown)~.form-element-label {
    transform: translateY(-100%) translateY(-0.5em) translateY(-2px) scale(0.9);
    cursor: pointer;
    pointer-events: auto;
  }

  textarea.form-element-field {
    height: auto;
    min-height: 3rem;
  }

  select.form-element-field {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  .form-select-placeholder {
    color: #a6a6a6;
    display: none;
  }

  .form-select .form-element-bar::before {
    content: "";
    position: absolute;
    height: 0.5em;
    width: 0.5em;
    border-bottom: 1px solid #999;
    border-right: 1px solid #999;
    display: block;
    right: 0.5em;
    bottom: 0;
    transition: transform 0.28s ease;
    transform: translateY(-100%) rotateX(0deg) rotate(45deg);
    will-change: transform;
  }

  .form-select select:focus~.form-element-bar::before {
    transform: translateY(-50%) rotateX(180deg) rotate(45deg);
  }

  .form-element-field[type="number"] {
    -moz-appearance: textfield;
  }

  .form-element-field[type="number"]::-webkit-outer-spin-button,
  .form-element-field[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
`;

const textInputTemplate = createTemplate(baseTemplateGenerator("text"));

/**
 * `xtal-text-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalTextInputMD extends XtalElement {
  static get is() {
    return "xtal-text-input-md";
  }

  _inputElement: HTMLInputElement | HTMLTextAreaElement;
  get inputElement() {
    if (this._inputElement === undefined) {
      this._inputElement = this.root.querySelector("input");
    }
    return this._inputElement;
  }
  get mainTemplate() {
    return textInputTemplate;
  }
  _renderContext = {};
  get renderContext() {
    return this._renderContext;
  }

  _eventContext = newEventContext({
    change: e => {
      const element = this.inputElement;
      if (element && element.matches(".form-element-field")) {
        element.classList[element.value ? "add" : "remove"]("-hasvalue");
      }
    },
    input: e => {
      this.emitEvent();
    }
  });
  get eventContext() {
    return this._eventContext;
  }

  get ready() {
    return true;
  }
  _value;
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.onPropsChange();
  }
  selection: any;
  _options: IXtalInputOptions;
  get options() {
    return this._options;
  }
  set options(nv) {
    this._options = nv;
    this.onPropsChange();
  }
  _previousOptions: IXtalInputOptions;
  _initializedAttrs = false;
  onPropsChange() {
    if (!super.onPropsChange()) return false;
    if (this._options && this._options !== this._previousOptions) {
      this._previousOptions = this._options;
      const nv = this._options;
      const dl = this.root.querySelector("#options");
      dl.innerHTML = "";
      const textFld = nv.textFld;
      nv.data.forEach(item => {
        const optionTarget = document.createElement("option");
        optionTarget.setAttribute("value", item[textFld]);
        dl.appendChild(optionTarget);
      });
    }
    if (!this._initializedAttrs) {
      for (let i = 0, ii = this.attributes.length; i < ii; i++) {
        const attrib = this.attributes[i];
        //const inp = clonedNode.querySelector('input');
        if (attrib.name === "type") continue;
        this.inputElement.setAttribute(attrib.name, attrib.value);
      }
      this._initializedAttrs = true;
    }

    if (this._value !== undefined) this.inputElement.value = this._value;
    this.addMutationObserver();
    return true;
  }

  emitEvent() {
    const val = this.inputElement.value;
    this.value = val;
    this.de("value", {
      value: val
    });
    if (this._options) {
      const textFld = this._options.textFld;
      const item = this._options.data.find(item => item[textFld] === val);
      if (item !== undefined) {
        this.selection = item;
        this.de("selection", {
          value: item
        });
      }
    }
  }
  connectedCallback() {
    this._upgradeProperties(["value", "options"]);
    super.connectedCallback();
  }

  _observer: MutationObserver;
  addMutationObserver() {
    const config: MutationObserverInit = { attributes: true };
    this._observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      mutationsList.forEach(mutation => {
        const attrName = mutation.attributeName;
        const attrVal = this.getAttribute(attrName);
        switch (attrName) {
          case "options":
            this.options = JSON.parse(attrVal);
            break;
          default:
            this.inputElement.setAttribute(attrName, attrVal);
        }
        attrName;
      });
    });
    this._observer.observe((<any>this) as Node, config);
  }
  disconnectedCallback() {
    this._observer.disconnect();
  }
}
define(XtalTextInputMD);

    })();  
        