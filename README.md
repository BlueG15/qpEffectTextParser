# Custom variant of XML parser (for qp Remake)

## What it does
This is an XML parser specialized for qp effect texts. 

Is this overkill? Yes. 

Did i do it anyway? Also yes.

Anyway, this takes in an effect text in XML string and outputs an array of text displa objects so you dont have to deal with the XML bullshit.

This is open sourced, feel free to fork and stuff for personal project, I dont mind. Please do ask me for permission if you used it for commercial projects (doubt anyone will ngl, this sucks and there are better parsers on the market already).

## Features
1. Backwards compatible with qp's XML effect text format
2. Modular tags allows for easy expandability
3. Parse option in different situation that requries parsing (menu, gameplay, debug)
4. Variable tag input length ==NEW==
5. Variable injection at run time ==NEW==


## Syntax:

### 1. Normal XML syntax

Typical XMl syntaxes are supported, using the library by rgove at https://github.com/rgrove/parse-xml. Along side the short hand </> to close out the most recent tag. Note that CDATA and XML instructions are largely ignored and will be treated as text.

I do have an obsolete version i built myself but this is better

Sincere thank you to the library writer

### 2. Using variables

Certain tags can take in inputs from the effect itself when being parsed at runtime, which will be given in 2 arrays, 1 for numbers, 1 for string

Default for all is 0 or an empty string. Using an unset variable result in the "error value" for that type.

## All supported tags so far

### 1. Images or icon insertion

While in game, Jkong used the 1st line only. I expanded the tag system to allow for arbitrary URL under these 2 constaints:

1. All icons are shrunk down and truncated to a square that fits the line height.
2. Default output that displays when url not found is the broken image image (The special "You lose" image of chess), of course this default is injected when parsed
    
Of course this is only a parser so it cannot enforce both constraints, it can only help with constraint 2 in particular by a default injection.

```XML
<img id="icon id here"/>
<img url="url here">
```

The icon tag is an allias that does the exact same thing, I thought it's a more fitting tag name:

```XML
<icon id = "icon id here"/>
<icon url="url here"/>
```

### 2. Text section identifiers

Ima highlights a few special tags in this section before dumping a bunch identical ones on you.

First is the *key* tag. The *key* tag adds the highlight tag to the section inside of it. Highlights in normal qp is ussually yellow but any display engine can display however they want ngl.

If you are insering a keyword though, try using one of the short hand in the section following this one instead, its shorter and more understandable than calling 

```XML
<key>EXECUTE</>
```
every time

*key* tag usage:

```XML
<key>keyword_here</>
```

Next is the *physical* and *magic* marks the section as either magic or physical damage. 

One more note is that this **DOES NOT** auto adds the corresponding icon right after the tag. 

```XML
<physical>damage_number_here</> 
<magic>damage_number_here</> 
```

The adding of the icon **IS** a frequent operation however, so I added a new tag that does that

```XML
<physical2>damage_number_here</> 
<magic2>damage_number_here</> 
```

> Yeah real creative naming, I know

You get the gist of it. Here is a few more section identifiers:

```XML
<health>health_here</> 
<attack>attack_gain_here</>
<!-- usage : <attack><+1></> -->
<specialbuff>buff_here</>
```

Internally, these tas do nothing but add the tag itself to the section identifier array of the block inside them. 

These can be chained together to add multiple tags to a section. Though I added a special tag for specifically that for easier readability:

```XML
<tags ID = "... ... ...">text_here</>
```

Where ID is a space separated list of all the tags you want. *This is the only way to add custom tags so far.*

> Tags cannot be an empty string


### 3. Quick keyword insertion

To standardized, these will uppercased the text inside (if any), but otherwise acts as above

```XML
<void>VOID</>
<decompile>DECOMPILE</>
<pathed>PATHED</>
<expose>EXPOSE</>
<exec>EXECUTE</>
...
```

or these new shorthands

```XML
<void/>
<decompile/>
<decompiled/>
<pathed/>
<align/>
<exec/>
<exec-ed/>
<expose/>
<cover/>
```
which just returns their asociated keyword, uppercased
i.e <decompile/> will parsed into DECOMPILE

### 4. Variant marking 

What is a variant you asked? A while back I got fed up with jkong enemy name + a random string (ex : syncMarker1, timeBomb_h4_t3). It adds unneccesary bloats to the data.

To solve this, I made a whole variants system to cards and merge it with the upgrade system. Upgrade is now a variant of the card. 

A variant is defined as the same card (same original cardID), inheriting some aspects of the original card like card image and stuff. But with a different load parameter upon creation.

Card texts have the need to only display certain sections for specific variants, thus these tags are born.

> Special interjection here, each variants ***CAN*** have different card texts if specified. But I offer these tags in case one is lazy and want to write a one text fits all solution.

#### 4.1: Upgraded variant

```XML
<uadd>stuff_here</>
<uminus>stuff_here</>
```

*uadd* and *uminus* specifies the section only be displayed for the "Upgraded" variant. 

The difference between the two honestly is the usage where 

***uadd*** is texts where the "Upgraded" variant has and the original doesn't

***uminus*** is the reverse, texts where the "Upgraded" variant doesn't have but original do, i.e "Upgraded" removed a section of the effect.

Jkong used these only to encase a bracket cause his use case is different, his intended use for these 2 tags is things to be visible only in the display menu. For backwards compatibility, specifically these 2 syntaxes:

```XML
<uadd>[</> text_here <uadd>]</>

<uminus>[</> text_here <uminus>]</>
```

Will tell the parser to do 3 different things depending on the parse option

1. Gameplay mode:
    Checks the variant and outputs the correct behavior (add/remove the block or text in the middle), remove the bracket
2. Menu mode:
    As above but keeps the brackets
3. Debug mode:
    Returns the raw text

#### 4.2: Generic variant checking

```XML
<variantInclude variantID = "... ... ..."> stuff_here </>
<variantExclude variantID = "... ... ..."> stuff_here </>
```

where variantID is a space separeted list of all the variantID where this tag is applied

### 5. Reference insertion (***NOT IMPLEMENTED*** cause i havent linked this to the actual simulation yet)

Sometimes you would want to insert a reference to another card or another effect. Like a hyperlink. 

The parser allows this through these modules:

```XML
<referenceCard ID = ""/>
<refrenceEffect cID = "" eID = "">
```

### 6. Numeric expression parsing

A numeric expression is a space separated list of numbers, numeric variables and operators that returns a number

Examples: 
a == 0 ? a + 1 : b
a + b > 100 ? a : b * 5.1 + a 

A number is anything parsable by Number() of js
A numeric variable is denoted a, b, ... up to z, injected at runtime

List of allowed operators: 

- Numeric: + - * / .
- Logic connector: || &&
- Comparative: <= >= < > != ==
- Tri state: ... ? ... : ...
- Brackets: () [] {}

Quirks: 

- The . numberic operator is the round to precision operator, 3.141592654 . 2 parsed to 3.14 

- Comparative and logic connectors returns 0 if false, 1 if true

- Order of operation as normal, with ot prefers operations in the same tier in the order listed above

- A failed parsed will have error set to true and parsed to NaN

- Like js, not 0 is true, only 0 specifically is false

Syntax:
```XML
<numeric> expression_here </>
```

### 7. String expression parsing

A string expression is a space seprated list of string literal, string variables, numeric variables and operators that returns a string

+ A string literal must be encased in double quotes, it is reccomended the double quote itself is between 2 spaces, (though my code should work even if it isnt but I am not 100% sure)
  
+ A string variable is denoted A, B, C, ... up to Z, injected at run time
+ A numeric variable is denoted a, b, c, ... up to z, injected at run time

List of allowed operators: 

- Concatinate string: +
- Remove all substring if found: -
- Repeat string: *
- Slices front, back: << >> (think of these as shifts into the void)
- Pad Space front, back: > < (think of these as shifts but not into the void)
- Brackets () [] {}
- Tristate ... ? ... : ...
- Comparison == !=
- Logic connector: || &&

Quirks:

- A fail parse results in an empty string
  
- Comparison returns the first input on true and an empty string on false
  
- ? returns the first input if the condition check returns a non-empty string, the second otherwise.
  
- Numeric variables will be coerced into a string if needed

Syntax:
```XML
<string> expression_here </>
```

### 8. General if statement

You may want to bridge between the different expression types in an if statement.

Syntax:
```XML
<if type = "string" ><condition expression></><expression1></><expression2></></>
```

Type is a either number, string or auto, specifying the type for the condition expression


## Format for a module

### 1. Normal modules

Any modules should reside in the module folder, each is a class extending from ```mod.ts``` in ```./abstract``` folder

> abstract here is not really correct srictly speaking since these base classes do provide basic implementation plus some helper functions but eh, I like the term

Modules should override these three properties in its constructor:

```ts
cmdName : string[] = [];
requiredAttr : string[][] = [];
doCheckRequiredAttr = false;
```

Where 

```cmdName``` is an array of all commands this module offer

```requiredAttr``` is the an array of array of required attributes, it is reccomended that this array be of equal length to ```cmdName```, or else it will be truncate/padded with ```[]```

```doCheckRequireAttr``` enforces the checking of requiredAttr in the creation of an input object

Modules then need to override the evaluate function:

```ts
evaluate(
    cmd : string, 
    args: moduleInputObject, 
    option : parseOptions, 
    raw : string
) : nestedTree<component> {
    return [new component()] //default return 
}
```

where ```moduleInputObject``` is basically a map with methods ```getAttr```, ```hasAttr``` and ```getChildren```, see in ```moduleInputObject.ts``` also in ```./abstract```. This object gets created at run time and handle basic input verifications.

To support this input validation, modules can optionally override the method ```isValidAttr```, which will be called during input creation.

```ts
//may override, only triger if doCheckRequiredAttr is true
isValidAttr(
    cmdIndex : number, 
    attrName : string, 
    attr : string
){
    return true
}
```

The return type ```nestedTree<component>``` is basically any conbination of any level of nesting of component arrays, i.e component[], component[][] and so on.

A component is a display atom of sort, there are 6 types for now

+ icon
+ text
+ image
+ number
+ reference (to other in game data like field, cards, etc, unused for now)
+ and error, which is what the default type revert to without any extensions

You can see specific in ```component.ts``` in ```./abstract``` folder

This returned tree then replaces the inputs' spots in the XML parse tree

### 2. Module packs

Module packs are like mod packs basically, a mod pack extends from the class ```modPack``` located in the file with the same name in ```./abstract``` folder

Example of a mod pack is like this:

```ts
class qpOriginalPack extends modPack {
    constructor(){
        super()
        this.moduleArr = [
            new imgModule(),
            new sectionIDModule(),
            new uadduminusModule(),
            new variantCheckModule(),
            new tagsModule(),
            new numericModule(),
            new stringParseModule(),
            new genericIfModule(),
        ]
        this.loadModules()
    }
}

export default qpOriginalPack
```

Basically, you call ```super``` (which does absolutely nothing but js wants it), load up the ```moduleArr``` with what you want, then call ```loadModule()```, it should work from there

## Example usage

### Running the parser

Here is the example code running some test cases, located in ```main.ts```

```ts
let p = new parser()
await p.load(new loadOptions(undefined, ["qpOriginal"]))

let str = `test numeric: <if type = "number"><numeric> a + b > c </><string> A + B </><string> C + D </></>`
let str2 = `<string> A + B </><string> C + D </>`
let str3 = `<string> A + " I am a cat "</>`
let option = new parseOptions(mode.gameplay, "", [3.115926, -5, 50, "cat", "dog", "horse", "house"], true)
console.log(`parsing test1: `, p.parse(str, option))
console.log(`parsing test2: `,p.parse(str2, option))
console.log(`parsing test3: `,p.parse(str3, option))
```

Sadly, load is async so this chunk is gonna be a promise, which may be uncomfortable to work with. I currently cannot fix this since dynamic module loading returns a promise.

Basically, to use the parser, create a new parser, load it with some options, then call parse on your inputs.

Here are explanations of the option types, you can inspect them in ```options.ts``` in ```./abstract``` folder

#### 1. Load option
Load option creation has 2 params, in order is:
 
```modulePath``` ```type: string``` which path to load the modules

```moduleArr``` ```type: string[]``` which modules to load from that path

### 2. parse option
Parse option creation has 4 params, in order is:

```mode``` ```type: enum mode``` some modules behaves differently whether the effect text is in UI, gameplay or wanted to use debug mode to output something different.

```variantID``` ```type: string``` the variant of the card the effect text is on, used for the variant dicerning tags

```inputArr``` ```type: (string | number)[]``` the input array used for live value injection.

```doFlatParse``` ```type: boolean``` whether to flatten the tree after the parse, reccomended to keep at true to avoid weird nesting




### Input to all the test cases:
```[3.115926, -5, 50, "cat", "dog", "horse", "house"]```

This is interpreted as 
+ a = 3.115926
+ b = -5
+ c = 50
+ A = "cat"
+ B = "dog"
+ C = "horse"
+ D = "house"

### Test case 1

```XML
test generic if: <if type = "number"><numeric> a + b > c </><string> A + B </><string> C + D </></>
```

```js
[
  [
    textComponent {
      sectionIDs: [],
      id: 1,
      errorFlag: false,
      errorMsg: '',
      fromCmd: '',
      raw: 'test generic if: ',
      str: 'test generic if: '
    }
  ],
  [
    textComponent {
      sectionIDs: [],
      id: 1,
      errorFlag: false,
      errorMsg: '',
      fromCmd: 'string',
      raw: ' C + D ',
      str: 'horsehouse'
    }
  ]
]
```
a + b > c is false so the latter of the 2 is returned

### Test case 2

```XML
<string> A + B </><string> C + D </>
```

```js
[
  [
    textComponent {
      sectionIDs: [],
      id: 1,
      errorFlag: false,
      errorMsg: '',
      fromCmd: 'string',
      raw: ' A + B ',
      str: 'catdog'
    }
  ],
  [
    textComponent {
      sectionIDs: [],
      id: 1,
      errorFlag: false,
      errorMsg: '',
      fromCmd: 'string',
      raw: ' C + D ',
      str: 'horsehouse'
    }
  ]
]
```

### Test case 3

```XML
<string> A + " I am a cat "</>
```

```js
[
  [
    textComponent {
      sectionIDs: [],
      id: 1,
      errorFlag: false,
      errorMsg: '',
      fromCmd: 'string',
      raw: ' A + " I am a cat "',
      str: 'cat I am a cat'
    }
  ]
]
```


Made in 2025 by Blu~



