let a = {a1: 'a1'};
let {a1: b} = a;
console.log(b);

// convert to (TypeScript => es5)
// var a = { a1: 'a1' };
// var b = a.a1;
// console.log(b);