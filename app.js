/*function greet(name) {
    return "Hello " + name;
  }
  
  console.log(greet("Bobu"));
  
  const add = (a, b) => a + b;
  console.log(add(2, 3));*/

  /*var mydog={
    "name": "Bobu",
    "breed":"Poddle",
    "tails":1,
    "legs":4,
    friends:["everyone"]
  };
  mydog.name="chitti";
  mydog.bark="bow-bow";
  mydog['cuteness']="very cute";

  var dog_name=mydog.name;
  var dog_breed=mydog.breed;
  var dog_tail=mydog["tails"];
  var dog_legs=mydog["legs"];*/
  /*var myobj={
    "charlie":"chicago",
    "david":"Dallas",
    "bob":"boston",
  };
  function lookup(val){
    if(myobj.hasOwnProperty(val)){
      return myobj[val];
    }
    else{
      return "Not found in object";
    }
  }
  console.log(lookup("hello"));*/

  /* collection={
    "2548":{
      "album":"Slippery When Wet",
      "artist":"Bon Jovi",
      "tracks":[
        "Let It Rock",
        "You Give Love a Bad Name"
      ]
    },
    "2468":{
      "album":"1999",
      "artist":"Prince",
      "tracks":[
        "1999",
        "Little Red Corvette"
      ]
    },
    "1245":{
      "artist":"Robert Palmer",
      "tracks":[
        "Addicted to Love"
      ]
    },
    "5439":{
      "album":"ABBA Gold"
    } 
  };
  
  var collectioncopy=JSON.parse(JSON.stringify(collection));
  function updaterecord(id,prop,value){
    if(value === ""){
      delete collection[id][prop];
    }else if(prop==="tracks"){
      collection[id][prop]=collection[id][prop] || [];
      collection[id][prop].push(value);
    }
    else{
      collection[id][prop]=value;
    }
    return collection;
  }
  updaterecord(2468,"tracks","test");
  console.log(collection["2468"]);
  updaterecord(5439,"artist","ABBA");
  console.log(collection["5439"]);*/

  /*var myarray=[];
  var i=0;
  while(i<5){
    myarray.push(i);
    i++;
  }
  console.log(myarray);*/

  /*var ourarray=[];
  for(var i=10;i>0;i-=2){
    ourarray.push(i);
  }
  console.log(ourarray);*/

 /* var ourarray=[];
  for(var i=9;i>0;i-=2){
    ourarray.push(i);
  }
  console.log(ourarray);*/

 /* var ourarr=[5,6,7,8,9];
  var total=0;
  for(var i=0;i<ourarr.length;i++){
    total+=ourarr[i];
  }
  console.log(total);*/

  /*function multiplyall(arr){
    var product=1;
    for(var i=0;i<arr.length;i++){
      for(var j=0;j<arr[i].length;j++){
        product*=arr[i][j];
      }
    }
    return product;
  }
  var product=multiplyall([[1,2],[3,4],[5,6,7]]);
  console.log(product);*/

  /*var contacts=[
    {
      "firstName":"Akash",
      "lastName":"Kumar",
      "number":"1234567890",
      "likes":["Pizza","Coding"]
    },
    {
      "firstName":"Bob",
      "lastName":"Smith",
      "number":"0987654321",
      "likes":["Movies","Music"]
    },
    {
      "firstName":"Charlie",
      "lastName":"Brown",
      "number":"5555555555",
      "likes":["Football","Chocolate"]
    }
  ];

  function lookupprofile(name,prop){
    for(var i=0;i<contacts.length;i++){
      if(name === contacts[i].firstName){
        return contacts[i][prop] || "No such property";
      }
    }
    return "No such contact";
  }
  var data =  lookupprofile("sherlock","likes");
  console.log(data);*/

  /*const s=[1,2,3];
  function editinplace(){
    "use strict";
    s[0]=10;}
  editinplace();
  console.log(s);*/

  /*const add = (a,b) => a.concat(b);
  console.log(add("hi"," bobu"));*/

  /*const myarr=[1,5,8,-2,-8,-10,4];
  const squarelist= (myarr)=>{
    const squareditems=myarr.filter(num => Number.isInteger(num) && num > 0).map(x => x*x);
    return squareditems;
  };
  const squarenumbers=squarelist(myarr);
  console.log(squarenumbers);*/
  // Create an Object

/*const person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue"
};

// Destructuring Assignment
let { firstName, age } = person;
*/
/*
class Car {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}
const mycar= new Car("Ford", 2014);
console.log(mycar.name,mycar.year);
*/

/*let p= new Promise((resolve,reject)=>{
  let a = 1+2;
  if(a==2){
    resolve("success");
  }
  else{
    reject("failed");
  }
})
p.then((message)=>{
  console.log("this is in then " + message);
}).catch((message)=>{
  console.log("this is in catch " + message);
})*/

/*const videoone = new Promise((resolve,reject)=>{
  resolve("Video 1 Recorded");
})
const videotwo=new Promise((resolve,reject)=>{
  resolve("Video 2 Recorded");
})
const videothree= new Promise((resolve,reject)=>{
  resolve("Video 3 Recorded");
})
Promise.race([videoone,videotwo,videothree]).then((message)=>{
  console.log(message);
})
  */
 function makerequest(location){
  return new Promise((resolve,reject)=>{
    console.log("Making request to " + location);
    if(location === "Google"){
      resolve(" Google says hi");
    }
    else{
      reject("We can only talk to Google");
    }
  })
 }
 function processrequest(response){
  return new Promise((resolve,reject)=>{
    console.log("Processing response"); 
    resolve("Extra information " + response);
  })
 }

 /*makerequest("google").then(response=>{
  console.log("Response received");
  return processrequest(response)
 }).then(processrequest=>{
  console.log(processrequest);
 }).catch(err=>{
  console.log(err);
 })*/

 async function dowork(){
  try{
    const response = await makerequest("google")
    console.log("Response received");
    const processresponse = await processrequest(response);
    console.log(processresponse);
  }
  catch(err){
    console.log(err);
  }
  
 }
 dowork();





 