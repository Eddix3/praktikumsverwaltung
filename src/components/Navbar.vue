<script setup>
import Dropdown from "@/components/Dropdown.vue"
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import router from "@/router/index.js";
import NavbarLink from "@/components/NavbarLink.vue";
const store = useVerwaltungsStore()

function getKurs() {
  router.push({path: "/getkurs"})
}

function logout() {
  console.log("ausgeloggt hahaha")
}
</script>

<template>
  <nav class="sticky bg-white dark:bg-gray-900 w-full top-0 left-0 border-b border-gray-200 dark:border-gray-600 items-start justify-between mx-auto p-3">
        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <Dropdown :elemente="[{id: -1, name: 'Wähle Kurs'}]" :current-value="-2" drop-down-default-name="Wähle Kurs"></Dropdown>
          <NavbarLink route-link="/getkurs">Kurs finden/erstellen</NavbarLink>
          <NavbarLink route-link="/">Einstellungen</NavbarLink>
          <NavbarLink route-link="/login" @click="logout">Logout</NavbarLink>
        </ul>
  </nav>

</template>
