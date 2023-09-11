import mariadb from "mariadb"
import { config } from 'dotenv';
config();
export const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    port: 3308,
    password: "1234",
    database: "testdb",
    connectionLimit: 10
});

export const kurse = [
    [1, "Informatik"],
    [2, "Verteilte Systeme"],
    [3, "Übersetzertechniken"]
]

export const teacher = [
    [1],
    [2],
    [3],
    [4],
    [5]

]
export const kursListe = [
    [1,2],
    [1,3],
    [2,2],
    [3,2],
    [3,3],

]

export async function createTestData() {
    const connection = await pool.getConnection()
    try {
        await connection.batch("INSERT INTO KURS VALUES (?,?)",kurse)
        await connection.batch("INSERT INTO teacher VALUES (?)",teacher)
        await connection.batch("INSERT INTO kursliste VALUES (?,?)", kursListe)
        await connection.batch("INSERT INTO student VALUES (?,?,?,?,?)",[
            [10, 3, "Hello World", "Test", 0],
            [6, 3, "Hello World", "Test", 0],
            [14, 3, "123", "456", 1],
        ])

        await connection.batch("INSERT INTO betreuung VALUES (?,?,?)",[
            [10, 3, 2],
            [14, 3, 2]
        ])

        await connection.batch("INSERT INTO aufgabe VALUES (?,?,?)",[
            [33, 6, "krank"],
            [33, 14, "anwesend"],
            [33, 10, "entschuldigt"],

        ])
    } catch (error) {
        console.error('Error beim Befüllen', error);
    } finally {
        await connection.end();
    }
}

export async function cleanupTestData() {
    const connection = await pool.getConnection()
    try {
        await connection.query("DELETE FROM kurs")
        await connection.query("DELETE FROM teacher")
        await connection.query("DELETE FROM student")
        await connection.query("DELETE FROM aufgabe")
        await connection.query("DELETE FROM betreuung")
        await connection.query("DELETE FROM kursliste")
    } catch (error) {
        console.error('Error beim Abräumen', error);
    } finally {
        await connection.end();
    }
}

