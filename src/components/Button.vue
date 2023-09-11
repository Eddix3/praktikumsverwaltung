<script setup>
defineProps({
  buttonName: String
})
const emit = defineEmits(['onClick'])
function onClick() {
  emit('onClick')
}
</script>

<template>
  <button @click="onClick" type="button"
          class="mt-3 inline-flex w-full m-3 justify-center rounded-md px-3 py-2 text-sm font-semibold
          text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto">
    {{buttonName}}
  </button>
</template>
