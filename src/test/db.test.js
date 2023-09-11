import {cleanupTestData, createTestData, pool} from '@/test/dbTestDaten.js';
import {
    getKursListe,
    kursErstellenDB,
    kursFindenDB,
    kursDatenDB,
    getStudentInfoDB, updateAnwesenheit, updateStudent
} from "backend/dbConnection.js"
import {expect, describe, beforeAll, afterAll, it} from 'vitest'

describe('Datenbank-Funktionen-Test', () => {
    beforeAll(async () => {
        await cleanupTestData()
        await createTestData()
    });

    afterAll(async () => {
        await cleanupTestData()
    });
    it('Verbindung erfolgreich herstellen', async () => {
        const connection = await pool.getConnection();
        expect(connection).toBeDefined();
        await connection.release();
    });

    it('Neuen Teacher hinzufügen und leere Kursliste erhalten', async () => {
        const connection = await pool.getConnection();
        expect(await getKursListe(6)).toStrictEqual([])
        expect(await connection.query("SELECT * FROM teacher WHERE idTeacher = ?", [6])).toStrictEqual([{idTeacher: 6}])
        await connection.release();
    });

    it('Kursliste von einem Teacher, der im System schon Kurse hat', async () => {
        expect(await getKursListe(2)).toStrictEqual([
            {
                "id": 1,
                "name": "Informatik",
            },
            {
                "id": 2,
                "name": "Verteilte Systeme",
            },
            {
                "id": 3,
                "name": "Übersetzertechniken",
            },
        ])
    });

    it('Kurs der noch nicht angelegt wurde, wird angelegt', async () => {
        const connection = await pool.getConnection();
        expect(await kursErstellenDB(4, 5, "Testsysteme")).toStrictEqual(true)
        expect(await connection.query("SELECT * FROM kurs WHERE idKurs = ? AND name = ?", [4, "Testsysteme"])).toStrictEqual([{
            idKurs: 4,
            name: 'Testsysteme'
        }])
        expect(await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [4, 5])).toStrictEqual([
            {
                Kurs_idKurs: 4,
                Teacher_idTeacher: 5,
            }])
        await connection.release();
    });

    it('Kurs wurde schon angelegt, nur Kurslisteneintrag hinzugefügt', async () => {
        const connection = await pool.getConnection();
        expect(await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [2, 5])).toStrictEqual([])
        expect(await connection.query("SELECT * FROM kurs WHERE idKurs = ? AND name = ?", [2, "Verteilte Systeme"])).toStrictEqual([{
            idKurs: 2,
            name: "Verteilte Systeme"
        }])
        expect(await kursErstellenDB(2, 5, "Verteilte Systeme")).toStrictEqual(true)
        expect(await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [2, 5])).toStrictEqual([
            {
                Kurs_idKurs: 2,
                Teacher_idTeacher: 5,
            }])
        await connection.release();
    });

    it('Kurs, der bereits existiert, finden', async () => {
        const connection = await pool.getConnection();
        expect(await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [3, 5])).toStrictEqual([])
        expect(await kursFindenDB(3, 5)).toStrictEqual(true)
        expect(await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [3, 5])).toStrictEqual([
            {
                Kurs_idKurs: 3,
                Teacher_idTeacher: 5,
            }])
        await connection.release();
    });

    it('Sucht nach Kurs der nicht existiert', async () => {
        const connection = await pool.getConnection();
        expect(await connection.query("SELECT * FROM kursliste WHERE Kurs_idKurs = ? AND Teacher_idTeacher = ?", [5, 5])).toStrictEqual([])
        expect(await kursFindenDB(5, 5)).toStrictEqual(false)
        await connection.release();
    });

    it('Holt sich Daten von einem leeren Kurs', async () => {
        const connection = await pool.getConnection();
        expect(await kursDatenDB(4, 5)).toStrictEqual([])

        await connection.release();
    });

    it('Holt sich Daten von einem Kurs mit angelegten Daten', async () => {
        const connection = await pool.getConnection();
        expect(await kursDatenDB(3, 2)).toStrictEqual([
            {
                "abgebrochen": false,
                "aufgaben": [{
                    "Anwesenheit": "krank",
                    "Student_idStudent": 6,
                    "idAufgabe": 33,
                },
                ],
                "betreut": false,
                "id": 6,
            },
            {
                "abgebrochen": false,
                "aufgaben": [
                    {
                        "Anwesenheit": "entschuldigt",
                        "Student_idStudent": 10,
                        "idAufgabe": 33,
                    },
                ],
                "betreut": true,
                "id": 10,
            },
            {
                "abgebrochen": true,
                "aufgaben": [
                    {
                        "Anwesenheit": "anwesend",
                        "Student_idStudent": 14,
                        "idAufgabe": 33,
                    },
                ],
                "betreut": true,
                "id": 14,
            },
        ])

        await connection.release();
    });

    it('Holt sich die Infos über einen Studenten im Kurs', async () => {
        const connection = await pool.getConnection();
        const dataDozent = await getStudentInfoDB(10,3, true)
        const dataTutor = await getStudentInfoDB(10,3, false)
        expect(dataDozent).toStrictEqual(
             {
                "notizen": "Hello World",
                "notizenDozent": "Test",
            },
        )
        expect(dataTutor).toStrictEqual(
            {
                "notizen": "Hello World",
            },
        )
        expect(await getStudentInfoDB(14,3, true)).toStrictEqual({
            "notizen": "123",
            "notizenDozent": "456"
        })
        // [10, 3, "Hello World", "Test", 0],

        await connection.release();
    });

    it('Holt sich die Infos über einen nicht angelegten Studenten', async () => {

        expect(await getStudentInfoDB(55, 3, true)).toStrictEqual(undefined)
    });

    it('Updated Anwesenheit bei angelegten Student', async () => {
        const connection = await pool.getConnection();
        expect(await updateAnwesenheit(33, 6, "anwesend", 3)).toStrictEqual(true)
        expect(await connection.query("SELECT * FROM aufgabe WHERE idAufgabe = ? AND Student_idStudent = ?", [33, 6])).toStrictEqual([
            {
                "Student_idStudent": 6,
                "anwesenheit": "anwesend",
                "idAufgabe": 33,
            },
        ])
        await connection.release();
    });

    it('Updated Anwesenheit bei einen nicht angelegten Student', async () => {
        const connection = await pool.getConnection();
        expect(await updateAnwesenheit(25, 20, "abwesend", 3)).toStrictEqual(true)
        expect(await connection.query("SELECT * FROM aufgabe WHERE idAufgabe = ? AND Student_idStudent = ?", [25, 20])).toStrictEqual(
            [{
                "Student_idStudent": 20,
                "anwesenheit": "abwesend",
                "idAufgabe": 25,
            }]
        )
        expect(await connection.query("SELECT * FROM student WHERE idStudent = ? AND idKurs = ?", [20, 3])).toStrictEqual([
            {
                "abgebrochen": 0,
                "idKurs": 3,
                "idStudent": 20,
                "notizen": "",
                "notizenDozent": "",
            }
        ])
        await connection.release();
    });

    it('Updated die Info über einen Studenten im Kurs', async () => {
        const connection = await pool.getConnection();
        expect(await updateStudent("Test bestanden", "Test bestanden vom Dozent", 1, 10, 3, true, 3, true)).toStrictEqual(true)
        expect(await connection.query("SELECT * FROM student WHERE idStudent = ? AND idKurs = ?", [10,3])).toStrictEqual([
            {
                "abgebrochen": 1,
                "idKurs": 3,
                "idStudent": 10,
                "notizen": "Test bestanden",
                "notizenDozent": "Test bestanden vom Dozent",
            },
        ])
        expect(await connection.query("SELECT * FROM betreuung WHERE Student_idStudent = ? AND Student_idKurs = ? AND Teacher_idTeacher = ?", [10,3,3])).toStrictEqual([
            {
                "Student_idKurs": 3,
                "Student_idStudent": 10,
                "Teacher_idTeacher": 3,
            }
        ])
        await connection.release();
    });

    it('Updated die Info über einen Studenten im Kurs ohne aktuellen Eintrag in der DB', async () => {
        const connection = await pool.getConnection();
        // Datensatz noch nicht in DB für Student
        expect(await connection.query("SELECT * FROM student WHERE idStudent = ? AND idKurs = ?", [8,3])).toStrictEqual([])
        // Auch keine Betreuung
        expect(await connection.query("SELECT * FROM betreuung WHERE Student_idStudent = ? AND Student_idKurs = ? AND Teacher_idTeacher = ?", [8,3,3])).toStrictEqual([])
        // Erstelt neuen Studentendatensatz
        expect(await updateStudent("Neuer Eintrag", "Neuer Eintrag vom Dozent", 0, 8, 3, true, 3)).toStrictEqual(true)
        // Prüft, neuen Datensatz in Betreuung
        expect(await connection.query("SELECT * FROM betreuung WHERE Student_idStudent = ? AND Student_idKurs = ? AND Teacher_idTeacher = ?", [8,3,3])).toStrictEqual([
            {
                "Student_idKurs": 3,
                "Student_idStudent": 8,
                "Teacher_idTeacher": 3,
            }
        ])
        // Prüft, neuen Datensatz in Studenten
        expect(await connection.query("SELECT * FROM student WHERE idStudent = ? AND idKurs = ?", [8,3])).toStrictEqual([
            {
                "abgebrochen": 0,
                "idKurs": 3,
                "idStudent": 8,
                "notizen": "Neuer Eintrag",
                "notizenDozent": "Neuer Eintrag vom Dozent",
            },
        ])
        //favorisierung von student wieder löschen
        expect(await updateStudent("Neuer Eintrag", "Neuer Eintrag vom Dozent", 0, 8, 3, false, 3)).toStrictEqual(true)
        // Datensatz für betreuung sollte nicht mehr da sein
        expect(await connection.query("SELECT * FROM betreuung WHERE Student_idStudent = ? AND Student_idKurs = ? AND Teacher_idTeacher = ?", [8,3,3])).toStrictEqual([])
        await connection.release();
    });



});