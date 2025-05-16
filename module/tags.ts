import { component, iconComponent, imageComponent, iconID, componentID, textComponent } from "../abstract/component";
import { mod } from "../abstract/mod";
import type moduleInputObject from "../abstract/moduleInputObject";
import type { parseOptions } from "../abstract/options";
import { nestedTree } from "../abstract/typesDef";

export default class tagsModule extends mod {

    override cmdName = ["tags"];
    override requiredAttr = [["ID"]];
    override doCheckRequiredAttr = true;

    private recurModify(tree : nestedTree<component>, sectionIDs : string[]) : void{
        tree.forEach(i => {
            if(i instanceof component) {
                i.addSectionID(sectionIDs)
            } else {
                this.recurModify(i, sectionIDs)
            };
        })
    }

    override evaluate(cmd: string, args: moduleInputObject, option: parseOptions, raw: string): nestedTree<component> {
        let IDs = (args.getAttr("ID") as string).split(" ")
        let final = args.getChilren()

        this.recurModify(final, IDs);

        return final
    }
}