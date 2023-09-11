import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {app } from '../../backend/backendServer.js' // Pfade anpassen, wenn nötig
import session from 'supertest-session'
import config from "@/javascript/config.js";
import {cleanupTestData, createTestData} from "@/test/dbTestDaten.js";
const endPunkte = config.backendServer.apiEndpunkte
const keys = config.backendServer.fetchKeys

describe('Backend-Server Endpunkte Test', () => {
    let testSession;

    beforeAll(async () => {
        await cleanupTestData()
        await createTestData()
        testSession = session(app);
    });

    afterAll(async (done) => {
        await cleanupTestData()
        testSession.end(done);
    });

    it('Verbindung erfolgreich herstellen', async () => {
        const response = await testSession.post('/login').send({
            username: "admin",
            password: "Abcd2204%"
        });
        expect(response["status"]).toBe(200);
        expect(response["body"]).toHaveProperty("wsToken")
        expect(response["body"]).toHaveProperty("kursListe")

    });
    it('Kurs Erstellen', async () => {
        const response = await testSession.post(endPunkte.kursFindenErstellen).send({
            [keys.wsToken]: "7227fbf4a8e29fb1dc83c784953a4a48",
            [keys.kursId]: 3
        });
        expect(response["status"]).toBe(200);
        expect(response["body"]).toHaveProperty("error")
        expect(response["body"]).toHaveProperty("message")
    });

    it('Kurs Infos erhalten', async () => {
        const response = await testSession.post(endPunkte.getkursInfos).send({
            [keys.wsToken]: "7227fbf4a8e29fb1dc83c784953a4a48",
            [keys.kursId]: 3
        });
        expect(response["status"]).toBe(200);
        expect(response["body"]).toHaveProperty("kurs")
        expect(response["body"]).toHaveProperty("aufgaben")
        expect(response["body"]).toHaveProperty("gruppen")
        expect(response["body"]).toHaveProperty("studenten")
    });

    it('Infos über Student erhalten', async () => {
        const response = await testSession.post(endPunkte.studentInfo).send({
            [keys.wsToken]: "7227fbf4a8e29fb1dc83c784953a4a48",
            [keys.studentId]: 10,
            [keys.kursId]: 3
        });
        expect(response["status"]).toBe(200);
        expect(response["body"]).toHaveProperty("notizen")
        expect(response["body"]).toHaveProperty("notizenDozent")
    });

    it('Anwesenheit Updaten', async () => {
        const response = await testSession.post(endPunkte.updateAnwesenheit).send({
            [keys.wsToken]: "7227fbf4a8e29fb1dc83c784953a4a48",
            [keys.aufgabenId]: 2,
            [keys.studentId]: 8,
            [keys.anwesenheit]: "krank",
        });
        expect(response["status"]).toBe(200);
        expect(response["body"]).toBe(true)
    });

    it('Studenteninfo Updaten', async () => {
        const response = await testSession.post(endPunkte.updateStudent).send({
            [keys.wsToken]: "7227fbf4a8e29fb1dc83c784953a4a48",
            [keys.notizen]: "Hello World",
            [keys.notizenDozent]: "Hello Dozent",
            [keys.abgebrochen]: 0,
            [keys.studentId]: 8,
            [keys.favorisiert]: true
        });
        expect(response["status"]).toBe(200);
        expect(response["body"]).toBe(true)

    });
})