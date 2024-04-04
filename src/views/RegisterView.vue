<template>
  <main>
    <div class="container center">
      <form @submit.prevent="register">
        <h1>Create Account</h1>
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
//trebam da dodam da kad se user signupuje da napravi u firestore doc sa svojim id-om. U firebase da napravim da moze da update samo ako je id od usera == id doc u firebase
//da citaju mogu svi. Na user stranici napravicu filter da mi se izlistaju samo doc iz firebase koji se jednaki id logovanog usera(tako da i ako haker zaobidje ovo nece
// moci nista da uradi jer u backend namesteno da ne moze da menja nista). Kad dodajem oglas treba se smesti unutar id od usera. pravimo kolekciju unutar id od usera
//Mogu dodati i users doc u firestore sa id usera gde ce moci da izlista user samo svoje podatke
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getAuth, createUserWithEmailAndPassword, setDoc, doc, db } from '@/firebase'

const email = ref('')
const password = ref('')
const router = useRouter()
const registerError = ref(null)

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((cred) => {
      setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email
      })
      return setDoc(doc(db, 'products', cred.user.uid), {})
    })
    .then(() => {
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
