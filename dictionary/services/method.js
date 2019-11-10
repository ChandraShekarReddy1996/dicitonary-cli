const readline = require('readline')
const request = require('request-promise')
const config = require('../config/sample.json')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

let index = (type,word) => {

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

    if(word == undefined && type != undefined && type != 'play')
    {
        definitions(type);
        synonyms(type);
        antonyms(type);
        examples(type);
    }else if(type == undefined){
        ramdomWord();
    }else if(word == undefined && type == 'play'){
        play();
    }
}

let getData = async (url) => {
    let request_params = {
        url : url,
        method : "GET"
    }

    let request_output = await request(request_params);

    return JSON.parse(request_output);
}

let definitions = async (word) => {
    let url = config.host + `/word/${word}/definitions?api_key=` + config.key;

    await getData(url)
    .then(response => console.log(`Definition for word  is `,response))
    .catch(err => {console.log('Word Not Found in Dictionary')});
    
    return Promise.resolve();
}

let synonyms = async (word) => {
    let url = config.host + `/word/${word}/relatedWords?api_key=` + config.key;

    await getData(url)
    .then(response => processData(response,'syn'))
    .then(response => console.log(`Synonyms for word  is `,response))
    .catch(err => {console.log('Word Not Found in Dictionary',err)});
    
    return Promise.resolve();
}

let antonyms = async (word) => {
    let url = config.host + `/word/${word}/relatedWords?api_key=` + config.key;

    await getData(url)
    .then(response => processData(response,'ant'))
    .then(response => console.log(`Antonyms for word  is `,response))
    .catch(err => {console.log('Word Not Found in Dictionary',err)});
    
    return Promise.resolve();
}

let examples = async (word) => {
    let url = config.host + `/word/${word}/examples?api_key=` + config.key;

    await getData(url)
    .then(response => console.log(`Examples for word  is `,response.examples))
    .catch(err => {console.log('Word Not Found in Dictionary',err)});
    
    return Promise.resolve();
};


let ramdomWord = async () => {
    let url = config.host + `/words/randomWord?api_key=` + config.key;

   let random_word =  await getData(url)
    .catch(err => {console.log('Word Not Found in Dictionary',err)})

    await Promise.all([
        definitions(random_word.word),
        synonyms(random_word.word),
        antonyms(random_word.word),
        examples(random_word.word)
    ])

    return Promise.resolve(random_word);
}

let play = async () => {
    let url = config.host + `/words/randomWord?api_key=` + config.key;

    let random_word =  await getData(url)
     .catch(err => {console.log('Word Not Found in Dictionary',err)});

     await Promise.all([
        definitions(random_word.word),
        synonyms(random_word.word),
        antonyms(random_word.word),
        examples(random_word.word)
    ])

    playStart(random_word.word)
}


let playStart = async (random_word) => {
    rl.question('Guess the word : ',answer => {
        console.log(answer === random_word,'  ',answer,'  ',random_word)
        if(answer === random_word){
            console.log('You Guessed right ! ');
            rl.close();
        }else{
            rl.question('Wrong Guess ! Try again ',first_attempt => {
                if(first_attempt === random_word){
                    console.log('You Guessed right ! ');
                    rl.close();
                }else{
                   let hint = jumble(random_word)
                    rl.question(`Seems Like you need some help. Use the below hint \n ${hint} \n :`,second_attempt => {
                        if(second_attempt === random_word){
                            console.log('You Guessed right ! ');
                            rl.close();
                        }else{
                            console.log('Max attempts exceeded and the word is ',random_word,'please refer the below info for further details regading the word !')
                            definitions(random_word)
                            synonyms(random_word)
                            antonyms(random_word)
                            examples(random_word)
                        }
                    })
                }
            })
        }
    })
}
  
let jumble = (word) => {
    word = word.split('')
    for (var i = word.length - 1; i >= 0; i--) {
      var rand = Math.floor(Math.random() * i)
      var temp = word[i]
      word[i] = word[rand]
      word[rand] = temp
    }
    word = word.join('')
    return word
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

    return Promise.resolve((response.length != 0) ? response[0].words : 'No Antonym for this word') 
}

module.exports = {
    index
}