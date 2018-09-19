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
           * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
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
           * Any component that emits events should not do so if it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in should ensure not to call "de" if this property is set to true.
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

  function qsa(css, from) {
    return [].slice.call(from.querySelectorAll(css));
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

  initCE(XtalSideNav.is, XtalSideNav, getBasePath(XtalSideNav.is) + '/side-nav');
})();