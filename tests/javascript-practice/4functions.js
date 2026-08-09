// function to add 2 numbers
function add(a,b){
    return a+b;
}

console.log(add(2,3));

//anonymous functions => without name
var sumOfIntegers = function (a,b){
    return a+b
}
console.log(sumOfIntegers(2,3));

//anonymous functions simplified with => 
var diffOfIntegers = (a,b) => a-b;
console.log(diffOfIntegers(2,3));
