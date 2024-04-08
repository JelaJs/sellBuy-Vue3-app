<template>
  <main>
    <div class="container center">
      <form @submit.prevent="register">
        <h1>Create Account</h1>
        <div>
          <label for="userName">Name:</label>
          <input v-model="userName" type="text" placeholder="Jhon" required />
          <p v-show="usernameError">This field is required</p>
        </div>
        <div>
          <label for="email">Email:</label>
          <input v-model="email" type="email" placeholder="eg@examle.com" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" type="password" placeholder="*********" />
        </div>
        <div>
          <label for="number">Phone:</label>
          <input v-model="phone" type="number" placeholder="06003342" required />
          <p v-show="phoneError">
            This field is required and needs to be at least 8 characters long
          </p>
        </div>
        <button>SignUp</button>
        <RouterLink to="/login">Login</RouterLink>
        <p v-if="registerError">{{ registerError }}</p>
      </form>
    </div>
  </main>
</template>

<script setup>
//Prikazi username na user stranici
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getAuth, createUserWithEmailAndPassword, setDoc, doc, db } from '@/firebase'

const userName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const router = useRouter()
const registerError = ref(null)
const phoneError = ref(false)
const usernameError = ref(false)

const register = () => {
  phoneError.value = false
  phoneError.value = false

  if (phone.value === '' && phone.value < 8) {
    phoneError.value = true
    return
  }

  if (userName.value === '') {
    usernameError.value = true
    return
  }

  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((cred) => {
      return setDoc(doc(db, 'users', cred.user.uid), {
        username: userName.value,
        email: cred.user.email,
        phone: phone.value
      })
      //return setDoc(doc(db, 'products', cred.user.uid), {})
    })
    .then(() => {
      userName.value = ''
      email.value = ''
      password.value = ''
      registerError.value = null
      router.push('/user')
    })
    .catch((err) => {
      console.log(err.message)
      registerError.value = err.message
    })
}
</script>
