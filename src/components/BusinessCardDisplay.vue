<template>
  <div class="business-card-display">
    <!-- Основная карточка визитки -->
    <v-card
      ref="cardElement"
      class="business-card mx-auto"
      :style="cardStyles"
      elevation="8"
      rounded="xl"
    >
      <!-- Фоновый градиент -->
      <div class="card-background" :style="backgroundStyles"></div>
      
      <!-- Содержимое карточки -->
      <v-card-text class="pa-6 position-relative">
        <!-- Аватар пользователя -->
        <div class="text-center mb-4">
          <UserAvatar 
            :photo-url="userData.photo_url"
            :first-name="userData.first_name"
            :size="120"
          />
        </div>
        
        <!-- Информация о пользователе -->
        <div class="user-info text-center">
          <!-- Имя и фамилия -->
          <h2 class="text-h4 font-weight-bold mb-2 card-text">
            {{ fullName }}
          </h2>
          
          <!-- Username -->
          <p v-if="userData.username" class="text-h6 mb-2 card-text-secondary">
            <v-icon class="mr-1" size="small">mdi-at</v-icon>
            {{ userData.username }}
          </p>
          
          <!-- ID пользователя (если не скрыт) -->
          <p v-if="!settings.hideId && userData.id" class="text-body-2 mb-3 card-text-secondary">
            <v-icon class="mr-1" size="small">mdi-identifier</v-icon>
            ID: {{ userData.id }}
          </p>
          
          <!-- Дополнительное описание -->
          <div v-if="settings.showDescription && settings.description" class="mb-3">
            <v-divider class="my-3 opacity-50"></v-divider>
            <p class="text-body-1 card-text">
              <v-icon class="mr-1" size="small">mdi-text</v-icon>
              {{ settings.description }}
            </p>
          </div>
          
          <!-- Веб-сайт -->
          <div v-if="settings.showWebsite && settings.website" class="mb-3">
            <p class="text-body-2 card-text-secondary">
              <v-icon class="mr-1" size="small">mdi-web</v-icon>
              <a :href="formatWebsiteUrl(settings.website)" target="_blank" class="website-link">
                {{ settings.website }}
              </a>
            </p>
          </div>
        </div>
        
        <!-- Декоративные элементы -->
        <div class="decorative-elements">
          <div class="decoration decoration-1"></div>
          <div class="decoration decoration-2"></div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UserAvatar from './UserAvatar.vue'
import html2canvas from 'html2canvas'

export default {
  name: 'BusinessCardDisplay',
  components: {
    UserAvatar
  },
  
  props: {
    // Данные пользователя
    userData: {
      type: Object,
      required: true
    },
    
    // Настройки визитки
    settings: {
      type: Object,
      required: true
    }
  },
  
  computed: {
    /**
     * Полное имя пользователя
     */
    fullName() {
      let name = this.userData.first_name || ''
      if (this.userData.last_name) {
        name += ` ${this.userData.last_name}`
      }
      return name || 'Пользователь Telegram'
    },
    
    /**
     * Стили для основной карточки
     */
    cardStyles() {
      return {
        '--card-color': this.settings.cardColor,
        minHeight: '400px',
        maxWidth: '350px',
        overflow: 'hidden'
      }
    },
    
    /**
     * Стили для фонового градиента
     */
    backgroundStyles() {
      const baseColor = this.settings.cardColor
      return {
        background: `linear-gradient(135deg, ${baseColor} 0%, ${this.darkenColor(baseColor, 20)} 100%)`
      }
    }
  },
  
  methods: {
    /**
     * Затемняет цвет на указанный процент
     */
    darkenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) + amt
      const G = (num >> 8 & 0x00FF) + amt
      const B = (num & 0x0000FF) + amt
      
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
    },
    
    /**
     * Форматирует URL веб-сайта
     */
    formatWebsiteUrl(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`
      }
      return url
    },
    
    /**
     * Сохраняет визитку как PNG изображение
     */
    async saveAsPNG() {
      try {
        const element = this.$refs.cardElement.$el
        
        // Настройки для html2canvas
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2, // Для лучшего качества
          logging: false,
          useCORS: true,
          allowTaint: true
        })
        
        // Создаем ссылку для скачивания
        const link = document.createElement('a')
        link.download = `business-card-${this.userData.username || this.userData.id || 'user'}.png`
        link.href = canvas.toDataURL()
        
        // Запускаем скачивание
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Вибрация при сохранении
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        
      } catch (error) {
        console.error('Ошибка при сохранении изображения:', error)
      }
    }
  }
}
</script>

<style scoped>
.business-card-display {
  width: 100%;
}

.business-card {
  position: relative;
  background: transparent !important;
}

/* Фоновый градиент */
.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

/* Текст на карточке */
.card-text {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.card-text-secondary {
  color: rgba(255, 255, 255, 0.8) !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

/* Ссылка на веб-сайт */
.website-link {
  color: rgba(255, 255, 255, 0.9) !important;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.website-link:hover {
  color: white !important;
  border-bottom-color: white;
}

/* Декоративные элементы */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.decoration-1 {
  width: 100px;
  height: 100px;
  top: -50px;
  right: -50px;
}

.decoration-2 {
  width: 60px;
  height: 60px;
  bottom: -30px;
  left: -30px;
  background: rgba(255, 255, 255, 0.05);
}

/* Анимации */
.business-card {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.business-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

/* Адаптивность */
@media (max-width: 600px) {
  .business-card {
    max-width: 100% !important;
    margin: 0 !important;
  }
}
</style> 