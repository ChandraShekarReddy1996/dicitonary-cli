const readline = require('readline')
const request = require('request-promise')
const config = require('../config/sample.json')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

let index = (type,word) => {
    console.log(type,word,config)

    switch(type){
        case "defn":
            definitions(word)
            break
        case "syn":
            synonyms(word)
            break
        case "ant":
            antonyms(word)
            break
        case "ex":
            examples(word)
            break
    
    }
}

let getData = async (url) => {
    let request_params = {
        url : url,
        method : "GET"
    }

    let request_output = await request(request_params)

    return JSON.parse(request_output)
}

let definitions = async (word) => {
    let url = config.host + `/word/${word}/definitions?api_key=` + config.key

    await getData(url).then(response => console.log(response)).catch(err => {console.log('Word Not Found in Dictionary')})
    
    return Promise.resolve()
}

let synonyms = async (word) => {
    let url = config.host + `/word/${word}/relatedWords?api_key=` + config.key

    await getData(url)
    .then(response => processData(response,'syn'))
    .then(response => console.log(response))
    .catch(err => {console.log('Word Not Found in Dictionary',err)})
    
    return Promise.resolve()
}

let antonyms = async (word) => {
    let url = config.host + `/word/${word}/relatedWords?api_key=` + config.key

    await getData(url)
    .then(response => processData(response,'ant'))
    .then(response => console.log(response))
    .catch(err => {console.log('Word Not Found in Dictionary',err)})
    
    return Promise.resolve()
}

let examples = async (word) => {
    let url = config.host + `/word/${word}/examples?api_key=` + config.key

    await getData(url)
    .then(response => console.log(response.examples))
    .catch(err => {console.log('Word Not Found in Dictionary',err)})
    
    return Promise.resolve()
}


let processData = async (response,type) => {
    if(type == 'syn')
      response = response.filter(function (pilot) {
        return pilot.relationshipType === "synonym";
      })
    else if(type == 'ant')
      response = response.filter(function (pilot) {
        return pilot.relationshipType === "antonym";
      })

    return Promise.resolve(response[0].words)
}

module.exports = {
    index
}