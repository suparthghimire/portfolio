# What is This? (in JavaScript)

We all developers have atleast once in our lifetime encountered the `this` keyword in most Programming Languages (`self` if you are from `Python` island). The implementation of `this` varies somewhat in all these languages, but it is not as confusing as it is in JavaScript.

# Detour to C++

Before starting, lets see another famous programming language that utilizes the `this` keyword, `C++`.

_The example here is true for most other languages as well_

I think the implementation of `this` in `C++` is as straight forward as it gets. It represents the current instance of the Class.
<br>
Let's See an Example

```cpp
#include<iostream>
class Person{
public:
    std::string name;
    Person(std::string name){
        this->name = name;
    }
};
int main(){
    Person p = Person("Suparth");
    std::cout << p.name;
    return 0;
}
```

Here, we see that parameters in the constructor function have same name as the public variable names in the class. However, `this` makes it clear on which variable is the value being assigned to. Here `this` refers to the instance of the class.

```cpp
this->name = name;
```

It means the value of variable `name` from parameter is being assigned to the variable `name` from the class instance.
<br>
Thus, while logging the value of `name` from object `p`, we get Suparth in terminal.

Doesn't Seem Complex does it? Well, buckle up, as we gear towards the island of `JavaScript` where everything is weird. Specially `This`!

# Welcome to JavaScript

`JavaScript`'s `this` has the same heart as other programming languages. It too refers to the current instance. But, the catch here is **WHAT IN HELL DOES CURRENT INSTANCE MEAN?**

## Current Instance / Scope

JavaScript (by default) is a globally scoped language. It means you dont need to create any extra scope to execute code like in C++ or Java where you require a `main` method. Here you can execute code from first line itself. It is similar to Python in this regard. To achieve this, JavaScript has scopes/contexts where everything is executed.

Scopes in JavaScript:

- Global Scope
- Function Scope
- Block Scope

We wont be going in what these scopes mean, as they are entirely different topic. Let's focus on `this` for now.

_Some extra topics that you can learn that are based around Scopes in JavaScript_

- _Hoisting_
- _Closures_

# This in JavaScript

`this` refers to different things in JavaScript.

The basic gist of `this` in JavaScript is that `this` refers to the object of whatever scope is wrapping it. If the object of scope is not found, it refers to the parent's scope's object.

Confused? Let me elaborate.

We see that `window` is an object in JavaScript which is the object that represents the global scope. Block scope doesn't have any object that represents to it. Hence, if `this` is referred inside a simple block scope (within curly braces), it still refers to the window object as there is no other object for it to bind itself to.

By {}, I mean simple lexical scoping or using if statements, loops etc.

## This Refering to Global Object

- Global Scope

```js
console.log(this);
```

- Block Scope

```js
if (true) {
  console.log(this);
}
```

- Function Scope

```js
function fn() {
  console.log(this);
}
fn();
```

- Inside an Object

```js
let obj = {
  thisKey: this,
};
console.log(obj.thisKey);
```

All these examples will print the window object in console.

Everything here has been explained by the paragraph above, except for last two examples of function and the object. The obvious question here is doesn't function have its own scope? And why does `this` not bind to Object?

**Function:**
JavaScript functions are weird as well as magical. We can not only treat them as normal subroutines by simply calling them, but also as constructors by invoking them using the new keyword! Here, `function fn` has just been called like a normal subroutine. Thus, no constructor is created which does not create a function scope, but creates a local scope. And since no object corresponds to local scope, it looks at the parent scope of the function which is global scope. Since the corresponding object of global scope is window, `this` inside a function invoked by a simple function call refers to the global scope or window object.

**Object:**
The answer to Object's example simple. Creating new object does not create any new scope, as `obj` is simply a variable (even though it uses curly braces). Thus, it refers to the global scope/window object as `obj` is created inside global scope.

# The Prototype Carnival

Before moving forward, we must be familiar with prototypes and prototipal inheritance. I wont go much in detail, but here is a small brief.

Everything in JavaScript is an Object. If we see the prototype chain of anything in JavaScript, we see it is same as `Object.Prototype`. The Prototype of Object is null. Hence, in the top level of hierarchy, we see object being present.

This means function is an object too. If you run following code:

```js
Function.prototype.__proto__ === Object.prototype;
```

We get true as the result.

---

## This Refering to Certain Object

- Functions as Constructors

```js
function ConstructorFunction() {
  console.log(this);
}
const newInvoker = new ConstructorFunction();
```

What is new Here?

We see that the first distinction from normal function call is we invoke the `ConstructorFunction` function using `new` Keyword. This now creates a function scope within the global scope. When a function scope is created, the corresponding object is Function itself (function is an Object in JavaScript - discussed above). Hence, the `this` keyword will now refrence the function itself.

A more sophisticated example

```js
function Game(initialScore) {
  this.score = initialScore;
  this.increaseScore = () => {
    this.score++;
  };
  this.decreaseScore = () => {
    this.score++;
  };
}

const newGame = new Game(0);
console.log(newGame.score);
newGame.increaseScore();
console.log(newGame.score);
```

The Output is:

```console
0
```

```console
1
```

- Arrow Functions

```js
const arrFunction = () => {
  console.log(this);
};
const arrFnNewInvoke = new arrFunction();
```

This will result in an error that says `arrFunction is not a constructor`.

Can you say why?

Arrow functions are not meant to be declared as constructors. Thus, they cannot be invoked using new keyword. Which means `this` keyword inside arrow functions will always point to the wrapper around the arrow function. In this case, it is the global scope/window object.

---

- Function as Method inside an Object

```js
let obj = {
    name:"Suparth"
    getName:function(){
        console.log(this)
    }
}
obj.getName();
```

Remember while discussing the global scope of `this` keyword, we said that in normal function call, `this` points to global object as the wrapper of the function itself is the global context? Well here the wrapper is the object `obj`. What do you think will `this` point to in this case?

You might think that as `getName` function is wrapped by an object `obj`, `this` should point to global/window because Object doesnot create any scoping, which results in `this` pointing to window itself.

The answer however is far more complex than that. Let's elaborate how objects are created in JavaScript.

```js
let obj = new Object();
obj.name = "Suparth";
obj.getName = function () {
  console.log(this);
};
obj.getName();
```

Current block of code, and the one before this results in same behavior. The only difference is how we define objects, lattar one being a longer way to do so.

Do you see what we did here though? Do you remember we invoking a function using new keyword? Yes!!! This is same as invoking a function as a constructor. This is possible because `Function` is an `Object` in JavaScript.

Then what will `this` inside a constructor function point to? Yup. The constructor function itself! Hence the output here of `obj.getName()` will print the object `obj` itself.

- Arrow Function as Object Method

```js
let obj = {
    name:"Suparth"
    getName:()=>{
        console.log(this);
    }
}
```

What will `this` point to in this case?

If you say window object, you are absolutely correct. As arrow functions cannot act as constructor function, it wont bind to the object `obj`, but to the global scope/window object.

# Classes - New Kids on the Block

Es6 was an interesting transition from Es5 in JavaScript island. Many new cool kids were added in the island who brought much needded changes that made the language much more redable and accessible. We all know the introduction of `Promises` and `async/await`, where `async/await` were the hot cakes. But well, classes were added too! So? How does `this` work in Classes? Well, how it always has! Let me explain.

You see classes in JavaScript is same thing as creating functions and invoking them as constructors using the `new` keyword. It just is a syntatic sugar similar to `async/await`.
Thus, whatever we discussed before that includes `Function`, the concept here holds true.

```js
class Person {
  constructor(p_name) {
    this.name = p_name;
  }
  getName() {
    console.log(this);
  }
}
const P = new Person("Suparth");
```

Well, you see the similarity? Calling function as a constructor is same as creating a class! It just is an declarative way to do so. This made JavaScript more closer to other Object Oriented Languages and made `inheritance` similar to other langauges as `prototypes` seemed weird before.

```js
class Game {
  constructor(initialScore) {
    this.score = initialScore;
  }
  increaseScore() {
    this.score++;
  }
  decreaseScore() {
    this.score++;
  }
}
const newGame = new Game(0);
console.log(newGame.score);
newGame.increaseScore();
console.log(newGame.score);
```

Remember this Example from above? Well this is how we would do it using ES6 way. This proves that classes are nothing but a syntatic sugar to create more redable constructor functions.

Not Convinced? Well, run this code:

```js
class DemoClass {}
console.log(typeof DemoClass);
```

The Output will be

```
"function"
```

Thus, nothing changes while using `this` keyword inside classes in JavaScript.

# Leaving JavaScript

That is all I have in store for today. `this` isn't over by the way! `this` has alot more to be explored upon. Did you know, you could modify behavior of `this` in JavaScript? Well, stay tuned for more blogs, as more of `this` is yet to be discussed.

Adios
