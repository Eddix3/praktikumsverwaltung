<script setup>
import axios from "axios";
import router from "@/router/index.js";
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
const store = useVerwaltungsStore()
const addresse = 'http://localhost/webservice/rest/server.php/?moodlewsrestformat=json&wstoken='

import {getCurrentRole, getCurrentUserId} from "@/moodleFetch.js";
import {onMounted} from "vue";
import Navbar from "@/components/Navbar.vue";
import KursModal from "@/views/KursErstellenFinden.vue";
import Dropdown from "@/components/Dropdown.vue";
import Modal from "@/components/Modal.vue";
function f() {
  window.alert('the end is coming')
}
//onMounted(() => getCurrentRole('8d415518c32b2afbd8e026effb126c9d').then(response => console.log(response.data)))
//onMounted(() => getCurrentRole('8d415518c32b2afbd8e026effb126c9d').then(response => console.log(response.data)))

function test() {
  getCurrentUserId(store.wsToken).then(response => {
    console.log(response.data)
  }).catch(
      err => {
        console.log('f in the chat boys')
      }
  )
}
    function getTasks(kursInhalt) {
      kursInhalt.forEach(abschnitte => abschnitte['modules'].forEach(aufgabe => {
        if(aufgabe['modname'] == "assign") {
          //console.log(aufgabe)
          this.aufgaben.push({aufgabenName: aufgabe.name, aufgabenID: aufgabe.instance})
          //console.log(this.aufgaben[5])
        }
      }))
    }
    function getUser(userInhalt) {
      userInhalt.forEach(user => {
        if(user.hasOwnProperty('groups')) {
          //this.users.push({userID: user.id, userName: user.fullname, groupName: user.groups.name, groupID: user.groups.id})
        }
        console.log(this.user)
      }
      )}
    function createTable() {
      console.log(this.wsToken)
      const courseID = document.getElementById('kurslinkInput').value.split('id=')[1]
      //get Request für ws token
      axios.get(addresse +
          //this.wsToken +
          //zum test hardcode ws token
          '8d415518c32b2afbd8e026effb126c9d' +
          '&wsfunction=core_course_get_contents&courseid=' +
          courseID
          ).then(response => {
            getTasks(response.data)
            console.log('meine fresse es geht')
          }).catch(err =>  {
            // Manage the state of the application if the request has failed
            this.error = 'du hast reingeschissen! Fehleranmeldung bitte kaufen sie den Battlepass'
          })
      //console.log(this.aufgaben)
      axios.get(addresse +
          //this.wsToken +
          //zum test hardcode ws token
          '8d415518c32b2afbd8e026effb126c9d' +
          '&wsfunction=core_enrol_get_enrolled_users&courseid=' +
          courseID
      ).then(response => {
        getUser(response.data)
        console.log('meine fresse es geht 2')
      }).catch(err =>  {
        // Manage the state of the application if the request has failed
        this.error = 'du hast reingeschissen! Fehleranmeldung bitte kaufen sie den Battlepass'
      })
}


</script>


<template>
  <h1>BRO HÄÄÄ</h1>
  <div>its rough</div>
</template>