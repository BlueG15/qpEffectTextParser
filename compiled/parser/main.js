"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_xml_1 = require("@rgrove/parse-xml");
const parse_xml_2 = require("@rgrove/parse-xml");
const component_1 = require("../abstract/component");
const mod_1 = require("../abstract/mod");
const options_1 = require("../abstract/options");
class parser {
    //[module index, command index]
    constructor() {
        this.loaded = false;
        this.moduleArr = [];
        this.moduleMap = new Map();
    }
    //
    load(l) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = l.modulePath;
            if (!path.endsWith("/"))
                path += "/";
            console.log(`load triggered, ab to load ${l.modulesInUse.length} modules`);
            for (let x = 0; x < l.modulesInUse.length; x++) {
                let i = l.modulesInUse[x];
                //start dynamic importing
                let moduleClass = yield Promise.resolve(`${path + i}`).then(s => __importStar(require(s)));
                if (!moduleClass || !moduleClass.default) {
                    console.warn(`WARN: Cannot import module ${i} in path ${path + i}`);
                }
                else {
                    let moduleInstance = new moduleClass.default();
                    //test malformed module
                    if (!(moduleInstance instanceof mod_1.mod)) {
                        console.warn(`WARN: file ${path + i} is not a module, skipped`);
                    }
                    else {
                        if (moduleInstance.requiredAttr.length != moduleInstance.cmdName.length) {
                            console.warn(`WARN: module ${i} is malformed: paramName and cmdName length does not matched up, auto filled with empty arrays`);
                            while (moduleInstance.cmdName.length > moduleInstance.requiredAttr.length) {
                                moduleInstance.requiredAttr.push([]);
                            }
                        }
                        let k = this.moduleArr.length;
                        this.moduleArr.push(moduleInstance);
                        moduleInstance.cmdName.forEach((n, index) => {
                            //if repeated keys appear, take the latter
                            if (this.moduleMap.has(n)) {
                                let [oldModuleNumber, _] = this.moduleMap.get(n);
                                let oldName = l.modulesInUse[oldModuleNumber];
                                if (oldModuleNumber == k) {
                                    console.warn(`WARN: Module ${oldName} has duplicate command : ${n}`);
                                }
                                else
                                    console.warn(`WARN: Repeated commands in multiple modules found, cmd = ${n}, originally from ${oldName}, currently override to use from module ${i}`);
                            }
                            this.moduleMap.set(n, [k, index]);
                            console.log(`loaded cmd ${n} from module ${i}`);
                        });
                    }
                }
            }
            this.loaded = true;
        });
    }
    parse_internal_lib_level(str, inRecur = false, escapedCharLimit = str.length) {
        if (!inRecur) {
            str = `<document>${str}</document>`; //if i dont do this, it doesnt work
        }
        try {
            //the lib wraps everything in a layer so we need to extract that layer
            return (0, parse_xml_1.parseXml)(str, options_1.lib_parse_option).children[0];
        }
        catch (err) {
            if (err.message.startsWith("Missing end tag")) {
                let temp = err.message.indexOf("(line");
                if (temp == -1)
                    throw err;
                let cTag = err.message.slice(28, temp - 1);
                let pre = str.slice(0, err.pos);
                let post = str.slice(err.pos + 1);
                const properClose = `</${cTag}>`;
                const properOpen = `<${cTag}>`;
                const errorChar = str[err.pos];
                const escapedChar = `&#${errorChar.charCodeAt(0)};`;
                //situation patchfix 1: allowing </> as a universal end tag
                //by repllacing </> with the proper close tag 
                const flag1 = str.slice(err.pos, err.pos + 3) === "</>";
                if (flag1) {
                    post = str.slice(err.pos + 3);
                    return this.parse_internal_lib_level(pre + properClose + post, true, escapedCharLimit); //reparse
                }
                //situation patchfix 2: escape the character that fails to parse
                //try replacing the problematic character with its XML entity
                if (escapedCharLimit <= 0)
                    throw err;
                return this.parse_internal_lib_level(pre + escapedChar + post, true, escapedCharLimit - 1);
            }
            throw err;
        }
    }
    parse_internal_loader_level_node(originalXML, tree, o, children) {
        const cmd = tree.name;
        if (this.moduleMap.has(cmd)) {
            const [moduleIndex, cmdIndex] = this.moduleMap.get(cmd);
            const module = this.moduleArr[moduleIndex];
            const inputObj = module.generateInputObj(cmdIndex, tree.attributes, children);
            if (!inputObj) {
                //incorrect input
                const errMes = `Failed to parse input for module ${cmd}, tried to parse attributes: ${JSON.stringify(tree.attributes, null, 0)}, required attributes = ${JSON.stringify(module.requiredAttr[cmdIndex], null, 0)}, reverting to text node`;
                console.warn(errMes);
                return [new component_1.textComponent(tree.text, errMes, cmd, tree.text)];
            }
            return module.evaluate(cmd, inputObj, o, tree.text);
        }
        else {
            const errMes = `WARN: unknown module, tried to invoke ${cmd}, reverting to a text node`;
            console.warn(errMes);
            return [new component_1.textComponent(tree.text, errMes, cmd, tree.text)];
        }
    }
    parse_internal_loader_level(originalXML, tree, o) {
        if (tree instanceof parse_xml_2.XmlProcessingInstruction) {
            //undefined behavior?
            //idk what this shit is???
            const errMes = `WARN: XML processing instruction not supported (trying to parse instuction name = ${tree.name}, content = ${tree.content}), reverting to text node`;
            console.warn(errMes);
            return [new component_1.textComponent(originalXML.slice(tree.start, tree.end), errMes, undefined, originalXML.slice(tree.start, tree.end))];
        }
        else {
            if (!tree.children || !tree.children.length) {
                //base case
                if (tree.type == "text") {
                    return [new component_1.textComponent(tree.text, undefined, undefined, tree.text)];
                }
                return this.parse_internal_loader_level_node(originalXML, tree, o, []);
            }
            const deeperParse = tree.children.map((i) => this.parse_internal_loader_level(originalXML, i, o));
            return this.parse_internal_loader_level_node(originalXML, tree, o, deeperParse);
        }
    }
    recur_flat_tree(tree) {
        let r = [];
        tree.forEach(i => {
            if (i instanceof component_1.component)
                r.push(i);
            else
                r.push(...this.recur_flat_tree(i));
        });
        return r;
    }
    parse(XML, o) {
        if (!this.loaded) {
            throw `Parser did not finish loading modules, call load() first`;
        }
        const tree = this.parse_internal_lib_level(XML);
        if (!tree.children || !tree.children.length)
            return [];
        const parsedTree = tree.children.map(i => this.parse_internal_loader_level(XML, i, o));
        if (o.flat_parse) {
            return this.recur_flat_tree(parsedTree);
        }
        else
            return parsedTree;
    }
    debug_parse(XML) {
        return this.parse_internal_lib_level(XML);
    }
}
exports.default = parser;
