<script setup>
import {onBeforeMount, onMounted, ref} from "vue";

const props = defineProps({
  textAreaName: String,
  text: String
})
onBeforeMount(() => {
  text.value = props.text

})

const emit = defineEmits(['onInput'])
function onInput() {
  emit('onInput', text.value)
}

const textarea = ref(null);
const text = ref();
const handleFocus = () => {
  if (textarea.value) {
    textarea.value.selectionStart = 0;
    textarea.value.selectionEnd = 0;
  }
};
</script>

<template>
  <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white py-1.5">{{textAreaName}}</label>
 <textarea @focus="handleFocus" @input="onInput" v-model="text" ref="textarea" id="message" rows="4" class="text-left block py-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </textarea>
</template>
