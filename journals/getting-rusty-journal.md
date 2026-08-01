---
layout: post
title: "Learning Rust: moving from Python to Rust"
author: "Asif Sayyed"
excerpt: "This blog contains the raw journal of all the trial and errors I made while learning rust and all the nuances I wanted to keep track of"
tags: journal
---

<style>
.post-header h1 {
    font-size: 35px;
}
.post pre,
.post code {
    background-color: #EEEEFF;
    font-size: 13px; /* make code smaller for this post... */
}
</style>

- In rust functions are defined as `fn function_name {}`
- There are somethings called as macros that I don't understand well yet, but one example will be `println!`, notice here the exclamation after println. that is what makes it a macro.
	  ? What is a macro? need to learn that

### Variables in Rust
```rust
let age: f64 = 22;
// Notice how we have to use strings and {} before passing age?
println!("{}", age);
```

If we ignore it, it will gave an error like this
```powershell
error: format argument must be a string literal
 --> src/main.rs:4:14
  |
4 |     println!(age);
  |              ^
  |
help: you might be missing a string literal to format with
  |
4 |     println!("{}", age);
  |              +++++

```
Why is {} needed? because `println!` is not a function but instead it is a macro and hence we need to be explicit about the type as this specific macro only takes strings as input for a few reasons like type safety

`println!` also has `Display` functionality that allows user to display the float as is but also format is as they wish for example

```rust
let pie: f64 = 3.14159;
println!("{:.2}", pie);
```
> This should result the pie float value up to 2 digits after decimal.

You can also declare a variable and assign it later (not a standard practice)
```rust
// Correct way
let pie: f64;
pie = 3.14159;

println!("{}", pie);

// Incorrect way
let pie;
pie: f64 = 3.14159;

println!("{}", pie);
```
Note for integer there are two types of integers i.e.
	1. Signed: Has a direction basically positive or negative example: -6 or +67
	2. Unsigned: Has no direction, will always be positive example: 67

The convention for naming variables in rust is snake_case similar to how we do it in python.

By default all the variables in rust are immutable i.e., you cannot modify them once they are defined unless you shadow them i.e. use `let` to redefine it

For example
```rust
// Correct way
let age: u64 = 22;
let age: u64 = 23;

// Incorrect way
let age: u64 = 22;
age = 23
```
The incorrect way will lead into error like
```powershell
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:7:5
  |
3 |     let x = 13;
  |         - first assignment to `x`
...
7 |     x = 3;
  |     ^^^^^ cannot assign twice to immutable variable
  |
help: consider making this binding mutable
  |
3 |     let mut x = 13;
  |         +++

For more information about this error, try `rustc --explain E0384`.
```

This happens because as we discussed Rust variables are by default immutable, if you want them to be mutable, we need to prefix the variable name with `mut`
```rust
// Now it should work!
let mut age: u64 = 22;
age = 23;
```

Float handling without explicit type hinting is more robust than int handling as by default rust treats every int definition with the type of `i32` this makes you susceptile to issues like value over flow and results in errors like

```rust
error: integer literal is too large
  --> .\01_basics\changing_variables.rs:24:15
   |
24 |     let age = 2222222222222222222222222222222222222222;
   |               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   |
   = note: value exceeds limit of `340282366920938463463374607431768211455`

error: aborting due to 1 previous error
```

while in the case of float, it uses `f64`, making it more robust. takeaway? be explicit whenever you can specially when dealing with integer

Let's say you define a variable as `mut` and you don't update the variable then rust will prompt you to not make the variable mutable and give an error like this
```rust
 --> .\01_basics\changing_variables.rs:5:9
  |
5 |     let mut age: u32 = 22;
  |         ----^^^
  |         |
  |         help: remove this `mut`
  |
  = note: `#[warn(unused_mut)]` (part of `#[warn(unused)]`) on by default

warning: 1 warning emitted
```

### Types of variables
Things that we have in common with python
- bool -> `true`, `false`
- tuple -> `(value, value, ...)`
- arrays (equivalent of python list) -> `[value, value, ...]` (values of same time `T`)
	- we can also specify the length of an array like `[value, value, ... ; length]`
	- The size is known at compile time
	- ```rust
	  // Fixed-size array (type signature is superfluous).
	  let xs: [i32; 5] = [1, 2, 3, 4, 5]
	  ```
- integers (there two types in Rust)
	- Signed `i16`, `i32` and so on... basically anything from negative inf to positive inf.
	- Unsigned `u16`, `u32` and so on... basically whole numbers from 0 to positive inf.
- float (similar to python) in Rust we have `f32` and `f64` 
- char (equivalent of python `str`)
- Slices: they are similar to array but their size is not know at compile time
- Pointer sized integer

A very crucial nuance is how Rust interprets texts i.e., a single character like "X" or a word like "Rust"
- Rust will consider anything that is encased in `"X"` as str -> string
- Rust will consider anything that is encased in `'X'` as char -> character
Let's say if we define a word with `'Asif'` then it will result in an error:
```powershell
error: character literal may only contain one codepoint
  --> .\01_basics\variable_types.rs:34:20
   |
34 |     let username = 'Asifdotexe';
   |                    ^^^^^^^^^^^^
   |
help: if you meant to write a string literal, use double quotes
   |
34 -     let username = 'Asifdotexe';
34 +     let username = "Asifdotexe";
   |

error: aborting due to 1 previous error
```
Let's say if we define a char type in code but encase it with `"😻"` then it will result in an error:
```powershell
error[E0308]: mismatched types
  --> .\01_basics\variable_types.rs:40:23
   |
40 |     let emoji: char = "😻";
   |                ----   ^^^^ expected `char`, found `&str`
   |                |
   |                expected due to this
   |
help: if you meant to write a `char` literal, use single quotes
   |
40 -     let emoji: char = "😻";
40 +     let emoji: char = '😻';
   |

error: aborting due to 1 previous error

For more information about this error, try `rustc --explain E0308`.
```

You cannot define `0s` and `1s` with bool type signature to represent `true` or `false` in rust, it will result in an error

```rust
error[E0308]: mismatched types
  --> .\01_basics\variable_types.rs:31:25
   |
31 |     let disable: bool = 0
   |                  ----   ^ expected `bool`, found integer
   |                  |
   |                  expected due to this

error: aborting due to 2 previous errors
```

### Data structures in Rust

There are a few data structures:
- Array
- Tuple
- Slices

If you are trying to print an array, you cannot do it using
```rust
let array = [1,2,3,4,5];
println!("{}", array);
```
This will result in an error.
```powershell
error[E0277]: `[{integer}; 10]` doesn't implement `std::fmt::Display`
  --> .\01_basics\collection_types.rs:10:20
   |
10 |     println!("{}", list_of_numbers);
   |               --   ^^^^^^^^^^^^^^^ `[{integer}; 10]` cannot be formatted with the default formatter
   |               |
   |               required by this formatting parameter
   |
   = help: the trait `std::fmt::Display` is not implemented for `[{integer}; 10]`
   = note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead

error: aborting due to 1 previous error
```
For you to print the array, you need to do something like this
```rust
let array = [1,2,3,4,5];
println!("{:?}", array);
```
This will print the array as follows:
```powershell
[1, 2, 3, 4, 5]
```
And if you want to pretty print. in this case it means printing every element on it's own line. then you format is as such
```rust
let array = [1,2,3,4,5]
println!("{:#?}", array)
```
this will print the array as follows:
```powershell
[
    1,
    2,
    3,
    4,
    5,
    6,
    6,
    6,
    7,
    9,
]
```
Here the takeaway is that when you use `println!("{}", array)`
the use of "{}" in the print statement means you are telling rust to use the `Display` trait

But the `Display` trait doesn't work with arrays and this is an intentional choice by the developers that created rust, because there isn't any universal way of displaying an array unlike other variables like `str`, `integer`, `float`, `bool`, `char` etc...

So instead of using `Display` i.e., `{}`, we are encouraged to use `Debug` trait that is denoted as `{:?}` where the colon denotes formatting should be applied and `?` mark implies that we want to use the `Debug` trait.

### Type casting in Rust
```rust
fn type_casting() {
    let a: u8 = 3;
    let b: u32 = 67;
    let c = a + b;

    println!("{}", c);
}
```
So in this piece of code, you can see that I am taking the variable `a` i.e. the data type `u8` that is unsigned integer of 8 bits. and then taking variable `b` that is `u32` and in rust you cannot be loose with the typing, you cannot addup two numbers that aren't the same datatype.
hence I got the following error. 

```powershell
error[E0308]: mismatched types
 --> .\01_basics\type_casting.rs:7:17
  |
7 |     let c = a + b;
  |                 ^ expected `u8`, found `u32`

error[E0277]: cannot add `u32` to `u8`
   --> .\01_basics\type_casting.rs:7:15
    |
  7 |     let c = a + b;
    |               ^ no implementation for `u8 + u32`
    |
    = help: the trait `Add<u32>` is not implemented for `u8`
help: the following other types implement trait `Add<Rhs>
```

How can I fix this? ideally we should be able to get past it by type casting
how does one typecast?
```rust
fn type_casting() {
    let a: u8 = 3;
    let b: u32 = 67;
    let c = a + b as u8;

    println!("{}", c);
}
```
