<script setup>
import {onBeforeMount, onMounted, ref} from "vue";

const props = defineProps({
  textAreaName: String,
  text: String
})
onBeforeMount(() => {
  //console.log(props.text)
  //text.value = String(props.text)


})

const emit = defineEmits(['onInput'])
function onInput(value) {
  //text.value = value
  emit('onInput', value)
}

const textarea = ref(null);
//const text = ref(props.text);
const handleFocus = () => {
  if (textarea.value) {
    textarea.value.selectionStart = 0;
    textarea.value.selectionEnd = 0;
  }
};


// @input="event => onInput(event.target.value)"
</script>

<template>
  <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{textAreaName}}</label>
 <textarea @focus="handleFocus" v-bind:value="text" v-on:input="event => onInput(event.target.value)" ref="textarea" name="message" rows="4" class="text-left block pb-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

 </textarea>
</template>
