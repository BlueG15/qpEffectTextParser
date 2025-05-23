import { component, iconComponent, imageComponent, iconID, componentID, textComponent } from "../abstract/component";
import { mod } from "../abstract/mod";
import type moduleInputObject from "../abstract/moduleInputObject";
import type { parseOptions } from "../abstract/options";
import { nestedTree } from "../abstract/typesDef";

export default class sectionIDModule extends mod {

    private quickKeyword = ['void', 'decompile', 'decompiled', 'pathed', 'expose', 'exec', 'exec-ed', 'align', 'cover']
    private normalKeyword = ['key', 'physical', 'magic', 'health', 'attack', 'specialbuff']
    
    override cmdName = [
        ...this.normalKeyword,
        ...this.quickKeyword,     
        'physical2', 'magic2', 
    ];
    override requiredAttr = new Array(this.cmdName.length).fill([]);
    override doCheckRequiredAttr = false;

    private recurModify(tree : nestedTree<component>, sectionID : string, upperCase : boolean) : void{
        tree.forEach(i => {
            if(i instanceof component) {
                i.addSectionID(sectionID)
                if(i.id == componentID.text && upperCase){
                    (i as textComponent).str = (i as textComponent).str.toUpperCase();
                }
            } else {
                this.recurModify(i, sectionID, upperCase)
            };
        })
    }

    override evaluate(cmd: string, args: moduleInputObject, option: parseOptions, raw: string): nestedTree<component> {
        let quickFlag = this.quickKeyword.includes(cmd)
        let pastFlag = false
        let addIconFlag = cmd.endsWith('2')

        let x = cmd
        if(x == "exec-ed") {x = "exec"; pastFlag = true}
        else if(x == "decompiled"){x = "decompile", pastFlag = true}

        if(addIconFlag) x = x.slice(0, -1);
        

        let final = args.getChilren()

        if(quickFlag && !final.length){
            //special behavior
            if(x == "exec") x = "execute"
            if(pastFlag) x += "d"
            x = x.toUpperCase()
            return [
                new textComponent(
                    x, undefined, cmd, raw
                )
            ]
        }

        this.recurModify(final, x, quickFlag);
        
        if(addIconFlag){
            final = [final, [new iconComponent(
                (x == "physical") ? iconID.dmg_phys : iconID.dmg_magic,
                undefined,
                cmd, 
                raw
            )]]
        }
        return final
        
    }
}