<template>
  <main>
    <button @click="addProduct = true">
      {{ usersProducts.length <= 0 ? 'Add New Product' : 'Update Product' }}
    </button>
    <div v-if="addProduct" @click.stop="addProduct = false" class="overlay">
      <div @click.stop="">
        <AddProduct v-if="addProduct" @closeModal="closeProductModal" />
      </div>
    </div>
    <ul v-if="usersProducts.length > 0">
      <li v-for="product in usersProducts" :key="product.productName">
        <img :src="product.imageUrl" alt="" />
        <p>{{ product.productName }}</p>
        <p>{{ product.productPrice }}</p>
        <p>{{ product.productDescription }}</p>
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
const usersProducts = ref([])
const productRef = ref(null)

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    productRef.value = doc(db, 'products', user.uid)
    //const docRef = doc(db, 'products', user.uid)
    onSnapshot(productRef.value, (doc) => {
      //console.log('doc data', { ...doc.data() })
      const objectData = doc.data()
      if (objectData) {
        usersProducts.value = Object.entries(objectData).map(([key, value]) => value)
        console.log('users products', usersProducts.value)
      }
    })
  } else {
    //console.log("user logged out");
    usersProducts.value = []
  }
})

const deleteProduct = () => {
  //await deleteDoc(doc(productRef.value, product))
  deleteDoc(productRef.value).then(() => {
    onSnapshot(collection(db, 'products'), () => {
      usersProducts.value = []
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
