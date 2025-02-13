<template>
  <div class="products">
    <div class="container">
      <h1>Scaly Shop</h1>
      <h4>Where cool video games are born.</h4>
      <br><br>
    </div>
    <b-container>
      <b-row>
        <b-col cols="4" >
          <b-form-input
            class="input"
            id="filter"
            v-model="searchstring"
            placeholder="Type to filter ..."
          />
        </b-col>
        <b-col cols="4">
          <b-form-select v-model="selected" :options="options"></b-form-select>
        </b-col>
      </b-row>
    </b-container>
    <b-list-group class = "box">
      <product-item v-for="product in filteredProducts" :key="product.name" :product="product" @order-product="orderProduct(product)" @like-product="likeProduct(product)" @dislike-product="dislikeProduct(product)"></product-item>
    </b-list-group>
  </div>
</template>

<script>
import { Api } from '@/Api';

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      orders: [],
      searchstring: '',
      selected: null,
      options: [
        { value: null, text: 'Categories' },
        { value: 'Sandbox', text: 'Sandbox' },
        { value: 'Action-adventure', text: 'Action-adventure' },
        { value: 'Platformer', text: 'Platformer' },
        { value: 'Vehicle simulation', text: 'Vehicle simulation' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      if (this.searchstring === '' && this.selected === null) {
        return this.products
      } else if (this.searchstring !== '') {
        return this.products.filter(product => {
          return product.name.toLowerCase().indexOf(this.searchstring.toLowerCase()) > -1
        })
      } else {
        return this.products.filter(product => {
          return product.category.toLowerCase().indexOf(this.selected.toLowerCase()) > -1
        })
      }
    }
  },
  mounted() {
    this.getProducts()
    this.getOrders()
  },
  methods: {
    generateRef() {
      return 'Order_' + Math.random().toString(36).substr(2, 9)
    },
    pendingOrder() {
      return this.orders.findIndex(order => order.orderStatus === 'Pending')
    },
    async orderProduct(productItem) {
      // Check if there is already a pending order
      var ordIdx = this.pendingOrder()
      var newRef = this.generateRef()
      var order = this.orders[ordIdx]
      if (ordIdx === -1) {
        order = await this.createOrder(newRef, productItem)
        ordIdx = this.orders.length - 1
      }
      // Update Order object
      var newTotal = (order.totalPrice + productItem.price).toFixed(2)
      var newProds = order.productsList
      newProds.push(productItem.name)
      this.updateOrder(order, newTotal, newProds)
      // Update Nr. Reserved
      this.updateNrReserved(productItem)
    },
    async createOrder(newRef, productItem) {
      const res = await Api.post('orders', {
        orderRef: newRef,
        totalPrice: 0,
        orderStatus: 'Pending'
      })
      this.orders.push(res.data)
      return res.data
    },
    updateOrder(order, newTotal, newProds) {
      Api.patch(`/orders/${order._id}`, {
        totalPrice: newTotal,
        productsList: newProds
      }).then(response => {
        console.log(response.data.message)
      }).catch(error => {
        console.log(error)
      })
    },
    updateNrReserved(productItem) {
      Api.patch(`/products/${productItem._id}`, {
        nrReserved: productItem.nrReserved + 1
      }).then(response => {
        console.log(response.data.message)
        location.reload()
      }).catch(error => {
        console.log(error)
      })
    },
    getProducts() {
      Api.get('products')
        .then(response => {
          this.products = response.data.products
        })
        .catch(error => {
          this.products = []
          console.log(error)
        })
    },
    getOrders() {
      Api.get('orders')
        .then(response => {
          this.orders = response.data.orders
        })
        .catch(error => {
          this.orders = []
          console.log(error)
        })
    },
    likeProduct(product) {
      Api.post(`products/${product._id}/like`).then(() => {
        product.likes++
      }).catch(error => {
        console.log(error)
      })
    },
    dislikeProduct(product) {
      Api.post(`products/${product._id}/dislike`).then(() => {
        product.dislikes++;
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.products {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 2em;
}
.box {
  margin-top: 1em;
}
</style>
