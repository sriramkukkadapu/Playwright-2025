const flag=true

if(flag){
    console.log(flag)
    console.log("condition satisfied")
}
else{
    console.log(flag)
    console.log("condition not satisfied")
}

console.log("-------while---------")
var i=0;
while(i<10){
    console.log("i: "+i);
    i++;
}

console.log("-------do while---------")
var i=10;
do{
  console.log("i: "+i);
    i++;
}while(i<10);

console.log("-------for loop--------")
for(var i=1;i<10;i++){
    console.log("i(forloop): "+i);
}

console.log("------from 1-10 find common multiples of 2&5")
for(var i=1;i<10;i++){
    if(i%2==0 || i%5==0){
        console.log(i);
    }
}
