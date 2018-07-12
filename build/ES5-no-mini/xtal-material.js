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

  var _cachedTemplates = {};
  var fetchInProgress = {};

  function loadTemplate(template, params) {
    var src = template.dataset.src;

    if (src) {
      if (_cachedTemplates[src]) {
        template.innerHTML = _cachedTemplates[src];
        if (params) customElements.define(params.tagName, params.cls);
      } else {
        if (fetchInProgress[src]) {
          if (params) {
            setTimeout(function () {
              loadTemplate(template, params);
            }, 100);
          }

          return;
        }

        fetchInProgress[src] = true;
        fetch(src, {
          credentials: 'same-origin'
        }).then(function (resp) {
          resp.text().then(function (txt) {
            fetchInProgress[src] = false;
            if (params && params.preProcessor) txt = params.preProcessor.process(txt);
            _cachedTemplates[src] = txt;
            template.innerHTML = txt;
            template.setAttribute('loaded', '');
            if (params) customElements.define(params.tagName, params.cls);
          });
        });
      }
    } else {
      if (params && params.tagName) customElements.define(params.tagName, params.cls);
    }
  } //# sourceMappingURL=first-templ.js.map
  // const _cachedTemplates : {[key:string] : string} = {};
  // const fetchInProgress : {[key:string] : boolean} = {};


  function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
  }

  var TemplMount =
  /*#__PURE__*/
  function (_HTMLElement) {
    babelHelpers.inherits(TemplMount, _HTMLElement);

    function TemplMount() {
      var _this;

      babelHelpers.classCallCheck(this, TemplMount);
      _this = babelHelpers.possibleConstructorReturn(this, (TemplMount.__proto__ || Object.getPrototypeOf(TemplMount)).call(this));

      if (!TemplMount._alreadyDidGlobalCheck) {
        TemplMount._alreadyDidGlobalCheck = true;

        _this.loadTemplatesOutsideShadowDOM();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this.loadTemplatesOutsideShadowDOM();

            _this.monitorHeadForTemplates();
          });
        } else {
          _this.monitorHeadForTemplates();
        }
      }

      return _this;
    }

    babelHelpers.createClass(TemplMount, [{
      key: "getHost",
      value: function getHost() {
        var parent = this.parentNode;
        return parent['host'];
      }
    }, {
      key: "loadTemplates",
      value: function loadTemplates(from) {
        qsa('template[data-src]', from).forEach(function (externalRefTemplate) {
          loadTemplate(externalRefTemplate);
        });
      }
    }, {
      key: "loadTemplatesOutsideShadowDOM",
      value: function loadTemplatesOutsideShadowDOM() {
        this.loadTemplates(document);
      }
    }, {
      key: "loadTemplateInsideShadowDOM",
      value: function loadTemplateInsideShadowDOM() {
        var host = this.getHost();
        if (!host) return;
        this.loadTemplates(host);
      }
    }, {
      key: "monitorHeadForTemplates",
      value: function monitorHeadForTemplates() {
        var config = {
          childList: true
        };
        this._observer = new MutationObserver(function (mutationsList) {
          mutationsList.forEach(function (mutationRecord) {
            mutationRecord.addedNodes.forEach(function (node) {
              if (node.tagName === 'TEMPLATE') loadTemplate(node);
            });
          });
        });

        this._observer.observe(document.head, config);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this.loadTemplateInsideShadowDOM();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", function (e) {
            _this2.loadTemplateInsideShadowDOM();
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

  TemplMount._alreadyDidGlobalCheck = false;

  if (!customElements.get(TemplMount.is)) {
    customElements.define(TemplMount.is, TemplMount);
  } //# sourceMappingURL=templ-mount.js.map


  var disabled = 'disabled';

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this3;

          babelHelpers.classCallCheck(this, _class);
          _this3 = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
          _this3._evCount = {};
          return _this3;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",
          value: function attr(name, val, trueVal) {
            if (val) {
              this.setAttribute(name, trueVal || val);
            } else {
              this.removeAttribute(name);
            }
          }
        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr(name, ec[name].toString());
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
        }, {
          key: "de",
          value: function de(name, detail) {
            var eventName = name + '-changed';
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this4 = this;

            props.forEach(function (prop) {
              if (_this4.hasOwnProperty(prop)) {
                var value = _this4[prop];
                delete _this4[prop];
                _this4[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",
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
  } //# sourceMappingURL=xtal-latx.js.map


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
      var _this5;

      babelHelpers.classCallCheck(this, BraKet);
      _this5 = babelHelpers.possibleConstructorReturn(this, (BraKet.__proto__ || Object.getPrototypeOf(BraKet)).call(this));

      if (Object.getPrototypeOf(babelHelpers.assertThisInitialized(_this5)) === BraKet.prototype) {} else {
        _this5.addTemplate();
      }

      return _this5;
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
  //# sourceMappingURL=bra-ket.js.map


  var AdoptAChild =
  /*#__PURE__*/
  function (_BraKet) {
    babelHelpers.inherits(AdoptAChild, _BraKet);

    function AdoptAChild() {
      var _this6;

      babelHelpers.classCallCheck(this, AdoptAChild);
      _this6 = babelHelpers.possibleConstructorReturn(this, (AdoptAChild.__proto__ || Object.getPrototypeOf(AdoptAChild)).call(this));
      _this6._rootElement = 'div';
      _this6._targetElementSelector = '[target]';
      return _this6;
    }

    babelHelpers.createClass(AdoptAChild, [{
      key: "postAdopt",
      value: function postAdopt() {}
    }, {
      key: "addTemplate",
      value: function addTemplate() {
        var _this7 = this;

        console.log('addTemplate');
        babelHelpers.get(AdoptAChild.prototype.__proto__ || Object.getPrototypeOf(AdoptAChild.prototype), "addTemplate", this).call(this);
        if (!this.dynamicSlots) return;
        this.dynamicSlots.forEach(function (slotSelector) {
          var slots = qsa(slotSelector, _this7.shadowRoot).forEach(function (slot) {
            slot.addEventListener('slotchange', function (e) {
              slot.assignedNodes().forEach(function (node) {
                var targetEl = _this7.shadowRoot.querySelector(_this7._targetElementSelector);

                if (node['disabled'] && babelHelpers.typeof(node['target'] !== 'undefined')) {
                  node['target'] = targetEl;
                  node.removeAttribute('disabled');
                } else {
                  if (node.nodeType === 1) {
                    targetEl.innerHTML = '';
                    targetEl.appendChild(node.cloneNode(true));

                    if (node.parentElement) {
                      node.parentElement.removeChild(node);
                    } else {
                      if (node.nodeType === 1) {
                        node.innerHTML = '';
                        node.style.display = 'none';
                        node.removeAttribute('id');
                      }
                    }
                  }
                }
              });

              _this7.postAdopt();
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
  }(BraKet); //# sourceMappingURL=adopt-a-child.js.map

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
        var _this8 = this;

        this.addInputListener();

        this._inputElement.addEventListener('change', function (e) {
          var element = _this8._inputElement; // e.target as HTMLInputElement;

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
        var _this9 = this;

        this._inputElement.addEventListener('input', function (e) {
          _this9.emitEvent();
        });
      }
    }, {
      key: "emitEvent",
      value: function emitEvent() {
        var newEvent = new CustomEvent('value-changed', {
          detail: {
            value: this._inputElement.value
          },
          bubbles: true,
          composed: false
        });
        this.dispatchEvent(newEvent);
      } // _upgradeProperties(props: string[]) {
      //     props.forEach(prop => {
      //         if (this.hasOwnProperty(prop)) {
      //             let value = this[prop];
      //             delete this[prop];
      //             this[prop] = value;
      //         }
      //     })
      // }

    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._upgradeProperties(['value']);

        this.addMutationObserver();
      }
    }, {
      key: "addMutationObserver",
      value: function addMutationObserver() {
        var _this10 = this;

        var config = {
          attributes: true
        };
        this._observer = new MutationObserver(function (mutationsList) {
          mutationsList.forEach(function (mutation) {
            _this10._inputElement[mutation.attributeName] = _this10[mutation.attributeName];
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

  initCE(XtalEmailInputMD.is, XtalEmailInputMD, basePath + '/text-input', XtalTextInputMD.is); //# sourceMappingURL=xtal-text-input-md.js.map

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
        var newEvent = new CustomEvent('checked-changed', {
          detail: {
            value: this._inputElement.checked
          },
          bubbles: true,
          composed: false
        });
        this.dispatchEvent(newEvent);
      }
    }, {
      key: "addInputListener",
      value: function addInputListener() {
        var _this11 = this;

        //some browsers don't support 'input' change on checkbox yet
        this._inputElement.addEventListener('change', function (e) {
          _this11.emitEvent();
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

  initCE(XtalCheckboxInputMD.is, XtalCheckboxInputMD, getBasePath(XtalCheckboxInputMD.is) + '/checkbox-input'); //# sourceMappingURL=xtal-checkbox-input-md.js.map

  var XtalRadioGroupMD =
  /*#__PURE__*/
  function (_AdoptAChild) {
    babelHelpers.inherits(XtalRadioGroupMD, _AdoptAChild);
    babelHelpers.createClass(XtalRadioGroupMD, null, [{
      key: "is",
      get: function get() {
        return 'xtal-radio-group-md';
      }
    }]);

    function XtalRadioGroupMD() {
      babelHelpers.classCallCheck(this, XtalRadioGroupMD);
      return babelHelpers.possibleConstructorReturn(this, (XtalRadioGroupMD.__proto__ || Object.getPrototypeOf(XtalRadioGroupMD)).call(this));
    }

    return XtalRadioGroupMD;
  }(AdoptAChild);

  initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group'); //# sourceMappingURL=xtal-radio-group-md.js.map

  var styleFn = function styleFn(n, t) {
    return "\ninput[type=\"radio\"][name=\"tabs\"]:nth-of-type(".concat(n + 1, "):checked~.slide {\n    left: calc((100% / ").concat(t, ") * ").concat(n, ");\n}\n");
  };

  var XtalRadioTabsMD =
  /*#__PURE__*/
  function (_XtallatX2) {
    babelHelpers.inherits(XtalRadioTabsMD, _XtallatX2);
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
        var _this12 = this;

        var q = qsa('input', this.shadowRoot);

        if (q.length === 0) {
          setTimeout(function () {
            _this12.postAdopt();
          }, 100);
          return;
        }

        this._changeHandler = this.handleChange.bind(this);
        q.forEach(function (radio) {
          radio.addEventListener('change', _this12._changeHandler);
        });
        var styles = [];
        console.log('length  = ' + q.length);

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
        var _this13 = this;

        babelHelpers.get(XtalRadioTabsMD.prototype.__proto__ || Object.getPrototypeOf(XtalRadioTabsMD.prototype), "disconnectedCallback", this).call(this);
        var q = qsa('input', this.shadowRoot);
        q.forEach(function (radio) {
          radio.removeEventListener('change', _this13._changeHandler);
        });
      }
    }]);
    return XtalRadioTabsMD;
  }(XtallatX(AdoptAChild));

  initCE(XtalRadioTabsMD.is, XtalRadioTabsMD, getBasePath(XtalRadioTabsMD.is) + '/radio-tabs'); //# sourceMappingURL=xtal-radio-tabs-md.js.map

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

  initCE(XtalTextAreaMD.is, XtalTextAreaMD, getBasePath(XtalTextAreaMD.is) + '/text-area'); //# sourceMappingURL=xtal-text-area-md.js.map

  var XtalSideNav =
  /*#__PURE__*/
  function (_XtallatX3) {
    babelHelpers.inherits(XtalSideNav, _XtallatX3);

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

  initCE(XtalSideNav.is, XtalSideNav, getBasePath(XtalSideNav.is) + '/side-nav'); //# sourceMappingURL=xtal-side-nav.js.map
})();