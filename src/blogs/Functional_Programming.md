# Functional Programming in JavaScript and Following the DRY Principle

## Introduction

We all have used JavaScript and probably have felt in love with it. If not, I don't blame you! Its not that easy of a language to work with.
However, JavaScript does provide some amazing features that you can leverage to write very clean code to follow the DRY principle. One of those features is Functional Programming.

---

## Example

We all have used multiple built in methods in JavaScript, and have felt in love with it. Lets one some of them here:

### 1. Classic Foreach

```js
const array = [1, 2, 3, 4, 5];

array.forEach((item) => {
  console.log(item);
});
```

Here each item of array is iterated over once and certain operation is performed. But if we take a closer look, the actual implementation of `forEach` is hidden from us. We have no idea how it is written in the spec of the language. We only know how to use it (This is called **Abstraction** in programming). And yet, we can pass almost any valid JavaScript statement and it does the job! How? This is the beauty of Functional Programming. We as programmers can provide a function itself that can perform certain task for us.

The alternative to this `forEach` method would be a traditional for loop as

```js
const array = [1, 2, 3, 4, 5];
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
```

_Note: I agree that traditional `for loop` is way faster than its `forEach` counterpart, but lets give that a pass it for now._

Now, what is the problem with this? Why not use a traditional `for loop` and why to use the `forEach` method?
<br>
Well the answer is only for better readability. However, if the amount of data to iterate over is not large, then using `forEach` over traditional `for loop` doesnot provide much performance boost.

---

## How is it implemented?

Okay. Enough of the performance jibber jabber. Lets see how is it implemented.

Now, we all know that functions can be assigned to variables in javascript.

```js
const fnName = function (...args) {
  return;
};
```

This is a valid statement. If you dont come from a background of statically typed languages, this might seem trivial, but believe me its next to magic that we can do this. _`Golang` supports this btw even though it is a statically typed language_, but most others donot. `C/C++`, `JAVA`, `C#` donot support functions as variables. Infact, `C#` uses delegates to do what `JavaScript` does.
<br>

---

## Your Point?

The magical thing this lets us do is pass functions as arguments to other functions!
<br>
Huh? What?
<br>
You know like any variable in JavaScript can be passed as argument to other functions like this?

```js
function sum(a, b) {
  return a + b;
}

function init() {
  const aNum = 12;
  const bNum = 40;
  const sum = calcSum(aNum, bNum);
}
init();
```

Likewise, we can pass functions itself! Woah! What?
Lets see an example:

```js
function callOtherFunction(functionName) {
  functionName();
}

function init() {
  const functionVariable = function () {
    console.log("I am being Called");
  };
  callOtherFunction(functionVariable);
}
init();
```

The output you get is

```js
I am being Called
```

You see the magic? We are calling the function by passing it as a parameter to other function! It is infact breaching its lexical scope!
<br>
Okay.... So What?

---

## The Implementation

Lets say we want to iterate over an array of data and log it to the console.
Lets write a function that logs any data to console.

```js
function LogValue(data) {
  console.log(data);
}
```

Now, We require an array of data. Lets create one above the LogValue function

```js
const data = [1, 2, 3, 4, 5];
const LogValue = function (data) {
  console.log(data);
};
```

Now, we want to iterate over the data array and run the LogValue function over every item in the array
thus, we can create a function that takes array and any action we wish to perform as arguments and simply iterate over the array and run the action function

```js
const data = [1, 2, 3, 4, 5];
const LogValue = function (data) {
  console.log(data);
};
function MyForEach(array, action) {
  for (let i = 0; i < array.length; i++) {
    action(data[i]);
  }
}
```

Finally, lets call MyForEach function by providing data and LogValue as its arguments

```js
const data = [1, 2, 3, 4, 5];
const LogValue = function (data) {
  console.log(data);
};
function MyForEach(array, action) {
  for (let i = 0; i < array.length; i++) {
    action(data[i]);
  }
}
MyForEach(data, LogValue);
```

This will give same output as this block of code

```js
const data = [1, 2, 3, 4, 5];
data.forEach(LogValue);
```

If you wish to use arrow function instead, we can do this

```js
const data = [1, 2, 3, 4, 5];
function MyForEach(array, action) {
  for (let i = 0; i < array.length; i++) {
    action(data[i]);
  }
}
MyForEach(data, (item) => {
  console.log(item);
});
```

This will provide same output as

```js
const data = [1, 2, 3, 4, 5];
data.forEach((item) => {
  console.log(item);
});
```

Now for the final show, we see that our implementation doesnot looks as good as the in built one right? I mean while using arrow function we cant even say what is going on in our code. In the native implementation we see that the code is far more readable. Well fear not! We can easily add our implementation to the existing Array method's prototype to use it in just the same way as the traditional forEach method

```js
const data = [1, 2, 3, 4, 5];
/*
 * Instead of this,
 * function MyForEach(array, action){
 *     for(let i=0; i<array.length; i++){
 *         action(data[i])
 *     }
 * }
 * MyForEach(data, item=>{
 *     console.log(item)
 * })
 */
Array.prototype.MyForEach = function (action) {
  for (let i = 0; i < this.length; i++) {
    action(this[i]);
  }
};
data.MyForEach((item) => {
  console.log(item);
});
```

You can use this method now to do everything that `forEach` does in JavaScript!
<br>
Isnt it remarkable that you can do this? This can lead to you not repeating yourself, essentially making you follow the DRY principle.
Write a generic function once and use it wherever on your project!

---

## Conclusion

JavaScript is filled with fun things like this that you can explore and imporove your approach in writing code. Making a habit of utilizing the language with many features that it provides will help you become a better developer.
<br>
I will leave you here with the implementation of the most useful `map` method used in JS array that returns another array by performing an operation. I hope you liked this blog, and I hope this helped you get into more complex and advanced topic in `JavaScript`.

### The Map Method

```js
Array.prototype.MyMap = function (action) {
  const newArray = [];
  for (let i = 0; i < this.length; i++) {
    newArray.push(action(this[i]));
  }
  return newArray;
};
function init() {
  const data = [4, 5, 6, 7, 8, 9];
  //JS Built Implementation of Map
  const jsMapAns = data.map((item) => {
    return item + 5 * 3;
  });
  //My Implementation of Map
  const myMapAns = data.MyMap((item) => {
    return item + 5 * 3;
  });

  console.log(jsMapAns, myMapAns, jsMapAns.toString() === myMapAns.toString());
}
init();
```

---
