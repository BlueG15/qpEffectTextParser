"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./parser/main"));
const options_1 = require("./abstract/options");
// import fs from "fs"
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let p = new main_1.default();
        yield p.load(new options_1.loadOptions(undefined, ["qpOriginal"]));
        let str = `test numeric: <if type = "number"><numeric> a + b == c </><string> A + B </><string> C + D + D </></>`;
        let str2 = `<string> A + B </><string> C + " " +    D </>`;
        let str3 = `<string> A + " I am a cat "</>`;
        let str4 = `1 < 2 is a fact, by extension, 1 <= 2 is also a fact`;
        let str5 = `" 2 << 100 "`;
        let option = new options_1.parseOptions(options_1.mode.gameplay, "", [3.115926, -5, 50, "cat", "dog", "horse", "house"], false);
        // console.log(`parsing test1: `, p.parse(str,  option))
        console.log(`parsing test2: `, p.parse(str2, option));
        // console.log(`parsing test3: `, p.parse(str3, option))
        // console.log(`parsing test4: `, p.parse(str4, option))
        // console.log(`parsing test5: `, p.parse(str5, option))
        //console.log("debugMode: ", JSON.stringify(p.debug_parse(str), null, 4))
    });
}
main();
// fs.writeFileSync("D:/.ts testing chamber/effectTextParser/test/.JSON", JSON.stringify(a, null,4))
