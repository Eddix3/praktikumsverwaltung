<script setup>
import Navbar from "@/components/Navbar.vue";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'

const store = useVerwaltungsStore()

//todo or dont use idle-vue
function updateTimer() {
  //console.log("hallo")
}
</script>

<template>
  <div><Navbar></Navbar></div>
  <div>
    <router-view></router-view>
  </div>



</template>
