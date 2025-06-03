<template>
  <div class="business-card-container">
    <!-- Заголовок приложения -->
    <v-row class="mb-4">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 mb-2">
          <v-icon class="mr-2" color="primary">mdi-card-account-details</v-icon>
          Моя визитка
        </h1>
        <p class="text-subtitle-1" style="color: var(--tg-hint-color, #708499);">
          Ваша персональная карточка в Telegram
        </p>
      </v-col>
    </v-row>

    <!-- Главная визитка -->
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <BusinessCardDisplay 
          :user-data="userData"
          :settings="settings"
          ref="businessCardRef"
        />
      </v-col>
    </v-row>

    <!-- Кнопки управления -->
    <v-row class="mt-4">
      <v-col cols="12">
        <BusinessCardActions 
          :user-data="userData"
          :settings="settings"
          @copy-card="copyCard"
          @save-card="saveCard"
          @update-settings="updateSettings"
          @send-to-bot="sendToBot"
        />
      </v-col>
    </v-row>

    <!-- Настройки -->
    <v-row class="mt-4">
      <v-col cols="12">
        <BusinessCardSettings 
          :settings="settings"
          @update-settings="updateSettings"
        />
      </v-col>
    </v-row>

    <!-- Уведомление о копировании -->
    <v-snackbar
      v-model="showCopyNotification"
      :timeout="2000"
      color="success"
      location="top"
    >
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      Визитка скопирована в буфер обмена!
    </v-snackbar>
  </div>
</template>

<script>
import BusinessCardDisplay from './BusinessCardDisplay.vue'
import BusinessCardActions from './BusinessCardActions.vue'
import BusinessCardSettings from './BusinessCardSettings.vue'
import { getTestProfileById, testProfiles } from '../testData.js'

export default {
  name: 'BusinessCard',
  components: {
    BusinessCardDisplay,
    BusinessCardActions,
    BusinessCardSettings
  },
  
  data() {
    return {
      // Данные пользователя из Telegram
      userData: {
        id: null,
        first_name: '',
        last_name: '',
        username: '',
        photo_url: '',
        language_code: 'ru'
      },
      
      // Настройки визитки
      settings: {
        hideId: false,
        cardColor: '#2196F3',
        showDescription: false,
        description: '',
        showWebsite: false,
        website: ''
      },
      
      // Состояние уведомлений
      showCopyNotification: false
    }
  },
  
  mounted() {
    // Загружаем данные пользователя при монтировании компонента
    this.loadUserData()
  },
  
  methods: {
    /**
     * Загружает данные пользователя из Telegram WebApp API или тестовые данные
     */
    loadUserData() {
      const isDevelopment = import.meta.env.DEV
      
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const user = window.Telegram.WebApp.initDataUnsafe.user
        
        if (user) {
          this.userData = {
            id: user.id,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            username: user.username || '',
            photo_url: user.photo_url || '',
            language_code: user.language_code || 'ru'
          }
          
          // В режиме разработки загружаем соответствующие тестовые настройки
          if (isDevelopment) {
            const testProfile = getTestProfileById(user.id)
            if (testProfile) {
              this.settings = { ...this.settings, ...testProfile.settings }
              console.log('🎯 Загружены тестовые настройки для пользователя:', testProfile.settings)
            }
          }
        } else {
          this.loadFallbackData()
        }
      } else {
        this.loadFallbackData()
      }
    },
    
    /**
     * Загружает резервные тестовые данные
     */
    loadFallbackData() {
      // Для тестирования вне Telegram - используем первый тестовый профиль
      const fallbackProfile = testProfiles[0]
      
      this.userData = { ...fallbackProfile.userData }
      this.settings = { ...this.settings, ...fallbackProfile.settings }
      
      console.log('🔄 Загружены резервные тестовые данные:', fallbackProfile)
    },
    
    /**
     * Копирует текстовую версию визитки в буфер обмена
     */
    async copyCard() {
      try {
        const cardText = this.generateCardText()
        await navigator.clipboard.writeText(cardText)
        
        // Показываем уведомление
        this.showCopyNotification = true
        
        // Вибрация если доступна в Telegram
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
        }
        
      } catch (error) {
        console.error('Ошибка при копировании:', error)
      }
    },
    
    /**
     * Сохраняет визитку как PNG изображение
     */
    async saveCard() {
      if (this.$refs.businessCardRef) {
        await this.$refs.businessCardRef.saveAsPNG()
      }
    },
    
    /**
     * Отправляет данные в бот через Telegram WebApp API
     */
    sendToBot() {
      if (window.Telegram && window.Telegram.WebApp) {
        const data = {
          action: 'business_card',
          user_data: this.userData,
          settings: this.settings,
          card_text: this.generateCardText()
        }
        
        window.Telegram.WebApp.sendData(JSON.stringify(data))
      }
    },
    
    /**
     * Обновляет настройки визитки
     */
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
    },
    
    /**
     * Генерирует текстовую версию визитки
     */
    generateCardText() {
      let cardText = '🎭 Моя визитка\n\n'
      
      // Имя
      if (this.userData.first_name) {
        cardText += `👤 ${this.userData.first_name}`
        if (this.userData.last_name) {
          cardText += ` ${this.userData.last_name}`
        }
        cardText += '\n'
      }
      
      // Username
      if (this.userData.username) {
        cardText += `📱 @${this.userData.username}\n`
      }
      
      // ID (если не скрыт)
      if (!this.settings.hideId && this.userData.id) {
        cardText += `🆔 ID: ${this.userData.id}\n`
      }
      
      // Описание
      if (this.settings.showDescription && this.settings.description) {
        cardText += `📝 ${this.settings.description}\n`
      }
      
      // Веб-сайт
      if (this.settings.showWebsite && this.settings.website) {
        cardText += `🌐 ${this.settings.website}\n`
      }
      
      cardText += '\n✨ Создано в Telegram Mini App'
      
      return cardText
    }
  }
}
</script>

<style scoped>
.business-card-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 600px) {
  .business-card-container {
    padding: 0 8px;
  }
}
</style> 