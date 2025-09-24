"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../abstract/component");
const mod_1 = require("../abstract/mod");
const options_1 = require("../abstract/options");
class variantCheckModule extends mod_1.mod {
    constructor() {
        super(...arguments);
        this.cmdName = [
            'variantInclude', 'variantExclude'
        ];
        this.requiredAttr = new Array(2).fill(["variantID"]);
        this.doCheckRequiredAttr = true;
    }
    isValidAttr(cmdIndex, attrName, attr) {
        const k = attr.split(" ");
        for (let i = 0; i < k.length; i++) {
            if (!k[i].length)
                return false;
        }
        return true;
    }
    recurModify(tree, sectionID) {
        tree.forEach(i => {
            if (i instanceof component_1.component) {
                i.addSectionID(sectionID);
            }
            else {
                this.recurModify(i, sectionID);
            }
            ;
        });
    }
    evaluate(cmd, args, option, raw) {
        let k = args.getChilren();
        if (option.mode == options_1.mode.debug)
            return k;
        //remove bracket by default
        const checkVariant = args.getAttr("expr").split(' ');
        let correctVariantFlag = checkVariant.includes(option.variantID);
        if ((correctVariantFlag && cmd == "variantExclude") || (!correctVariantFlag && cmd == "variantInclude")) {
            return [];
        }
        if (option.mode == options_1.mode.info) {
            k = [
                [new component_1.textComponent("[", undefined, cmd, raw)],
                k,
                [new component_1.textComponent("]", undefined, cmd, raw)]
            ];
        }
        this.recurModify(k, cmd);
        return k;
    }
}
exports.default = variantCheckModule;
