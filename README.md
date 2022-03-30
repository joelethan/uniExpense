# uniExpense

uni-expense smart contract with Solidity

## Contents

1. [Project Overview!!](#project-overview)
1. [Project Setup!!](#project-setup)

## Project Overview!!

uniExpense is an individually developed Solidity Smart Contract mainly built to try and reduce the rate of corruption and miss-allocation of funds especially in institutions like Universities.

- This project mainly ensures that for all institution funds that are to be spent, they are audited and meet a certain number of votes from a group of people (maybe Board of Governors).

## Project Setup!!

First, download and install the following:

- [NodeJS](https://nodejs.org/en/download/) (v14.x.x recommended)
- [Git](https://git-scm.com/downloads) (v2.x.x recommended)
- [Ganache-cli](https://trufflesuite.com/ganache/) (v2.x.x recommended)

To clone the repository,
Run

```
git clone https://github.com/joelethan/uniExpense.git
```

Install packages with npm in the project root:

```
npm install -g truffle
npm install -g ganache
npm install
```

## Interacting with the Smart Contract

To compile the Smart Contract

```
npm run compile
```

To deploy the Smart Contract on to a test local blockchain

```
npm run develop
```

## Testing the Smart Contract

To execute the Smart Contract Automated Tests:
Run

```
npm run test
```

To execute the Smart Contract Manual Tests:

```
npm run test
```
