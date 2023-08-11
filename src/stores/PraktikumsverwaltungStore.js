import {defineStore} from 'pinia'
import {
    getAssignments, getCurrentRole, getCurrentUserId,
    getGrades,
    getGroupmembers,
    getGroups,
    getWSToken, saveGrade
} from "@/moodleFetch.js";
import {computed, inject, ref} from "vue";
import {useRoute} from "vue-router";
import {getKursDatenDB, getKursListeDB, kursFindenDB, updateAnwesenheit} from "@/dbFetch.js";

export const useVerwaltungsStore = defineStore('praktikumsverwaltung', () => {
    // arrow function recommended for full type inference
    const route = useRoute()
    const router = inject('provideRouter')
    const wsToken = ref("8d415518c32b2afbd8e026effb126c9d")
    //todo change user id to empty
    const userId = ref(2)
    const errorMessage = ref("HURENSOHN")
    const kurs = ref({}) // {id: , name:, rolleId: }
    const kursListe = ref([])
    const aufgaben = ref([]) // [{id: , name: }]
    const gruppen = ref([])

    const studenten = ref([])

    const alleGruppen = computed(() => [{
        id: -1,
        name: "Alle Gruppen"}].concat(gruppen.value))

    const anwesenheitsTypen = computed(() =>
        Array("anwesend", "abwesend", "krank", "entschuldigt")
    )
    /**
     * Generiert Fehlernachricht bei Verbindungsfehler mit dem Backend-Server
     *
     * @return {string} Fehlernachricht bei Verbindung mit dem Backend-Server
     */
    function verbindungsfehlerDB() {
        return errorMessage.value = "Die Datenbank konnte nicht erreicht werden"
    }

    /**
     * Generiert Fehlernachricht bei Verbindungsfehler mit dem Moodle-Server
     *
     * @return {string} Fehlernachricht bei Verbindung mit dem Moodle-Server
     */
    function verbindungsfehlerMoodle() {
        return errorMessage.value = "Der Lernraum konnte nicht erreicht werden"
    }
    /**
     * Prüft und authentifiziert den User über Nutzername und Passwort über die Moodle API
     *
     * @param {string} username Nutzername
     * @param {string} passwort Passwort
     */
    function login(username, passwort) {
        getWSToken(username, passwort).then(response => {
            // Login ist fehlgeschlagen, wegen falschem Passwort oder Username
            if (response.data.hasOwnProperty("error")) {
                errorMessage.value = response["data"]["error"]
            }
            //Login war erfolgreich
            if (response.data.hasOwnProperty("token")) {
                wsToken.value = response["data"]["token"]
                getCurrentUserId(wsToken.value).then(response => {
                    userId.value = response["data"]["userid"]
                    //holt sich die Kursliste aus der Datenbank
                    getKursListeDB(userId.value).then(response => {
                        //todo vll ändern
                        console.log("Login erfolgreich")
                    }).catch(() => {
                        // Backend-Server konnte nicht erreicht werden
                        verbindungsfehlerDB()
                    })
                }).catch(() => {
                    verbindungsfehlerMoodle()
                })
                router.push({path: "/"})
            }
        }).catch(() => {
               // login fehlgeschlagen
                verbindungsfehlerMoodle()
            })
    }

    /**
     * Prüft ob die angegebene ID für den Kurs existiert und User Berechtigung für diesen Kurs hat ihn zu erstellen oder zu finden.
     *
     * @param {number} courseId Die ID des Kurses
     */
    // todo kursErstellenFinden
    function kursErstellenFinden(courseId) {
        getCurrentRole(wsToken.value,userId.value,courseId).then(response => {
            // KursID existiert nicht im Lernraum
            if(response["data"].hasOwnProperty("errorcode")) {
                errorMessage.value = "Geben sie einen gültigen Kurslink an"
            }
            //todo auf das backend die Logik verlegen maybe
            //Die Rollen ID des Teachers wird geprüft, ob der den Kurs erstellen darf
            else if(response["data"][0]["roles"].some(rolle => { return rolle["roleid"] === 3})) {
                console.log("ICH BIN HIER ")
                console.log(response["data"][0]["enrolledcourses"])
                console.log(response["data"][0]["enrolledcourses"].find(kurs => kurs["id"] === Number(courseId)))
                // Erstellt den Kurs, da der Nutzer die nötige Berechtigung hat
                kursErstellen(response["data"][0]["enrolledcourses"].find(kurs => kurs["id"] === courseId))
            }
            //Die Rollen ID des Tutors wird geprüft, ob er den Kurs finden dürfen
            else if(response["data"][0]["roles"].some(rolle => { return rolle["roleid"] === 4})) {
                // versucht den Kurs zu finden, falls er schon in der Datenbank erstellt wurde
                kursFinden(response["data"][0]["enrolledcourses"].find(kurs => kurs.id === Number(courseId)))
            }
            else {
                errorMessage.value = "Sie besitzen nicht die benötigte Berechtigungen für den Kurs"
            }

        }).catch(() => {
            verbindungsfehlerMoodle()
        })
    }

    /**
     *  Versucht den Kurs in der Datenbank über die Backend-API zu erstellen
     *
     * Das object hat die keys id, fullname und shortname
     * @param {Object}  kurs Kurs object.
     */
     function kursErstellen(kurs) {
        kursErstellenDB(kurs["id"], userId.value, kurs["fullname"]).then(response => {
            //todo response vll verarbeiten
                getKursInfos(kurs)
        }
        ).catch(() => {
            // Der Backend-Server konnte nicht erreicht werden
            verbindungsfehlerDB()
        })

    }

    /**
     * Versucht den Kurs für den eingeloggten Nutzer in der Datenbank zu finden.
     *
     * Das object hat die keys id, fullname und shortname
     * @param {object} a Das Kurs object.
     */
    function kursFinden(kurs) {
        kursFindenDB(kurs["id"], userId.value).then(response => {
                //todo Abfangen ob der Kurs schon erstellt wurde oder erst von jemanden mit gültiger rollen berechtigung erstellt werden muss
                getKursInfos(kurs)
            }
        ).catch(() => {
            // Der Backend-Server konnte nicht erreicht werden
            verbindungsfehlerDB()
        })
    }


    /**
     * Zieht sich die relevanten Daten vom Moodle-Server und von der Datenbank durch den Backend-Server.
     *
     * Das object hat die keys id, fullname und shortname
     * @param {object} a Das Kurs object.
     */

    //todo die hauptfunktion die alles vereint ordentlich zusammen schreiben alle promises ranholen und dann damit arbeiten
    function getKursInfos(kurs) {
        kurs.value = {name: kurs["fullname"], id: kurs["id"]}
        getAufgaben(kurs.value["id"])
        getStudenten(kurs.value["id"])
    }

// Holt sich die AufgabenListe aus dem Lernraum für den Kurs
    function getAufgaben(courseId) {
        //todo gucken ob kurs schon erstelt wurde oder nicht und außerdem checken ob der user die rechte hat den kurs zum verwalten hinzuzufügen über datenbank
        //todo change ws token to store wstoken
        getAssignments('8d415518c32b2afbd8e026effb126c9d', courseId).then(response => {
            if (response.hasOwnProperty("message")) {

            } else {
                kurs.value = {id: response.data["courses"][0]["id"], name: response.data["courses"][0]["fullname"]}
                response.data["courses"][0]["assignments"].forEach(aufgabe => {
                    aufgaben.value.push({id: aufgabe["id"], name: aufgabe["name"]})

                })
                console.log(aufgaben.value)
            }
        }).catch(err => {
            errorMessage.value = "Fehler beim Aufruf der Lernraum-Daten"
        })
    }

    async function getStudenten(courseId) {
        //todo use this in the store as method if multiple uses
        //todo change ws token to store wstoken
        const gruppenIds = []
        getGroups('8d415518c32b2afbd8e026effb126c9d', courseId).then(response => {
            response.data.forEach(gruppe => {
                gruppen.value.push({
                    id: gruppe["id"],
                    name: gruppe["name"],
                })
                gruppenIds.push(gruppe["id"])

            })
        }).catch(err => {
            //todo falls fehlgeschlagen
        })
        console.log(gruppenIds)
        const noten = []
        await getGrades('8d415518c32b2afbd8e026effb126c9d', courseId).then(response => {
            noten.push(response.data["usergrades"])
            console.log(noten)

        }).catch(() => {

        })

        //todo gruppenId als array geht nicht aus irgendeinen grund ????
        await getGroupmembers('8d415518c32b2afbd8e026effb126c9d', gruppenIds).then(response => {
            console.log(response)
            for (let i = 0; i < response.data.length; i++) {
                console.log(`halllo ${i}`)
                const studentenProGruppe = []
                gruppen.value[i]["studenten"] = response.data[i]["userids"]
                console.log(gruppen.value)
                //id: , name: , email: , stand: , note: , meinStudent: , notizenDozent: , notizenStudent: ,
            }
        }).catch(() => {

        })
        await getGrades('8d415518c32b2afbd8e026effb126c9d', courseId).then(response => {
            getKursDatenDB(courseId,userId).then(anwesenheitsListe => {
                console.log(anwesenheitsListe)
                gruppen.value.forEach(gruppe => {
                    const gruppenId = gruppe["id"]
                    for (let i = 0; i < gruppe["studenten"].length; i++) {
                        // const studentenId = gruppe["studenten"][i]
                        const gradeitems = []
                        const student = response.data["usergrades"].find(student => student["userid"] === gruppe["studenten"][i])
                        student["gradeitems"].forEach(bewertung => {
                            let anwesenheit = getAnwesenheit(anwesenheitsListe["data"], bewertung["iteminstance"], student["userid"])
                            if (bewertung["itemmodule"] === "assign") {
                                gradeitems.push({
                                    id: bewertung["iteminstance"],
                                    note: bewertung["gradeformatted"],
                                    fortschritt: bewertung["percentageformatted"],
                                    maxNote: bewertung["grademax"],
                                    feedback: bewertung["feedback"],
                                    feedbackformat: bewertung["feedbackformat"],
                                    anwesenheit: anwesenheit === undefined ? "" : anwesenheit["Anwesenheit"]
                                })
                            }
                        })
                        studenten.value.push({
                            id: student["userid"],
                            name: student["userfullname"],
                            gruppenId: gruppenId,
                            noten: gradeitems
                        })

                        gruppe["studenten"][i] = {
                            id: student["userid"],
                            name: student["userfullname"],
                            noten: gradeitems
                        }
                    }
                })
            }).catch()

        }).catch(() => {

        })
        console.log(studentenNoten.value)
        testconsole()
        router.push({path: "/kurs"})

    }

    /**
     * Holt sich die passende Anwesenheit für den passenden Studenten und Aufgaben.
     *
     * Das object hat die keys id, fullname und shortname
     * @param {array} anwesenheitsliste Das Kurs object.
     * @param {number} aufgabenId Das Kurs object.
     * @param {number} studentId Das Kurs object.
     * @return {Object} aufgabenId The sum of the two numbers.
     */
    function getAnwesenheit(anwesenheitsliste, aufgabenId, studentId) {
        return anwesenheitsliste.find(anwesenheit => anwesenheit["idAufgabe"] === aufgabenId && anwesenheit["Student_idStudent"] === studentId)
    }
    /**
     * Holt sich die detailierten Informationen für die jeweilige Aufgabe und Student.
     *
     * @param {number} aufgabeId Die ID der Aufgabe
     * @param {number} studentId Die ID des Studenten
     * @return {Object} ...
     */
    function getTerminInfos(studentId,aufgabeId) {
        const student = studenten.value.find(student => student["id"] === studentId)
        console.log(student)
        console.log(aufgabeId)
        const aufgabeName = aufgaben.value.find(aufgabe => aufgabe["id"] === aufgabeId)["name"]
        console.log(aufgabeName)
        const note = student["noten"].find(note => note["id"] === aufgabeId)
        console.log(note)
        return {
            name: aufgabeName,
            student: {
                id: studentId,
                name:student["name"]
            },
            note: note
        }
    }


    /**
     * Holt sich die detailierten Informationen für die jeweilige Aufgabe und Student.
     *
     * @param {number} studentId Die ID des Studenten
     * @return {Object} ...
     */
    function getStudentenInfo(studentId) {
        return studenten.value.find(student => student["id"] === studentId)
    }

    /**
     * Sendet die angegebene Note und Feedback als Kommentar zur Moodle API.
     *
     * @param {number} aufgabeId Die ID der Aufgabe
     * @param {number} studentId Die ID des Studenten
     * @param {string} note Die ID der Aufgabe
     * @param {string} feedback Die ID des Studenten
     * @param {number} feedbackFormat Die ID der Aufgabe
     */
    function sendNotetoMoodle(aufgabeId, studentId, note, feedback, feedbackFormat) {
        saveGrade(wsToken.value, aufgabeId, studentId, note, feedback, feedbackFormat).then( r =>
            r["data"] === null ? console.log("hat geklappt") : errorMessage.value = r["data"]["message"]
        ).catch(() => errorMessage.value = "Moodle Server konnte nicht erreicht werden")

    }

    function testconsole() {
        console.log(studentenNoten.value)
        console.log(gruppen.value)
        console.log(aufgaben.value)
    }

    function kursErstellenDB() {

    }

    function isNotLoggedIn() {
        return wsToken.value.length === 0
    }


    function test() {
    }

    function changeAnwesenheit(aufgabeId, studentId, anwesenheit) {
        console.log("ich will die anwesenheit updaten brooo")
        updateAnwesenheit(aufgabeId,studentId,anwesenheit, kurs.value["id"])
    }

    return {
        wsToken,
        errorMessage,
        kurs,
        aufgaben,
        gruppen,
        studenten,
        alleGruppen,
        login,
        kursErstellenFinden,
        isNotLoggedIn,
        test,
        changeAnwesenheit,
        getTerminInfos,
        sendNotetoMoodle,
        getStudentenInfo,
        anwesenheitsTypen
    }
})