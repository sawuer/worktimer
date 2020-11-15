import App from './components/App.js'

window.app = new Vue({
  render: h => h(App),
}).$mount('#app')