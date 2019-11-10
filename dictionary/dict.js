#!/usr/bin/env node

const method = require('./services/method')
const config = require('./config/sample.json')
const type = process.argv[2]
const word = process.argv[3]

console.log('Type >>>>> ',type,'Word >>>>>',word)


if(config.key == 'undefined')
    console.log('Invalid Key :(, please enter the Key to surf the words')
else
    method.index(type,word)


