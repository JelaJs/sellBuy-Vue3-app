<template>
  <main>
    <h1>Home page</h1>
    <input type="file" @change="uploadLocal($event)" />
    <div v-if="myImg">
      <img :src="myImg" />
      <button @click="uploadtoFirebase">Upload</button>
    </div>
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
  getDoc,
  setDoc,
  collection,
  addDoc
} from '@/firebase'

const myImg = ref(null)
const imgs = ref(null)
const extention = ref(null)
const name = ref(null)
let reader = new FileReader()

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

const uploadtoFirebase = async () => {
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
        //console.log(downloadUrl)
        saveToFirestoredb(downloadUrl)
      })
    }
  )
}

const saveToFirestoredb = async (url) => {
  let ref = doc(db, 'cars/' + name.value)

  await setDoc(ref, {
    ImageName: name.value + extention.value,
    ImageURL: url
  })
}
</script>

<style scoped>
img {
  width: 200px;
  height: 200px;
}
</style>
