<script setup>
import LoginButton from "@/components/LoginButton.vue";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import ErrorMessage from "@/components/ErrorMessage.vue";
import {onUnmounted, ref} from "vue";
import Modal from "@/components/Modal.vue";

const store = useVerwaltungsStore()
const username = ref("")
const passwort = ref("")

onUnmounted(() => store.errorMessage = "")
</script>

<template>
  <Modal>
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="px-6 py-6 lg:px-8">
          <h1 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Logge dich mit deinen Lernraum-Account
            ein</h1>
          <form class="space-y-6">
            <!-- Username Input-->
            <div>
              <label for="username"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input v-on:keyup.enter="store.login(username, passwort)" v-model="username" type="text" name="username" id="username"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     placeholder="Username" required>
            </div>
            <div>
              <label for="password"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort</label>
              <input v-on:keyup.enter="store.login(username, passwort)" v-model="passwort" type="password" name="password" id="password"
                     placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     required>
            </div>
            <!--Login Button-->
            <LoginButton @click="store.login(username, passwort)"></LoginButton>
            <ErrorMessage></ErrorMessage>
          </form>
        </div>
      </div>
  </Modal>
</template>

