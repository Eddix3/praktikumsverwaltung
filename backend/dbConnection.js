import mariadb from "mariadb"
import {fehlerBenachrichtigung} from "./helper.js";


const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    port: 3308,
    password: "1234",
    database: "mydb", // todo zu "testdb" beim laufen der Test ändern, sonst funktionieren tests nicht
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
        return await connection.query("SELECT Kurs_idKurs, name FROM kursliste LEFT JOIN kurs ON Kurs_idKurs = idKurs WHERE Teacher_idTeacher = ?", [userId]).then(data => {
            return data.map((kurs) => ({
                id: kurs["Kurs_idKurs"],
                name: kurs["name"]
            }))

        })
    } catch (err) {
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
        if (row1.length === 0) {
            await connection.query("INSERT INTO kurs(idKurs,name) VALUES(?,?)", [kursId, kursName])
        }
        const row2 = await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [kursId, userId])
        if (row2.length === 0) {
            await connection.query("INSERT INTO kursliste(Kurs_idKurs,Teacher_idTeacher) VALUES(?,?)", [kursId, userId])
        }
        else {
            return false
        }
        return true
    } catch (err) {
        console.log(err)
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
        connection = await pool.getConnection();
        const row1 = await connection.query("SELECT * FROM kurs WHERE idKurs = ?", [kursId])
        if (row1.length === 0) {
            return false
        } else {
            const row2 = await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [kursId, userId])
            if (row2.length === 0) {
                await connection.query("INSERT INTO kursliste(Kurs_idKurs, Teacher_idTeacher) VALUES(?,?)", [kursId, userId])
            }
            else {
                return false
            }
            return true
        }
    } catch (error) {
        console.log(error)
        return false
    } finally {
        await connection.release()
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
export async function kursDatenDB(kursId, userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        //für die Anwesenheiten im Kurs
        const aufgaben = connection.query("SELECT aufgabe.idAufgabe, aufgabe.Student_idStudent, aufgabe.Anwesenheit FROM aufgabe INNER JOIN student ON aufgabe.Student_idStudent = student.idStudent WHERE student.idKurs = ?",
            [kursId])
        const studenten = connection.query("SELECT idStudent, abgebrochen FROM student WHERE idKurs = ?",
            [kursId])
        const betreuung = connection.query("SELECT Student_idStudent FROM betreuung WHERE Student_idKurs = ? AND Teacher_idTeacher = ?", [kursId, userId])

        return await Promise.all([studenten, betreuung, aufgaben]).then((daten) => {
            const studentenListe = []
            daten[0].forEach(data => {
                    studentenListe.push({
                        id: data["idStudent"],
                        abgebrochen: !!data["abgebrochen"],
                        betreut: daten[1].some(student => student["Student_idStudent"] === data["idStudent"]),
                        aufgaben: daten[2].filter(aufgabe => aufgabe["Student_idStudent"] === data["idStudent"])
                    })


                }
            )
            return studentenListe
        })
    } catch (error) {
        console.log(error)
    } finally {
        await connection.release()
    }
}


/**
 * Updated die Notizen, Notizen(Dozent) und ob der Student abgebrochen, sowie ob der Student von dem eingeloggten User für die Betreuung markiert wurde.
 *
 * @param {number} studentId Die ID des Studenten.
 * @param {number} kursId Die ID des Kurses.
 * @param {boolean} isDozent Ob der User ein Dozent ist oder nur ein Tutor
 *
 * @return {Promise} Ob das Update geklappt hat oder nicht.
 */
export async function getStudentInfoDB(studentId, kursId, isDozent) {
    let connection;
    try {
        connection = await pool.getConnection();
        if(isDozent) {
            return (await connection.query("SELECT notizen, notizenDozent FROM student WHERE idStudent = ? AND idKurs = ?", [studentId, kursId]))[0]
        }
        return (await connection.query("SELECT notizen FROM student WHERE idStudent = ? AND idKurs = ?", [studentId, kursId]))[0]

    } catch (error) {
        console.log(error)
        return fehlerBenachrichtigung("Fehlgeschlagen")
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
 * @return {Promise<boolean>} Ob das Update geklappt hat oder nicht.
 */
export async function updateAnwesenheit(aufgabenId, studentId, anwesenheit, kursId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const row1 = await connection.query("SELECT * FROM student WHERE idStudent = ?", [studentId])
        // Student wurde noch nicht im Studententable erstellt
        if (row1.length === 0) {
            await connection.query("REPLACE INTO student(idStudent, idKurs, Notizen, NotizenDozent, Abgebrochen) VALUE(?,?,?,?,?)",
                [studentId, kursId, "", "", 0])
        }
        await connection.query("REPLACE INTO aufgabe(idAufgabe, Student_idStudent, anwesenheit) VALUE(?,?,?)", [aufgabenId, studentId, anwesenheit])
        return true
    } catch (error) {
        console.log(error)
        return false
    } finally {
        await connection.release()
    }
}

/**
 * Updated die Notizen, Notizen(Dozent) und ob der Student abgebrochen, sowie ob der Student von dem eingeloggten User für die Betreuung markiert wurde.
 *
 * @param {string} notizen Notizen.
 * @param {string} notizenDozent Die Notizen die nur für den Dozenten.
 * @param {number} abgebrochen Ob der Student den Kurs abgebrochen hat.
 * @param {number} studentId Die ID des Studenten.
 * @param {number} kursId Die ID des Kurses.
 * @param {boolean} favorisiert der Student von der eingeloggten als Betreuter markiert hat.
 * @param {number}  userId Die ID des eingeloggten Users.
 * @param {boolean} isDozent Ob der User ein Dozent ist oder nur ein Tutor
 *
 * @return {Promise<boolean>} Ob das Update geklappt hat oder nicht.
 */
export async function updateStudent(notizen, notizenDozent, abgebrochen, studentId, kursId, favorisiert, userId, isDozent) {
    let connection;
    try {
        connection = await pool.getConnection();
        const student = await connection.query("SELECT * FROM student WHERE idStudent = ? AND idKurs = ?", [studentId, kursId])
        if(student.length === 0){
            await connection.query("INSERT INTO student(idStudent, idKurs, notizen, notizenDozent, abgebrochen) VALUES(?,?,?,?,?)",
                [studentId, kursId, notizen, notizenDozent, abgebrochen])
        }
        else {
            if(isDozent) {
                await connection.query("UPDATE student SET idStudent = ?, idKurs = ?, notizen = ?, notizenDozent = ?, abgebrochen = ? WHERE idStudent = ? AND  idKurs = ? ",
                    [studentId, kursId, notizen, notizenDozent, abgebrochen, studentId, kursId])
            }
            else {
                await connection.query("UPDATE student SET idStudent = ?, idKurs = ?, notizen = ?, abgebrochen = ? WHERE idStudent = ? AND  idKurs = ? ",
                    [studentId, kursId, notizen, abgebrochen, studentId, kursId])
            }
        }
        if (favorisiert) {
            await connection.query("REPLACE INTO betreuung(Student_idStudent, Student_idKurs, Teacher_idTeacher) VALUES(?,?,?)",
                [studentId, kursId, userId])

        } else {
            await connection.query("DELETE FROM betreuung WHERE Student_idStudent = ? AND Student_idKurs = ? AND Teacher_idTeacher = ?",
                [studentId, kursId, userId])
        }
        return true
    } catch (err){
        console.log(err)
        return false
    } finally {
        await connection.release()
    }
}
