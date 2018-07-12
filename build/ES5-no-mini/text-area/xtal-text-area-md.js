import { initCE } from "../node_modules/bra-ket/bra-ket.js";
import { getBasePath } from '../getBasePath.js';
import { XtalTextInputMD } from '../text-input/xtal-text-input-md.js';
/**
 * `xtal-text-area-md`
 *  Web component wrapper around Jon Uhlmann's pure CSS material design text input element. https://codepen.io/jonnitto/pen/OVmvPB
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export var XtalTextAreaMD =
/*#__PURE__*/
function (_XtalTextInputMD) {
  babelHelpers.inherits(XtalTextAreaMD, _XtalTextInputMD);

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