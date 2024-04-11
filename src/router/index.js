import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserView from '@/views/UserView.vue'
import SingleProductView from '@/views/SingleProductView.vue'
import MessagesView from '@/views/MessagesView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/singleproduct/:id',
      name: 'singleproduct',
      component: SingleProductView
    },
    {
      path: '/messages/:id/:user',
      name: 'messages',
      component: MessagesView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert('you do not have an access')
      next('/')
    }
  } else {
    next()
  }
})
export default router
