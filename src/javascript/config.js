// config.js

const config = {
    backendServer: {
        baseurl: "http://localhost:3000",
        apiEndpunkte: {
            login: "/login",
            kursFindenErstellen: "/api/kursfindenerstellen",
            getkursInfos: "/api/getkursinfos",
            studentInfo: "/api/studentinfo",
            updateAnwesenheit: "/api/updateanwesenheit",
            updateStudent: "/api/updatestudent",
            updateNote: "/api/updatenote",
        },
        fetchKeys: {
            username: "username",
            password: "password",
            wsToken: "wsToken",
            kursId: "kursId",
            userId: "userId",
            studentId: "studentId",
            aufgabenId: "aufgabenId",
            anwesenheit: "anwesenheit",
            notizen: "notizen",
            notizenDozent: "notizenDozent",
            abgebrochen: "abgebrochen",
            favorisiert: "favorisiert",
            grade: "grade",
            textInput: "textInput",
            textFormat: "textFormat",

        }
    },
    storageKeys: {
        authToken: 'authToken',
        userSettings: 'userSettings',
    },
};

export default config;