<script setup>
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
const store = useVerwaltungsStore()

</script>

<template>
  <div class="text-sm font-medium text-red-500 dark:text-gray-300">
    {{store.errorMessage}}
  </div>
</template>
