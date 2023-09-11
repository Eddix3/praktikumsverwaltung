import axios from "axios";
const url = 'http://localhost/webservice/rest/server.php/?moodlewsrestformat=json&' // Addresse des moodle kurses mit format json für REST-Anfragen
const webserviceName = 'plan' // nutzt die Kurzbezeichnung des Webservices
const headers = {
    'Access-Control-Allow-Origin': ' http://localhost:5173/'
}


/**
 * Login des Users authentifizieren und Webservice-Token erhalten, um weitere Funktionen auszuführen
 *
 * @param {string} username Der angegebene Username.
 * @param {string} password Das angegebene Passwort.
 *
 * @return {Promise} Beinhaltet bei erfolgreicher Anmeldung das Webservicetoken
 */
export function getWSToken(username, password) {
    return axios.get("http://localhost/login/token.php?", {
        params: {
            username: username,
            password: password,
            service: webserviceName
        }
    })
}

/**
 * Die UserId des eingeloggten Nutzers erhalten
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 *
 * @return {Promise} Die User ID im Lernraum des eingeloggten Users.
 */
export function getCurrentUserId(wsToken) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_webservice_get_site_info",
            "serviceshortnames[0]": webserviceName
        }
    })
}

/**
 * Die Rollen des eingeloggten Nutzers im ausgewählten Kurs erhalten
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 * @param {number} userId Die User ID des eingeloggten Nutzers
 * @param {number} courseId Die Kurs ID des ausgewählten Kurses.
 *
 * @return {Promise} Die Rolle des eingeloggten Users im Kurs.
 */
export async function getCurrentRole(wsToken, userId, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_user_get_course_user_profiles",
            "userlist[0][userid]": userId,
            "userlist[0][courseid]": courseId
        }
    })
}


/**
 * Alle Aufgaben, die der aktuelle eingeloggte User Zugriff drauf hat, im ausgewählten Kurs
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 * @param {number} courseId Die Kurs ID des ausgewählten Kurses.
 *
 * @return {Promise} Die Aufgaben im ausgewählten Kurs
 */
export function getAssignments(wsToken, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "mod_assign_get_assignments",
            "courseids[0]": courseId
        }
    })
}

/**
 * Alle Gruppen aus dem ausgewählten Kurs
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 * @param {number} courseId Die Kurs ID des ausgewählten Kurses.
 *
 * @return {Promise} Alle Gruppen aus dem Kurs
 */
export function getGroups(wsToken, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_group_get_course_groups",
            courseid: courseId
        }
    })
}

/**
 * Alle Studenten aus den Gruppen von dem ausgewählten Kurs
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 * @param {array} groupIds Die Gruppen IDs der Gruppen im Kurs.
 *
 * @return {Promise} Alle Gruppenmitglieder der angegebenen Gruppen
 */
export function getGroupmembers(wsToken, groupIds) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_group_get_group_members",
            //todo hardcoded weil es nicht geht ????
            groupids: groupIds
        }
    })
}

/**
 * Alle Bewertungen der Studenten im Kurs für alle Aufgaben
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 * @param {number} courseId Die Kurs ID des ausgewählten Kurses.
 *
 * @return {Promise} Alle Bewertungen der Studenten im Kurs für alle Aufgaben
 */
export function getGrades(wsToken, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "gradereport_user_get_grade_items",
            courseid: courseId
        }
    })
}

/**
 * Die Note und ein Kommentar als Feedback für die angegebene Aufgabe und User speichern
 *
 * @param {string} wsToken Das Webservicetoken zur Authentifizierung.
 * @param {number} assignId Die ID der Aufgabe.
 * @param {number} userId Die User ID des eingeloggten Nutzers.
 * @param {number} grade Die Punkte für die Aufgabe.
 * @param {string} textInput Das Feedback als Kommentar.
 * @param {number} textFormat Das ausgewählte Textformat.
 *
 * @return {Promise} Ob erfolgreich oder nicht.
 */
export function saveGrade(wsToken, assignId, userId, grade, textInput, textFormat) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "mod_assign_save_grade",
            assignmentid: assignId,
            userid: userId,
            grade: grade,
            "plugindata[assignfeedbackcomments_editor][text]": textInput,
            // folgende Parameter sind notwendig für die POST-Rest-Anfrage aber für die Anwendung nicht relevant
            "plugindata[assignfeedbackcomments_editor][format]": textFormat,
            attemptnumber: -1,
            addattempt: 0,
            workflowstate: "",
            applytoall: 0,
        }}
       )
}
