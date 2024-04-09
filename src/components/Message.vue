<template>
  <div class="msg-wrap">
    <p>To: {{ username }}</p>
    <ul v-if="filteredMessages.length > 0">
      <li
        :class="{ cur: props.curUserId === msg.senderId }"
        v-for="msg in filteredMessages"
        :key="msg.msgId"
      >
        <p>{{ msg.message }}</p>
      </li>
    </ul>
    <input v-model="message" type="text" id="message-input" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { db, doc, setDoc, onSnapshot } from '@/firebase'

const props = defineProps({
  id: String,
  username: String,
  curUser: String,
  curUserId: String
})

const message = ref('')
const messages = ref([])
const messagesRef = doc(db, 'messages', 'all-messages')

onSnapshot(messagesRef, (doc) => {
  messages.value = doc.exists() ? doc.data().messages : []
})

const filteredMessages = ref([])
onSnapshot(messagesRef, (doc) => {
  filteredMessages.value = doc.exists()
    ? doc
        .data()
        .messages.filter(
          (msg) =>
            (msg.senderId === props.curUserId && msg.receiverId === props.id) ||
            (msg.senderId === props.id && msg.receiverId === props.curUserId)
        )
    : []
})

const sendMessage = () => {
  if (message.value === '') return

  const newMessage = {
    message: message.value,
    senderId: props.curUserId,
    receiverId: props.id,
    msgId: uuidv4()
  }

  messages.value.push(newMessage)

  setDoc(messagesRef, { messages: messages.value })
    .then(() => {
      message.value = ''
    })
    .catch((error) => {
      console.error('Error sending message: ', error)
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
