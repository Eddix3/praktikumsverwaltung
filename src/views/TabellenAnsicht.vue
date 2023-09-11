<script setup>
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import {onBeforeMount, ref, watch} from "vue";
import Checkbox from "@/components/Checkbox.vue";
import TabellenZeilenElement from "@/components/TabellenZeilenElement.vue";
import Dropdown from "@/components/Dropdown.vue";
import {useRoute} from "vue-router";

const store = useVerwaltungsStore()

//TODO Filter werden nicht bei Kurswechsel nicht zurückgesetzt
const betreuteStudentenAnzeigen = ref(!!Number(sessionStorage.getItem("betreuteAnzeigen")))

const abgebrochenStudentenAnzeigen = ref(!!Number(sessionStorage.getItem("abgebrocheneAnzeigen")))

const notenVerstecken = ref(!!Number(sessionStorage.getItem('notenVerstecken')))

const currentGroupId = ref(Number(sessionStorage.getItem('currentGroupId')))

const searchBarInput = ref("")

const route = useRoute()

onBeforeMount( () => {
  if (store.studenten.length === 0 && Number(sessionStorage.getItem("currentKursId")) !== -1) {
     store.fetchKursInfos(Number(sessionStorage.getItem("currentKursId")))
  }


})
function updateGruppe(id) {
  currentGroupId.value = id
  sessionStorage.setItem("currentGroupId", String(id))
}
function updateBetreuteStudentenAnzeigen() {
  betreuteStudentenAnzeigen.value = !betreuteStudentenAnzeigen.value
  sessionStorage.setItem("betreuteAnzeigen", betreuteStudentenAnzeigen.value ? "1" : "0")
}

function updateAbgebrochenStudentenAnzeigen() {
  abgebrochenStudentenAnzeigen.value = !abgebrochenStudentenAnzeigen.value
  sessionStorage.setItem("abgebrocheneAnzeigen", abgebrochenStudentenAnzeigen.value ? "1" : "0")

}

function updateNotenVerstecken() {
  notenVerstecken.value = !notenVerstecken.value
  sessionStorage.setItem("notenVerstecken", notenVerstecken.value ? "1" : "0")
}

function filterStudent(student) {
  return student["name"].toLowerCase().includes(searchBarInput.value.toLowerCase()) &&
      (student["gruppenId"] === currentGroupId.value || currentGroupId.value === -1) &&
      !!student["abgebrochen"] === abgebrochenStudentenAnzeigen.value &&
      (betreuteStudentenAnzeigen.value ? student["betreut"] === betreuteStudentenAnzeigen.value : true)
}


</script>

<template>
  <div class="relative overflow shadow-md sm:rounded-lg">
    <ul class="items-center flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <!-- TableSearchElement Anfang-->
      <li>
      <label for="table-search" class="sr-only">Student suchen</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor"
               viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"></path>
          </svg>
        </div>
        <input type="text" v-model="searchBarInput"
               class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Name des Studenten">
      </div>
      </li>
      <!-- TableSearchElement ende-->
      <Dropdown :elemente="store.alleGruppen" @onClick="args => updateGruppe(args.id)" drop-down-default-name="Alle Gruppen" :current-value="currentGroupId"></Dropdown>
      <li>
      <Checkbox :abgehackt="betreuteStudentenAnzeigen" checkbox-name="Meine Studenten" @onClick="updateBetreuteStudentenAnzeigen()"></Checkbox>
      </li>
      <li>
        <Checkbox :abgehackt="abgebrochenStudentenAnzeigen" checkbox-name="Praktikum abgebrochen" @onClick="updateAbgebrochenStudentenAnzeigen"></Checkbox>
      </li>
      <li>
        <Checkbox :abgehackt="notenVerstecken" checkbox-name="Bewertungen verstecken" @onClick="notenVerstecken = !notenVerstecken"></Checkbox>
      </li>
    </ul>
    <!-- Table Beginn-->
    <table class="overflow-y-auto overflow-x-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <!-- Alle Aufgabennamen als Überschriften-->
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="border px-6 py-3">
          Name
        </th>
        <th v-for="aufgabe in store.aufgaben" scope="col" class="border px-6 py-3">
          {{ aufgabe.name }}
        </th>
      </tr>
      </thead>
      <!-- Alle Zeilenelemente in der Tabellenübersicht          v-show="student.gruppenId === currentGroupId || currentGroupId === -1" -->
      <tbody>
        <template v-for="student in store.studenten">
           <TabellenZeilenElement v-show="filterStudent(student)" :student="student" :notenAnzeigen="notenVerstecken"></TabellenZeilenElement>
        </template>
      </tbody>
    </table>
  </div>

</template>


