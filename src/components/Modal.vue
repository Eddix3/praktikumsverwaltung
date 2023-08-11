<script setup>
//todo use slot for this https://vuejs.org/guide/components/slots.html#render-scope
</script>

<template>
  <!-- Main modal -->
  <div role="dialog" aria-modal="true"
       class="fixed inset-0 overflow-y-auto flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div
        class="flex-col relative overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
      <slot></slot>
    </div>
  </div>
</template>

