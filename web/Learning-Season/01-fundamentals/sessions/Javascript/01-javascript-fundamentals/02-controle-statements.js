// conditional statement (if..else , switch)

// if
let age = 18;

if (age >= 18) {
  console.log("You can drive");
}

// if..else
const hour = 5;
if (hour < 18) {
  console.log("Good day");
} else {
  console.log("Good evening");
}

// if..else if..else
if (time < 10) {
  greeting = "Good morning";
} else if (time < 20) {
  greeting = "Good day";
} else {
  greeting = "Good evening";
}

// switch
const today = 4;
switch (today) {
  case 0:
    day = "Sunday";
    break;
  case 1:
    day = "Monday";
    break;
  case 2:
    day = "Tuesday";
    break;
  case 3:
    day = "Wednesday";
    break;
  case 4:
    day = "Thursday";
    break;
  case 5:
    day = "Friday";
    break;
  case 6:
    day = "Saturday";
}

// iterative statements (loops) (for , while ,do..while)
for (let i = 0; i < 10; i++) {
  console.log("hello mc");
}

let j = 0;
while (j < 10) {
  console.log("hello mc");
  j++;
}

let k = 0;
do {
  console.log("hello mc");
  k++;
} while (k < 10);
