import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Создаем Vuetify с темной темой по умолчанию (как в Telegram)
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})

// Инициализация Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready()
  
  // Расширяем приложение на весь экран
  window.Telegram.WebApp.expand()
  
  // Включаем главную кнопку
  window.Telegram.WebApp.MainButton.setText('Закрыть')
  window.Telegram.WebApp.MainButton.show()
  
  // Обработчик для главной кнопки
  window.Telegram.WebApp.MainButton.onClick(() => {
    window.Telegram.WebApp.close()
  })
}

createApp(App).use(vuetify).mount('#app') 