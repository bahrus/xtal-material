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

  function delayedLoad(template, delay, params) {
    setTimeout(function () {
      loadTemplate(template, params);
    }, delay);
  }

  function loadTemplate(template, params) {
    var src = template.dataset.src || template.getAttribute('href');

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
            var split = txt.split('<!---->');

            if (split.length > 1) {
              txt = split[1];
            }

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
          var ds = externalRefTemplate.dataset;
          var ua = ds.ua;
          if (ua && navigator.userAgent.indexOf(ua) === -1) return;

          if (!ds.dumped) {
            document.head.appendChild(externalRefTemplate.content.cloneNode(true));
            ds.dumped = 'true';
          }

          var delay = ds.delay;

          if (delay) {
            delayedLoad(externalRefTemplate, parseInt(delay));
          } else {
            loadTemplate(externalRefTemplate);
          }
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

            this.setAttribute("shadowed", true);
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


  var XtalSideNav =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(XtalSideNav, _XtallatX);

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