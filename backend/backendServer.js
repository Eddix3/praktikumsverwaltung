import express from "express"
import cors from "cors";
import {getStudentInfoDB, updateAnwesenheit, updateStudent} from "./dbConnection.js"
import {fehlerBenachrichtigung, getKursInfos, kursErstellenFinden, login} from './helper.js'
import * as bodyParser from "express";
import session from "express-session"
import config from "../src/javascript/config.js"
import {saveGrade} from "./moodleFetch.js";
import backendConfig from "./backendConfig.js";

const endPunkte = config.backendServer.apiEndpunkte
const keys = config.backendServer.fetchKeys
const dozentRoleId = backendConfig.dozentRoleId

export const app = express()

app.use(session({
    secret: 'Geheim', // Geheimnis zur Verschlüsselung der Sitzungsdaten, sollte ausgelagert werden
    resave: false,             // Sitzung bei jeder Anfrage speichern
    saveUninitialized: false   // uninitialisierte Sitzung speichern
}));

app.use(cors({ // fürs lokale Testen
    origin: true,
    credentials: true, // Aktiviere das Senden und Empfangen von Cookies
}))

app.use(bodyParser.json());

function isAuthorized(req, res, next) {
    const token = req.session.wsToken
    if (token !== req["body"][keys.wsToken]) {
        return res.status(401).json({ message: 'Kein Token' })
    }
    next();
}

app.post(endPunkte.login, async function (req, res, next) {
    try {
        const data = req.body
        const response = await login(data[[keys.username]], data[keys.password])
        if(response["error"]) {
            res.send(response)
        }
        else {
            req.session.wsToken = response["wsToken"]
            req.session.userId = response["userId"]
            res.send({
                wsToken: response["wsToken"],
                kursListe: response["kursListe"],
            })
        }
    }
    catch {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }
})

app.post(endPunkte.kursFindenErstellen, isAuthorized, async function (req, res, next) {
    try {
        const data = req.body
        const response = await kursErstellenFinden(data[keys.kursId], req.session.userId)
        if(response["error"]) {
            res.send(response)
        }
        else {
            req.session.roles = response["roles"]
            req.session.kursId = response["data"]["kurs"]["id"]
            res.send(response["data"])
        }
    }
    catch (e) {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }
})

app.post(endPunkte.getkursInfos, isAuthorized,async function (req, res, next) {
    try {
        const data = req.body
        const response = await getKursInfos(data[keys.wsToken], data[keys.kursId], req.session.userId)
        if(response["error"]) {
            res.send(response)
        }
        else {
            req.session.roles = response["roles"]
            req.session.kursId = response["data"]["kurs"]["id"]
            res.send(response["data"])
        }

    } catch (e) {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }

})

app.post(endPunkte.studentInfo, isAuthorized, async function (req, res, next) {
    try {
        const data = req.body;
        const response = await getStudentInfoDB(data[keys.studentId], req.session.kursId, req.session.roles.includes(dozentRoleId))
        if(response["error"]) {
            res.send(response)
        }
        else {
            res.send(response)
        }


    } catch (e) {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }

})

app.post(endPunkte.updateAnwesenheit, isAuthorized,async function (req, res, next) {
    try {
        const data = req.body;
        const response = await updateAnwesenheit(data[keys.aufgabenId], data[keys.studentId], data[keys.anwesenheit], req.session.kursId)
        if(response) {
            res.send(response)
        }
        else {
            res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
        }
    } catch (e) {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }


})

app.post(endPunkte.updateStudent, isAuthorized, async function (req, res, next) {
    try {
        const data = req.body;
        const response = await updateStudent(data[keys.notizen], data[keys.notizenDozent], data[keys.abgebrochen], data[keys.studentId], req.session.kursId, data[keys.favorisiert], req.session.userId, req.session.roles.includes(dozentRoleId))
        if(response) {
            res.send(response)
        }
        else {
            res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
        }
    } catch (e) {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }

})

app.post(endPunkte.updateNote, async function (req, res, next) {
    try {
        const data = req.body;
        const response = await saveGrade(data[keys.wsToken], data[keys.aufgabenId],data[keys.studentId], data[keys.grade], data[keys.textInput], data[keys.textFormat])
        if(response["errorcode"]) {
            res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
        }
        else {
            res.send(true)
        }
    } catch (e) {
        res.send(fehlerBenachrichtigung("Fehlgeschlagen"))
    }
})



app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})