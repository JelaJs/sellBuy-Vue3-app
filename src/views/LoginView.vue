<template>
  <main>
    <div class="container center">
      <form class="form" @submit.prevent="login">
        <h2>Login</h2>
        <div>
          <label for="email">Email:</label>
          <input v-model="email" type="email" placeholder="eg@examle.com" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" type="password" placeholder="*********" />
        </div>
        <div class="btn-wrap">
          <button>Login</button>
        </div>
        <div class="p-btn-wrap">
          <p>Don't have account?</p>
          <RouterLink to="/register">Register</RouterLink>
        </div>
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

.form {
  width: 80%;
  padding: 3rem 4rem;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 16px -1px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 0px 16px -1px rgba(0, 0, 0, 0.4);
  box-shadow: 0px 0px 16px -1px rgba(0, 0, 0, 0.4);
}

.form h2 {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  font-size: 3rem;
}

.form label {
  display: block;
}

.form div {
  margin-top: 3rem;
}

.form input {
  width: 100%;
  height: 4rem;
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.form .btn-wrap {
  margin-top: 3rem;
  text-align: center;
}

.form button {
  padding: 1.5rem 3rem;
  background-color: rgb(106, 106, 255);
  border: none;
  color: #fff;
  font-size: 2rem;
  letter-spacing: 1px;
  font-weight: 500;
  border-radius: 100px;
  cursor: pointer;
}

.form .p-btn-wrap {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}
</style>
