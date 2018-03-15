# Dialogflow2AlexaSkillJson
DialogflowからエクスポートしたzipをもとにAlexa SkillのJSONを生成します。  
※2018/3/10時点の仕様に対応。  

## できること
* DialogflowのIntentからAlexa SkillのIntent生成
    * Training phrasesからSample Utterancesへ変換
    * Action and parametersからIntent Slotsへ変換
* DialogflowのEntityからAlexa SkillのSlot Type生成
    * Synonymもおっけー

## できないこと（誰か機能追加して…）
* DialogflowのContexts対応
* ParameterのRequired対応

# Usage

## Install
以下のコマンドを実行。  

```
git clone https://github.com/miso-develop/dialogflow2alexa-skill-json
cd dialogflow2alexa-skill-json
npm i
```

## Dialogflowのエクスポート
* Dialogflowの[コンソール](https://console.dialogflow.com/api-client/)にてAgent名横の歯車をポチ
* 「Export and Import」タブをポチ
* 「EXPORT AS ZIP」ボタンをポチ
* zipファイルを保存

## Alexa Skill Codeの生成
以下のコマンドを実行。  

```
node index.js dialogflow.zip
```

同ディレクトリに`alexa-skill.json`が生成されます。  

## Alexa Skillへ反映
* Alexaの[コンソール](https://developer.amazon.com/alexa/console/ask/build/)にて「Build」タブをポチ
* 「JSON Editor」をポチ
* `alexa-skill.json`を「Drag and drop a .json file」にドラッグ&ドロップ
* Skill Invocation Nameを手入力して下さい

## コピペ時の注意事項
Alexa SkillはDiralogflowに比べて色々制約がきつく、ちょこちょこ調整する必要があります。  

* Intent名とSlot名が同じだと怒られます
* サンプル発話（AlexaのSample Utterances）に同じSlotを繰り返し使えません
* Slotの値は基本的に日本語じゃないといけません（頭文字、イニシャリズム、アクロニムを除く）
    * 「a flat」みたいのはエラーは出ませんが申請時にリジェクト食らいます
    * 数字もダメです。カタカナか漢数字にしましょう

# Contribution
1. Fork it
1. Create your feature branch
1. Commit your changes
1. Push to the branch
1. Create new Pull Request

# License
MIT
