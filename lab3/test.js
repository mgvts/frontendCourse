function Foo(n) {
  this.nn = n
}
Foo.prototype.valueOf = function () {return this.nn}

console.log(new Foo(1))