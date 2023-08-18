import mariadb from "mariadb"

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    port: 3308,
    password: "1234",
    database: "mydb",
    connectionLimit: 10
});

/**
 * Holt sich die Liste der Kurse für den eingeloggten User.
 *
 * @param {number} userId Die ID des eingeloggten Nutzers.
 *
 * @return {Promise} Ob das Update geklappt hat oder nicht.
 */
export async function getKursListe(userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query("SELECT * FROM teacher WHERE idTeacher = ?", [userId])
        if (rows.length === 0) {
            await connection.query("INSERT INTO teacher(idTeacher) VALUES(?)", [userId])
        }
        return await connection.query("SELECT Kurs_idKurs FROM kursliste WHERE Teacher_idTeacher = ?", [userId]).then(data => {
            return data.map((kurs) => ({
                id: kurs["Kurs_idKurs"]
            }))

        }).catch()
        //todo catch regeln
    } catch (err) {
        console.log("failed")
        console.log(err)
    } finally {
        await connection.release()
    }
}

/**
 * Erstellt den Kurs, falls nicht vorhanden und
 *
 * @param {number} kursId Die ID des Kurses.
 * @param {number} userId Die ID des eingeloggten Users.
 * @param {string} kursName Der Name des Kurses.
 *
 * @return {Promise} Ob das Update geklappt hat oder nicht.
 */
export async function kursErstellenDB(kursId, userId, kursName) {
    let connection;
    try {
        connection = await pool.getConnection();
        const row1 = await connection.query("SELECT * FROM kurs WHERE idKurs = ?", [kursId])
        console.log(row1)
        if (row1.length === 0) {
            await connection.query("INSERT INTO kurs(idKurs,name) VALUES(?,?)", [kursId, kursName])
        }
        const row2 = await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [kursId, userId])
        console.log(row2)
        if (row2.length === 0) {
            console.log("hier now")
            await connection.query("INSERT INTO kursliste(Kurs_idKurs,Teacher_idTeacher) VALUES(?,?)", [kursId, userId])
        }
        return true
    } catch (err) {
        console.log("failed Funktion kursErstellen")
        console.log("err")
        return false
    } finally {
        await connection.release()
    }
}

/**
 * Findet den Kurs, falls vorhanden
 *
 * @param {number} kursId Die ID des Kurses.
 * @param {number} userId Die ID des eingeloggten Users.
 *
 * @return {Promise} Ob der Kurs schon in der Datenbank vorhanden ist oder nicht.
 */
export async function kursFindenDB(kursId, userId) {
    let connection;
    try {
        //todo prüfen und dann was sinnvolles zurück senden je nachdem ob der kurs gefunden wurde oder nicht
        connection = await pool.getConnection();
        console.log("it work")
        const row1 = await connection.query("SELECT * FROM kurs WHERE idKurs = ?", [kursId])
        console.log(row1)
        if (row1.length === 0) {
            return false
        } else {
            const row2 = await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [kursId, userId])
            if (row2.length === 0) {
                await connection.query("INSERT INTO kursliste(Kurs_idKurs, Teacher_idTeacher) VALUES(?,?)", [kursId, userId])
            }
            return true
        }
    } catch (error) {
        console.log("failed")
        console.log(error)
        return false
    } finally {
        await connection.release()
    }
}

/**
 * Findet den Kurs, falls vorhanden
 *
 * @param {number} kursId Die ID des Kurses.
 * @param {connection}  Die ID des eingeloggten Users.
 *
 * @return {Promise} Ob der Kurs schon in der Datenbank vorhanden ist oder nicht.
 */
async function kursInDB(conn, kursId) {
    try {
        const row = await conn.query("SELECT * FROM kurs WHERE idKurs = ?", [kursId])
        console.log(row)
        return row.length === 0
    } catch {

    }


}

/**
 * Holt sich die nötigen Informationen für die Standardkursansicht
 *
 * @param {number} kursId Die ID des Kurses.
 * @param {number} userId Die ID des eingeloggten Users.
 *
 * @return {Promise} sendet die Kursdaten
 */
//todo anwesenheit kriegen von Studenten im Kurs
export async function kursDatenDB(kursId, userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        //für die Anwesenheiten im Kurs
        const aufgaben = connection.query("SELECT aufgabe.idAufgabe, aufgabe.Student_idStudent, aufgabe.Anwesenheit FROM aufgabe INNER JOIN student ON aufgabe.Student_idStudent = student.idStudent WHERE student.idKurs = ?",
            [kursId])
        const studenten = connection.query("SELECT idStudent, Abgebrochen FROM student WHERE idKurs = ?",
            [kursId])
        const betreuung = connection.query("SELECT Student_idStudent FROM betreuung WHERE Student_idKurs = ? AND Teacher_idTeacher = ?", [kursId, userId])

        return await Promise.all([studenten, betreuung, aufgaben]).then((daten) => {
            const studentenListe = []
            daten[0].forEach(data => {
                    studentenListe.push({
                        id: data["idStudent"],
                        abgebrochen: data["abgebrochen"] === 1,
                        betreut: daten[1].some(student => student["Student_idStudent"] === data["idStudent"]),
                        aufgaben: daten[2].filter(aufgabe => aufgabe["Student_idStudent"] === data["idStudent"])
                    })


                }
            )
            return studentenListe
            //console.log(betreuung)
        })
    } catch (error) {
        console.log("failed")
        console.log(error)
    } finally {
        await connection.release()
    }
}



/**
 * Updated die Notizen, Notizen(Dozent) und ob der Student abgebrochen, sowie ob der Student von dem eingeloggten User für die Betreuung markiert wurde.
 *
 * @param {number} aufgabenId Die ID der Aufgabe.
 * @param {number} studentId Die ID des Studenten.
 * @param {number} kursId Die ID des Kurses.
 * @param {String} anwesenheit Der Anwesenheitsstatus.
 *
 * @return {Promise} Ob das Update geklappt hat oder nicht.
 */
//todo befehl zum updaten von der Anwesenheit zum jeweiligen Termin für Aufgabe x
export async function updateAnwesenheit(aufgabenId, studentId, anwesenheit, kursId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const row1 = await connection.query("SELECT * FROM student WHERE idStudent = ?", [studentId])
        // Student wurde noch nicht im Studententable erstellt
        if (row1.length === 0) {
            console.log("hier drin ?")
            await connection.query("REPLACE INTO student(idStudent, idKurs, Notizen, NotizenDozent, Abgebrochen) VALUE(?,?,?,?,?)",
                [studentId, kursId, "", "", 0])
        }
        const rows = await connection.query("REPLACE INTO aufgabe(idAufgabe, Student_idStudent, Anwesenheit) VALUE(?,?,?)", [aufgabenId, studentId, anwesenheit])
        console.log(rows)
    } catch (error) {
        console.log("failed updateAnwesenheit")
        console.log(error)
    } finally {
        await connection.release()
    }
}

/**
 * Updated die Notizen, Notizen(Dozent) und ob der Student abgebrochen, sowie ob der Student von dem eingeloggten User für die Betreuung markiert wurde.
 *
 * @param {string} notizen Notizen.
 * @param {string} notizenDozent Die Notizen die nur für den Dozenten.
 * @param {boolean} abgebrochen Ob der Student den Kurs abgebrochen hat.
 * @param {number} studentId Die ID des Studenten.
 * @param {number} kursId Die ID des Kurses.
 * @param {boolean} favorisiert der Student von der eingeloggten als Betreuter markiert hat.
 * @param {number}  userId Die ID des eingeloggten Users.
 *
 * @return {Promise} Ob das Update geklappt hat oder nicht.
 */
//todo befehl zum updaten von Studententable für Notizen, Notizen(tutor), abgebrochen, ob student favorisiert wurde
//todo wenn die betreuung erstellt wird und der user nicht existiert den User zuerst erstellen
//todo unterscheiden zwischen dozent und eintrag nur von tutor
export async function updateStudent(notizen, notizenDozent, abgebrochen, studentId, kursId, favorisiert, userId) {
    let connection;
    console.log(typeof notizenDozent)
    console.log(typeof favorisiert)
    console.log(typeof abgebrochen)
    try {
        connection = await pool.getConnection();
        const rows = await connection.query("REPLACE INTO student(idStudent, idKurs, Notizen, NotizenDozent, abgebrochen) VALUE(?,?,?,?,?)",
            [studentId, kursId, notizen, notizenDozent, abgebrochen ? 1 : 0])
        console.log("anfang replace")
        console.log(rows)
        if (favorisiert) {
            const row2 = await connection.query("REPLACE INTO betreuung(Student_idStudent, Student_idKurs, Teacher_idTeacher) VALUE(?,?,?)",
                [studentId, kursId, userId])
            console.log("favorisiert")
            console.log(row2)
        } else {
            const row3 = await connection.query("DELETE FROM betreuung WHERE Student_idStudent = ? AND Student_idKurs = ? AND Teacher_idTeacher = ?",
                [studentId, kursId, userId])
            console.log("favorisiert nicht")
            console.log(row3)
        }
    } catch (err){
        console.log(err)
        console.log("failed updateStudent")
    } finally {
        await connection.release()
    }
}
