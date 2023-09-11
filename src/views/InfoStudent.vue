<script setup>
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Button from "@/components/Button.vue";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import Checkbox from "@/components/Checkbox.vue";
import TextArea from "@/components/TextArea.vue";
import Modal from "@/components/Modal.vue";
const store = useVerwaltungsStore()

const student = ref()

const abgebrochen = ref()

const meinStudent = ref()

const notizen = ref()

const notizenDozent = ref()

const route = useRoute();



onBeforeMount( () => {
  student.value = store.getStudentenInfo(Number(route.params.studentid))
  meinStudent.value = student.value.betreut
  abgebrochen.value = student.value.abgebrochen
  store.fetchNotizen(Number(route.params.studentid)).then(fetchNotizen => {
    if (fetchNotizen["data"]["error"]) {
      // error im backend
    } else {
      notizen.value = fetchNotizen["data"]["notizen"]
      notizenDozent.value = fetchNotizen["data"]["notizenDozent"] ? "" : fetchNotizen["data"]["notizenDozent"]
    }
  }).catch(() => {
        //error beim fetchen
      }
  )
})


function Stand() {
  const abgeschlossen = student.value.noten.filter(note => note['note'] !== '-').length
  return `${abgeschlossen}/${student.value.noten.length} `
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
          <h1 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{{student.name}}</h1>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Stand: {{Stand()}}
          </div>
          <TextArea :v-show="notizenDozent" class="pb-5" textAreaName="Notizen(Dozent)" :text="notizenDozent" @onInput="event => notizenDozent = event"></TextArea>
          <TextArea textAreaName="Notizen" :text="notizen" @onInput="event => notizen = event"></TextArea>
          <div class="flex justify-between p-2.5">
            <div class="flex items-start " >
              <Checkbox :abgehackt="meinStudent" class="pr-5" checkbox-name="Mein Student" @onClick="meinStudent = !meinStudent"></Checkbox>
              <Checkbox :abgehackt="abgebrochen" checkbox-name="Praktikum Abgebrochen" @onClick="abgebrochen = !abgebrochen"></Checkbox>
            </div>
          </div>
          <!--Buttons-->
          <Button @onClick="store.changeStudentenInfo(student.id, notizenDozent, notizen, meinStudent, abgebrochen)" buttonName="Speichern"></Button>
          <Button @onClick="store.routeBack" buttonName="Abbrechen"></Button>
          <div class="text-sm font-medium text-red-500 dark:text-gray-300">
            {{store.errorMessage}}
          </div>
        </div>
      </div>
  </Modal>
</template>

