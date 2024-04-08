<template>
  <main v-if="productData">
    <img :src="productData.imageUrl" :alt="productData.imageName" />
    <p>{{ productData.productName }}</p>
    <p>{{ productData.productDescription }}</p>
    <p>{{ productData.productPrice }}€</p>
    <ul v-if="productComms.length">
      <li v-for="comm in productComms" :key="comm">
        <p>{{ comm.user }}</p>
        <p>{{ comm.comment }}</p>
        <button @click="removeComment">Remove</button>
      </li>
    </ul>
    <input v-model="comment" type="text" placeholder="Add a comment" />
    <button @click="addComment">Add</button>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { onSnapshot, db, doc, onAuthStateChanged, getAuth, updateDoc } from '@/firebase'

const comment = ref('')
const productData = ref(null)
const productComms = ref([])
const route = useRoute()
const id = ref(route.params.id)
const docRef = doc(db, 'products', id.value)
const userRef = ref(null)
const username = ref(null)

onSnapshot(docRef, (doc) => {
  productData.value = doc.data()
  productComms.value = doc.data().productComments
  console.log('Product comments', productComms.value)
})

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    userRef.value = doc(db, 'users', user.uid)

    onSnapshot(userRef.value, (doc) => {
      const userData = doc.data()
      username.value = userData.username
    })
  }
})

const addComment = () => {
  if (comment.value === '') return
  productComms.value.push({
    user: username.value,
    comment: comment.value,
    id
  })

  updateDoc(docRef, {
    productComments: productComms.value
  }).then(() => {
    comment.value = ''
  })
}

const removeComment = () => {}
</script>

<style scoped>
img {
  width: 20rem;
  height: 20rem;
}

ul {
  margin-top: 3rem;
}
</style>
