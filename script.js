'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (mov) {
        return mov[0];
      })
      .join('');
  });
};
creatUsernames(accounts);

// const findAccount = function (accs) {

// };
// findAccount(accounts);

const displaymovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displaymovements(account1.movements);

const calcDisplaySummary = function (acc) {
  const IN = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const OUT = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${IN}€`;
  labelSumOut.textContent = `${Math.abs(OUT)}€`;
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

const calculateBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  });
  labelBalance.textContent = `${account.balance}€`;
};

// calculateBalance(account1.movements);
// displaymovements(account2.movements);

const updateUPI = function (currAccount) {
  displaymovements(currAccount.movements);
  calcDisplaySummary(currAccount);
  calculateBalance(currAccount);
};
let currAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  containerMovements.innerHTML = '';
  currAccount = accounts.find(function (user) {
    return user.username === inputLoginUsername.value;
  });

  // console.log(currAccount);
  if (currAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(' ')[0]
    }`;
    // containerApp.style.opacity = 100;
    containerApp.classList.add('opacity');

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUPI(currAccount);
  } else {
    containerApp.classList.remove('opacity');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, recieverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  if (
    amount > 0 &&
    recieverAcc &&
    currAccount.balance >= amount &&
    currAccount.username !== recieverAcc.username
  ) {
    currAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUPI(currAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('loan');
  const loanAmount = Number(inputLoanAmount.value);
  const validity = currAccount.movements.some(acc => acc >= 0.1 * loanAmount);
  if (loanAmount > 0 && validity) {
    currAccount.movements.push(loanAmount);
    updateUPI(currAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('close');
  const user = inputCloseUsername.value;
  const pass = inputClosePin.value;
  if (currAccount.username === user && currAccount.pin === Number(pass)) {
    const index = accounts.findIndex(
      acc => acc.username === currAccount.username
    );
    accounts.splice(index, 1);
    containerApp.classList.remove('opacity');
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  // console.log(accounts);
});

let toggle = 1;
btnSort.addEventListener('click', function () {
  toggle = 1 - toggle;
  // console.log(toggle);
  const movs = toggle
    ? currAccount.movements
    : currAccount.movements.slice().sort((a, b) => a - b);
  displaymovements(movs);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀


const checkDog = function (juliasDogs, katesDogs) {
  const juliasCorrected = juliasDogs.slice(0, 3).slice(1);
  // console.log(juliasCorrected);
  const combined = [...juliasCorrected, ...katesDogs];
  combined.forEach(function (age, i) {
    let text;
    if (age >= 3) {
      text = `Dog number ${i + 1} is an adult, and is ${age} years old`;
    } else {
      text = `Dog number ${i + 1} is still a puppy`;
    }
    console.log(text);
  }); 
};
checkDog([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDog([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//MAPS
currencies.forEach(function (value, key) {
  console.log(`${key} : ${value}`);
});


//SETS
const currenciesunique = new Set(['USD', 'EUR', 'USD', 'GBP', 'EUR']);
console.log(currenciesunique);
currenciesunique.forEach(function (value, key) {
  console.log(`${key} : ${value}`);
});
*/

// console.log(accounts);

// const user = 'Steven Thomas Williams';

// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(function (mov) {
//     return mov[0];
//   })
//   .join('');

// console.log(username);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
//MAP METHOD
const currencyUSD = movements.map(function (mov) {
  return 1.1 * mov;
});
console.log(currencyUSD);

const currencyUSD1 = movements.map(mov => 1.1 * mov);
console.log(currencyUSD1);

//FILTER METHOD
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);
const withdrews = movements.filter(mov => mov < 0);
console.log(withdrews);

//REDUCE
const baln = movements.reduce(function (acc, mov) {
  return acc + mov;
});

const bal = movements.reduce((acc, mov) => acc + mov, 0);

console.log(bal, baln);

/*
//FOREACH

movements.forEach(function (mov, i) {
  if (mov > 0) {
    console.log(`Movement ${i} : You deposited ${mov}`);
  } else {
    console.log(`Movement ${i} : You withdrew ${Math.abs(mov)}`);
  }
});
///////////////////////////////////////////
const arr = ['a', 'b', 'c', 'd', 'e'];

//sclice
console.log(arr.slice(2));
console.log(arr.slice(1, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());

//splice
console.log(arr.splice(-1));
console.log(arr);
console.log(arr.splice(1, 4));
console.log(arr);

//reverse
const a = ['a', 'b', 'c', 'd', 'e'];
const a2 = ['j', 'h', 'i', 'p', 'q'];
console.log(a2.reverse());
console.log(a2);

//concat
console.log(a.concat(a2));
console.log([...a, ...a2]);

//join
console.log(a.concat(a2).join('-'));
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
const calcAverageHumanAge = function (Ages) {
  const humanAges = Ages.map(function (age) {
    return age <= 2 ? 2 * age : 16 + age * 4;
  });
  // console.log(humanAges);
  const adults = humanAges.filter(function (age) {
    return age >= 18;
  });
  console.log(adults);
  const avg = adults.reduce((acc, mov, i, arr) => acc + mov / arr.length, 0);
  console.log(avg);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//USING CHAINING

const calcAvgHumanAge = function (ages) {
  const avgAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(avgAge);
};
calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);

*/
/*
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(arr);

console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const y = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(y);

labelBalance.addEventListener('click', function () {
  const movUI = Array.from(document.querySelectorAll('.movements__value'), el =>
    Number(el.textContent.replace('€', ''))
  );
  console.log(movUI);
});
*/

/*
const depositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, mov) => sum + mov, 0);

console.log(depositSum);

const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  // .filter(mov => mov >= 1000).length;
  .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);
console.log(numDeposit1000);

//return OBJECT USING REDUCE
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, mov) => {
      mov > 0 ? (sum.deposit += mov) : (sum.withdraw += mov);
      return sum;
    },
    { deposit: 0, withdraw: 0 }
  );
console.log(sums);

//return array using reduce
const sumsarr = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, mov) => {
      mov > 0 ? (sum[0] += mov) : (sum[1] += mov);
      return sum;
    },
    [0, 0]
  );
console.log(sumsarr);

//convert any title to titleCase
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'and', 'or', 'with', 'in', 'on'];
  const stringTitle = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word)
        ? word
        : word.replace(word[0], word[0].toUpperCase())
    )
    .join(' ');
  console.log(stringTitle);
};
convertTitleCase('this is a nice title');
convertTitleCase('THis is a bAD one');

///////////////////////////////////////
// Coding Challenge #4


Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
*/
//TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//1
// console.log(dogs);

dogs.forEach(dog => {
  dog.recmFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

const sarahsDog = function (dogs) {
  const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

  const amountof = sarahDog.curFood > sarahDog.recmFood ? 'much' : little;

  console.log(`Sarah's dog eating too ${amountof}`);
};

sarahsDog(dogs);

let ownersEatMuch = [];
let ownersEatLittle = [];

dogs.map(dog =>
  dog.curFood > dog.recmFood
    ? ownersEatMuch.push(dog.owners)
    : ownersEatLittle.push(dog.owners)
);

console.log(ownersEatMuch.flat(), ownersEatLittle.flat());
console.log(`${ownersEatMuch.flat().join(' and ')} dogs eat too much`);
console.log(`${ownersEatLittle.flat().join(' and ')} dogs eat too little`);

//5
const equalFood = dogs.some(dog => dog.curFood === dog.recmFood);
console.log(equalFood);

//6
const okayFood = dogs.some(
  dog =>
    dog.curFood >= dog.recmFood - dog.recmFood * 0.1 &&
    dog.curFood <= dog.recmFood + dog.recmFood * 0.1
);

console.log(okayFood);

//7
// const okayFoodarr = [];
// dogs.map(dog => {
//   if (
//     dog.curFood >= dog.recmFood - dog.recmFood * 0.1 &&
//     dog.curFood <= dog.recmFood + dog.recmFood * 0.1
//   ) {
//     okayFoodarr.push(dog);
//   }
// });
const okayFoodarr = dogs.filter(
  dog =>
    dog.curFood >= dog.recmFood - dog.recmFood * 0.1 &&
    dog.curFood <= dog.recmFood + dog.recmFood * 0.1
);
console.log(okayFoodarr);

const sorted = dogs.slice().sort((a, b) => a.recmFood - b.recmFood);
console.log(sorted);
