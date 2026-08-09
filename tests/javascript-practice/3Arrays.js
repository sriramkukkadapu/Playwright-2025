var marks = Array(6);
marks = new Array(35,70,65,78,99,45);
marks = [35,70,65,78,99,46];
console.log(marks);
console.log(marks[2]);
marks[2]=89;
console.log(marks);
console.log("Total Subjects: "+marks.length);
marks.push(30);
console.log(marks);
marks.pop();
console.log(marks);
marks.unshift(12);
console.log(marks);
console.log(marks.indexOf(12));
console.log(marks.includes(12));
console.log(marks.includes(120));

subMarks = marks.slice(2,6);
console.log(subMarks);

//find total marks
var sum=0;
for(var i=0;i<marks.length;i++){
    sum=sum+marks[i];
}
console.log(marks);
console.log("Total marks: "+sum);


//reduce filter map
// reduce
sum=0;
var sum_reduce = marks.reduce((sum,mark) => sum+mark, 0) //0 is initial value of sum, mark keeps changing
console.log("sum (using reduce): "+sum_reduce)

//filter - filter even numbers from array
var scores = [12,13,14,16];
var even_scores = [];
even_scores = scores.filter(score => score%2==0); //elements matching condition will be stored and returned
console.log("even scores(using filter): "+even_scores);

//map will modify every value of array to a new value 
var scores_doubled = even_scores.map(score=>score*2);
console.log("scores doubled(using map): "+scores_doubled);

//sum the scores doubled using reduce:
var sum_scores_doubled = scores_doubled.reduce((sum,score)=>sum+score,0);
console.log("sum of scores doubled(using reduce): "+sum_scores_doubled);

var chained_result = scores.filter(score => score%2==0).map(score=>score*2).reduce((sum,score)=>sum+score,0);
console.log("sum of even scores doubled(using chaining): "+chained_result);


//realtime examples of filter, reduce, map
//filter
var usersJson = {
    users: [
        {
            "name": "sriram",
            "status": "active"
        },
        {
            "name": "thripura",
            "status": "active"
        },
        {
            "name": "ishitha",
            "status": "active"
        },        
        {
            "name": "raju",
            "status": "inactive"
        }
    ]
};

const activeUsers = usersJson.users.filter(user => user.status === 'active'); 
console.log("active users: ", activeUsers);
console.log("active users count: " + activeUsers.length);


//reduce real time example
// you are on cart page and you want to calculate and assert total of the products
var displayedTotal = 125.49;
const itemPrices = [19.99, 5.50, 100.00]; 
const calculatedTotal = itemPrices.reduce((accumulator, price) => accumulator + price, 0); // 125.49
if(displayedTotal == calculatedTotal)
    console.log("Total verified on cart page : success")
else 
    console.log("Total verified on cart page : fail")


//map real time example
// Example: Extracting visible text from a list of UI elements
//const productElements = await page.$$('.product-title');
//const productNames = await Promise.all(productElements.map(async (el) => await el.innerText()));
// Output: ['iPhone 15', 'Samsung S24', 'Pixel 8']

//real time example on chaining all 3 of them.
// to find all laptop prices sum
const inventory = [
  { name: 'MacBook Pro', category: 'Laptop', price: 2000 },
  { name: 'iPhone 15', category: 'Phone', price: 1000 },
  { name: 'Dell XPS', category: 'Laptop', price: 1500 }
];

const totalLaptopCost = inventory
  .filter(item => item.category === 'Laptop') // 1. Isolate Laptops
  .map(item => item.price)                    // 2. Extract their prices
  .reduce((sum, price) => sum + price, 0);    // 3. Aggregate total sum

console.log("Laptop prices total: "+totalLaptopCost);




//========== Sorting arrays ===========
var fruits = ["banana","mango","apple","jackfruit"];
fruits.sort();
console.log("fruits sorted: "+fruits);
fruits.reverse();
console.log("fruits sorted reverse order: "+fruits);

var numbers = [4,9,0,2,10];
console.log(numbers.sort());

var sorted_numbers=numbers.sort((a,b) => a-b); //bubble sort min diff ele comes 1st
console.log(sorted_numbers);

var sorted_numbers=numbers.sort((a,b) => b-a); //bubble sort in descending order
console.log(sorted_numbers);