let day = "tuesday";
console.log("length: "+day.length);
console.log("slice: "+day.slice(0,4));
console.log(day[1]);
// split into two strings tue & day
let two_strings = day.split("s");
console.log(two_strings[0]);
console.log(two_strings[1]);
day = "tuesday ";
console.log(day.trim());

let date = '23'
let nextDate = '27'
let diff = parseInt(nextDate) - parseInt(date);
console.log("Diff b/w date & next date: "+diff)
console.log("Diff as string: "+diff.toString());

let newQote = day + " is funday a happy day";
console.log("concatenated string: "+newQote);
let val = newQote.indexOf("day")
console.log(val);
val = newQote.indexOf("day",5) //start searching from index 5
console.log(val);

//find occurances of a string in a sentence like day in above example
val = 0;
let count=0;
val = newQote.indexOf("day");
while(val!==-1){
    count++;
    val = newQote.indexOf("day",val+1); //start searching from next index
}

console.log("no of times day present: "+count);
