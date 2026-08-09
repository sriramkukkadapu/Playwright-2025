//block of code
//var - global level scope
//let - block level scope

//var example - global
var greet = "evening";
if(12==12){
    var greet="afternoon";
}
console.log(greet);
//o/p evening

//let example - block scoped
var greet = "evening";
if(12==12){
    let greet="afternoon"; //this variable is only valid in this block.
}
console.log(greet);
//o/p afternoon

//const - same as let but final => value cannot be changed
const pi=3.14;
try{
pi=2.55; //=> this step is invalid because assigning to const variable
}
catch(e){
    console.log("Invalid operation: "+e.message + " is not supported");
}

