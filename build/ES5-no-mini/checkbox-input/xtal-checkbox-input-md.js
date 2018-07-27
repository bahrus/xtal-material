import { XtalTextInputMD } from '../text-input/xtal-text-input-md.js';
import { initCE } from "../node_modules/bra-ket/bra-ket.js";
import { getBasePath } from '../getBasePath.js';
export var XtalCheckboxInputMD =
/*#__PURE__*/
function (_XtalTextInputMD) {
  babelHelpers.inherits(XtalCheckboxInputMD, _XtalTextInputMD);

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
      var _this = this;

      //some browsers don't support 'input' change on checkbox yet
      this._inputElement.addEventListener('change', function (e) {
        _this.emitEvent();
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