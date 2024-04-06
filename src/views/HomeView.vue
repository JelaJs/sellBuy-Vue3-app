<template>
  <main>
    <h1>Home page</h1>
    <ul v-if="prodRef">
      <li v-for="product in products" :key="product.id" @click="goTosingleProduct(product.id)">
        <img :src="product.imageUrl" :alt="product.imageName" />
        <p>{{ product.productType }}</p>
        <p>{{ product.productName }}</p>
        <p>{{ product.productDescription }}</p>
        <p>{{ product.productPrice }}</p>
      </li>
    </ul>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  db,
  getStorage,
  sRef,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from '@/firebase'

const router = useRouter()
const products = ref([])
const dateSortedProducts = ref([])
const priceSortedProducts = ref([])
const priceToLowerSortedProducts = ref([])
const prodRef = collection(db, 'products')
const sortedByDateRef = query(prodRef, orderBy('createdAt', 'desc')) //od najmladjeg ka najstarijem, ovo po difotu prvo mi je od najstarijeg do najmladjeg
const sortedByPriceRef = query(prodRef, orderBy('productPrice')) //od najjeftinijeg do najskupljeg
const toLowerSortedPriceRef = query(prodRef, orderBy('productPrice', 'desc'))

onSnapshot(prodRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    products.value.push({ ...doc.data(), id: doc.id })
  })
  console.log(products.value)
})

onSnapshot(sortedByDateRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    dateSortedProducts.value.push({ ...doc.data(), id: doc.id })
  })
  console.log('date sorted', dateSortedProducts.value)
})

onSnapshot(sortedByPriceRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    priceSortedProducts.value.push({ ...doc.data(), id: doc.id })
  })
  console.log('price sorted', priceSortedProducts.value)
})

onSnapshot(toLowerSortedPriceRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    priceToLowerSortedProducts.value.push({ ...doc.data(), id: doc.id })
  })
  console.log('price to lower sorted', priceToLowerSortedProducts.value)
})

const goTosingleProduct = (id) => {
  router.push(`/singleproduct/${id}`)
}
</script>

<style scoped>
img {
  width: 200px;
  height: 200px;
}
</style>
