<template>
  <main class="addProductPopup">
    <h3>Add New Product</h3>
    <input class="upload-img-input" type="file" @change="uploadLocal($event)" />
    <div v-if="myImg">
      <img :src="myImg" />
    </div>
    <div v-if="!myImg">Add image</div>
    <form @submit.prevent="uploadData">
      <input type="text" v-model="productName" placeholder="Product Name" required />
      <input type="number" v-model="productPrice" placeholder="Product Price in Euro" required />
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
        <option value="other">Other</option>
      </select>
      <button class="add-btn" type="submit">Submit</button>
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
const curUser = ref(null)
const phone = ref(null)
const userName = ref(null)

const emit = defineEmits(['CloseModal'])
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
  if (e.target.files.length === 0) {
    imgs.value = null
    return
  }

  imgs.value = e.target.files
  extention.value = getFileExt(imgs.value[0])
  name.value = getFileName(imgs.value[0])

  reader.readAsDataURL(imgs.value[0])
}

reader.addEventListener('load', () => {
  myImg.value = reader.result
})

const uploadData = async () => {
  //console.log('imgs value', imgs.value)
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
      console.log(progress)
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
    imageName: name.value + extention.value,
    imageUrl: url,
    productName: productName.value,
    productPrice: productPrice.value,
    productDescription: productDescription.value,
    productType: productType.value,
    productComments: [],
    phone: phone.value,
    username: userName.value,
    createdAt: serverTimestamp()
  }
  await setDoc(userRef, userData).then(() => {
    emit('closeModal')
  })
}

onAuthStateChanged(getAuth(), (user) => {
  userId.value = user.uid
  existingProduct.value = doc(db, 'products', user.uid)
  curUser.value = doc(db, 'users', user.uid)

  onSnapshot(existingProduct.value, (doc) => {
    //iscitavamo iz baze ako postoji za update
    //console.log('uslov prosao', doc.data())
    const userProduct = doc.data()
    if (userProduct) {
      productName.value = userProduct.productName
      productPrice.value = userProduct.productPrice
      productDescription.value = userProduct.productDescription
      productType.value = userProduct.productType
    }
  })

  onSnapshot(curUser.value, (doc) => {
    //console.log('curUser', doc.data())
    phone.value = doc.data().phone
    userName.value = doc.data().username
  })
})
</script>

<style scoped>
.addProductPopup {
  width: 80rem;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
}

.addProductPopup h3 {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  font-size: 2.3rem;
}

.addProductPopup .upload-img-input {
  margin-top: 2rem;
  cursor: pointer;
}

img {
  width: 10rem;
  height: 10rem;
  object-fit: cover;
  margin-top: 1rem;
}

form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

form input {
  height: 3rem;
  outline: none;
  border: 1px solid #ccc;
  padding-left: 1rem;
}

form textarea {
  height: 10rem;
  outline: none;
  border: 1px solid #ccc;
  resize: none;
}

form select {
  height: 3rem;
  outline: none;
  border: 1px solid #ccc;
}

form .add-btn {
  padding: 1rem 2rem;
  background-color: rgb(106, 106, 255);
  border: none;
  color: #fff;
  font-size: 1.8rem;
  letter-spacing: 1px;
  font-weight: 500;
  border-radius: 100px;
  cursor: pointer;
  width: 80%;
  margin: 0 auto;
}

/**Responsive */
@media (max-width: 992px) {
  .addProductPopup {
    width: 90%;
  }
}
</style>
