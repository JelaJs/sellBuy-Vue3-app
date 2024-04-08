<template>
  <main v-if="productData">
    <img :src="productData.imageUrl" :alt="productData.imageName" />
    <p>{{ productData.username }}</p>
    <p>{{ productData.phone }}</p>
    <p>{{ productData.productName }}</p>
    <p>{{ productData.productDescription }}</p>
    <p>{{ productData.productPrice }}€</p>
    <ul v-if="productComms.length > 0">
      <li v-for="comm in productComms" :key="comm.id">
        <p>{{ comm.user }}</p>
        <p>{{ comm.comment }}</p>
        <button :class="{ hide: comm.curId !== curUserId }" @click="removeComment(comm.id)">
          Remove
        </button>
      </li>
    </ul>
    <input v-model="comment" type="text" placeholder="Add a comment" @keyup.enter="addComment" />
    <button @click="addComment">Add</button>
    <button v-if="sendBtn" @click="sendMessage = true">Send Message</button>
    <Message
      v-if="sendMessage"
      :id="id"
      :username="productData.username"
      :curUser="username"
      :curUserId="curUserId"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { onSnapshot, db, doc, onAuthStateChanged, getAuth, updateDoc } from '@/firebase'
import Message from '@/components/Message.vue'

const comment = ref('')
const productData = ref(null)
const productComms = ref([])
const route = useRoute()
const id = ref(route.params.id)
const docRef = doc(db, 'products', id.value)
const curUserRef = ref(null)
const username = ref(null)
const sendMessage = ref(false)
const curUserId = ref(null)
const sendBtn = ref(true)
const toRemove = ref(true)
//const phoneNumber = ref(null)

onSnapshot(docRef, (doc) => {
  productData.value = doc.data()
  productComms.value = doc.data().productComments
  console.log('Product comments', productComms.value)
})

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    curUserRef.value = doc(db, 'users', user.uid)

    onSnapshot(curUserRef.value, (doc) => {
      const userData = doc.data()
      username.value = userData.username
      curUserId.value = user.uid
    })

    if (user.uid === id.value) {
      sendBtn.value = false
    } else {
      sendBtn.value = true
    }
  } else {
    sendBtn.value = false
  }
})

const addComment = () => {
  if (comment.value === '') return
  productComms.value.push({
    user: username.value,
    comment: comment.value,
    id: uuidv4(),
    curId: curUserId.value
  })

  updateDoc(docRef, {
    productComments: productComms.value
  }).then(() => {
    comment.value = ''
  })
}

const removeComment = (id) => {
  productComms.value = productComms.value.filter((comm) => comm.id !== id)

  updateDoc(docRef, {
    productComments: productComms.value
  })
}
</script>

<style scoped>
img {
  width: 20rem;
  height: 20rem;
}

ul {
  margin-top: 3rem;
}

.hide {
  display: none;
}
</style>
