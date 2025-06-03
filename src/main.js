import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Тестовые данные для локальной разработки
import { initializeMockTelegram } from './testData.js'

// Создаем Vuetify с темной темой по умолчанию (как в Telegram)
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})

// Проверяем, запущено ли приложение в режиме разработки
const isDevelopment = import.meta.env.DEV

// Если запущено в режиме разработки и нет Telegram WebApp, инициализируем моки
if (isDevelopment) {
  initializeMockTelegram()
}

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
  
  // Логируем информацию о Telegram WebApp
  if (isDevelopment) {
    console.log('📱 Telegram WebApp инициализирован')
    console.log('🔧 Данные инициализации:', window.Telegram.WebApp.initDataUnsafe)
    console.log('🎨 Параметры темы:', window.Telegram.WebApp.themeParams)
  }
}

createApp(App).use(vuetify).mount('#app') 