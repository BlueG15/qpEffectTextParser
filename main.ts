import parser from "./parser/main";
import allEffectText from "./test/allEffectText";
import { loadOptions, parseOptions, mode } from "./abstract/options";
// import fs from "fs"


async function main() {
    let p = new parser()
    await p.load(new loadOptions(undefined, ["qpOriginal"]))

    let str = `test numeric: <if type = "number"><numeric> a + b > c </><string> A + B </><string> C + D </></>`
    let str2 = `<string> A + B </><string> C + D </>`
    let str3 = `<string> A + " I am a cat "</>`
    let option = new parseOptions(mode.gameplay, "", [3.115926, -5, 50, "cat", "dog", "horse", "house"], false)
    console.log(`parsing test1: `, p.parse(str, option))
    console.log(`parsing test2: `,p.parse(str2, option))
    console.log(`parsing test3: `,p.parse(str3, option))
    //console.log("debugMode: ", JSON.stringify(p.debug_parse(str), null, 4))
}

main()

// fs.writeFileSync("D:/.ts testing chamber/effectTextParser/test/.JSON", JSON.stringify(a, null,4))