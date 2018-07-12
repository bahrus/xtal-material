import { initCE } from "../node_modules/bra-ket/bra-ket.js";
import { getBasePath } from '../getBasePath.js';
import { AdoptAChild } from '../adopt-a-child.js';
export var XtalRadioGroupMD =
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