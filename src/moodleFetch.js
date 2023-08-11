import axios from "axios";
const url = 'http://localhost/webservice/rest/server.php/?moodlewsrestformat=json&' // Addresse des moodle kurses mit format json für REST-Anfragen
const webserviceName = 'plan' // nutzt die Kurzbezeichnung des Webservices
const headers = {
    'Access-Control-Allow-Origin': ' http://localhost:5173/'
}


// Login des Users authentifizieren und Webservice-Token erhalten, um weitere Funktionen auszuführen
export function getWSToken(username, password) {
    return axios.get("http://localhost/login/token.php?", {
        params: {
            username: username,
            password: password,
            service: webserviceName
        }
    })
}

// Die UserId des eingeloggten Nutzers erhalten
export function getCurrentUserId(wsToken) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_webservice_get_site_info",
            "serviceshortnames[0]": webserviceName
        }
    })
}

// Die Rollen des eingeloggten Nutzers im ausgewählten Kurs erhalten
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
// Alle Aufgaben, die der aktuelle eingeloggte User Zugriff drauf hat, im ausgewählten Kurs
export function getAssignments(wsToken, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "mod_assign_get_assignments",
            "courseids[0]": courseId
        }
    })
}


// Die Note und ein Kommentar als Feedback für die angegebene Aufgabe und User speichern
export function saveGrade(wsToken, assignId, userId, grade, textInput, textFormat) {
    return axios.post('http://localhost/webservice/rest/server.php/', {
        wstoken: wsToken,
        wsfunction: "mod_assign_save_grade",
        assignid: assignId,
        userid: userId,
        grade: grade,
        "plugindata[assignfeedbackcomments_editor][text]": textInput,
        // folgende Parameter sind notwendig für die POST-Rest-Anfrage aber für die Anwendung nicht relevant
        "plugindata[assignfeedbackcomments_editor][format]": textFormat,
        attemptnumber: -1,
        addattempt: 0,
        workflowstate: "",
        applytoall: 0,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
    })
}

export function getGroups(wsToken, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_group_get_course_groups",
            courseid: courseId
        }
    })
}

export function getGroupmembers(wsToken, groupIds) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "core_group_get_group_members",
            //todo hardcoded weil es nicht geht ????
            groupids: [1,2,3]
        }
    })
}

export function getGrades(wsToken, courseId) {
    return axios.get(url, {
        params: {
            wstoken: wsToken,
            wsfunction: "gradereport_user_get_grade_items",
            courseid: courseId
        }
    })
}