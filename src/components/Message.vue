<template>
  <div class="msg-wrap">
    <p>To: {{ username }}</p>
    <ul v-if="messages.length > 0">
      <li :class="{ cur: props.curUserId === msg.curId }" v-for="msg in messages" :key="msg.msgId">
        <p>{{ msg.message }}</p>
      </li>
    </ul>
    <input v-model="message" type="text" id="message-input" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
//RADI IZMEDJU 2 KORISNIKA NE RADI KAD SE DODA TRECI
import { ref, defineProps } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {
  db,
  getStorage,
  sRef,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  setDoc,
  onAuthStateChanged,
  getAuth,
  serverTimestamp,
  onSnapshot
} from '@/firebase'

const props = defineProps({
  id: String,
  username: String,
  curUser: String,
  curUserId: String
})
const message = ref('')
const messages = ref([])
const messageRef = ref(doc(db, 'messages', props.id))
const curUserMessageRef = ref(doc(db, 'messages', props.curUserId))

onSnapshot(curUserMessageRef.value, (doc) => {
  messages.value = doc.data().message
  console.log('Proslo', messages.value)
})

const sendMessage = () => {
  if (message.value === '') return
  //messageRef.value = doc(db, 'messages', props.id)
  //curUserMessageRef.value = doc(db, 'messages', props.curUserId)
  messages.value.push({
    message: message.value,
    curId: props.curUserId,
    msgId: uuidv4()
  })

  const messageData = {
    user: props.curUser,
    message: messages.value,
    curUserId: props.curUserId,
    userId: props.id
  }

  setDoc(messageRef.value, messageData).then(() => {
    message.value = ''
  })

  setDoc(curUserMessageRef.value, messageData).then(() => {
    message.value = ''
  })

  onSnapshot(curUserMessageRef.value, (doc) => {
    messages.value = doc.data().message
    console.log('Proslo', message.value)
  })
}
</script>

<style scoped>
.msg-wrap {
  width: 40rem;
  height: 50rem;
  position: absolute;
  bottom: 0;
  right: 10px;
  border: 1px solid #ccc;
}

input,
button {
  position: relative;
  top: 90%;
  width: 100%;
}

ul {
  list-style: none;
}

ul li {
  text-align: start;
  background-color: orangered;
}

ul li.cur {
  text-align: end;
  background-color: yellow;
}
</style>
