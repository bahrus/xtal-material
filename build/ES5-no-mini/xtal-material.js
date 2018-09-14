//@ts-check
(function () {
  function getBasePath(tagName) {
    var path;
    var link = self['xtal_material'];

    if (link) {
      path = link.href;
    } else {
      var cs = document.currentScript;

      if (cs) {
        path = cs.src;
      } else {}
    }

    return path.split('/').slice(0, -1).join('/');
  }

  function lispToSnakeCase(s) {
    return s.split('-').join('_');
  }

  var _cT = {}; //cachedTemplates

  var fip = {}; //fetch in progress

  function def(p) {
    if (p && p.tagName && p.cls) {
      if (customElements.get(p.tagName)) {
        console.warn(p.tagName + '!!');
      } else {
        customElements.define(p.tagName, p.cls);
      }
    }
  }

  function loadTemplate(t, p) {
    var src = t.dataset.src || t.getAttribute('href');

    if (src) {
      if (_cT[src]) {
        t.innerHTML = _cT[src];
        def(p);
      } else {
        if (fip[src]) {
          if (p) {
            setTimeout(function () {
              loadTemplate(t, p);
            }, 100);
          }

          return;
        }

        fip[src] = true;
        fetch(src, {
          credentials: 'same-origin'
        }).then(function (resp) {
          resp.text().then(function (txt) {
            fip[src] = false;
            if (p && p.preProcessor) txt = p.preProcessor.process(txt);

            if (!p || !p.noSnip) {
              var split = txt.split('<!---->');

              if (split.length > 1) {
                txt = split[1];
              }
            }

            _cT[src] = txt;
            t.innerHTML = txt;
            t.setAttribute('loaded', '');
            def(p);
          });
        });
      }
    } else {
      def(p);
    }
  }

  function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
  }
  /**
  * `templ-mount`
  * Dependency free web component that loads templates from data-src (optionally href) attribute
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  */


  var TemplMount =
  /*#__PURE__*/
  function (_HTMLElement) {
    babelHelpers.inherits(TemplMount, _HTMLElement);

    function TemplMount() {
      var _this;

      babelHelpers.classCallCheck(this, TemplMount);
      _this = babelHelpers.possibleConstructorReturn(this, (TemplMount.__proto__ || Object.getPrototypeOf(TemplMount)).call(this));

      if (!TemplMount._adgc) {
        TemplMount._adgc = true;

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this.mhft();

            _this.ltosd();
          });
        } else {
          _this.mhft();
        }
      }

      return _this;
    }

    babelHelpers.createClass(TemplMount, [{
      key: "getHost",

      /**
       * Gets host from parent
       */
      value: function getHost() {
        return this.parentNode;
      }
    }, {
      key: "copyAttrs",
      value: function copyAttrs(src, dest, attrs) {
        attrs.forEach(function (attr) {
          if (!src.hasAttribute(attr)) return;
          var attrVal = src.getAttribute(attr);
          if (attr === 'type') attrVal = attrVal.replace(':', '');
          dest.setAttribute(attr, attrVal);
        });
      }
    }, {
      key: "cT",
      value: function cT(clonedNode, tagName, copyAttrs) {
        var _this2 = this;

        qsa(tagName, clonedNode).forEach(function (node) {
          //node.setAttribute('clone-me', '');
          var clone = document.createElement(tagName);

          _this2.copyAttrs(node, clone, copyAttrs);

          clone.innerHTML = node.innerHTML;
          document.head.appendChild(clone);
        });
      }
    }, {
      key: "iT",
      value: function iT(template) {
        var ds = template.dataset;
        var ua = ds.ua;
        var noMatch = false;

        if (ua) {
          noMatch = navigator.userAgent.search(new RegExp(ua)) === -1;
        }

        if (ua && template.hasAttribute('data-exclude')) noMatch = !noMatch;
        if (ua && noMatch) return;

        if (!ds.dumped) {
          //This shouldn't be so hard, but Chrome (and other browsers) doesn't seem to consistently like just appending the cloned children of the template
          var clonedNode = template.content.cloneNode(true);
          this.cT(clonedNode, 'script', ['src', 'type', 'nomodule']);
          this.cT(clonedNode, 'template', ['id', 'data-src', 'href', 'data-activate', 'data-ua', 'data-exclude', 'data-methods']);
          this.cT(clonedNode, 'c-c', ['from', 'noshadow', 'copy']);
          ds.dumped = 'true';
        }

        loadTemplate(template, {
          noSnip: template.hasAttribute('nosnip')
        });
      }
      /**
       *
       * @param from
       */

    }, {
      key: "lt",
      value: function lt(from) {
        var _this3 = this;

        qsa('template[data-src],template[data-activate]', from).forEach(function (t) {
          _this3.iT(t);
        });
      }
    }, {
      key: "ltosd",
      value: function ltosd() {
        this.lt(document);
      }
    }, {
      key: "ltisd",
      value: function ltisd() {
        var host = this.getHost();
        if (!host) return;
        this.lt(host);
      }
    }, {
      key: "mhft",
      value: function mhft() {
        var _this4 = this;

        var config = {
          childList: true
        };
        this._observer = new MutationObserver(function (mL) {
          mL.forEach(function (mR) {
            mR.addedNodes.forEach(function (node) {
              if (node.tagName === 'TEMPLATE') _this4.iT(node);
            });
          });
        });

        this._observer.observe(document.head, config);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this5 = this;

        this.style.display = 'none';
        this.ltisd();
        this.ltosd();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this5.ltisd();
          });
        }
      }
    }], [{
      key: "is",
      get: function get() {
        return 'templ-mount';
      }
    }]);
    return TemplMount;
  }(HTMLElement);

  TemplMount._adgc = false; //already did global check

  customElements.define(TemplMount.is, TemplMount);
  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this6;

          babelHelpers.classCallCheck(this, _class);
          _this6 = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
          _this6._evCount = {};
          return _this6;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
              case disabled:
                this._disabled = newVal !== null;
                break;
            }
          }
          /**
           * Dispatch Custom Event
           * @param name Name of event to dispatch (with -changed if asIs is false)
           * @param detail Information to be passed with the event
           * @param asIs If true, don't append event name with '-changed'
           */

        }, {
          key: "de",
          value: function de(name, detail, asIs) {
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this7 = this;

            props.forEach(function (prop) {
              if (_this7.hasOwnProperty(prop)) {
                var value = _this7[prop];
                delete _this7[prop];
                _this7[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so ef it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in sure ensure it doesn't call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  function lispToSnakeCase(s) {
    return s.split('-').join('_');
  }

  function BraKetMixin(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass2) {
        babelHelpers.inherits(_class2, _superClass2);

        function _class2() {
          babelHelpers.classCallCheck(this, _class2);
          return babelHelpers.possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
        }

        babelHelpers.createClass(_class2, [{
          key: "looksLike",
          value: function looksLike() {}
        }, {
          key: "customizeClone",
          value: function customizeClone(clonedNode) {}
        }, {
          key: "initShadowRoot",
          value: function initShadowRoot() {}
        }, {
          key: "addTemplate",
          value: function addTemplate(noShadow) {
            if (!noShadow) {
              this.attachShadow({
                mode: 'open'
              });
            }

            if (!this.CE._template) {
              this.CE._template = {};
            }

            var tn = this.looksLike() || this.tn;

            if (!this.CE._template[tn]) {
              var templateId = lispToSnakeCase(tn) + '_template';
              this.CE._template[tn] = self[lispToSnakeCase(tn) + '_template'];
            }

            var clonedNode = this.CE._template[tn].content.cloneNode(true);

            this.customizeClone(clonedNode);

            if (!noShadow) {
              this.shadowRoot.appendChild(clonedNode);
              this.initShadowRoot();
            } else {
              this.appendChild(clonedNode);
            }

            this.setAttribute("shadowed", 'true');
          }
        }, {
          key: "tn",
          get: function get() {
            return this.tagName.toLowerCase();
          }
        }, {
          key: "dynamicSlots",
          get: function get() {
            return null;
          }
        }, {
          key: "CE",
          get: function get() {
            if (!this._ce) this._ce = customElements.get(this.tn);
            return this._ce;
          }
        }], [{
          key: "is",
          get: function get() {
            return 'bra-ket';
          }
        }]);
        return _class2;
      }(superClass)
    );
  }

  var BraKet =
  /*#__PURE__*/
  function (_BraKetMixin) {
    babelHelpers.inherits(BraKet, _BraKetMixin);

    function BraKet() {
      var _this8;

      babelHelpers.classCallCheck(this, BraKet);
      _this8 = babelHelpers.possibleConstructorReturn(this, (BraKet.__proto__ || Object.getPrototypeOf(BraKet)).call(this));

      if (Object.getPrototypeOf(babelHelpers.assertThisInitialized(_this8)) === BraKet.prototype) {} else {
        _this8.addTemplate();
      }

      return _this8;
    }

    return BraKet;
  }(BraKetMixin(HTMLElement));

  function initCE(tagName, cls, basePath, sharedTemplateTagName) {
    if (customElements.get(tagName)) return;
    var templateTagName = sharedTemplateTagName || tagName;
    var templateID = lispToSnakeCase(templateTagName) + '_template';
    var template = self[templateID];

    if (!template) {
      template = document.createElement('template');
      template.id = templateID;
      template.dataset.src = basePath + '/' + templateTagName + '.html';
      document.head.appendChild(template);
    } //TODO:  line below shouldn't be necessary with templ-mount?


    loadTemplate(template, {
      cls: cls,
      sharedTemplateTagName: sharedTemplateTagName,
      tagName: tagName
    });
  } // export const basePath = getBasePath(BraKet.is);
  // customElements.define(BraKet.is, BraKet);
  //initCE(XtalShadow.is, XtalShadow, basePath);


  var AdoptAChild =
  /*#__PURE__*/
  function (_BraKet) {
    babelHelpers.inherits(AdoptAChild, _BraKet);

    function AdoptAChild() {
      var _this9;

      babelHelpers.classCallCheck(this, AdoptAChild);
      _this9 = babelHelpers.possibleConstructorReturn(this, (AdoptAChild.__proto__ || Object.getPrototypeOf(AdoptAChild)).call(this));
      _this9._rootElement = 'div';
      _this9._targetElementSelector = '[target]';
      return _this9;
    }

    babelHelpers.createClass(AdoptAChild, [{
      key: "postAdopt",
      value: function postAdopt() {}
    }, {
      key: "addTemplate",
      value: function addTemplate() {
        var _this10 = this;

        babelHelpers.get(AdoptAChild.prototype.__proto__ || Object.getPrototypeOf(AdoptAChild.prototype), "addTemplate", this).call(this);
        if (!this.dynamicSlots) return;
        this.dynamicSlots.forEach(function (slotSelector) {
          var slots = qsa(slotSelector, _this10.shadowRoot).forEach(function (slot) {
            slot.addEventListener('slotchange', function (e) {
              slot.assignedNodes().forEach(function (node) {
                var targetEl = _this10.shadowRoot.querySelector(_this10._targetElementSelector);

                if (node.nodeType === 3) return;

                if (node.hasAttribute('disabled')) {
                  node.removeAttribute('disabled');
                  node['target'] = targetEl;
                }
              });

              _this10.postAdopt();
            });
          });
        });
      }
    }, {
      key: "dynamicSlots",
      get: function get() {
        return ['slot'];
      }
    }]);
    return AdoptAChild;
  }(BraKet);
  /**
   * `xtal-text-input-md`
   *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */


  var XtalTextInputMD =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(XtalTextInputMD, _XtallatX);

    function XtalTextInputMD() {
      babelHelpers.classCallCheck(this, XtalTextInputMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalTextInputMD.__proto__ || Object.getPrototypeOf(XtalTextInputMD)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalTextInputMD, [{
      key: "customizeClone",
      value: function customizeClone(clonedNode) {
        babelHelpers.get(XtalTextInputMD.prototype.__proto__ || Object.getPrototypeOf(XtalTextInputMD.prototype), "customizeClone", this).call(this, clonedNode);
        var inputEl = this._inputElement = clonedNode.querySelector('input');
        inputEl.setAttribute('type', this.getType());

        for (var i = 0, ii = this.attributes.length; i < ii; i++) {
          var attrib = this.attributes[i]; //const inp = clonedNode.querySelector('input');

          if (attrib.name === 'type') continue;
          inputEl.setAttribute(attrib.name, attrib.value);
        }
      }
    }, {
      key: "initShadowRoot",
      value: function initShadowRoot() {
        var _this11 = this;

        this.addInputListener();

        this._inputElement.addEventListener('change', function (e) {
          var element = _this11._inputElement; // e.target as HTMLInputElement;

          if (element && element.matches(".form-element-field")) {
            element.classList[element.value ? "add" : "remove"]("-hasvalue");
          }
        });
      }
    }, {
      key: "getType",
      value: function getType() {
        return this.constructor['is'].split('-')[1];
      }
    }, {
      key: "addInputListener",
      value: function addInputListener() {
        var _this12 = this;

        this._inputElement.addEventListener('input', function (e) {
          _this12.emitEvent();
        });
      }
    }, {
      key: "emitEvent",
      value: function emitEvent() {
        this.value = this._inputElement.value;
        this.de('value', {
          value: this.value
        });
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._upgradeProperties(['value']);

        this.addMutationObserver();
      }
    }, {
      key: "addMutationObserver",
      value: function addMutationObserver() {
        var _this13 = this;

        var config = {
          attributes: true
        };
        this._observer = new MutationObserver(function (mutationsList) {
          mutationsList.forEach(function (mutation) {
            _this13._inputElement[mutation.attributeName] = _this13[mutation.attributeName];
          });
        });

        this._observer.observe(this, config);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this._observer.disconnect();
      }
    }, {
      key: "value",
      get: function get() {
        return this._inputElement.value;
      },
      set: function set(val) {
        this._inputElement.value = val;
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-text-input-md';
      }
    }]);
    return XtalTextInputMD;
  }(XtallatX(BraKet));

  var basePath = getBasePath(XtalTextInputMD.is);
  initCE(XtalTextInputMD.is, XtalTextInputMD, basePath + '/text-input');
  /**
   * `xtal-email-input-md`
   *  Web component wrapper around Jon Uhlmann's pure CSS material design email input element. https://codepen.io/jonnitto/pen/OVmvPB
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */

  var XtalEmailInputMD =
  /*#__PURE__*/
  function (_XtalTextInputMD) {
    babelHelpers.inherits(XtalEmailInputMD, _XtalTextInputMD);

    function XtalEmailInputMD() {
      babelHelpers.classCallCheck(this, XtalEmailInputMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalEmailInputMD.__proto__ || Object.getPrototypeOf(XtalEmailInputMD)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalEmailInputMD, [{
      key: "looksLike",
      value: function looksLike() {
        return XtalTextInputMD.is;
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-email-input-md';
      }
    }]);
    return XtalEmailInputMD;
  }(XtalTextInputMD);

  initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is);

  var XtalCheckboxInputMD =
  /*#__PURE__*/
  function (_XtalTextInputMD2) {
    babelHelpers.inherits(XtalCheckboxInputMD, _XtalTextInputMD2);

    function XtalCheckboxInputMD() {
      babelHelpers.classCallCheck(this, XtalCheckboxInputMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalCheckboxInputMD.__proto__ || Object.getPrototypeOf(XtalCheckboxInputMD)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalCheckboxInputMD, [{
      key: "emitEvent",
      value: function emitEvent() {
        var val = this._inputElement.checked;
        this.value = val ? 'on' : 'off';
        this.de('value', {
          value: val
        });
      }
    }, {
      key: "addInputListener",
      value: function addInputListener() {
        var _this14 = this;

        //some browsers don't support 'input' change on checkbox yet
        this._inputElement.addEventListener('change', function (e) {
          _this14.emitEvent();
        });
      }
    }, {
      key: "checked",
      // getType() {
      //     return 'checkbox';
      // }
      get: function get() {
        return this._inputElement.checked;
      },
      set: function set(val) {
        this._inputElement.checked = val;
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-checkbox-input-md';
      }
    }]);
    return XtalCheckboxInputMD;
  }(XtalTextInputMD);

  initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, getBasePath(XtalCheckboxInputMD.is) + '/checkbox-input');
  /**
   * `xtal-radio-group-md`
   *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */

  var XtalRadioGroupMD =
  /*#__PURE__*/
  function (_XtallatX2) {
    babelHelpers.inherits(XtalRadioGroupMD, _XtallatX2);

    function XtalRadioGroupMD() {
      babelHelpers.classCallCheck(this, XtalRadioGroupMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalRadioGroupMD.__proto__ || Object.getPrototypeOf(XtalRadioGroupMD)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalRadioGroupMD, [{
      key: "handleChange",
      value: function handleChange(e) {
        this.de('selected-radio', e.target);
      }
    }, {
      key: "postAdopt",
      value: function postAdopt() {
        var _this15 = this;

        var q = qsa('input', this.shadowRoot);

        if (q.length === 0) {
          setTimeout(function () {
            _this15.postAdopt();
          }, 10);
          return;
        }

        this._changeHandler = this.handleChange.bind(this);
        q.forEach(function (radio) {
          radio.addEventListener('change', _this15._changeHandler);
        });
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var _this16 = this;

        var q = qsa('input', this.shadowRoot);
        q.forEach(function (radio) {
          radio.removeEventListener('change', _this16._changeHandler);
        });
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-radio-group-md';
      }
    }]);
    return XtalRadioGroupMD;
  }(XtallatX(AdoptAChild));

  initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group');

  var styleFn = function styleFn(n, t) {
    return "\ninput[type=\"radio\"][name=\"tabs\"]:nth-of-type(".concat(n + 1, "):checked~.slide {\n    left: calc((100% / ").concat(t, ") * ").concat(n, ");\n}\n");
  };

  var XtalRadioTabsMD =
  /*#__PURE__*/
  function (_XtallatX3) {
    babelHelpers.inherits(XtalRadioTabsMD, _XtallatX3);
    babelHelpers.createClass(XtalRadioTabsMD, null, [{
      key: "is",
      get: function get() {
        return 'xtal-radio-tabs-md';
      }
    }]);

    function XtalRadioTabsMD() {
      babelHelpers.classCallCheck(this, XtalRadioTabsMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalRadioTabsMD.__proto__ || Object.getPrototypeOf(XtalRadioTabsMD)).call(this));
    }

    babelHelpers.createClass(XtalRadioTabsMD, [{
      key: "handleChange",
      value: function handleChange(e) {
        this.de('selected-tab', e.target);
      }
    }, {
      key: "postAdopt",
      value: function postAdopt() {
        var _this17 = this;

        var q = qsa('input', this.shadowRoot);

        if (q.length === 0) {
          setTimeout(function () {
            _this17.postAdopt();
          }, 10);
          return;
        }

        this._changeHandler = this.handleChange.bind(this);
        q.forEach(function (radio) {
          radio.addEventListener('change', _this17._changeHandler);
        });
        var styles = [];

        for (var i = 0, ii = q.length; i < ii; i++) {
          styles.push(styleFn(i, ii));
        }

        styles.push("\n        .slide {\n            width: calc(100% / ".concat(q.length, ");\n        }\n        "));
        var style = document.createElement('style');
        style.innerHTML = styles.join('');
        this.shadowRoot.appendChild(style);
        this.addEventListener('input', function (e) {
          debugger;
        });
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var _this18 = this;

        var q = qsa('input', this.shadowRoot);
        q.forEach(function (radio) {
          radio.removeEventListener('change', _this18._changeHandler);
        });
      }
    }]);
    return XtalRadioTabsMD;
  }(XtallatX(AdoptAChild));

  initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs'); //import {qsa} from 'templ-mount/templ-mount.js';

  var XtalSelectMD =
  /*#__PURE__*/
  function (_XtallatX4) {
    babelHelpers.inherits(XtalSelectMD, _XtallatX4);

    function XtalSelectMD() {
      babelHelpers.classCallCheck(this, XtalSelectMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalSelectMD.__proto__ || Object.getPrototypeOf(XtalSelectMD)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalSelectMD, [{
      key: "handleChange",
      value: function handleChange(e) {
        console.log(this._select[this._select.selectedIndex]);
        this.de('selected-option', this._select[this._select.selectedIndex]);
      }
    }, {
      key: "postAdopt",
      value: function postAdopt() {
        var _this19 = this;

        this._select = this.shadowRoot.querySelector('select');

        if (!this._select) {
          setTimeout(function () {
            _this19.postAdopt();
          }, 10);
          return;
        }

        this._changeHandler = this.handleChange.bind(this);

        this._select.addEventListener('change', this._changeHandler);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        if (this._select && this._changeHandler) {
          this._select.removeEventListener('change', this._changeHandler);
        }
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-select-md';
      }
    }]);
    return XtalSelectMD;
  }(XtallatX(AdoptAChild));

  initCE(XtalSelectMD.is, XtalSelectMD, getBasePath(XtalSelectMD.is) + '/select');
  /**
   * `xtal-text-area-md`
   *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */

  var XtalTextAreaMD =
  /*#__PURE__*/
  function (_XtalTextInputMD3) {
    babelHelpers.inherits(XtalTextAreaMD, _XtalTextInputMD3);

    function XtalTextAreaMD() {
      babelHelpers.classCallCheck(this, XtalTextAreaMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalTextAreaMD.__proto__ || Object.getPrototypeOf(XtalTextAreaMD)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalTextAreaMD, [{
      key: "customizeClone",
      //_textArea: HTMLTextAreaElement;
      value: function customizeClone(clonedNode) {
        var textArea = this._inputElement = clonedNode.querySelector('textarea');

        for (var i = 0, ii = this.attributes.length; i < ii; i++) {
          var attrib = this.attributes[i];
          textArea.setAttribute(attrib.name, attrib.value);
        }
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-text-area-md';
      }
    }]);
    return XtalTextAreaMD;
  }(XtalTextInputMD);

  initCE(XtalTextAreaMD.is, XtalTextAreaMD, getBasePath(XtalTextAreaMD.is) + '/text-area');

  var XtalSideNav =
  /*#__PURE__*/
  function (_XtallatX5) {
    babelHelpers.inherits(XtalSideNav, _XtallatX5);

    function XtalSideNav() {
      babelHelpers.classCallCheck(this, XtalSideNav);
      return babelHelpers.possibleConstructorReturn(this, (XtalSideNav.__proto__ || Object.getPrototypeOf(XtalSideNav)).apply(this, arguments));
    }

    babelHelpers.createClass(XtalSideNav, [{
      key: "openMenu",
      value: function openMenu(e) {
        this.setWidth(250);
      }
    }, {
      key: "setWidth",
      value: function setWidth(width) {
        this.shadowRoot.getElementById('mySidenav').style.width = width + 'px';
      }
    }, {
      key: "closeMenu",
      value: function closeMenu(e) {
        this.setWidth(0);
      }
    }, {
      key: "initShadowRoot",
      value: function initShadowRoot() {
        this._opener = this.shadowRoot.getElementById('opener');
        this._boundOpener = this.openMenu.bind(this);

        this._opener.addEventListener('click', this._boundOpener);

        this._closer = this.shadowRoot.getElementById('closebtn');
        this._boundCloser = this.closeMenu.bind(this);

        this._closer.addEventListener('click', this._boundCloser);

        this._slot = this.shadowRoot.getElementById('slot');

        this._slot.addEventListener('click', this._boundCloser);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this._opener.removeEventListener('click', this._boundOpener);

        this._closer.removeEventListener('click', this._boundCloser);

        this._slot.removeEventListener('click', this._boundCloser);
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-side-nav';
      }
    }]);
    return XtalSideNav;
  }(XtallatX(BraKet));

  initCE(XtalSideNav.is, XtalSideNav, getBasePath(XtalSideNav.is) + '/side-nav');
})();