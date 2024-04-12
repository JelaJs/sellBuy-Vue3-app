<template>
  <main v-if="productData">
    <div class="container">
      <div class="product-img-info-wrap">
        <img :src="productData.imageUrl" :alt="productData.imageName" />
        <div>
          <p class="info-header">User Info</p>
          <p class="inner-info"><span>User:</span> {{ productData.username }}</p>
          <p class="inner-info"><span>Phone:</span> {{ productData.phone }}</p>
          <button class="send-message" v-if="sendBtn" @click="goToMessagePage">Send Message</button>
          <button class="send-message" v-if="!sendBtn && isUserLoggedIn" @click="goToUserPage">
            Update Product
          </button>
          <p class="send-msg-info" v-if="!isUserLoggedIn">
            <RouterLink to="/login">Login</RouterLink> to send a message to user
          </p>
          <p class="info-header product-info">Product Info</p>
          <p class="inner-info"><span>Name:</span> {{ productData.productName }}</p>
          <p class="inner-info"><span>Description:</span> {{ productData.productDescription }}</p>
          <p class="inner-info"><span>Price:</span> {{ productData.productPrice }}€</p>
        </div>
      </div>
      <p class="comments-p">Comments:</p>
      <ul v-if="productComms.length > 0">
        <li v-for="comm in productComms" :key="comm.id">
          <p class="user-com">{{ comm.user }}</p>
          <div class="com-btn-wrap">
            <p>{{ comm.comment }}</p>
            <button :class="{ hide: comm.curId !== curUserId }" @click="removeComment(comm.id)">
              Remove
            </button>
          </div>
        </li>
      </ul>
      <div v-if="isUserLoggedIn">
        <input
          v-model="comment"
          type="text"
          placeholder="Add a comment"
          @keyup.enter="addComment"
        />
        <button class="post-com-btn" @click="addComment">Add</button>
      </div>
      <p v-if="!isUserLoggedIn"><RouterLink to="/login">Login</RouterLink> to post a comment</p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { onSnapshot, db, doc, onAuthStateChanged, getAuth, updateDoc } from '@/firebase'

const router = useRouter()
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
const isUserLoggedIn = ref(false)
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

    isUserLoggedIn.value = true

    if (user.uid === id.value) {
      sendBtn.value = false
    } else {
      sendBtn.value = true
    }
  } else {
    sendBtn.value = false
    isUserLoggedIn.value = false
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

const goToMessagePage = () => {
  router.push(`/messages/${id.value}/${productData.value.username}`)
}

const goToUserPage = () => {
  router.push(`/user`)
}
</script>

<style scoped>
.product-img-info-wrap {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 2rem;
}

img {
  width: 20rem;
  height: 20rem;
  object-fit: cover;
}

.product-img-info-wrap .info-header {
  font-size: 2.2rem;
  font-weight: 700;
}

.product-img-info-wrap .product-info {
  margin-top: 3rem;
}

.product-img-info-wrap .send-message {
  padding: 1rem 1.5rem;
  cursor: pointer;
  border: none;
  font-size: 1.6rem;
  font-weight: 500;
  margin-top: 1.5rem;
  color: #fff;
  background-color: rgb(106, 106, 255);
  border-radius: 10px;
}

.product-img-info-wrap .send-msg-info {
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  color: #000000a8;
  font-weight: 500;
}

.product-img-info-wrap .inner-info {
  margin-left: 0.5rem;
  font-size: 1.8rem;
  margin-top: 1rem;
}

.product-img-info-wrap .inner-info span {
  font-weight: 500;
}

.comments-p {
  margin-top: 3rem;
}

ul {
  margin-top: 1rem;
  list-style: none;
}

ul li {
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

ul li .user-com {
  font-weight: 500;
  color: #999999;
}

ul li .com-btn-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ul li .com-btn-wrap button {
  background-color: transparent;
  border: none;
  color: rgb(175, 45, 45);
  font-size: 1.6rem;
  font-weight: 700;
}

input {
  width: 90%;
  height: 3.5rem;
  padding: 1rem;
  outline: 0;
  border: 1px solid rgb(106, 106, 255);
  border-right: none;
}

.post-com-btn {
  height: 3.5rem;
  border: none;
  background-color: rgb(106, 106, 255);
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
}

.post-com-btn {
  width: 10%;
}

a {
  text-decoration: none;
  font-weight: 500;
}

.hide {
  display: none;
}
</style>
