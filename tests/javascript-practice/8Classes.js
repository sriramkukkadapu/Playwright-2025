// Classes is introduced in JS from ES6 only.

class Person{
    age=25;

    //we can add a getter method
    get location(){
        return "canada"
    }
}
let person = new Person();
console.log(person.age);
console.log(person.location); //no need of () as it is a getter

