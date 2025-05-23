import { component, iconComponent, imageComponent, iconID} from "../abstract/component";
import { mod } from "../abstract/mod";
import type moduleInputObject from "../abstract/moduleInputObject";
import type { parseOptions } from "../abstract/options";

export default class imgModule extends mod {

    override cmdName = ['img', 'icon'];
    override requiredAttr = [[], []];
    override doCheckRequiredAttr = false;

    private getIconID(key : string) : [iconID, boolean] {
        let k = key as keyof typeof iconID;
        let x = iconID[k];
        if(!x) return [iconID.crash, false];
        return [x, true];
    }

    override evaluate(cmd: string, args: moduleInputObject, option: parseOptions, raw: string): component[] {
        let isInIconMode = false
        
        let str = args.getAttr('id');
        if(str) isInIconMode = true;
        else str = args.getAttr('url');
        if(str) isInIconMode = false;
        else return []

        if(isInIconMode){
            let [iconID, isCorrect] = this.getIconID(str);
            return [
                new iconComponent(iconID, isCorrect ? undefined : `Wrong iconID, received = ${str}`, cmd, raw)
            ]
        } else {
            return [
                new imageComponent(str, undefined, cmd, raw)
            ]
        }
        
    }
}