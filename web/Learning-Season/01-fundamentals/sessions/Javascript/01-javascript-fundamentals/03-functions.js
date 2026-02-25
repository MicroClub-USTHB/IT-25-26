function sayHello() {
  console.log("hello mc ");
}
sayHello();

function sayHelloWithParametar(name, age) {
  console.log("hello " + name);
  console.log("age " + age);
}
sayHelloWithParametar("ahmed", 23);

const sayHello2 = () => {
  console.log("hello ");
};
const sayHello3 = function () {
  console.log("hello ");
};
sayHello2();
sayHello3();

function sum(number1, number2) {
  return number1 + number2;
}
let sum2 = sum(3, 5);
console.log(sum2);

function add2(a, b) {
  console.log("HI");
  return a + b;
}
console.log(add2(3, 4));
