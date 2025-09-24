"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../abstract/component");
const mod_1 = require("../abstract/mod");
class tagsModule extends mod_1.mod {
    constructor() {
        super(...arguments);
        this.cmdName = ["tags"];
        this.requiredAttr = [["ID"]];
        this.doCheckRequiredAttr = true;
    }
    recurModify(tree, sectionIDs) {
        tree.forEach(i => {
            if (i instanceof component_1.component) {
                i.addSectionID(sectionIDs);
            }
            else {
                this.recurModify(i, sectionIDs);
            }
            ;
        });
    }
    evaluate(cmd, args, option, raw) {
        let IDs = args.getAttr("ID").split(" ");
        let final = args.getChilren();
        this.recurModify(final, IDs);
        return final;
    }
}
exports.default = tagsModule;
