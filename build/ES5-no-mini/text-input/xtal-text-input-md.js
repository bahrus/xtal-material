import { BraKet, initCE } from "../node_modules/bra-ket/bra-ket.js";
import { XtallatX } from "../node_modules/xtal-latx/xtal-latx.js";
import { getBasePath } from '../getBasePath.js';
/**
 * `xtal-text-input-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export var XtalTextInputMD =
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
      var _this = this;

      this.addInputListener();

      this._inputElement.addEventListener('change', function (e) {
        var element = _this._inputElement; // e.target as HTMLInputElement;

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
      var _this2 = this;

      this._inputElement.addEventListener('input', function (e) {
        _this2.emitEvent();
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
      var _this3 = this;

      var config = {
        attributes: true
      };
      this._observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
          _this3._inputElement[mutation.attributeName] = _this3[mutation.attributeName];
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

export var XtalEmailInputMD =
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