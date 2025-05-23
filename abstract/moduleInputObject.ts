import type { component } from "./component";
import type { nestedTree } from "./typesDef";

export default class moduleInputObject {
    private paramMap : Map<string, string> = new Map()
    private chilren : nestedTree<component>
    constructor(attrObj : {[attr : string] : string}, children : nestedTree<component>){
        Object.keys(attrObj).forEach(i => {
            this.paramMap.set(i, attrObj[i])
        })
        this.chilren = children
    }
    hasAttr(key : string){
        return this.paramMap.has(key) && this.paramMap.get(key) != undefined
    }
    getAttr(key : string){
        return this.paramMap.get(key)
    }
    getChilren(){
        return this.chilren
    }
}