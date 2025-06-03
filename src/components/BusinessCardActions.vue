<template>
  <div class="business-card-actions">
    <!-- Основные действия -->
    <v-row class="mb-3">
      <v-col cols="12" sm="6">
        <!-- Кнопка копирования -->
        <v-btn
          @click="$emit('copy-card')"
          class="telegram-button action-button"
          block
          size="large"
          :loading="copying"
          prepend-icon="mdi-content-copy"
        >
          Скопировать визитку
        </v-btn>
      </v-col>
      
      <v-col cols="12" sm="6">
        <!-- Кнопка сохранения -->
        <v-btn
          @click="handleSaveCard"
          class="action-button"
          color="primary"
          variant="outlined"
          block
          size="large"
          :loading="saving"
          prepend-icon="mdi-download"
        >
          Сохранить как PNG
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Дополнительные действия -->
    <v-row>
      <v-col cols="12" sm="6">
        <!-- Кнопка отправки в бот -->
        <v-btn
          v-if="showBotButton"
          @click="$emit('send-to-bot')"
          class="action-button"
          color="secondary"
          variant="tonal"
          block
          prepend-icon="mdi-robot"
        >
          Отправить в бот
        </v-btn>
      </v-col>
      
      <v-col cols="12" sm="6">
        <!-- Кнопка поделиться -->
        <v-btn
          @click="shareCard"
          class="action-button"
          color="success"
          variant="tonal"
          block
          prepend-icon="mdi-share"
          :disabled="!canShare"
        >
          Поделиться
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Статистика взаимодействий -->
    <div v-if="showStats" class="stats-section mt-4">
      <v-card class="stats-card" variant="tonal">
        <v-card-text class="pa-3">
          <v-row align="center" no-gutters>
            <v-col cols="4" class="text-center">
              <div class="stat-item">
                <v-icon class="stat-icon" color="primary">mdi-content-copy</v-icon>
                <div class="stat-number">{{ stats.copies }}</div>
                <div class="stat-label">Копий</div>
              </div>
            </v-col>
            
            <v-col cols="4" class="text-center">
              <div class="stat-item">
                <v-icon class="stat-icon" color="success">mdi-download</v-icon>
                <div class="stat-number">{{ stats.downloads }}</div>
                <div class="stat-label">Загрузок</div>
              </div>
            </v-col>
            
            <v-col cols="4" class="text-center">
              <div class="stat-item">
                <v-icon class="stat-icon" color="warning">mdi-share</v-icon>
                <div class="stat-number">{{ stats.shares }}</div>
                <div class="stat-label">Репостов</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCardActions',
  
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
  
  emits: [
    'copy-card',
    'save-card', 
    'send-to-bot',
    'update-settings'
  ],
  
  data() {
    return {
      // Состояние загрузки
      copying: false,
      saving: false,
      
      // Статистика использования
      stats: {
        copies: 0,
        downloads: 0,
        shares: 0
      }
    }
  },
  
  computed: {
    /**
     * Доступна ли кнопка отправки в бот
     */
    showBotButton() {
      return window.Telegram && 
             window.Telegram.WebApp && 
             window.Telegram.WebApp.sendData
    },
    
    /**
     * Можно ли использовать Web Share API
     */
    canShare() {
      return navigator.share !== undefined
    },
    
    /**
     * Показывать ли статистику
     */
    showStats() {
      return this.stats.copies > 0 || this.stats.downloads > 0 || this.stats.shares > 0
    }
  },
  
  mounted() {
    // Загружаем статистику из локального хранилища
    this.loadStats()
  },
  
  methods: {
    /**
     * Обработчик сохранения визитки
     */
    async handleSaveCard() {
      this.saving = true
      
      try {
        await this.$emit('save-card')
        
        // Обновляем статистику
        this.stats.downloads++
        this.saveStats()
        
        // Показываем уведомление
        this.showNotification('Визитка сохранена успешно!', 'success')
        
      } catch (error) {
        console.error('Ошибка при сохранении:', error)
        this.showNotification('Ошибка при сохранении визитки', 'error')
      } finally {
        this.saving = false
      }
    },
    
    /**
     * Поделиться визиткой через Web Share API
     */
    async shareCard() {
      if (!this.canShare) return
      
      try {
        const cardText = this.generateShareText()
        
        await navigator.share({
          title: 'Моя визитка в Telegram',
          text: cardText,
          url: window.location.href
        })
        
        // Обновляем статистику
        this.stats.shares++
        this.saveStats()
        
      } catch (error) {
        // Пользователь отменил или произошла ошибка
        console.log('Поделиться отменено:', error)
      }
    },
    
    /**
     * Генерирует текст для sharing
     */
    generateShareText() {
      let text = '🎭 Моя визитка в Telegram\n\n'
      
      if (this.userData.first_name) {
        text += `👤 ${this.userData.first_name}`
        if (this.userData.last_name) {
          text += ` ${this.userData.last_name}`
        }
        text += '\n'
      }
      
      if (this.userData.username) {
        text += `📱 @${this.userData.username}\n`
      }
      
      text += '\n✨ Создано в Telegram Mini App'
      
      return text
    },
    
    /**
     * Показывает уведомление
     */
    showNotification(message, type = 'info') {
      // В реальном приложении здесь может быть toast-уведомление
      console.log(`${type.toUpperCase()}: ${message}`)
    },
    
    /**
     * Загружает статистику из локального хранилища
     */
    loadStats() {
      try {
        const saved = localStorage.getItem('business_card_stats')
        if (saved) {
          this.stats = { ...this.stats, ...JSON.parse(saved) }
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error)
      }
    },
    
    /**
     * Сохраняет статистику в локальное хранилище
     */
    saveStats() {
      try {
        localStorage.setItem('business_card_stats', JSON.stringify(this.stats))
      } catch (error) {
        console.error('Ошибка сохранения статистики:', error)
      }
    }
  },
  
  watch: {
    // Отслеживаем события копирования из родительского компонента
    '$parent.showCopyNotification'(newVal) {
      if (newVal) {
        this.stats.copies++
        this.saveStats()
      }
    }
  }
}
</script>

<style scoped>
.business-card-actions {
  width: 100%;
}

/* Стили кнопок */
.action-button {
  height: 48px !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

.action-button .v-btn__content {
  gap: 8px;
}

/* Анимации кнопок */
.action-button {
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-button:active {
  transform: translateY(0);
}

/* Стили статистики */
.stats-section {
  margin-top: 16px;
}

.stats-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  padding: 8px 0;
}

.stat-icon {
  font-size: 24px !important;
  margin-bottom: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: var(--tg-text-color, #ffffff);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--tg-hint-color, #708499);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .action-button {
    margin-bottom: 8px;
  }
  
  .stat-item {
    padding: 4px 0;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .stat-label {
    font-size: 10px;
  }
}

/* Пульсация при загрузке */
.v-btn--loading {
  pointer-events: none;
}

.v-btn--loading .v-btn__content {
  opacity: 0.6;
}
</style> 