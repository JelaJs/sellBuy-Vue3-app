<template>
  <main>This is single product page</main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { onSnapshot, db, doc } from '@/firebase'

const productData = ref(null)
const route = useRoute()
const id = ref(route.params.id)
const docRef = doc(db, 'products', id.value)

onSnapshot(docRef, (doc) => {
  productData.value = doc.data()
  console.log(productData.value)
})
</script>
