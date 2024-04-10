<template>
  <main>
    <div class="container">
      <h1>Buy and Sell Quickly</h1>
      <div class="findProd-wrap">
        <p>Find Product:</p>
        <input
          v-model="searchProduct"
          type="text"
          placeholder="product name"
          @input="searchForProduct"
        />
      </div>
      <ul v-if="prodRef">
        <li v-for="product in products" :key="product.id" @click="goTosingleProduct(product.id)">
          <img :src="product.imageUrl" :alt="product.imageName" />
          <p class="prod-type">{{ product.productType }}</p>
          <p class="prod-name">{{ product.productName }}</p>
          <p class="prod-desc">{{ product.productDescription.slice(0, 30) }}...</p>
          <p class="prod-price">{{ product.productPrice }} €</p>
        </li>
      </ul>
    </div>
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
  orderBy,
  where
} from '@/firebase'

const router = useRouter()
const products = ref([])
//const dateSortedProducts = ref([])
//const priceSortedProducts = ref([])
//const priceToLowerSortedProducts = ref([])
const prodRef = collection(db, 'products')
//const sortedByDateRef = query(prodRef, orderBy('createdAt', 'desc')) //od najmladjeg ka najstarijem, ovo po difotu prvo mi je od najstarijeg do najmladjeg
//const sortedByPriceRef = query(prodRef, orderBy('productPrice')) //od najjeftinijeg do najskupljeg
//const toLowerSortedPriceRef = query(prodRef, orderBy('productPrice', 'desc'))
const searchProduct = ref('')
const searchTimer = ref(null)

onSnapshot(prodRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    products.value.push({ ...doc.data(), id: doc.id })
  })
  console.log(products.value)
})

const goTosingleProduct = (id) => {
  router.push(`/singleproduct/${id}`)
}

const searchForProduct = () => {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    if (searchProduct.value === '') {
      onSnapshot(prodRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          products.value.push({ ...doc.data(), id: doc.id })
        })
      })

      return
    }
    products.value = products.value.filter(
      (prod) => prod.productName.trim().toLowerCase() === searchProduct.value.trim().toLowerCase()
    )
  }, 300)
}
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 4.2rem;
}

.findProd-wrap {
  display: flex;
  align-items: center;
  margin-top: 3rem;
  gap: 0.5rem;
}

.findProd-wrap p {
  font-size: 2rem;
}

.findProd-wrap input {
  padding: 0.5rem 1rem;
  outline: none;
  border-radius: 10px;
  border: 1px solid #ccc;
}

ul {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 3rem;
  row-gap: 15rem;
  margin-top: 2rem;
}

ul li {
  cursor: pointer;
}

ul li img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

ul li .prod-type {
  font-size: 1.4rem;
  color: #00000094;
}

ul li .prod-name {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.2rem;
  text-transform: uppercase;
}

ul li .prod-desc {
  margin-top: 1rem;
  font-size: 1.8rem;
}

ul li .prod-price {
  font-size: 1.8rem;
}
</style>
