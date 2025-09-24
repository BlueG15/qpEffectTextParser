"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lib_parse_option = exports.loadOptions = exports.parseOptions = exports.mode = void 0;
var mode;
(function (mode) {
    mode[mode["gameplay"] = 0] = "gameplay";
    mode[mode["info"] = 1] = "info";
    mode[mode["debug"] = 2] = "debug";
})(mode || (exports.mode = mode = {}));
class parseOptions {
    constructor(mode, variantID, input, flat_parse = false) {
        this.flat_parse = flat_parse;
        this.mode = mode;
        this.variantID = variantID;
        this.inputNumber = [];
        this.inputString = [];
        input.forEach(i => {
            if (typeof i == "string")
                this.inputString.push(i);
            else
                this.inputNumber.push(i);
        });
    }
}
exports.parseOptions = parseOptions;
class loadOptions {
    constructor(modulePath = "../module/", modules = ["qpOriginal"]) {
        this.modulePath = modulePath;
        this.modulesInUse = modules;
    }
}
exports.loadOptions = loadOptions;
const lib_parse_option = {
    preserveComments: false,
    preserveXmlDeclaration: false,
    preserveDocumentType: false,
    ignoreUndefinedEntities: false,
    includeOffsets: true,
    sortAttributes: false,
    preserveCdata: false,
};
exports.lib_parse_option = lib_parse_option;
