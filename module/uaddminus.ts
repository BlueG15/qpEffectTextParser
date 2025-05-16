import { component, iconComponent, imageComponent, iconID, componentID, textComponent } from "../abstract/component";
import { mod } from "../abstract/mod";
import type moduleInputObject from "../abstract/moduleInputObject";
import { parseOptions, mode } from "../abstract/options";
import { nestedTree } from "../abstract/typesDef";

export default class uadduminusModule extends mod {

    override cmdName = ['uadd', 'uminus'];
    override requiredAttr = [[], []];
    override doCheckRequiredAttr = false; 

    private recurModify(tree : nestedTree<component>, sectionID : string) : void{
        tree.forEach(i => {
            if(i instanceof component) {
                i.addSectionID(sectionID)
            } else {
                this.recurModify(i, sectionID)
            };
        })
    }

    override evaluate(cmd: string, args: moduleInputObject, option: parseOptions, raw: string): nestedTree<component> {
        
        let k = args.getChilren()

        if(option.mode == mode.debug) 
            return k
            
        //remove bracket by default
        
        let upgradeFlag = option.variantID.toLowerCase().includes("upgrade")
        if((upgradeFlag && cmd == "uminus") || (!upgradeFlag && cmd == "uadd")){
            return []
        }
        
        if(option.mode == mode.info){
            k = [
                [new textComponent("[", undefined, cmd, raw)],
                k,
                [new textComponent("]", undefined, cmd, raw)]
            ]
        }

        this.recurModify(k, cmd)

        return k
    }
}