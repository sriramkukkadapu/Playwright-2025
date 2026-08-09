let person = {
    firstName : "Tom",
    lastName : "Holland",
    age: 24
}

console.log(person.firstName);
console.log(person['lastName']);
person.firstName = 'Peter';
console.log(person.firstName);

//add a new property to the gender
person.gender = 'Male';
console.log(person);
console.log('gender' in person);

//delete a property in the object
delete person.gender;
console.log(person);
console.log('gender' in person);

//iterate through all properties in object
for(var key in person){
    console.log(key+": "+person[key]);
}

// we can also add functions to objects
person = {
    firstName : "Tom",
    lastName : "Holland",
    age: 24,
    fullName: function (){
        return this.firstName+" "+this.lastName
    }
}

console.log(person.fullName());
