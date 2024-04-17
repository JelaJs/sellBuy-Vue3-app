<template>
  <header>
    <nav class="container nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login" v-if="!isLoggedIn">Login</RouterLink>
      <div v-if="isLoggedIn" class="btn-link-wrap">
        <button v-if="curUserId" @click="goToMsgPage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"
            />
          </svg>
        </button>
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
import { getAuth, signOut, onAuthStateChanged, onSnapshot, doc, db } from '@/firebase'

const isLoggedIn = ref(false)
const router = useRouter()
const curUserId = ref(null)
const curUser = ref(null)

const handleSignout = () => {
  signOut(auth).then(router.push('/'))
}

let auth
onMounted(() => {
  auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      curUserId.value = user.uid

      onSnapshot(doc(db, 'users', curUserId.value), (doc) => {
        curUser.value = doc.data().username
      })
    } else {
      isLoggedIn.value = false
    }
  })
})

const goToMsgPage = () => {
  router.push(`/messages/${curUserId.value}/${curUser.value}`)
}
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

svg {
  width: 20px;
  height: 20px;
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
