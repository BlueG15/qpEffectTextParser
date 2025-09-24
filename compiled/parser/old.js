"use strict";
//ok this file is just a bunch of regex, ready yourself
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
//All the matches below have been tweaked to hopefully dont overlap
//...except the ones am not smart enough to engineer to do so, i will have notes
const singularTagPureStringInside = new RegExp(
//this matches a singular tag with just string inside
//we support 2 syntaxes:
//<tag> asdhcguigcigyucgucgygc </>
// or
//<tag>   "aaaaaa"    </>
//of course style 1 doesnt allow special characters, specically < and >
// this is just a mashed version of the two
//I have engineered more to accept lone < and > as string literals instead of XML brackets
/<([\w\d_\.-]+)>(([^<>\n\r]+)|([^<>\n\r]+.?(<|>).?[^<>\n\r]+)+)<\/>|<([\w\d_\.-]+)>\s*"([^\n\r]*)"\s*<\/>/, "g");
const shortTag = new RegExp(
//this matches <tag/>
/<[\w\d_\.-]+\/>/, "g");
const shortTagWithParam = new RegExp(
//this matches <tag param1="sssss" param2="dddd"/>
/<([\w\d_\.-]+)(?:\s([\w\d_\.-]+)\s?=\s?"([^"\n\r]*)")+\/>/, "g");
const tagWithParamChaining = new RegExp(
//this matches <tag><"aaaaaaaaaa">< sssssssss ></>
//matches from the first <tag> to teh first </>
//ungreedy without ungreedy tag lmao, by specifically excluding the case where </> appears in the middle
/<[\w\d_\.-]+>\s*(<[^\/\n\r]*>|<"[^\n\r]*">|<[^<>\n\r]{2,}>\s*)*<\/>(?![^<>]*<\/>)|<[\w\d_\.-]+><\/>/, "g");
const specialChecksFor_uadd_uminus = new RegExp(/<uadd>\[<\/>[^<>\/\n\r]*<uadd>\]<\/>|<uminus>\[<\/>[^<>\/\n\r]*<uminus>\]<\/>/, "g");
const magicRegex = new RegExp(/<([\w\d_\.-]+)(?:\s([\w\d_\.-]+)\s?=\s?"([^"\n\r]*)")+\/>|<[\w\d_\.-]+\/>|<([\w\d_\.-]+)>(([^<>\n\r]+)|([^<>\n\r]+.?(<|>).?[^<>\n\r]+)+)<\/>|<([\w\d_\.-]+)>\s*"([^\n\r]*)"\s*<\/>|<[\w\d_\.-]+>\s*(<[^\/\n\r]*>|<"[^\n\r]*">|<[^<>\n\r]{2,}>\s*)*<\/>(?![^<>]*<\/>)|<[\w\d_\.-]+><\/>|<uadd>\[<\/>[^<>\/\n\r]*<uadd>\]<\/>|<uminus>\[<\/>[^<>\/\n\r]*<uminus>\]<\/>/, "g");
/* Test code
function evaluate(cmd : string, params : string[]){
    return "CMD = " + cmd + "____" + ((params.length) ? "Param = [ " + Object.entries(params).join("__|__|__") + " ]" : "No_Param");
}

const paramNames = ["param1", "param2", "a", "b"]
function getParamIndex(name : string, currentIndex : number){
    let k = paramNames.indexOf(name);

    console.log("Got param index trigger for param name = `" + name + "`")
    return k == -1 ? currentIndex : k;
}



const str1 = "The total current value of the counter is <numeric>a + b > 5 ? a + b : a - b</>"
const str2 = "This tests tags in tags, it should match the inner most level tag: <key><uadd>Test</></>"
const str3 = "This tests short hand tags, it shoudl match all of them <exec/> <new/> <important/>"
const str4 = `This tests tags with params, short form <testTag a="aaaaa" b = bbbbb/>`
const str5 = "This tests tag that uses param chaining <chain><param1 aaaaaa> <param2 bbbbb></>"
console.log(parse(str5))
*/
const component_1 = require("../abstract/component");
const module_1 = require("../abstract/module");
const options_1 = require("../abstract/options");
class parser {
    //[module index, command index]
    constructor() {
        this.loaded = false;
        this.MAX_ITERATION = 1000;
        this.moduleArr = [];
        this.moduleMap = new Map();
    }
    load(l) {
        return __awaiter(this, void 0, void 0, function* () {
            this.MAX_ITERATION = l.MAX_PARSE_ITERATION;
            let path = l.modulePath;
            if (!path.endsWith("/"))
                path += "/";
            l.modulesInUse.forEach((i) => __awaiter(this, void 0, void 0, function* () {
                //start dynamic importing
                let moduleClass = yield Promise.resolve(`${path + i}`).then(s => __importStar(require(s)));
                if (!moduleClass || !moduleClass.default) {
                    console.warn(`WARN: Cannot import module ${i} in path ${path + i}`);
                }
                else {
                    let moduleInstance = moduleClass.default();
                    //test malformed module
                    if (!(moduleInstance instanceof module_1.module)) {
                        console.warn(`WARN: file ${path + i} is not a module, skipped`);
                    }
                    else {
                        if (moduleInstance.paramName.length != moduleInstance.cmdName.length) {
                            console.warn(`WARN: module ${i} is malformed: paramName and cmdName length does not matched up, skipped`);
                        }
                        else {
                            let k = this.moduleArr.length;
                            this.moduleArr.push(moduleInstance);
                            moduleInstance.cmdName.forEach((n, index) => {
                                //if repeated keys appear, take the latter
                                if (this.moduleMap.has(n)) {
                                    console.warn(`WARN: Repeated commands in multiple modules found, cmd = ${n}, currently override to use from module ${i}`);
                                }
                                this.moduleMap.set(n, [k, index]);
                            });
                        }
                    }
                }
            }));
            this.loaded = true;
        });
    }
    paramNameToIndex(cmd, name, cIndex) {
        let x = this.moduleMap.get(cmd);
        if (!x)
            return cIndex;
        let k = this.moduleArr[x[0]].paramName[x[1]].indexOf(name);
        if (k < 0)
            return cIndex;
        return k;
    }
    evaluate_internal(cmd, param, p, raw, key, cache) {
        let x = this.moduleMap.get(cmd);
        let errMsg = `MODULE NOT EXIST: Trying to load command ${cmd} with params = ${JSON.stringify(param, null, 0)}`;
        if (!x) {
            return (p.mode == options_1.mode.debug) ? [new component_1.component(component_1.componentID.error, errMsg, cmd, raw)] : [new component_1.textComponent(raw, errMsg, cmd, raw)];
        }
        let moduleArrInput = [];
        param.forEach(i => {
            if (typeof i == "string") {
                let a = cache.get(i);
                if (a)
                    moduleArrInput.push(a);
                else
                    moduleArrInput.push([new component_1.textComponent(i, undefined, undefined, raw)]);
            }
            else {
                moduleArrInput.push(i);
            }
        });
        let input = this.moduleArr[x[0]].generateInputObj(x[1], moduleArrInput);
        if (!input)
            return [
                new component_1.component(component_1.componentID.error, `Input generation failed for command ${cmd}, params: ${param.join(", ")}`, cmd, raw)
            ];
        let res = this.moduleArr[x[0]].evaluate(cmd, input, p, raw);
        if (!res.length)
            return [
                new component_1.component(component_1.componentID.error, `Parsed failed for cmd ${cmd}, probably wrong param`, cmd, raw)
            ];
        return res;
    }
    getNoRepeatSubstringKey(originalXML) {
        if (!originalXML.length)
            return "a";
        let cache = new Map();
        let min = Infinity;
        let minLetter = originalXML[0];
        const checkCharacters = [..."abcdefghijklmnopqrstuvwxxyyzABCDEFGHIJKLMNOPQRSTUVWXXYZ"];
        originalXML.split("").forEach(i => {
            if (checkCharacters.includes(i)) {
                let x = cache.get(i);
                if (x) {
                    cache.set(i, x + 1);
                    if (x + 1 < min || i == minLetter) {
                        min = x + 1;
                        minLetter = i;
                    }
                }
                else {
                    cache.set(i, 0);
                    min = 0;
                    minLetter = i;
                }
            }
        });
        return minLetter.repeat(min + 1);
    }
    cacheInsertion(res, key, cache) {
        let final = [];
        let i = res.indexOf(`"${key}_`);
        while (i != -1) {
            let i2 = res.indexOf(`${key}_"`, i);
            let accessKey = res.slice(i, i2 + key.length + 2);
            let x = cache.get(accessKey);
            if (i != 0) {
                let pre = res.slice(0, i);
                final.push(new component_1.textComponent(pre, undefined, undefined, pre));
            }
            if (x) {
                final.push(...x);
            }
            res = res.slice(i2 + key.length + 2);
            i = res.indexOf(`"${key}_`);
        }
        return final;
    }
    parse_internal(XML, p, key, cache, iterG = 0) {
        let matches = XML.match(magicRegex);
        if (!matches || !matches.length || iterG > this.MAX_ITERATION)
            return XML;
        let final = XML;
        let count = iterG;
        matches.forEach((i, index) => {
            let index_start = final.lastIndexOf(i);
            let len = i.length;
            let prePart = final.slice(0, index_start);
            let postPart = final.slice(index_start + len);
            if (shortTag.test(i)) {
                let re = this.evaluate_internal(i.slice(1, -2), [], p, i, key, cache);
                let accessKey = `"` + key + "_" + (count + index) + key + `_"`;
                cache.set(accessKey, re);
                final = prePart + accessKey + postPart;
            }
            else if (shortTagWithParam.test(i)) {
                let k = i.indexOf(" ");
                let k2 = -1;
                let k3 = -1;
                let cIndex = 0;
                let params = [];
                let cmd = i.slice(1, k);
                let iter = 0;
                while (k != -1 && iter < this.MAX_ITERATION) {
                    let k4 = i.indexOf("=", k);
                    k2 = i.indexOf(`"`, k4);
                    k3 = i.indexOf(`"`, k2 + 1);
                    let paramName = i.slice(k + 1, k4).trim();
                    let paramContent = i.slice(k2 + 1, k3);
                    cIndex = this.paramNameToIndex(cmd, paramName, cIndex);
                    params[cIndex] = paramContent;
                    cIndex++;
                    k = i.indexOf(" ", k3);
                    iter++;
                }
                let re = this.evaluate_internal(cmd, params, p, i, key, cache);
                let accessKey = `"` + key + "_" + (count + index) + key + `_"`;
                cache.set(accessKey, re);
                final = prePart + accessKey + postPart;
            }
            else if (tagWithParamChaining.test(i)) {
                let k = i.indexOf(">");
                let k2 = -1;
                let cIndex = 0;
                let params = [];
                let cmd = i.slice(0, k);
                let iter = 0;
                while (true && iter < this.MAX_ITERATION) {
                    k2 = i.indexOf(`>`, k + 1);
                    if (i[k2 - 1] == "/" && i[k2 - 2] == "<")
                        break;
                    let paramContent = i.slice(k + 2, k2);
                    params[cIndex] = paramContent;
                    cIndex++;
                    k = i.indexOf("<", k2);
                    iter++;
                }
                let re = this.evaluate_internal(cmd, params, p, i, key, cache);
                let accessKey = `"` + key + "_" + (count + index) + key + `_"`;
                cache.set(accessKey, re);
                final = prePart + accessKey + postPart;
            }
            else if (singularTagPureStringInside.test(i)) {
                let k = i.indexOf(">");
                let cmd = i.slice(1, k);
                let k2 = i.indexOf("</>");
                let paramContent = i.slice(k + 1, k2).trim();
                if (paramContent.startsWith(`"`) && paramContent.endsWith(`"`) && !paramContent.startsWith(`"${key}_`))
                    paramContent = paramContent.slice(1, -1);
                let params = this.cacheInsertion(paramContent, key, cache);
                let re = this.evaluate_internal(cmd, [params], p, i, key, cache);
                let accessKey = `"` + key + "_" + (count + index) + key + `_"`;
                cache.set(accessKey, re);
                final = prePart + accessKey + postPart;
            }
            else if (specialChecksFor_uadd_uminus.test(i)) {
                let cmd;
                if (i.startsWith("<uadd>"))
                    cmd = "uadd";
                else
                    cmd = "uminus";
                let k = i.indexOf("</>");
                let paramContent = i.slice(k + 3, -(k + 3));
                if (paramContent.startsWith(`"`) && paramContent.endsWith(`"`) && !paramContent.startsWith(`"${key}_`))
                    paramContent = paramContent.slice(1, -1);
                let params = this.cacheInsertion(paramContent, key, cache);
                let re = this.evaluate_internal(cmd, [params], p, i, key, cache);
                let accessKey = `"` + key + "_" + (count + index) + key + `_"`;
                cache.set(accessKey, re);
                final = prePart + accessKey + postPart;
            }
            else {
                final = prePart + i + postPart;
            }
        });
        return this.parse_internal(final, p, key, cache, iterG + 1);
    }
    parse(XML, p) {
        if (!this.loaded) {
            throw "Parser did not finish loading modules, call load() first";
        }
        let key = this.getNoRepeatSubstringKey(XML);
        let cache = new Map();
        let res = this.parse_internal(XML, p, key, cache);
        return this.cacheInsertion(res, key, cache);
    }
    matchMagicRegex(XML) {
        var _a;
        return (_a = XML.match(magicRegex)) !== null && _a !== void 0 ? _a : [];
    }
}
exports.default = parser;
