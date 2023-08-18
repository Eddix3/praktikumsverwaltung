import express from "express"
import cors from "cors";
import {updateAnwesenheit, updateStudent} from "../backend/dbConnection.js"
import {kursErstellenFinden} from '../backend/helper.js'
import * as bodyParser from "express";
const app = express()

const authorizedTokens = []

app.use(cors())

app.use(bodyParser.json());

/*
app.use('/api', function(req, res, next){
    var key = req.query['api-key'];

    // key isn't present
    if (!key) return next(error(400, 'api key required'));

    // key is invalid
    if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))

    // all good, store req.key for route access
    req.key = key;
    next();
});

 */


// todo beim login die Kursliste vom user ziehen und vll auch mögliche Accounteinstellungen und ws Token
app.post('/login', function (req, res, next) {
    res.send(req["body"])
})

//todo kurs erstellen finden anfrage
app.post('/kursfindenerstellen', function (req, res, next) {
    const data = req.body
    kursErstellenFinden(data.wstoken, data.userid, data["courseid"])
})

//todo alle Informationen die notwendig sind für die kurs ansicht
app.post('/getkursinfos', function (req, res, next) {
    const data = req.body
    res.send(kursErstellenFinden(data.wstoken, data.userid, data["courseid"]))

})

//todo wenn jemand info über einen student haben will
app.get('/apidb/studentinfo', function (req, res, next) {
//todo mach mal

})

//todo wenn jemand info die aufgabe für einen studenten updaten will
app.post('/apidb/updateanwesenheit', function (req, res, next) {
    const data = req.body;
    updateAnwesenheit(data["aufgabenid"], data["studentid"], data["anwesenheit"], data["kursid"]).then(data => {

        res.send("hallo wie gehts")

    })

})

//todo wenn jemand die StudentenInfo updaten will
app.post('/apidb/updatestudent', function (req, res, next) {
        console.log("hier?")
        updateStudent(req.query["notizen"], req.query["notizendozent"], req.query["abgebrochen"],req.query["studentid"], req.query["kursid"], req.query["favorisiert"], req.query["userid"]).then(
            response =>
            res.send("lucky bro"))


})

//todo wenn jemand die note im lernraum updaten will
app.post('/apidb/updatenote', function (req, res, next) {

})



app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})