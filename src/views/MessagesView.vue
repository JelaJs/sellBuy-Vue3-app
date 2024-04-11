<template>
  <div>
    <div>Users:</div>
    <ul v-if="users.length > 0">
      <li v-for="user in users" :key="user.id" @click="goToUserChat(user.id, user.username)">
        {{ user.username }}
      </li>
    </ul>
    <div class="msg-wrap">
      <p>To: {{ username }}</p>
      <ul v-if="filteredMessages.length > 0">
        <li
          :class="{ cur: curUserId === msg.senderId }"
          v-for="msg in filteredMessages"
          :key="msg.msgId"
        >
          <p>{{ msg.message }}</p>
        </li>
      </ul>
      <input v-model="message" type="text" id="message-input" @keyup.enter="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { db, doc, setDoc, onSnapshot, onAuthStateChanged, getAuth, collection } from '@/firebase'

/*const props = defineProps({
  id: String,
  username: String,
  curUser: String,
  curUserId: String
})*/

const router = useRouter()
const route = useRoute()
const id = ref(route.params.id)
const username = ref(route.params.user)
const curUserRef = ref(null)
const curUserId = ref(null)
const curUsername = ref(null)
const message = ref('')
const messages = ref([])
const messagesRef = doc(db, 'messages', 'all-messages')
const filteredMessages = ref([])
const usersRef = collection(db, 'users')
const users = ref([])

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    curUserRef.value = doc(db, 'users', user.uid)
    curUserId.value = user.uid

    onSnapshot(curUserRef.value, (doc) => {
      const userData = doc.data()
      curUsername.value = userData.username
    })
  }
})

onSnapshot(usersRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    users.value.push({ ...doc.data(), id: doc.id })
  })
})

onSnapshot(messagesRef, (doc) => {
  messages.value = doc.exists() ? doc.data().messages : []
})

onSnapshot(messagesRef, (doc) => {
  filteredMessages.value = doc.exists()
    ? doc
        .data()
        .messages.filter(
          (msg) =>
            (msg.senderId === curUserId.value && msg.receiverId === id.value) ||
            (msg.senderId === id.value && msg.receiverId === curUserId.value)
        )
    : []
})

const sendMessage = () => {
  if (message.value === '') return

  const newMessage = {
    message: message.value,
    senderId: curUserId,
    receiverId: id,
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

const goToUserChat = (id, username) => {
  router.push(`/messages/${id}/${username}`).then(() => {})
}

const onRouteParamsChange = () => {
  id.value = route.params.id
  username.value = route.params.user

  onSnapshot(messagesRef, (doc) => {
    messages.value = doc.exists() ? doc.data().messages : []
  })

  onSnapshot(messagesRef, (doc) => {
    filteredMessages.value = doc.exists()
      ? doc
          .data()
          .messages.filter(
            (msg) =>
              (msg.senderId === curUserId.value && msg.receiverId === id.value) ||
              (msg.senderId === id.value && msg.receiverId === curUserId.value)
          )
      : []
  })
}

watch([() => route.params.id, () => route.params.user], () => {
  onRouteParamsChange()
})
</script>
