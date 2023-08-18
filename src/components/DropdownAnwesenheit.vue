<script setup>
import {ref} from "vue";
import Button from "@/components/Button.vue";

const visibility = ref(false)

const props = defineProps({
  dropDownDefaultName: String,
  currentValue: String,
  elemente: Array
})
const emit = defineEmits(['onClick'])
const currentlySelected = ref(props.currentValue)

function nonSelectedElements() {
  return props.elemente.filter(element => element !== currentlySelected.value)
}
function selectedElement() {
  return props.elemente.find(element => element === currentlySelected.value)
}
function onClick(anwesenheit) {
  visibility.value = !visibility.value
  currentlySelected.value = anwesenheit
  emit('onClick', anwesenheit)
}
</script>

<template>
    <button @click="visibility = !visibility"
            class="flex items-center justify-center py-2 pl-3 pr-4 text-xs text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
      {{selectedElement() === undefined ? dropDownDefaultName : selectedElement()}}
      <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>
    </button>
    <!-- Dropdown menu -->
    <div v-show="visibility"
         class="absolute text-xs bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-400">
        <template v-for="(anwesenheitsstatus) in nonSelectedElements()">
          <li>
            <div @click="onClick(anwesenheitsstatus)"
                 class="block py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              {{ anwesenheitsstatus }}
            </div>
          </li>
        </template>
      </ul>
    </div>
</template>

