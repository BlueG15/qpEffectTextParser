"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("./module");
class modulePack extends module_1.module {
    constructor() {
        super();
        this.moduleMap = new Map();
        //override this
        this.moduleArr = [];
        this.cmdName = [];
        this.requiredAttr = [];
        this.doCheckRequiredAttr = false; //not used
        this.doCheckRequiredAttrArr = [];
        this.cmdTrueIndex = [];
        this.moduleArr.forEach((i, index) => {
            var _a;
            i.cmdName.forEach(j => {
                this.moduleMap.set(j, index);
            });
            for (let k = 0; k < i.cmdName.length; k++) {
                this.cmdName.push(i.cmdName[k]);
                this.requiredAttr.push((_a = i.requiredAttr[k]) !== null && _a !== void 0 ? _a : []);
                this.doCheckRequiredAttrArr.push(i.doCheckRequiredAttr);
                this.cmdTrueIndex.push(k);
            }
        });
    }
    generateInputObj(cmdIndex, attrObj, children) {
        return this.moduleArr[cmdIndex].generateInputObj(this.cmdTrueIndex[cmdIndex], attrObj, children);
    }
    isValidAttr(cmdIndex, attrName, attr) {
        return this.moduleArr[cmdIndex].isValidAttr(this.cmdTrueIndex[cmdIndex], attrName, attr);
    }
    evaluate(cmd, args, option, raw) {
        const moduleIndex = this.moduleMap.get(cmd);
        if (!moduleIndex)
            return [];
        return this.moduleArr[moduleIndex].evaluate(cmd, args, option, raw);
    }
}
exports.default = modulePack;
