<script setup>
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Navbar from "@/components/Navbar.vue";
const store = useVerwaltungsStore()

</script>


<template>
  <div><Navbar></Navbar></div>
  <div><router-view></router-view></div>
</template>