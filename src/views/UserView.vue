<template>
  <main>
    <button @click="addProduct = true">Add new product</button>
    <div v-if="addProduct" @click.stop="addProduct = false" class="overlay">
      <div @click.stop="">
        <AddProduct v-if="addProduct" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { collection, onSnapshot, onAuthStateChanged, getAuth, db, where, query } from '@/firebase'
import AddProduct from '../components/AddProduct.vue'

const addProduct = ref(false)
const usersProducts = ref([])

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    const q = query(collection(db, `products`, user.uid))
    //console.log("User logged in ", user);
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(doc)
        usersProducts.value.push({ ...doc.data(), id: doc.id })
      })
      //console.log(usersProducts.value)
    })
  } else {
    //console.log("user logged out");
    usersProducts.value = []
  }
})
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
</style>
