import {defineStore} from 'pinia'
import {computed, inject, ref} from "vue";
import {
    fetchLogin,
    fetchStudentInfos, getKursInfos,
    kursFindenErstellen,
    updateAnwesenheit, updateNote,
    updateStudentInfos
} from "@/javascript/fetchBackend.js";


export const useVerwaltungsStore = defineStore('praktikumsverwaltung', () => {

    const router = inject('provideRouter')

    const errorMessage = ref("") // Fehlernachricht, falls Fehler auftritt

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
     * Login des Users authentifizieren und Webservice-Token erhalten, um weitere Funktionen auszuführen
     *
     * @param {string} username Der angegebene Username.
     * @param {string} password Das angegebene Passwort.
     *
     */
    function login(username, password) {
        errorMessage.value = ""
         fetchLogin(username, password).then(r => {
             if(r["data"]["error"]) {
                 errorMessage.value = r["data"]["message"]
             }
             else {
                 sessionStorage.setItem('wsToken', String(r["data"]["wsToken"]))
                 sessionStorage.setItem('userId', String(r["data"]["userId"]))
                 sessionStorage.setItem('kursListe', JSON.stringify((r["data"]["kursListe"])))
                 sessionStorage.setItem("currentKursId", "-1")
                 router.push({path: "/"})
             }

         }).catch(() => {
             errorMessage.value = "Server konnte nicht erreicht werden"
         })
    }

    /** Versucht Kurs in der Kursliste des Users hinzuzufügen
     *
     *
     * @param {string} kursLink der angegebene Link zum Kurs
     */
    function kursErstellenFinden(kursLink) {
            const courseId = kursLink.split('id=')[1]
            kursFindenErstellen(sessionStorage.getItem("wsToken"), Number(courseId)).then(r => {
                if(["data"]["error"]) {
                    errorMessage.value = r["data"]["message"]
                }
                else {
                    sessionStorage.setItem("kursListe", JSON.stringify(JSON.parse(sessionStorage.getItem("kursListe")).push(r["data"]["kurs"])))
                    kursBefuellen(r)
                }

            }).catch(() => {
                errorMessage.value = "Server konnte nicht erreicht werden"
            })

    }

    /** Holt sich die Infos zum ausgewählten Kurs
     *
     *
     * @param {number} kursId Angegebene Id im Kurslink
     */
    function fetchKursInfos(kursId) {
        getKursInfos(sessionStorage.getItem("wsToken"), kursId).then(r => {
            if(["data"]["error"]) {
                errorMessage.value = ["data"]["message"]
            }
            else {
                kursBefuellen(r)
            }
        }).catch(() => {
            errorMessage.value = "Server konnte nicht erreicht werden"
        })
    }

    function kursBefuellen(r) {
        studenten.value = r["data"]["studenten"]
        gruppen.value = r["data"]["gruppen"]
        aufgaben.value = r["data"]["aufgaben"]
        sessionStorage.setItem("currentKursId", String(r["data"]["kurs"]["id"]))
        sessionStorage.setItem("currentGroupId", "-1")
        sessionStorage.setItem("abgebrocheneAnzeigen", "0")
        sessionStorage.setItem("betreuteAnzeigen", "0")
        sessionStorage.setItem("notenVerstecken", "0")
        router.replace({name: "kurs", params: {kursid: sessionStorage.getItem("currentKursId")}})
    }




    /**
     * Holt sich die detailierten Informationen für die jeweilige Aufgabe und Student.
     *
     * @param {number} aufgabeId Die ID der Aufgabe
     * @param {number} studentId Die ID des Studenten
     * @return {Object} ...
     */
    function getTerminInfos(studentId, aufgabeId) {
        const student = studenten.value.find(student => student["id"] === studentId)
        const aufgabeName = aufgaben.value.find(aufgabe => aufgabe["id"] === aufgabeId)["name"]
        const note = student["noten"].find(note => note["id"] === aufgabeId)
        return {
            name: aufgabeName,
            student: {
                id: studentId,
                name: student["name"]
            },
            note: note
        }
    }


    /**
     * Holt sich die detailierten Informationen für den ausgewählten Studenten im Kurs.
     *
     * @param {number} studentId Die ID des Studenten
     */
    function getStudentenInfo(studentId) {
        return studenten.value.find(student => student["id"] === studentId)
    }

    /**
     * Sendet eine Anfrage ans Backend, um den Eintrag des Studenten zum ausgewählten Kurs zu erhalten.
     *
     * @param {number} studentId Die ID des Studenten
     *
     */
    async function fetchNotizen(studentId) {
        return await fetchStudentInfos(sessionStorage.getItem("wsToken"), studentId)

    }

    /**
     * Sendet eine Anfrage ans Backend, um den Eintrag des Studenten zum ausgewählten Kurs zu ändern.
     *
     * @param {number} studentId Die ID des Studenten
     * @param {string} notizenDozent Notizen nur einsichtbar von Dozenten
     * @param {string} notizen Notizen allgemein
     * @param {boolean} meinStudent
     * @param {boolean} abgebrochen
     *
     */
    function changeStudentenInfo(studentId,notizenDozent, notizen, meinStudent, abgebrochen) {
        errorMessage.value = ""
        updateStudentInfos(sessionStorage.getItem("wsToken"),notizen, notizenDozent, abgebrochen, studentId, meinStudent, Number(sessionStorage.getItem("userId"))).then(r => {
            if(r["data"]) {
                router.back()
            }
            else {
                errorMessage.value = r["data"]["message"]
            }
        }).catch(() => {
            errorMessage.value = "Server konnte nicht erreicht werden"
        })
    }

    /**
     * Holt sich die detailierten Informationen für die jeweilige Aufgabe und Student.
     *
     * @param {number} aufgabeId Die ID der Aufgabe
     * @param {number} studentId Die ID des Studenten
     * @param {string} anwesenheit Der Anwesenheitsstatus
     */
    function changeAnwesenheit(aufgabeId, studentId, anwesenheit) {
        errorMessage.value = ""
        updateAnwesenheit(sessionStorage.getItem("wsToken"),aufgabeId, studentId, anwesenheit).then(r  => {
            if(r["data"]) {
                studenten.value.find(student => student["id"] === studentId)["noten"].find(note => note["id"] === aufgabeId)["anwesenheit"] = anwesenheit
            }
            else {
                errorMessage.value = r["data"]["message"]
            }
        }).catch(() => {
            errorMessage.value = "Server konnte nicht erreicht werden"
        })
    }


    /**
     * Ändert die Bewertung einer Aufgabe für einen Studenten
     *
     * @param {number} aufgabeId Die ID der Aufgabe
     * @param {number} studentId Die ID des Studenten
     * @param {string} grade Die Punktebewertung
     * @param {string} textInput Kommentar als Feedback
     * @param {number} textFormat Das Textformat
     */
    function changeNote(aufgabeId, studentId, grade, textInput, textFormat) {
        errorMessage.value = ""
        const newGrade = Number(grade.replace(/,/, "."))
        updateNote(sessionStorage.getItem("wsToken"), aufgabeId, studentId, newGrade, textInput, textFormat).then(r => {
        if(r["data"]["error"]) {
            errorMessage.value = r["data"]["message"]
        }
        else {
            const student = studenten.value.find(student => student["id"] === studentId)["noten"].find(note => note["id"] === aufgabeId)
            student["note"] = grade
            student["feedback"] = textInput
            student["fortschritt"] = ((newGrade / student["maxNote"]).toFixed(2) + " %").replace(/./, ",")
            router.back()
        }

    }).catch(() => {
            errorMessage.value = "Server konnte nicht erreicht werden"

        })
    }

    function routeBack() {
        router.back()
    }



    return {
        errorMessage,
        aufgaben,
        gruppen,
        studenten,
        alleGruppen,
        anwesenheitsTypen,
        login,
        kursErstellenFinden,
        fetchKursInfos,
        changeAnwesenheit,
        getTerminInfos,
        getStudentenInfo,
        changeStudentenInfo,
        fetchNotizen,
        changeNote,
        routeBack,
        router
    }
})