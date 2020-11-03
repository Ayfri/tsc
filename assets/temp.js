"use strict";
class Ayfri {
    constructor(biteLength, wtf = "aaaa") {
        this.biteLength = biteLength;
        this.wtf = wtf;
        this.bite = { length: biteLength };
        this.whaaat(this.wtf);
    }
    whaaat(wow) { console.log(wow); }
}
const a = new Ayfri(15018, "MDRRRRRRRRR");
