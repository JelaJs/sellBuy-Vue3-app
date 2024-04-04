<template>
  <main>
    <div class="container center">
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input v-model="email" type="email" placeholder="eg@examle.com" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" type="password" placeholder="*********" />
        </div>
        <button>Login</button>
        <RouterLink to="/register">Register</RouterLink>
        <p v-if="loginError">{{ loginError }}</p>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getAuth, signInWithEmailAndPassword } from '@/firebase'

const email = ref('')
const password = ref('')
const router = useRouter()
const loginError = ref(null)
//const userId = ref(null)

const login = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((cred) => {
      //console.log('user created', cred.user.uid)
      //userId.value = cred.user.uid
      email.value = ''
      password.value = ''
      loginError.value = null
      router.push('/user')
    })
    .catch((err) => {
      console.log(err.message)
      loginError.value = err.message
    })
}
</script>

<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

form {
  width: 80%;
  padding: 2rem 3rem;
}

form label {
  display: block;
}

form div {
  margin-top: 3rem;
}

form input {
  width: 100%;
  height: 3rem;
  padding-left: 1rem;
  margin-top: 0.5rem;
}

form button {
  margin-top: 3rem;
}
</style>
