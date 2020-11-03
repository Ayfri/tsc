class A<T> {
	readonly #a: T;
	
	public constructor(a: T) {
		this.#a = a;
	}
	
	public get a() {
		return this.#a;
	}
}

const b: A<string> = new A<string>('bite');
console.log(b.a);
