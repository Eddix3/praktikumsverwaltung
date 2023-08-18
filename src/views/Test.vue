<script setup>
import {onMounted} from "vue"

/*onMounted(() => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = event.target.result;
    const rows = data.split('\n');
    for (const row of rows) {
      const columns = row.split(',');
      console.log(columns);
    }
  };
  //reader.readAsText()

})

 */

import router from "@/router/index.js";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Button from "@/components/Button.vue";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import TextArea from "@/components/TextArea.vue";
import {getGroupmembers} from "@/backend/moodleFetch.js";
import Modal from "@/components/Modal.vue";
import Checkbox from "@/components/Checkbox.vue";
import Arrow from "@/components/Arrow.vue";
import Anwesenheit from "@/components/DropdownAnwesenheit.vue";

const store = useVerwaltungsStore()

function changeRoute() {
  router.push({path: "/kurs"})
}

const showNote = ref(false)
const route = useRoute();
const notizenDozent = ref()
//const userId = router.params.id;

onBeforeMount(() => {

})

function saveUserInfo() {

}

onMounted(() => {
  //getGroupmembers("8d415518c32b2afbd8e026effb126c9d", [])
  store.test()
})
// todo handle text start at the beginning
const textarea = ref(null);
const text = ref('');
const handleFocus = () => {
  if (textarea.value) {
    textarea.value.selectionStart = 0;
    textarea.value.selectionEnd = 0;
  }
};

const selectedOption = ref("")

function test2(event) {
  //showNote.value = !showNote.value

  if(event.target.value !== "")selectedOption.value = event.target.value
}

</script>

<template>
  <select @click="event => test2(event)" v-model="selectedOption">
    <option value="" disabled selected="selected" v-if="false">Anwesenheit</option>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </select>
  <p>Selected option: {{ selectedOption }}</p>
</template>