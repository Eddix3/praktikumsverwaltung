<script setup>
import {ref} from "vue";
import router from "@/router/index.js";
import Dropdown2 from "@/components/DropdownAnwesenheit.vue";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import DropdownAnwesenheit from "@/components/DropdownAnwesenheit.vue";

const store = useVerwaltungsStore()

const props = defineProps({
  student: Object
})
const emit = defineEmits(['onClick'])

const noten = ref()
function onClick() {
  emit('onClick')
}

function showTermin(studentenId, aufgabenId) {
  return "aufgabe/" + studentenId + "/" + aufgabenId
}

function showStudentenInfo(studentenId) {
  return router.push({path: `student/${studentenId}`})
}
function saveAnwesenheit(studentId, aufgabeId, anwesenheit, index) {
  store.changeAnwesenheit(studentId, aufgabeId, anwesenheit)
  props.student["noten"][index]["anwesenheit"] = anwesenheit
}
</script>

<template>
  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

    <th @click="showStudentenInfo(props.student.id)" scope="row"
        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
      <!-- todo es macht kein sinn bro-->
      {{ props.student.name }}
    </th>
    <!-- Alle Aufgabenfelder für den aktuellen User-->
    <template v-for="(aufgabeNote, index) in props.student.noten">
      <td class="text-center border px-6 py-4">
        <div class="whitespace-nowrap pb-5">Bewertungsfortschritt: {{aufgabeNote.fortschritt}}</div>
        <DropdownAnwesenheit @onClick="anwesenheit => saveAnwesenheit(props.student.id, aufgabeNote.id, anwesenheit, index)" :elemente="store.anwesenheitsTypen" :current-value="aufgabeNote.anwesenheit" drop-down-default-name="Anwesenheit"></DropdownAnwesenheit>
        <router-link class= "justify-center flex white-space: nowrap pt-4 font-medium text-blue-900 dark:text-white hover:text-gray-600" :to="showTermin(props.student.id, aufgabeNote.id)" >Detailansicht</router-link>
      </td>
    </template>
  </tr>
</template>

