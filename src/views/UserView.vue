<template>
  <main>
    <div class="container">
      <p class="username-p" v-if="username">
        You are currently logged in as: <span class="username">{{ username }}</span>
      </p>
      <button class="addProd-btn" @click="addProduct = true">
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
          <p><span>Name:</span> {{ userProduct.productName }}</p>
          <p><span>Price:</span> {{ userProduct.productPrice }} €</p>
          <p><span>Description:</span> {{ userProduct.productDescription }}</p>
          <button class="prod-delete-btn" @click="deletePopup = true">Delete</button>
        </li>
      </ul>
    </div>
    <DeleteProduct
      v-if="deletePopup"
      @deleteProduct="deleteCurProduct"
      @closeDelPopup="deletePopup = false"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { collection, onSnapshot, onAuthStateChanged, getAuth, db, doc, deleteDoc } from '@/firebase'
import AddProduct from '../components/AddProduct.vue'
import DeleteProduct from '@/components/DeleteProduct.vue'

const addProduct = ref(false)
const userProduct = ref(null)
const productRef = ref(null)
const userRef = ref(null)
const username = ref(null)
const deletePopup = ref(false)

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    productRef.value = doc(db, 'products', user.uid)
    userRef.value = doc(db, 'users', user.uid)
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

const deleteCurProduct = () => {
  deleteDoc(productRef.value).then(() => {
    onSnapshot(collection(db, 'products'), () => {
      userProduct.value = null
      deletePopup.value = false
    })
  })
}

const closeProductModal = () => {
  addProduct.value = false
}
</script>

<style scoped>
.username-p {
  font-size: 2.3rem;
}

.username {
  font-weight: 500;
  font-size: 3rem;
}

.addProd-btn {
  margin-top: 2rem;
  margin-bottom: 3rem;
  padding: 1rem 2rem;
  border: none;
  font-size: 1.6rem;
  color: #fff;
  background-color: rgb(106, 106, 255);
  cursor: pointer;
  border-radius: 100px;
}

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

ul {
  list-style: none;
}

ul li {
  margin-bottom: 40px;
}

ul li p {
  font-size: 1.8rem;
  margin-top: 0.5rem;
}

ul li p span {
  font-weight: 500;
}

ul li img {
  width: 15rem;
  height: 15rem;
  object-fit: cover;
}

.prod-delete-btn {
  margin-top: 3rem;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 2rem;
  font-weight: 500;
  color: rgb(175, 45, 45);
}

/**Responsive */
@media (max-width: 576px) {
  .username-p {
    font-size: 2rem;
  }

  .username {
    font-size: 2.2rem;
  }

  ul li p {
    font-size: 1.6rem;
  }
}
</style>
