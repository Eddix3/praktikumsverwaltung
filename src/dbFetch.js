import axios from "axios";
const url = 'http://localhost:3000/apidb/' // Addresse für Rest-Server um mit der Datenbank zu kommunizieren

//todo
export function getKursListeDB(userId) {
    return axios.get(url + "login", {
        params: {
            id: userId
        }
    })
}

//todo
export function kursErstellenDB(kursId, userId, kursName) {
    return axios.get(url + "erstellekurs", {
        params: {
            kursid: kursId,
            userid: userId,
            kursname: kursName
        }
    })
}

export function kursFindenDB(kursId, userId, kursName) {
    return axios.get(url + "findekurs", {
        params: {
            kursid: kursId,
            userid: userId,
        }
    })
}
//todo alle notwendigen information für den ausgewählten kurs fetchen
export function getKursDatenDB(kursId, userId) {
    return axios.get(url + "kurs", {
        params: {
            kursid: kursId,
            userid: userId
        }
    })
}

export function updateAnwesenheit(aufgabenId, studentId, anwesenheit, kursId) {
    console.log(`${aufgabenId} ${studentId} ${anwesenheit} ${kursId}`)
    return axios.post(url + "anwesenheit", {
            aufgabenid: aufgabenId,
            studentid: studentId,
            anwesenheit: anwesenheit,
            kursid: kursId
    })
}

export function updateStudentenInfo(notizen, notizenDozent, abgebrochen, studentId, kursId) {
    return axios.post(url + "student", {
        notizen: notizen,
        notizendozent: notizenDozent,
        abgebrochen: abgebrochen,
        studentid: studentId,
        kursid: kursId

    })
}

/*export function updateStudentenInfo(notizen, notizenDozent, abgebrochen, studentId, kursId, favorisiert, userId) {
    return axios.post(url + "student", {
        params: {
            notizen: notizen,
            notizendozent: notizenDozent,
            abgebrochen: abgebrochen,
            studentid: studentId,
            kursid: kursId,
            favorisiert: favorisiert,
            userid: userId
        }
    })
}

 */





