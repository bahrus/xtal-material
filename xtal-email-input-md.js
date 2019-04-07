import { baseTemplateGenerator, XtalTextInputMD } from './xtal-text-input-md.js';
import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
const mainTemplate = createTemplate(baseTemplateGenerator('email'));
export class XtalEmailInputMD extends XtalTextInputMD {
    static get is() { return 'xtal-email-input-md'; }
    get mainTemplate() {
        return mainTemplate;
    }
}
define(XtalEmailInputMD);
