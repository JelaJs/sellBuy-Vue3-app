<template>
  <main>
    <div class="container">
      <h1>Buy and Sell Quickly</h1>
      <div class="findProd-wrap">
        <p>Sort Products:</p>
        <div class="sort-btns-wrap">
          <button class="sort-btn" @click="sortByDate">By date</button>
          <button class="sort-btn" @click="sortByPriceToExp">
            By Price(Cheapest to Expensive)
          </button>
          <button class="sort-btn" @click="sortByPriceToCheapest">
            By Price(Most Expensive to Cheapest)
          </button>
        </div>
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
import { db, collection, onSnapshot, query, orderBy } from '@/firebase'

const router = useRouter()
const products = ref([])
const prodRef = collection(db, 'products')
const sortedByDateRef = query(prodRef, orderBy('createdAt', 'desc')) //od najmladjeg ka najstarijem, ovo po difotu prvo mi je od najstarijeg do najmladjeg
const sortedByPriceRef = query(prodRef, orderBy('productPrice')) //od najjeftinijeg do najskupljeg
const toLowerSortedPriceRef = query(prodRef, orderBy('productPrice', 'desc'))

const onSnapShotCall = (ref) => {
  onSnapshot(ref, (snapshot) => {
    products.value = []
    snapshot.docs.forEach((doc) => {
      products.value.push({ ...doc.data(), id: doc.id })
    })
  })
}

onSnapShotCall(prodRef)

const sortByDate = () => {
  onSnapShotCall(sortedByDateRef)
}

const sortByPriceToExp = () => {
  onSnapShotCall(sortedByPriceRef)
}

const sortByPriceToCheapest = () => {
  onSnapShotCall(toLowerSortedPriceRef)
}

const goTosingleProduct = (id) => {
  router.push(`/singleproduct/${id}`)
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

.findProd-wrap .sort-btns-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.findProd-wrap p {
  font-size: 2rem;
}

.findProd-wrap .sort-btn {
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: rgb(106, 106, 255);
  color: #fff;
  border-radius: 100px;
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
  width: 80%;
  height: 80%;
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

/**Responsive Design */
@media (max-width: 1200px) {
  h1 {
    font-size: 3.8rem;
  }

  ul {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (max-width: 992px) {
  ul li .prod-name {
    font-size: 1.8rem;
    font-weight: 700;
  }

  ul li .prod-desc {
    font-size: 1.6rem;
  }

  ul li .prod-price {
    margin-top: 0.5rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 3.2rem;
  }

  ul {
    grid-template-columns: 1fr 1fr;
  }

  .findProd-wrap {
    flex-direction: column;
    align-items: start;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2.8rem;
  }

  ul {
    grid-template-columns: 1fr;
  }
}
</style>
