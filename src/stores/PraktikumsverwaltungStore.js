import {defineStore} from 'pinia'
import {
    getAssignments, getCurrentRole, getCurrentUserId,
    getGrades,
    getGroupmembers,
    getGroups,
    getWSToken, saveGrade
} from "@/backend/moodleFetch.js";
import {computed, inject, ref} from "vue";
import {useRoute} from "vue-router";
import {getKursDatenDB, kursFindenDB, updateAnwesenheit} from "@/dbFetch.js";
import axios from "axios";

export const useVerwaltungsStore = defineStore('praktikumsverwaltung', () => {
    // arrow function recommended for full type inference
    const route = useRoute()
    const router = inject('provideRouter')
    const wsToken = ref("8d415518c32b2afbd8e026effb126c9d")
    //todo change user id to empty
    const userId = ref(2)
    const errorMessage = ref("HURENSOHN")
    const kurs = ref({}) // {id: , name:, rolleId: }
    const kursListe = ref([])
    const aufgaben = ref([]) // [{id: , name: }]
    const gruppen = ref([])

    const studenten = ref([])

    const alleGruppen = computed(() => [{
        id: -1,
        name: "Alle Gruppen"}].concat(gruppen.value))

    const anwesenheitsTypen = computed(() =>
        Array("anwesend", "abwesend", "krank", "entschuldigt")
    )

    function testconsole() {
        console.log(studentenNoten.value)
        console.log(gruppen.value)
        console.log(aufgaben.value)
    }

    function kursErstellenDB() {

    }

    function isNotLoggedIn() {
        return wsToken.value.length === 0
    }


    function test() {
        axios.post("http://localhost:3000/apidb/test", {}).then(data => console.log(data.request))
    }

    function changeAnwesenheit(aufgabeId, studentId, anwesenheit) {
        console.log("ich will die anwesenheit updaten brooo")
        updateAnwesenheit(aufgabeId,studentId,anwesenheit, kurs.value["id"])
    }

    return {
        wsToken,
        errorMessage,
        kurs,
        aufgaben,
        gruppen,
        studenten,
        alleGruppen,
        login,
        kursErstellenFinden,
        isNotLoggedIn,
        test,
        changeAnwesenheit,
        getTerminInfos,
        sendNotetoMoodle,
        getStudentenInfo,
        anwesenheitsTypen
    }
})