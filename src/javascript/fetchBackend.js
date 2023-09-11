import axios from "axios"
import config from "../javascript/config.js"

const endPunkte = config.backendServer.apiEndpunkte
const url = config.backendServer.baseurl
const keys = config.backendServer.fetchKeys
/**
 * Login des Users authentifizieren und Webservice-Token erhalten, um weitere Funktionen auszuführen
 *
 * @param {string} username Der angegebene Username.
 * @param {string} password Das angegebene Passwort.
 *
 * @return {Promise} Beinhaltet bei erfolgreicher Anmeldung das Webservicetoken
 */
export function fetchLogin(username, password) {
    return axios.post(url + endPunkte.login, {
        [keys.username] : username,
        [keys.password]: password,
    }, {
        withCredentials: true
    })
}

export function kursFindenErstellen(wsToken, courseId) {
    return axios.post(url + endPunkte.kursFindenErstellen, {
        [keys.wsToken]: wsToken,
        [keys.kursId]: courseId
    }, {
        withCredentials: true
    })
}

export function getKursInfos(wsToken, courseId) {
    return axios.post(url + endPunkte.getkursInfos, {
        [keys.wsToken]: wsToken,
        [keys.kursId]: courseId,
    }, {
        withCredentials: true
    })
}

export function fetchStudentInfos(wsToken, studentId) {
    return axios.post(url + endPunkte.studentInfo, {
        [keys.wsToken]: wsToken,
        [keys.studentId]: studentId,
    }, {
        withCredentials: true
    })
}

export function updateAnwesenheit(wsToken,aufgabenId, studentId, anwesenheit) {
    return axios.post(url + endPunkte.updateAnwesenheit, {
        [keys.wsToken]: wsToken,
        [keys.aufgabenId]: aufgabenId,
        [keys.studentId]: studentId,
        [keys.anwesenheit]: anwesenheit,
    }, {
        withCredentials: true
    })
}

export function updateStudentInfos(wsToken, notizen, notizenDozent, abgebrochen, studentId, favorisiert, userId) {
    return axios.post(url + endPunkte.updateStudent, {
        [keys.wsToken]: wsToken,
        [keys.notizen]: notizen,
        [keys.notizenDozent]: notizenDozent,
        [keys.abgebrochen]: abgebrochen,
        [keys.studentId]: studentId,
        [keys.favorisiert]: favorisiert,
        [keys.userId]: userId,

    }, {
        withCredentials: true
    })
}

export function updateNote(wsToken, aufgabenId, studentId, grade, textInput, textFormat) {
    return axios.post(url + endPunkte.updateNote, {
        [keys.wsToken]: wsToken,
        [keys.aufgabenId]: aufgabenId,
        [keys.studentId]: studentId,
        [keys.grade]: grade,
        [keys.textInput]: textInput,
        [keys.textFormat]: textFormat

    }, {
        withCredentials: true
    })
}





