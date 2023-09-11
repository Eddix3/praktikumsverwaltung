import {
    getAssignments,
    getCurrentRole,
    getCurrentUserId,
    getGrades, getGroupmembers,
    getGroups,
    getWSToken
} from "./moodleFetch.js"

import {getKursListe, kursDatenDB, kursErstellenDB, kursFindenDB} from "./dbConnection.js"

const specialToken = "7227fbf4a8e29fb1dc83c784953a4a48"


/**
 * Generiert Fehlernachricht bei Verbindungsfehler mit dem Moodle-Server
 *
 * @return {{error: boolean, message: string}} Fehlernachricht bei Verbindung mit dem Moodle-Server
 */
export function fehlerBenachrichtigung(fehlerNachricht) {
    return {
        error: true,
        message: fehlerNachricht
    }
}
/**
 * Authentifiziert den User über Nutzername und Passwort über die Moodle API
 *
 * @param {string} username Nutzername
 * @param {string} passwort Passwort
 *
 */
export async function login(username, passwort) {
    try {
        const response1 = (await getWSToken(username, passwort))["data"]
        if (response1["error"]) {
             return response1["error"]
        }
        const response2 = (await getCurrentUserId(response1["token"]))["data"]
        const kursListe = await getKursListe(response2["userid"])
        return {
            wsToken: response1["token"],
            userId: response2["userid"],
            kursListe: kursListe
        }
    }
    catch (e) {
        return fehlerBenachrichtigung(e)

    }
}

/**
 * Prüft, ob die angegebene ID für den Kurs existiert und User Berechtigung für diesen Kurs hat ihn zu erstellen oder zu finden.
 *
 * @param {number} userId Die ID des eingeloggten Users
 * @param {number} courseId Die ID des Kurses
 */
export async function kursErstellenFinden(courseId, userId) {
    try {
        const response1 = (await getCurrentRole(specialToken, userId, courseId))["data"][0] // holt sich antwort aus Lernraum für den Kurs und den eingeloggten User in der Webanwendung
        if (response1["errorcode"]) { // Prüft, ob Kurs existiert
            return fehlerBenachrichtigung( "Geben sie einen gültigen Kurslink an")
        }
        const kurs = response1["enrolledcourses"].find(kurse => kurse["id"] === courseId) // Die ID und Name zum Kurs

        if (response1["roles"].some(rolle => {
            return rolle["roleid"] !== -1
        })) {  // Die Rollen ID des Teachers wird geprüft, ob der den Kurs erstellen darf
            if (await kursErstellenDB(kurs["id"], userId, kurs["fullname"])) { // Erstellt den Kurs, da der Nutzer die nötige Berechtigung hat
                return getKursInfos(specialToken, kurs["id"], userId) //sendet die Daten vom Kurs aus Lernraum und Datenbank
            }
            else {
                return fehlerBenachrichtigung("Kurs ist schon in Kursliste")
            }
        }
        else if (response1["roles"].some(rolle => {
            return rolle["roleid"] !== -1
        })) { //Die Rollen ID des Tutors wird geprüft, ob er den Kurs finden dürfen
            if (await kursFindenDB(kurs["id"], userId)) { // versucht den Kurs zu finden, falls er schon in der Datenbank erstellt wurde
                return getKursInfos(specialToken, kurs["id"], userId) //sendet die Daten vom Kurs aus Lernraum und Datenbank
            }
            else {
                return fehlerBenachrichtigung("Kurs ist schon in Kursliste")
            }
        }
        else {
            return fehlerBenachrichtigung("Sie besitzen nicht die benötigte Berechtigungen für den Kurs")
        }
    } catch (e) {
        return fehlerBenachrichtigung(e)
    }
}


/**
 * Zieht sich die relevanten Daten vom Moodle-Server und von der Datenbank durch den backend-Server.
 * Das Objekt hat die keys id, fullname und shortname
 *
 * @param {string} wsToken Token zur Authentifizierung
 * @param {number} courseId Das Kurs object
 * @param {number} userId Die ID des eingeloggten Users
 *
 * @return{Object} Kursdaten
 */
export async function getKursInfos(wsToken, courseId, userId) {
    try {
        const aufgabenListe = getAssignments(specialToken, courseId)
        const noten = getGrades(specialToken, courseId)
        const datenDB = kursDatenDB(courseId, userId)
        const currentRole =  getCurrentRole(specialToken, userId, courseId)

        const aufgaben = []
        const studenten = []
        const gruppen =  (await  getGroups(specialToken, courseId))["data"].map((gruppe) =>
            ({
                id: gruppe["id"],
                name: gruppe["name"],
            })
        ) // []
        const gruppenMitglieder = (await getGroupmembers(specialToken, gruppen.map(gruppe => gruppe["id"])))["data"]

        return await Promise.all([aufgabenListe, noten, datenDB, currentRole]).then(daten => {
            // Kurs ID und Name werden abgespeichert
            const kurs = {id: daten[0]["data"]["courses"][0]["id"], name: daten[0]["data"]["courses"][0]["fullname"]}
            //aufgaben und aufgabenname
            daten[0]["data"]["courses"][0]["assignments"].forEach(aufgabe => {
                aufgaben.push({id: aufgabe["id"], name: aufgabe["name"]})

            })
            gruppenMitglieder.forEach(gruppe => {
                const gruppenId = gruppe["groupid"]
                for (let i = 0; i < gruppe["userids"].length; i++) {
                    const gradeitems = [] // Alle Noten für die Aufgaben für ein Student
                    const student = daten[1]["data"]["usergrades"].find(student => student["userid"] === gruppe["userids"][i]) // Holt sich noten für die passende ID vom Student
                    const studentDB = Array(daten[2])[0].find((student) => student["id"] === gruppe["userids"][i])
                    student["gradeitems"].forEach(bewertung => {
                        if (bewertung["itemmodule"] === "assign") {
                            const aufgabe = studentDB === undefined ? undefined : studentDB["aufgaben"].find(anwesenheit => anwesenheit["idAufgabe"] === bewertung["iteminstance"])
                            gradeitems.push({
                                id: bewertung["iteminstance"],
                                note: bewertung["gradeformatted"],
                                fortschritt: bewertung["percentageformatted"],
                                maxNote: bewertung["grademax"],
                                feedback: bewertung["feedback"],
                                feedbackformat: bewertung["feedbackformat"],
                                anwesenheit: aufgabe === undefined ? "" : aufgabe["Anwesenheit"]
                            })
                        }
                    })
                    studenten.push({
                        id: student["userid"],
                        name: student["userfullname"],
                        gruppenId: gruppenId,
                        abgebrochen: studentDB === undefined ? false : studentDB["abgebrochen"],
                        betreut: studentDB === undefined ? false : studentDB["betreut"],
                        noten: gradeitems
                    })
                    gruppe["userids"][i] = {
                        id: student["userid"],
                        name: student["userfullname"],
                        noten: gradeitems
                    }
                }
            })
            return {
                data:{
                    kurs: kurs,
                    aufgaben: aufgaben,
                    gruppen: gruppen,
                    studenten: studenten
                },
                roles: daten[3]["data"][0]["roles"].map(role => role["roleid"])
            }
        })

    } catch (e) {
        return fehlerBenachrichtigung(e)
    }
}




