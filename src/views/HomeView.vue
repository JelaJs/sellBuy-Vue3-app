<template>
  <main>
    <div class="container">
      <h1>Buy and Sell Quickly</h1>
      <div class="findProd-wrap">
        <p>Sort Products by:</p>
        <div class="inner-sort-wrap" @click="showSelectMenu">
          {{ sortBy }}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
            />
          </svg>
        </div>
        <div class="sort-btns-wrap" style="display: none">
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
const sortBy = ref('default')

const onSnapShotCall = (ref) => {
  onSnapshot(ref, (snapshot) => {
    products.value = []
    snapshot.docs.forEach((doc) => {
      products.value.push({ ...doc.data(), id: doc.id })
    })
  })
}

const setDisplayNone = () => {
  const btnsMenu = document.querySelector('.sort-btns-wrap')
  btnsMenu.style.display = 'none'
}

onSnapShotCall(prodRef)

const sortByDate = () => {
  onSnapShotCall(sortedByDateRef)
  sortBy.value = 'date'
  setDisplayNone()
}

const sortByPriceToExp = () => {
  onSnapShotCall(sortedByPriceRef)
  sortBy.value = 'By Price(Cheapest to Expensive)'
  setDisplayNone()
}

const sortByPriceToCheapest = () => {
  onSnapShotCall(toLowerSortedPriceRef)
  sortBy.value = 'By Price(Most Expensive to Cheapest)'
  setDisplayNone()
}

const goTosingleProduct = (id) => {
  router.push(`/singleproduct/${id}`)
}

const showSelectMenu = () => {
  const btnsMenu = document.querySelector('.sort-btns-wrap')
  if (btnsMenu.style.display === 'none') {
    btnsMenu.style.display = 'flex'
  } else {
    btnsMenu.style.display = 'none'
  }
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
  position: relative;
}

.findProd-wrap .sort-btns-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 110%;
  left: 15%;
  background-color: #ebebeb;
  padding: 1rem;
  border-radius: 10px;
}

.findProd-wrap .inner-sort-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.findProd-wrap p {
  font-size: 2rem;
}

.findProd-wrap svg {
  width: 20px;
  height: 20px;
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
  width: 100%;
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

  .findProd-wrap .sort-btns-wrap {
    width: 100%;
    left: 0;
  }
}
</style>
