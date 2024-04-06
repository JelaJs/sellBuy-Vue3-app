<template>
  <main>
    <div class="container center">
      <form @submit.prevent="register">
        <h1>Create Account</h1>
        <div>
          <label for="userName">Name:</label>
          <input v-model="userName" type="text" placeholder="Jhon" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input v-model="email" type="email" placeholder="eg@examle.com" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" type="password" placeholder="*********" />
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
const router = useRouter()
const registerError = ref(null)

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((cred) => {
      return setDoc(doc(db, 'users', cred.user.uid), {
        username: userName.value,
        email: cred.user.email
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
