<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login" v-if="!isLoggedIn">Login</RouterLink>
      <button @click="handleSignout" v-if="isLoggedIn">Sign out</button>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged } from '@/firebase'

const isLoggedIn = ref(false)
const router = useRouter()

const handleSignout = () => {
  signOut(auth).then(router.push('/'))
}

let auth
onMounted(() => {
  auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})
</script>

<style scoped></style>
