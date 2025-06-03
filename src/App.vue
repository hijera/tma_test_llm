<template>
  <v-app>
    <!-- Главный контейнер приложения -->
    <v-main>
      <v-container class="fill-height pa-4">
        <!-- Компонент визитки -->
        <BusinessCard />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import BusinessCard from './components/BusinessCard.vue'

export default {
  name: 'App',
  components: {
    BusinessCard
  },
  
  mounted() {
    // Применяем тему Telegram если доступна
    this.applyTelegramTheme()
  },
  
  methods: {
    /**
     * Применяет цветовую схему из Telegram WebApp
     */
    applyTelegramTheme() {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.themeParams) {
        const themeParams = window.Telegram.WebApp.themeParams
        
        // Применяем цвета темы Telegram к CSS переменным
        document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || '#17212b')
        document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || '#ffffff')
        document.documentElement.style.setProperty('--tg-hint-color', themeParams.hint_color || '#708499')
        document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || '#5288c1')
        document.documentElement.style.setProperty('--tg-button-text-color', themeParams.button_text_color || '#ffffff')
      }
    }
  }
}
</script>

<style>
/* Глобальные стили с цветами Telegram */
.v-application {
  background-color: var(--tg-bg-color, #17212b) !important;
  color: var(--tg-text-color, #ffffff) !important;
}

/* Стили для кнопок в стиле Telegram */
.telegram-button {
  background-color: var(--tg-button-color, #5288c1) !important;
  color: var(--tg-button-text-color, #ffffff) !important;
}

/* Плавные анимации */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 