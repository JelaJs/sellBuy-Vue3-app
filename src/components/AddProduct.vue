<template>
  <main class="addProductPopup">
    <h1>Add Product</h1>
    <input type="file" @change="uploadLocal($event)" />
    <div v-if="myImg">
      <img :src="myImg" />
    </div>
    <div v-if="!myImg">Add image</div>
    <form @submit.prevent="uploadData">
      <input type="text" v-model="productName" placeholder="Product Name" required />
      <input type="number" v-model="productPrice" placeholder="Product Price" required />
      <textarea v-model="productDescription" placeholder="Product Description" required></textarea>
      <select v-model="productType" required>
        <option value="" disabled selected>Select Product Type</option>
        <option value="car">Car</option>
        <option value="motorcycle">Motorcycle</option>
        <option value="phone">Phone</option>
        <option value="laptop">Laptop</option>
        <option value="desktop">Desktop</option>
        <option value="bikes">Bikes</option>
        <option value="electronic">Electronic</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import {
  db,
  getStorage,
  sRef,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  setDoc,
  onAuthStateChanged,
  getAuth,
  serverTimestamp,
  onSnapshot
} from '@/firebase'

const existingProduct = ref(null)
const myImg = ref(null)
const imgs = ref(null)
const extention = ref(null)
const name = ref(null)
const userId = ref(null)
const productName = ref('')
const productPrice = ref('')
const productDescription = ref('')
const productType = ref('')
let reader = new FileReader()

const emit = defineEmits(['CloseModal'])

//set fileds if product already exist

const getFileExt = (file) => {
  let temp = file.name.split('.')
  let ext = temp.slice(temp.length - 1, temp.length)
  return '.' + ext[0]
}

const getFileName = (file) => {
  let temp = file.name.split('.')
  let fName = temp.slice(0, -1).join('.')
  return fName
}

const uploadLocal = (e) => {
  if (!e.target.files) return

  imgs.value = e.target.files
  extention.value = getFileExt(imgs.value[0])
  name.value = getFileName(imgs.value[0])

  reader.readAsDataURL(imgs.value[0])
}

reader.addEventListener('load', () => {
  myImg.value = reader.result
})

const uploadData = async () => {
  console.log('imgs value', imgs.value)
  if (
    !productName.value ||
    !productPrice.value ||
    !productDescription.value ||
    !productType.value ||
    !imgs.value
  ) {
    alert('All fields are required')
    return
  }

  let imgToUpload = imgs.value[0]

  let imgName = name.value + extention.value

  const metaData = {
    contentType: imgToUpload.type
  }

  const storage = getStorage()
  const storageRef = sRef(storage, 'images/' + imgName)
  const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData)

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    },
    (error) => {
      console.log('img not uploaded', error.message)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        saveToFirestoredb(downloadUrl)
      })
    }
  )
}

const saveToFirestoredb = async (url) => {
  const userRef = doc(db, 'products', userId.value)
  const userData = {
    // Add a new field with a dynamic name based on timestamp
    [`image_${Date.now()}`]: {
      imageName: name.value + extention.value,
      imageUrl: url,
      productName: productName.value,
      productPrice: productPrice.value,
      productDescription: productDescription.value,
      productType: productType.value,
      productComments: [],
      productLikes: 0,
      createdAt: serverTimestamp()
    }
  }
  await setDoc(userRef, userData).then(() => {
    emit('closeModal')
  })
}

onAuthStateChanged(getAuth(), (user) => {
  userId.value = user.uid
  existingProduct.value = doc(db, 'products', user.uid)

  onSnapshot(existingProduct.value, (doc) => {
    console.log('uslov prosao', doc.data())
    const objectData = doc.data()
    const userProduct = Object.entries(objectData).map(([key, value]) => value)
    console.log('users products', userProduct[0])
    if (userProduct[0]) {
      productName.value = userProduct[0].productName
      productPrice.value = userProduct[0].productPrice
      productDescription.value = userProduct[0].productDescription
      productType.value = userProduct[0].productType
    }
  })
})
</script>

<style scoped>
.addProductPopup {
  width: 80rem;
  height: 30rem;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
}
img {
  width: 200px;
  height: 200px;
}
</style>
