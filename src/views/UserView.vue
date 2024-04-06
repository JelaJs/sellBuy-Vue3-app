<template>
  <main>
    <p v-if="username">{{ username }}</p>
    <button @click="addProduct = true">
      {{ userProduct ? 'Update Product' : 'Add New Product' }}
    </button>
    <div v-if="addProduct" @click.stop="addProduct = false" class="overlay">
      <div @click.stop="">
        <AddProduct v-if="addProduct" @closeModal="closeProductModal" />
      </div>
    </div>
    <ul v-if="userProduct">
      <li>
        <img :src="userProduct.imageUrl" alt="" />
        <p>{{ userProduct.productName }}</p>
        <p>{{ userProduct.productPrice }}</p>
        <p>{{ userProduct.productDescription }}</p>
        <button @click="deleteProduct">Delete</button>
      </li>
    </ul>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import {
  collection,
  onSnapshot,
  onAuthStateChanged,
  getAuth,
  db,
  query,
  doc,
  updateDoc,
  deleteField,
  deleteDoc
} from '@/firebase'
import AddProduct from '../components/AddProduct.vue'

const addProduct = ref(false)
const userProduct = ref(null)
const productRef = ref(null)
const userRef = ref(null)
const username = ref(null)

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    productRef.value = doc(db, 'products', user.uid)
    userRef.value = doc(db, 'users', user.uid)
    //const docRef = doc(db, 'products', user.uid)
    onSnapshot(productRef.value, (doc) => {
      //console.log('doc data', { ...doc.data() })
      const objectData = doc.data()
      if (objectData) {
        userProduct.value = doc.data()
      }
    })

    onSnapshot(userRef.value, (doc) => {
      const userData = doc.data()
      username.value = userData.username
    })
  } else {
    //console.log("user logged out");
    userProduct.value = null
  }
})

const deleteProduct = () => {
  //await deleteDoc(doc(productRef.value, product))
  deleteDoc(productRef.value).then(() => {
    onSnapshot(collection(db, 'products'), () => {
      userProduct.value = null
    })
  })
}

const closeProductModal = () => {
  addProduct.value = false
}
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #00000091;
}

img {
  width: 200px;
  height: 200px;
}

li {
  margin-bottom: 40px;
  cursor: pointer;
}
</style>
