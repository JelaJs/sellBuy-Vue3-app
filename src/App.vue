<template>
  <header>
    <nav class="container nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login" v-if="!isLoggedIn">Login</RouterLink>
      <div v-if="isLoggedIn" class="btn-link-wrap">
        <RouterLink class="add-prod-link" to="/user">Add Product</RouterLink>
        <button @click="handleSignout">Sign out</button>
      </div>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
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

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.nav a {
  text-decoration: none;
  color: #000;
  font-size: 2rem;
}

.nav a.add-prod-link {
  padding: 1rem 2rem;
  background-color: rgb(106, 106, 255);
  color: #fff;
  border-radius: 20px;
}

.btn-link-wrap {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav .btn-link-wrap button {
  border: none;
  background-color: transparent;
  color: #000;
  font-size: 2.1rem;
  font-weight: 400;
  cursor: pointer;
}

/**Transition */
.page-enter-active,
.page-leave-active {
  transition: 400ms ease all;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/**Responsive Design */
@media (max-width: 1200px) {
  .nav a {
    font-size: 1.8rem;
  }

  .nav .btn-link-wrap button {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .nav a {
    font-size: 1.4rem;
  }

  .nav .btn-link-wrap button {
    font-size: 1.4rem;
  }

  .nav a.add-prod-link {
    padding: 0.5rem 1rem;
  }
}
</style>
