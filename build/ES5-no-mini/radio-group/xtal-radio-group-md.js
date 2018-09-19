import { initCE } from "../node_modules/bra-ket/bra-ket.js";
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
import { XtallatX } from "../node_modules/xtal-latx/xtal-latx.js";
import { qsa } from "../node_modules/xtal-latx/qsa.js";
/**
 * `xtal-radio-group-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export var XtalRadioGroupMD =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(XtalRadioGroupMD, _XtallatX);

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
      var _this = this;

      var q = qsa('input', this.shadowRoot);

      if (q.length === 0) {
        setTimeout(function () {
          _this.postAdopt();
        }, 10);
        return;
      }

      this._changeHandler = this.handleChange.bind(this);
      q.forEach(function (radio) {
        radio.addEventListener('change', _this._changeHandler);
      });
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this2 = this;

      var q = qsa('input', this.shadowRoot);
      q.forEach(function (radio) {
        radio.removeEventListener('change', _this2._changeHandler);
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
initCE(XtalRadioGroupMD.is, XtalRadioGroupMD, getBasePath(XtalRadioGroupMD.is) + '/radio-group'); //# sourceMappingURL=xtal-radio-group-md.js.map