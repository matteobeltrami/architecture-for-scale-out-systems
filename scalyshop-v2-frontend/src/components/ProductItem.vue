<template>
  <b-list-group-item>
    <img alt="Product" src="../assets/game.png">
    {{ product.name }} - ( {{ product.price }}kr )
    <b-button type="button" variant="link" @click="$emit('order-product', product._id)">
      <img alt="Add To Cart" src="../assets/addtocart.jpg">
    </b-button>
    <b-button type="button" variant="link" @click="$emit('like-product', product._id)">
      <img alt="Like" src="../assets/like.svg">
      {{ product.likes }}
    </b-button>
    <b-button type="button" variant="link" @click="$emit('dislike-product', product._id)">
      <img alt="Add To Cart" src="../assets/dislike.svg">
      {{ product.dislikes }}
    </b-button>
  </b-list-group-item>
</template>

<script>

export default {
  name: 'product-item',
  props: ['product']
}
</script>

<style scoped>
img {
  width: 33px;
  margin-right: 10px;
}
</style>
