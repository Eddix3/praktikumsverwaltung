<script setup>
import Button from "@/components/Button.vue";
import {onUnmounted, ref} from "vue";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Modal from "@/components/Modal.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const store = useVerwaltungsStore()

const kursLink = ref("")

onUnmounted(() => store.errorMessage = "")

</script>

<template>
  <Modal>
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <button @click="store.routeBack" type="button"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal">
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
      <div class="px-6 py-6 lg:px-8">
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Lernraumkurslink eingeben zum Finden oder
          Erstellen des Kurses</h3>
        <form class="space-y-6">
          <!-- Lernraumlink-->
          <div>
            <label for="kurs" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link zum Kurs im
              Lernraum</label>
            <input v-model="kursLink" v-on:keyup.enter="store.kursErstellenFinden(kursLink)" type="text" name="kurs" id="kurs"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                   placeholder="Kurslink" required>
          </div>
          <div class="flex justify-between">
          </div>
          <!--Buttons-->
          <Button @onClick="store.kursErstellenFinden(kursLink)" buttonName="Bestätigen"></Button>
          <Button @onClick="store.routeBack" buttonName="Abbrechen"></Button>
          <ErrorMessage></ErrorMessage>
        </form>
      </div>
    </div>
  </Modal>
</template>
