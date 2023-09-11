<script setup>
import {ref} from "vue";

const props = defineProps({
  checkboxName: String,
  abgehackt: Boolean
})
const emit = defineEmits(['onClick'])
const abgehacktRef = ref(props.abgehackt)
function onClick() {
  emit('onClick')
}
</script>

<template>
  <div class="flex items-center h-5">
    <input v-model="abgehacktRef" @click="onClick()" id="checkbox" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required>
    <label for="checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{checkboxName}}</label>
  </div>

</template>

