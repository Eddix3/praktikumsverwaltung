<script setup>
import Dropdown from "@/components/Dropdown.vue"
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import NavbarLink from "@/components/NavbarLink.vue";
const store = useVerwaltungsStore()


function logout() {
  sessionStorage.clear()
}

function kursListe() {
  return JSON.parse(sessionStorage.getItem("kursListe"))
}

function currentKursId() {
  return Number(sessionStorage.getItem('currentKursId'))
}
</script>

<template>
  <nav class="relative bg-white dark:bg-gray-900 w-full top-0 left-0 border-b border-gray-200 dark:border-gray-600 items-start justify-between mx-auto p-3">
        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <Dropdown :elemente="kursListe()" :current-value="currentKursId()" @onClick="args => store.fetchKursInfos(args.id)" drop-down-default-name="Wähle Kurs"></Dropdown>
          <NavbarLink route-link="/getkurs">Kurs finden/erstellen</NavbarLink>
          <NavbarLink route-link="/">Einstellungen</NavbarLink>
          <NavbarLink route-link="/login" @click="logout">Logout</NavbarLink>
        </ul>
  </nav>
</template>
