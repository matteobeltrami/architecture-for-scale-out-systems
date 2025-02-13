
import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import ProductItem from './components/OrderItem.vue'
import OrderItem from './components/OrderItem.vue'

const app = createApp(App)
app.use(createBootstrap())
app.use(router)

app.component('ProductItem', ProductItem)
app.component('OrderItem', OrderItem)

app.mount('#app')
