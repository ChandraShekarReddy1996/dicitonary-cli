const axios = require('axios')
const readline = require('readline')
const http = require('https')
const config = require('../config/sample.json')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

let index = (type,word) => {
    console.log(type,word,config)
    definition(word)
}

let getData = async (url) => {
    return axios({
        url: url,
        baseURL: config.host,
        method: 'get'
      })
}

let definition = async (word) => {
    let url = `/word/${word}/definitions?api_key=` + config.key

    await getData(url).then(response => console.log(response.data)).catch(err => {console.log('Word Not Found in Dictionary')})
    
    return Promise.resolve()
}


module.exports = {
    index
}