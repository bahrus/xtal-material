var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function () {
    function define(custEl) {
        var tagName = custEl.is;
        if (customElements.get(tagName)) {
            console.warn('Already registered ' + tagName);
            return;
        }
        customElements.define(tagName, custEl);
    }
    var disabled = 'disabled';
    /**
     * Base class for many xtal- components
     * @param superClass
     */
    function XtallatX(superClass) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._evCount = {};
                return _this;
            }
            Object.defineProperty(class_1, "observedAttributes", {
                get: function () {
                    return [disabled];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(class_1.prototype, "disabled", {
                /**
                 * Any component that emits events should not do so if it is disabled.
                 * Note that this is not enforced, but the disabled property is made available.
                 * Users of this mix-in should ensure not to call "de" if this property is set to true.
                 */
                get: function () {
                    return this._disabled;
                },
                set: function (val) {
                    this.attr(disabled, val, '');
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Set attribute value.
             * @param name
             * @param val
             * @param trueVal String to set attribute if true.
             */
            class_1.prototype.attr = function (name, val, trueVal) {
                var v = val ? 'set' : 'remove'; //verb
                this[v + 'Attribute'](name, trueVal || val);
            };
            /**
             * Turn number into string with even and odd values easy to query via css.
             * @param n
             */
            class_1.prototype.to$ = function (n) {
                var mod = n % 2;
                return (n - mod) / 2 + '-' + mod;
            };
            /**
             * Increment event count
             * @param name
             */
            class_1.prototype.incAttr = function (name) {
                var ec = this._evCount;
                if (name in ec) {
                    ec[name]++;
                }
                else {
                    ec[name] = 0;
                }
                this.attr('data-' + name, this.to$(ec[name]));
            };
            class_1.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
                switch (name) {
                    case disabled:
                        this._disabled = newVal !== null;
                        break;
                }
            };
            /**
             * Dispatch Custom Event
             * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
             * @param detail Information to be passed with the event
             * @param asIs If true, don't append event name with '-changed'
             */
            class_1.prototype.de = function (name, detail, asIs) {
                if (asIs === void 0) { asIs = false; }
                var eventName = name + (asIs ? '' : '-changed');
                var newEvent = new CustomEvent(eventName, {
                    detail: detail,
                    bubbles: true,
                    composed: false,
                });
                this.dispatchEvent(newEvent);
                this.incAttr(eventName);
                return newEvent;
            };
            /**
             * Needed for asynchronous loading
             * @param props Array of property names to "upgrade", without losing value set while element was Unknown
             */
            class_1.prototype._upgradeProperties = function (props) {
                var _this = this;
                props.forEach(function (prop) {
                    if (_this.hasOwnProperty(prop)) {
                        var value = _this[prop];
                        delete _this[prop];
                        _this[prop] = value;
                    }
                });
            };
            return class_1;
        }(superClass));
    }
    var XtalElement = /** @class */ (function (_super) {
        __extends(XtalElement, _super);
        function XtalElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(XtalElement.prototype, "noShadow", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalElement.prototype, "renderOptions", {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        });
        XtalElement.prototype.attributeChangedCallback = function (n, ov, nv) {
            _super.prototype.attributeChangedCallback.call(this, n, ov, nv);
            this.onPropsChange();
        };
        XtalElement.prototype.connectedCallback = function () {
            this._upgradeProperties([disabled]);
            this._connected = true;
            this.onPropsChange();
        };
        Object.defineProperty(XtalElement.prototype, "root", {
            get: function () {
                if (this.noShadow)
                    return this;
                if (this.shadowRoot == null) {
                    this.attachShadow({ mode: 'open' });
                }
                return this.shadowRoot;
            },
            enumerable: true,
            configurable: true
        });
        XtalElement.prototype.onPropsChange = function () {
            if (this._disabled || !this._connected || !this.ready)
                return false;
            var rc = this.renderContext;
            var esc = this.eventContext;
            if (this.mainTemplate !== undefined) {
                if (esc && esc.eventManager !== undefined) {
                    if (!this._initialized) {
                        esc.eventManager(this.root, esc);
                    }
                }
                if (rc && rc.init !== undefined) {
                    if (this._initialized && rc.update !== undefined) {
                        rc.update(rc, this.root);
                    }
                    else if (!this._initialized) {
                        rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                        //rc.update = this.update;
                    }
                }
                else if (!this._initialized) {
                    this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                }
                this._initialized = true;
            }
            return true;
        };
        return XtalElement;
    }(XtallatX(HTMLElement)));
    function createTemplate(innerHTML) {
        var template = document.createElement("template");
        template.innerHTML = innerHTML;
        return template;
    }
    function newRenderContext(transformRules) {
        return {
            init: init,
            Transform: transformRules,
        };
    }
    function addEventListeners(target, ctx) {
        var _loop_1 = function (key) {
            var rule = ctx.eventRules[key];
            target.addEventListener(key, function (e) {
                processRule(rule, e, ctx);
            });
        };
        for (var key in ctx.eventRules) {
            _loop_1(key);
        }
        return ctx;
    }
    function newEventContext(rules) {
        return {
            eventManager: addEventListeners,
            eventRules: rules
        };
    }
    function processRule(ruleOrHandler, e, ctx) {
        var target = e.target;
        if (typeof ruleOrHandler === 'function') {
            ruleOrHandler(e, ctx);
            return; //TODO, deal with return object?
        }
        if (ruleOrHandler.action !== undefined) {
            ruleOrHandler.action(e, ctx);
        }
        if (ruleOrHandler.route !== undefined) {
            var _loop_2 = function (matchRuleKey) {
                var matchRule = ruleOrHandler.route[matchRuleKey];
                if (typeof matchRule === 'function') {
                    matchRule(e, ctx);
                    return "continue";
                }
                if (!matchRule.type)
                    matchRule.type = 'targetMatch';
                switch (matchRule.type) {
                    case 'targetMatch':
                        if (target.matches && target.matches(matchRuleKey)) {
                            processRule(matchRule, e, ctx);
                        }
                        break;
                    case 'propMatch':
                        var propTokens = matchRule.expression.split('.');
                        var val_1 = e;
                        propTokens.forEach(function (token) {
                            if (val_1)
                                val_1 = val_1[token];
                        });
                        if (val_1 && val_1 === matchRuleKey) {
                            processRule(matchRule, e, ctx);
                        }
                        break;
                }
            };
            for (var matchRuleKey in ruleOrHandler.route) {
                _loop_2(matchRuleKey);
            }
        }
    }
    function init(template, ctx, target, options) {
        var isTemplate = template.localName === "template";
        var clonedTemplate = isTemplate
            ? template.content.cloneNode(true)
            : template;
        //ctx.template = clonedTemplate;
        if (ctx.Transform) {
            var firstChild = clonedTemplate.firstElementChild;
            if (firstChild !== null) {
                ctx.leaf = firstChild;
                process(ctx, 0, 0, options);
            }
        }
        if (isTemplate) {
            var verb = "appendChild";
            if (options) {
                if (options.prepend)
                    verb = "prepend";
                var callback = options.initializedCallback;
                if (callback !== undefined)
                    callback(ctx, target, options);
            }
            target[verb](clonedTemplate);
        }
        return ctx;
    }
    function process(context, idx, level, options) {
        var target = context.leaf;
        if (target.matches === undefined)
            return;
        var transform = context.Transform;
        var nextTransform = {};
        var nextSelector = "";
        var firstSelector = true;
        var matchNextSib = true;
        var inherit = false;
        var nextMatch = [];
        for (var selector in transform) {
            if (target.matches(selector)) {
                var transformTemplateVal = transform[selector];
                var resp2 = transformTemplateVal;
                if (typeof resp2 === 'function') {
                    resp2 = resp2({ target: target, ctx: context, idx: idx, level: level });
                }
                switch (typeof resp2) {
                    case "string":
                        target.textContent = resp2;
                        break;
                    case "object":
                        var isTR = true;
                        var keys = Object.keys(resp2);
                        if (keys.length > 0) {
                            var firstCharOfFirstProp = keys[0][0];
                            isTR = "SNTM".indexOf(firstCharOfFirstProp) === -1;
                        }
                        if (isTR) {
                            var respAsTransformRules = resp2;
                            nextSelector = "*";
                            Object.assign(nextTransform, respAsTransformRules);
                        }
                        else {
                            var respAsNextStep = resp2;
                            inherit = inherit || !!resp2.MergeTransforms;
                            if (respAsNextStep.Select !== undefined) {
                                nextSelector =
                                    (firstSelector ? "" : ",") + respAsNextStep.Select;
                                firstSelector = false;
                            }
                            var newTransform = respAsNextStep.Transform;
                            if (newTransform === undefined) {
                                Object.assign(nextTransform, context.Transform);
                            }
                            else {
                                Object.assign(nextTransform, newTransform);
                            }
                            if (respAsNextStep.SkipSibs)
                                matchNextSib = false;
                            if (!matchNextSib && resp2.NextMatch) {
                                nextMatch.push(resp2.NextMatch);
                            }
                        }
                        break;
                }
            }
        }
        if (matchNextSib) {
            var transform_1 = context.Transform;
            var nextSib = target.nextElementSibling;
            if (nextSib !== null) {
                context.leaf = nextSib;
                process(context, idx + 1, level, options);
            }
            context.Transform = transform_1;
            if (nextMatch.length > 0) {
                var match = nextMatch.join(",");
                var nextSib_1 = target.nextElementSibling;
                while (nextSib_1 !== null) {
                    if (nextSib_1.matches(match)) {
                        context.leaf = nextSib_1;
                        process(context, idx + 1, level, options);
                        break;
                    }
                    nextSib_1 = nextSib_1.nextElementSibling;
                }
            }
        }
        if (nextSelector.length > 0) {
            var transform_2 = context.Transform;
            var nextChild = target.querySelector(nextSelector);
            if (inherit) {
                Object.assign(nextTransform, context.Transform);
            }
            if (nextChild !== null) {
                context.leaf = nextChild;
                context.Transform = nextTransform;
                process(context, 0, level + 1, options);
                context.Transform = transform_2;
            }
        }
    }
    var baseTemplateGenerator = function (type) { /* html */ return "\n<div class=\"form-element form-input\">\n  <input id=\"input_field\" list=\"options\" type=\"" + type + "\" class=\"form-element-field\" placeholder=\" \" required />\n  <datalist id=\"options\"></datalist>\n  <div class=\"form-element-bar\"></div>\n  <label class=\"form-element-label\" for=\"input_field\">\n    <slot name=\"label\"></slot>\n  </label>\n  <small class=\"form-element-hint\">\n  </small>\n</div>\n<style>\n  :host {\n    display: block;\n  }\n\n  .form-element {\n    position: relative;\n    margin-top: 2.25rem;\n    margin-bottom: 2.25rem;\n  }\n\n  .form-element-hint {\n    font-weight: 400;\n    font-size: 0.6875rem;\n    color: #a6a6a6;\n    display: block;\n  }\n\n  .form-element-bar {\n    position: relative;\n    height: 1px;\n    background: #999;\n    display: block;\n  }\n\n  .form-element-bar::after {\n    content: \"\";\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    background: #337ab7;\n    height: 2px;\n    display: block;\n    transform: rotateY(90deg);\n    transition: transform 0.28s ease;\n    will-change: transform;\n  }\n\n  .form-element-label {\n    position: absolute;\n    top: 0.75rem;\n    line-height: 1.5rem;\n    pointer-events: none;\n    padding-left: 0.125rem;\n    z-index: 1;\n    font-size: 1rem;\n    font-weight: normal;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    margin: 0;\n    color: #a6a6a6;\n    transform: translateY(-50%);\n    transform-origin: left center;\n    transition: transform 0.28s ease, color 0.28s linear, opacity 0.28s linear;\n    will-change: transform, color, opacity;\n  }\n\n  .form-element-field {\n    outline: none;\n    height: 1.5rem;\n    display: block;\n    background: none;\n    padding: 0.125rem 0.125rem 0.0625rem;\n    font-size: 1rem;\n    border: 0 solid transparent;\n    line-height: 1.5;\n    width: 100%;\n    color: #333;\n    box-shadow: none;\n    opacity: 0.001;\n    transition: opacity 0.28s ease;\n    will-change: opacity;\n  }\n\n  .form-element-field:-ms-input-placeholder {\n    color: #a6a6a6;\n    transform: scale(0.9);\n    transform-origin: left top;\n  }\n\n  .form-element-field::placeholder {\n    color: #a6a6a6;\n    transform: scale(0.9);\n    transform-origin: left top;\n  }\n\n  .form-element-field:focus~.form-element-bar::after {\n    transform: rotateY(0deg);\n  }\n\n  .form-element-field:focus~.form-element-label {\n    color: #337ab7;\n  }\n\n  .form-element-field.-hasvalue,\n  .form-element-field:focus {\n    opacity: 1;\n  }\n\n  .form-element-field.-hasvalue~.form-element-label,\n  .form-element-field:focus~.form-element-label {\n    transform: translateY(-100%) translateY(-0.5em) translateY(-2px) scale(0.9);\n    cursor: pointer;\n    pointer-events: auto;\n  }\n\n  .form-has-error .form-element-label.form-element-label,\n  .form-has-error .form-element-hint {\n    color: #d9534f;\n  }\n\n  .form-has-error .form-element-bar,\n  .form-has-error .form-element-bar::after {\n    background: #d9534f;\n  }\n\n  .form-is-success .form-element-label.form-element-label,\n  .form-is-success .form-element-hint {\n    color: #259337;\n  }\n\n  .form-is-success .form-element-bar::after {\n    background: #259337;\n  }\n\n  input.form-element-field:not(:placeholder-shown),\n  textarea.form-element-field:not(:placeholder-shown) {\n    opacity: 1;\n  }\n\n  input.form-element-field:not(:placeholder-shown)~.form-element-label,\n  textarea.form-element-field:not(:placeholder-shown)~.form-element-label {\n    transform: translateY(-100%) translateY(-0.5em) translateY(-2px) scale(0.9);\n    cursor: pointer;\n    pointer-events: auto;\n  }\n\n  textarea.form-element-field {\n    height: auto;\n    min-height: 3rem;\n  }\n\n  select.form-element-field {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    cursor: pointer;\n  }\n\n  .form-select-placeholder {\n    color: #a6a6a6;\n    display: none;\n  }\n\n  .form-select .form-element-bar::before {\n    content: \"\";\n    position: absolute;\n    height: 0.5em;\n    width: 0.5em;\n    border-bottom: 1px solid #999;\n    border-right: 1px solid #999;\n    display: block;\n    right: 0.5em;\n    bottom: 0;\n    transition: transform 0.28s ease;\n    transform: translateY(-100%) rotateX(0deg) rotate(45deg);\n    will-change: transform;\n  }\n\n  .form-select select:focus~.form-element-bar::before {\n    transform: translateY(-50%) rotateX(180deg) rotate(45deg);\n  }\n\n  .form-element-field[type=\"number\"] {\n    -moz-appearance: textfield;\n  }\n\n  .form-element-field[type=\"number\"]::-webkit-outer-spin-button,\n  .form-element-field[type=\"number\"]::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n</style>\n"; };
    var textInputTemplate = createTemplate(baseTemplateGenerator("text"));
    /**
     * `xtal-text-input-md`
     *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    var XtalTextInputMD = /** @class */ (function (_super) {
        __extends(XtalTextInputMD, _super);
        function XtalTextInputMD() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._renderContext = {};
            _this._eventContext = newEventContext({
                change: function (e) {
                    var element = _this.inputElement;
                    if (element && element.matches(".form-element-field")) {
                        element.classList[element.value ? "add" : "remove"]("-hasvalue");
                    }
                },
                input: function (e) {
                    _this.emitEvent();
                }
            });
            _this._initializedAttrs = false;
            return _this;
        }
        Object.defineProperty(XtalTextInputMD, "is", {
            get: function () {
                return "xtal-text-input-md";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "inputElement", {
            get: function () {
                if (this._inputElement === undefined) {
                    this._inputElement = this.root.querySelector("input");
                }
                return this._inputElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "mainTemplate", {
            get: function () {
                return textInputTemplate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "renderContext", {
            get: function () {
                return this._renderContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "eventContext", {
            get: function () {
                return this._eventContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "ready", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                this._value = val;
                this.onPropsChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XtalTextInputMD.prototype, "options", {
            get: function () {
                return this._options;
            },
            set: function (nv) {
                this._options = nv;
                this.onPropsChange();
            },
            enumerable: true,
            configurable: true
        });
        XtalTextInputMD.prototype.onPropsChange = function () {
            if (!_super.prototype.onPropsChange.call(this))
                return false;
            if (this._options && this._options !== this._previousOptions) {
                this._previousOptions = this._options;
                var nv = this._options;
                var dl_1 = this.root.querySelector("#options");
                dl_1.innerHTML = "";
                var textFld_1 = nv.textFld;
                nv.data.forEach(function (item) {
                    var optionTarget = document.createElement("option");
                    optionTarget.setAttribute("value", item[textFld_1]);
                    dl_1.appendChild(optionTarget);
                });
            }
            if (!this._initializedAttrs) {
                for (var i = 0, ii = this.attributes.length; i < ii; i++) {
                    var attrib = this.attributes[i];
                    //const inp = clonedNode.querySelector('input');
                    if (attrib.name === "type")
                        continue;
                    this.inputElement.setAttribute(attrib.name, attrib.value);
                }
                this._initializedAttrs = true;
            }
            if (this._value !== undefined)
                this.inputElement.value = this._value;
            this.addMutationObserver();
            return true;
        };
        XtalTextInputMD.prototype.emitEvent = function () {
            var val = this.inputElement.value;
            this.value = val;
            this.de("value", {
                value: val
            });
            if (this._options) {
                var textFld_2 = this._options.textFld;
                var item = this._options.data.find(function (item) { return item[textFld_2] === val; });
                if (item !== undefined) {
                    this.selection = item;
                    this.de("selection", {
                        value: item
                    });
                }
            }
        };
        XtalTextInputMD.prototype.connectedCallback = function () {
            this._upgradeProperties(["value", "options"]);
            _super.prototype.connectedCallback.call(this);
        };
        XtalTextInputMD.prototype.addMutationObserver = function () {
            var _this = this;
            var config = { attributes: true };
            this._observer = new MutationObserver(function (mutationsList) {
                mutationsList.forEach(function (mutation) {
                    var attrName = mutation.attributeName;
                    var attrVal = _this.getAttribute(attrName);
                    switch (attrName) {
                        case "options":
                            _this.options = JSON.parse(attrVal);
                            break;
                        default:
                            _this.inputElement.setAttribute(attrName, attrVal);
                    }
                    attrName;
                });
            });
            this._observer.observe(this, config);
        };
        XtalTextInputMD.prototype.disconnectedCallback = function () {
            this._observer.disconnect();
        };
        return XtalTextInputMD;
    }(XtalElement));
    define(XtalTextInputMD);
})();
