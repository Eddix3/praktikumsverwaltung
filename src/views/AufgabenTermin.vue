<script setup>
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Button from "@/components/Button.vue";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import Modal from "@/components/Modal.vue";
import DropdownAnwesenheit from "@/components/DropdownAnwesenheit.vue";
import TextArea from "@/components/TextArea.vue";
const store = useVerwaltungsStore()



const route = useRoute();
const aufgabeTermin = ref()
const punkte = ref()
const feedback = ref()

onBeforeMount(() => {
  aufgabeTermin.value = store.getTerminInfos(Number(route.params.studentid), Number(route.params.aufgabeid))
  punkte.value = aufgabeTermin.value["note"]["note"]
  feedback.value = aufgabeTermin.value["note"]["feedback"]
})


function aufgabeId() {
  return aufgabeTermin.value["note"]["id"]
}

function studentId() {
  return aufgabeTermin.value["student"]["id"]
}

function anwesenheit() {
  return aufgabeTermin.value["note"]["anwesenheit"]
}
function saveAnwesenheit(value) {
  store.changeAnwesenheit(aufgabeTermin.value.student.id, aufgabeTermin.value.note.id, value)
  aufgabeTermin.value["note"]["anwesenheit"] = value
}

function saveNote() {
    store.changeNote(aufgabeId(), studentId(), punkte.value, feedback.value, 0)
}

function studentenSeite() {
  return "student/" + studentId()
}

</script>

<template>
  <Modal>
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button @click="store.routeBack()" type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="px-6 py-6 lg:px-8">
          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{{aufgabeTermin.name}}</h3>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Link zur Aufgabe im Lernraum:
            <a :href="'http://localhost'+ `/mod/assign/view.php?id=${aufgabeId()}`" target="_blank" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{{aufgabeTermin.name}}</a>
          </div>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Name: <RouterLink :to="{path: studentenSeite(), replace: true} " class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
            {{aufgabeTermin.student.name}}
          </RouterLink>

          </div>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            <DropdownAnwesenheit @onClick="value => saveAnwesenheit(value)" :elemente="store.anwesenheitsTypen" :current-value="anwesenheit()" drop-down-default-name="Anwesenheit"></DropdownAnwesenheit>
          </div>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Bewertung (Lernraum-Bewertung): <input type="text" class="text-sm font-medium dark:text-gray-300 py-1.5 px-1 w-10" v-model="punkte"> /{{aufgabeTermin.note.maxNote}}
          </div>
          <TextArea textAreaName="Feedback als Kommentar (Lernraum-Feedback)" :text="feedback" @onInput="event => feedback = event"></TextArea>
          <!--Buttons-->
          <div class="mt-5">
          <Button @onClick="saveNote" buttonName="Speichern"></Button>
          <Button @onClick="store.routeBack()" buttonName="Abbrechen"></Button>
          </div>
          <div class="text-sm font-medium text-red-500 dark:text-gray-300">
            {{store.errorMessage}}
          </div>
        </div>
      </div>
  </Modal>
</template>