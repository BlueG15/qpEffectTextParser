"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../abstract/component");
const mod_1 = require("../abstract/mod");
const options_1 = require("../abstract/options");
class uadduminusModule extends mod_1.mod {
    constructor() {
        super(...arguments);
        this.cmdName = ['uadd', 'uminus'];
        this.requiredAttr = [[], []];
        this.doCheckRequiredAttr = false;
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
        let upgradeFlag = option.variantID.toLowerCase().includes("upgrade");
        if ((upgradeFlag && cmd == "uminus") || (!upgradeFlag && cmd == "uadd")) {
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
exports.default = uadduminusModule;
