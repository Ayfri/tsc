"use strict";
class A {
    constructor(a) { this.#a = a; }
    #a;
    get a() { return this.#a; }
}
const b = new A("bite");
console.log(b.a);
