import express from "express"
import cors from "cors";
import {getKursListe, kursErstellen, kursFinden, kursInfos, updateAnwesenheit, updateStudent} from "./dbConnection.js";
import * as bodyParser from "express";
const app = express()


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


// todo beim login die Kursliste vom user ziehen und vll auch mögliche Accounteinstellungen
app.get('/apidb/login', function (req, res, next) {
    res.send(getKursListe(req.query["id"]))
})

//todo kurs erstellen anfrage
app.get('/apidb/erstellekurs', function (req, res, next) {
    res.send(kursErstellen(req.query["kursid"], req.query["userid"], req.query["kursname"]))
})

//todo kurs finden anfrage
app.get('/apidb/findekurs', function (req, res, next) {
    res.send(kursFinden(req.query["kursid"], req.query["userid"]))
})

//todo alle Informationen die notwendig sind für die kurs ansicht
app.get('/apidb/kurs', function (req, res, next) {
    console.log("BRO WAS GEHT HIER AB")
    console.log(kursInfos(req.query["kursid"], req.query["userid"]))
    kursInfos(req.query["kursid"], req.query["userid"]).then(data => {
        console.log(data)
        res.json(data)
        console.log("Bruder muss los")
    })
})

//todo wenn jemand info über einen student haben will
app.get('/apidb/studentinfo', function (req, res, next) {
//todo mach mal

})

//todo wenn jemand info die aufgabe für einen studenten updaten will
app.post('/apidb/anwesenheit', function (req, res, next) {
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



app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})