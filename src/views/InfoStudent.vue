<script setup>
import router from "@/router/index.js";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Button from "@/components/Button.vue";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import Checkbox from "@/components/Checkbox.vue";
import TextArea from "@/components/TextArea.vue";
import Modal from "@/components/Modal.vue";
const store = useVerwaltungsStore()
function changeRoute() {
  router.push({path: "/kurs"})
}
const route = useRoute();
//const userId = router.params.id;
const student = ref()

onBeforeMount(() => {
  student.value = store.getStudentenInfo(Number(route.params.studentid))

})
function saveUserInfo() {

}

function Stand() {
  const abgeschlossen = student.value.noten.filter(note => note['note'] !== '-').length
  return `${abgeschlossen}/${student.value.noten.length} `
}

function test() {
  console.log("hallo wie gehts")
}


const text = ref('');

</script>

<template>
  <Modal>
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button @click="changeRoute" type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="px-6 py-6 lg:px-8">
          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Information über Student</h3>

          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Name: {{student.name}}
          </div>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Note:
          </div>
          <div class="text-sm font-medium dark:text-gray-300 py-1.5">
            Stand: {{Stand()}}
          </div>
          <!-- Todo fix cursor start at the top right in the textarea -->
          <TextArea textAreaName="Notizen(Dozent)" @onInput="event => event"></TextArea>
          <TextArea textAreaName="Notizen" @onInput="event => event"></TextArea>
          <div class="flex justify-between p-2.5">
            <div class="flex items-start">
              <Checkbox checkbox-name="Mein Student" @onClick="test"></Checkbox>
              <Checkbox checkbox-name="Praktikum Abgebrochen" @onClick=""></Checkbox>
            </div>
          </div>
          <!--Buttons-->
          <Button @onClick="saveUserInfo" buttonName="Speichern"></Button>
          <Button @onClick="changeRoute" buttonName="Abbrechen"></Button>
          <div class="text-sm font-medium text-red-500 dark:text-gray-300">
            {{store.errorMessage}}
          </div>
        </div>
      </div>
  </Modal>
</template>

