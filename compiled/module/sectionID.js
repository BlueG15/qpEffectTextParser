"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../abstract/component");
const mod_1 = require("../abstract/mod");
class sectionIDModule extends mod_1.mod {
    constructor() {
        super(...arguments);
        this.quickKeyword = ['void', 'decompile', 'decompiled', 'pathed', 'expose', 'exec', 'exec-ed', 'align', 'cover'];
        this.normalKeyword = ['key', 'physical', 'magic', 'health', 'attack', 'specialbuff'];
        this.cmdName = [
            ...this.normalKeyword,
            ...this.quickKeyword,
            'physical2', 'magic2',
        ];
        this.requiredAttr = new Array(this.cmdName.length).fill([]);
        this.doCheckRequiredAttr = false;
    }
    recurModify(tree, sectionID, upperCase) {
        tree.forEach(i => {
            if (i instanceof component_1.component) {
                i.addSectionID(sectionID);
                if (i.id == component_1.componentID.text && upperCase) {
                    i.str = i.str.toUpperCase();
                }
            }
            else {
                this.recurModify(i, sectionID, upperCase);
            }
            ;
        });
    }
    evaluate(cmd, args, option, raw) {
        let quickFlag = this.quickKeyword.includes(cmd);
        let pastFlag = false;
        let addIconFlag = cmd.endsWith('2');
        let x = cmd;
        if (x == "exec-ed") {
            x = "exec";
            pastFlag = true;
        }
        else if (x == "decompiled") {
            x = "decompile", pastFlag = true;
        }
        if (addIconFlag)
            x = x.slice(0, -1);
        let final = args.getChilren();
        if (quickFlag && !final.length) {
            //special behavior
            if (x == "exec")
                x = "execute";
            if (pastFlag)
                x += "d";
            x = x.toUpperCase();
            return [
                new component_1.textComponent(x, undefined, cmd, raw)
            ];
        }
        this.recurModify(final, x, quickFlag);
        if (addIconFlag) {
            final = [final, [new component_1.iconComponent((x == "physical") ? component_1.iconID.dmg_phys : component_1.iconID.dmg_magic, undefined, cmd, raw)]];
        }
        return final;
    }
}
exports.default = sectionIDModule;
