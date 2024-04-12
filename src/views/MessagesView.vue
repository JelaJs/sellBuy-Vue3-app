<template>
  <div class="container message-grid">
    <div class="users-div">
      <p class="users-header">Users:</p>
      <ul v-if="users.length > 0">
        <li v-for="user in users" :key="user.id" @click="goToUserChat(user.id, user.username)">
          {{ user.username }}
        </li>
      </ul>
    </div>
    <div class="msg-wrap">
      <p class="user-header">To: {{ username }}</p>
      <ul v-if="filteredMessages.length > 0">
        <li
          :class="{ cur: curUserId === msg.senderId }"
          v-for="msg in filteredMessages"
          :key="msg.msgId"
        >
          <p>{{ msg.message }}</p>
        </li>
      </ul>
      <div class="input-btn-wrap">
        <input
          v-model="message"
          type="text"
          id="message-input"
          @keyup.enter="sendMessage"
          autocomplete="off"
        />
        <button @click="sendMessage">Send</button>
      </div>
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

<style scoped>
.message-grid {
  display: grid;
  grid-template-columns: 1fr 4fr;
  margin-top: 3rem;
}

.message-grid .users-div {
  height: 100vh;
  background-color: #f8f8f8;
  padding: 2rem;
}

.message-grid .users-div .users-header,
.user-header {
  font-size: 2rem;
  font-weight: 500;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ccc;
}

.message-grid .users-div ul {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin-top: 1rem;
}

.message-grid .users-div ul li {
  cursor: pointer;
  padding: 1rem;
  background-color: #ececec;
  font-size: 2rem;
  font-weight: 500;
  color: rgb(106, 106, 255);
  transition: all 0.3s;
}

.message-grid .users-div ul li:hover {
  background-color: #e2e2e2;
}

.message-grid .msg-wrap {
  padding: 2rem;
  height: 100vh;
  position: relative;
}

.message-grid .msg-wrap ul {
  list-style: none;
  height: 80%;
  margin-top: 1rem;
  padding-bottom: 2rem;
  overflow-y: scroll;
}

.message-grid .msg-wrap ul li {
  margin-top: 0.5rem;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 100px;
}

.message-grid .msg-wrap ul li.cur {
  text-align: end;
  background-color: rgb(106, 106, 255);
  color: #fff;
}

.message-grid .msg-wrap .input-btn-wrap {
  bottom: 0;
  width: 100%;
}

.message-grid .msg-wrap .input-btn-wrap input {
  width: 90%;
  height: 4rem;
  outline: none;
  border: 1px solid #ccc;
  padding-left: 1rem;
}

.message-grid .msg-wrap .input-btn-wrap button {
  width: 10%;
  height: 4rem;
  font-weight: 1.6rem;
  font-weight: 500;
  background-color: rgb(106, 106, 255);
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
