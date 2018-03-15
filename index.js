"use strict"

const fs = require("fs")
const path = require("path")
const unzip = require("unzip")
const del = require("del")

const zipPath = process.argv[2]
const unzipPath = "./unzip/"

const l = v => console.log(v)
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))



const getIntents = () => {
    return (new Promise(resoleve => {
        const intents = [
            {"name": "AMAZON.CancelIntent", "slots": [], "samples": []},
            {"name": "AMAZON.HelpIntent", "slots": [], "samples": []},
            {"name": "AMAZON.StopIntent", "slots": [], "samples": []},
        ]
        const jsonDir = `${unzipPath}intents/`
        fs.readdir(jsonDir, function (err, files) {
            if (err) throw err
            // json回し
            for (const file of files) {
                // Intent取得
                if (file.indexOf("_usersays") === -1) {
                    const dfIntent = require(jsonDir + file)
                    // intent変換
                    let intent = {name: dfIntent.name, slots: []}
                    for (const parameter of dfIntent.responses[0].parameters) {
                        intent.slots.push({
                            name: parameter.name, 
                            type: parameter.dataType.replace("@", "")
                        })
                    }
                    intents.push(intent)
                    
                // samples取得
                } else {
                    const userSays = require(jsonDir + file)
                    const name = file.match(/(.*)_usersays/)[1]
                    for (const intent of intents) {
                        if (intent.name !== name) continue
                        // samples変換
                        const samples = []
                        for (const userSay of userSays) {
                            let sample = `${name} `
                            for (const data of userSay.data) {
                                sample += data.userDefined ? `{${data.text}} ` : `${data.text} `
                            }
                            samples.push(sample.trim())
                        }
                        intent.samples = samples
                    }
                }
            }
            resoleve(intents)
        })
    }))
}



const getTypes = () => {
    return (new Promise(resoleve => {
        const types = []
        const jsonDir = `${unzipPath}entities/`
        fs.readdir(jsonDir, function (err, files) {
            if (err) throw err
            // json回し
            for (const file of files) {
                if (file.indexOf("_entries") === -1) continue
                // entity変換
                const entities = require(jsonDir + file)
                const name = file.match(/(.*)_entries/)[1]
                let type = {name: name, values: []}
                for (const entity of entities) {
                    // synonymの先頭をvalueに
                    entity.value = entity.synonyms.shift()
                    // 重複を除外
                    let duplicateFlag = false
                    for (const value of type.values) {
                        if (value.id === entity.value) {
                            duplicateFlag = true
                            break
                        }
                    }
                    if (!duplicateFlag) type.values.push({id: entity.value, name: entity})
                }
                types.push(type)
                
            }
            resoleve(types)
        })
    }))
}



// 
const main = async () => {
    const jsonName = "alexa-skill.json"
    const output = {languageModel: {invocationName: "Skill名に置換して下さい"}}
    
    // zip展開
    fs.createReadStream(zipPath).pipe(unzip.Extract({path: unzipPath}))
    await sleep(1000)
    
    // Intents取得
    output.languageModel.intents = await getIntents()
    
    // Entities取得
    output.languageModel.types = await getTypes()
    
    // json出力
    fs.writeFile(jsonName, JSON.stringify(output), () => {console.log(`output: ${jsonName}`)})
    
    //zip展開ディレクトリ削除
    del(unzipPath)
}
main()



