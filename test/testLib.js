const { parseXml } = require('@rgrove/parse-xml');


//NOTE : improper close such as </>
//Is not intended

// </> is only allowed to close the latest tag

const str = "<key>SyncA</> <key2>SyncB</>"

function recurTryParse(str, inRecur = false){
    if(!inRecur){
        str = `<document>${str}</document>`;
    }

    try{
        //the lib wraps everything in a layer so we need to extract that layer
        return parseXml(str).children[0]
    } catch(err){
        if( 
            err.message.startsWith("Missing end tag") && 
            str.slice(err.pos, err.pos + 3) == "</>"
        ){
            //correct condition to replace
            let pre = str.slice(0, err.pos);
            let post = str.slice(err.pos + 3);

            let k = err.message.indexOf("(line");
            if(k == -1) throw err;
            let cTag = err.message.slice(28, k-1);
            return recurTryParse(pre + `</${cTag}>` + post, true);
        }
        else throw err
    }
}


let _str = "<cat/>"
let res = recurTryParse(_str)
console.log(JSON.stringify(res, null, 4))

