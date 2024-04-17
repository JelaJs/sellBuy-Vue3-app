<template>
  <div class="overlay">
    <div class="content-wrap">
      <p>Are you sure you want to delete this product?</p>
      <div class="btns-wrap">
        <button class="btn-del" @click="$emit('deleteProduct')">Delete</button>
        <button class="btn-close" @click="$emit('closeDelPopup')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0000006c;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay .content-wrap {
  max-width: 100rem;
  padding: 4rem;
  border-radius: 10px;
  z-index: 10;
  background-color: #fff;
}

.overlay .content-wrap p {
  font-size: 1.8rem;
}

.overlay .content-wrap .btns-wrap {
  margin-top: 2rem;
}

.overlay .content-wrap .btns-wrap button {
  padding: 1rem 2rem;
  margin-right: 1rem;
  font-size: 1.6rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  letter-spacing: 1px;
}

.overlay .content-wrap .btns-wrap button.btn-del {
  background-color: red;
  color: #fff;
}
</style>
