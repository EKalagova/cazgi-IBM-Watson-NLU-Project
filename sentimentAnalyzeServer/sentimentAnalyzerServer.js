const express = require('express');
const dotenv = require('dotenv');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

dotenv.config();

const SENTIMENT_PARAMS = {
    'features': {
        'entities': {
            'sentiment': true,
            'limit': 1
        }
    },
    'language': 'en'
};

const EMOTION_PARAMS = {
    'features': {
        'entities': {
            'sentiment': true,
            'emotion': true,
            'limit': 1
        }
    },
    'language': 'en'
};

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    
let analyzeParams = { url: req.query.url, ...EMOTION_PARAMS };
    
    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        console.log(analysisResults.result.entities[0].emotion)
        if (analysisResults && analysisResults.result && analysisResults.result.entities[0] && analysisResults.result.entities[0].emotion) {
            res.send({ ...analysisResults.result.entities[0].emotion });
        } else {
            throw new Error('Invalid request')
        }
    })
    .catch(err => {
        console.log('error:', err);
        return res.status('400').send(err);
    });
});

app.get('/url/sentiment', (req,res) => {

let analyzeParams = { url: req.query.url, ...SENTIMENT_PARAMS };
    
    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        if (analysisResults && analysisResults.result && analysisResults.result.entities[0] && analysisResults.result.entities[0].sentiment && analysisResults.result.entities[0].sentiment.label) {
            res.send({ sentiment: analysisResults.result.entities[0].sentiment.label });
        } else {
            throw new Error('Invalid request')
        }
    })
    .catch(err => {
        console.log('error:', err);
        return res.status('400').send(err);
    });
});

app.get("/text/emotion", (req,res) => {
    let analyzeParams = { text: decodeURIComponent(req.query.text), ...EMOTION_PARAMS };

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        console.log(analysisResults.result.entities)
        if (analysisResults && analysisResults.result && analysisResults.result.entities[0] && analysisResults.result.entities[0].emotion) {
            res.send({ ...analysisResults.result.entities[0].emotion });
        } else {
            throw new Error('Invalid request')
        }
    })
    .catch(err => {
        console.log('error:', err);
        return res.status('400').send(err);
    });
});

app.get("/text/sentiment", (req,res) => {
    let analyzeParams = { text: decodeURIComponent(req.query.text), ...SENTIMENT_PARAMS };

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        console.log(analysisResults.result)
        if (analysisResults && analysisResults.result && analysisResults.result.entities[0] && analysisResults.result.entities[0].sentiment && analysisResults.result.entities[0].sentiment.label) {
            res.send({ sentiment: analysisResults.result.entities[0].sentiment.label });
        } else {
            throw new Error('Invalid request')
        }
    })
    .catch(err => {
        console.log('error:', err);
        return res.status('400').send(err);
    });
});

let server = app.listen(8081, () => {
    console.log('Listening', server.address().port)
})
