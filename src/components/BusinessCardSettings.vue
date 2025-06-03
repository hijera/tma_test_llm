<template>
  <div class="business-card-settings">
    <!-- Заголовок настроек -->
    <v-card class="settings-card" variant="tonal">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-cog</v-icon>
        Настройки визитки
        
        <v-spacer></v-spacer>
        
        <!-- Кнопка сворачивания/разворачивания -->
        <v-btn
          @click="expanded = !expanded"
          :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="text"
          size="small"
        ></v-btn>
      </v-card-title>
      
      <!-- Содержимое настроек -->
      <v-expand-transition>
        <div v-show="expanded">
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <!-- Основные настройки -->
            <div class="settings-section mb-4">
              <h4 class="settings-section-title mb-3">
                <v-icon class="mr-1" size="small">mdi-eye</v-icon>
                Отображение
              </h4>
              
              <!-- Скрыть ID -->
              <v-switch
                v-model="localSettings.hideId"
                @update:model-value="updateSettings"
                label="Скрыть ID пользователя"
                color="primary"
                density="comfortable"
                hide-details
              ></v-switch>
            </div>
            
            <!-- Цветовая схема -->
            <div class="settings-section mb-4">
              <h4 class="settings-section-title mb-3">
                <v-icon class="mr-1" size="small">mdi-palette</v-icon>
                Цветовая схема
              </h4>
              
              <!-- Выбор цвета -->
              <div class="color-picker-section">
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-slider
                      v-model="colorHue"
                      @update:model-value="updateCardColor"
                      :min="0"
                      :max="360"
                      step="10"
                      label="Оттенок"
                      thumb-label
                      color="primary"
                    >
                      <template v-slot:thumb-label="{ modelValue }">
                        {{ modelValue }}°
                      </template>
                    </v-slider>
                  </v-col>
                  
                  <v-col cols="12" sm="4">
                    <div class="color-preview" :style="{ backgroundColor: localSettings.cardColor }"></div>
                  </v-col>
                </v-row>
                
                <!-- Предустановленные цвета -->
                <div class="preset-colors mt-3">
                  <v-chip
                    v-for="(color, index) in presetColors"
                    :key="index"
                    @click="selectPresetColor(color)"
                    :class="{ 'selected-color': localSettings.cardColor === color.value }"
                    class="preset-color-chip mr-2 mb-2"
                    :style="{ backgroundColor: color.value }"
                    size="small"
                  >
                    {{ color.name }}
                  </v-chip>
                </div>
              </div>
            </div>
            
            <!-- Дополнительная информация -->
            <div class="settings-section mb-4">
              <h4 class="settings-section-title mb-3">
                <v-icon class="mr-1" size="small">mdi-information</v-icon>
                Дополнительная информация
              </h4>
              
              <!-- Описание -->
              <v-switch
                v-model="localSettings.showDescription"
                @update:model-value="updateSettings"
                label="Показать описание"
                color="primary"
                density="comfortable"
                hide-details
                class="mb-3"
              ></v-switch>
              
              <v-expand-transition>
                <div v-show="localSettings.showDescription">
                  <v-textarea
                    v-model="localSettings.description"
                    @update:model-value="updateSettings"
                    label="Ваше описание"
                    placeholder="Например: Frontend разработчик, любитель кофе ☕"
                    rows="2"
                    max-rows="3"
                    counter="100"
                    maxlength="100"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  ></v-textarea>
                </div>
              </v-expand-transition>
              
              <!-- Веб-сайт -->
              <v-switch
                v-model="localSettings.showWebsite"
                @update:model-value="updateSettings"
                label="Показать веб-сайт"
                color="primary"
                density="comfortable"
                hide-details
                class="mb-3"
              ></v-switch>
              
              <v-expand-transition>
                <div v-show="localSettings.showWebsite">
                  <v-text-field
                    v-model="localSettings.website"
                    @update:model-value="updateSettings"
                    label="Ваш веб-сайт"
                    placeholder="example.com"
                    prepend-inner-icon="mdi-web"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  ></v-text-field>
                </div>
              </v-expand-transition>
            </div>
            
            <!-- Кнопки действий с настройками -->
            <div class="settings-actions">
              <v-row>
                <v-col cols="6">
                  <v-btn
                    @click="resetSettings"
                    variant="outlined"
                    color="warning"
                    block
                    prepend-icon="mdi-refresh"
                  >
                    Сбросить
                  </v-btn>
                </v-col>
                
                <v-col cols="6">
                  <v-btn
                    @click="saveAsTemplate"
                    variant="tonal"
                    color="success"
                    block
                    prepend-icon="mdi-content-save"
                  >
                    Сохранить шаблон
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BusinessCardSettings',
  
  props: {
    // Настройки визитки
    settings: {
      type: Object,
      required: true
    }
  },
  
  emits: ['update-settings'],
  
  data() {
    return {
      // Локальная копия настроек
      localSettings: { ...this.settings },
      
      // Состояние UI
      expanded: false,
      
      // Значение оттенка для слайдера
      colorHue: 210,
      
      // Предустановленные цвета
      presetColors: [
        { name: 'Синий', value: '#2196F3' },
        { name: 'Зеленый', value: '#4CAF50' },
        { name: 'Фиолетовый', value: '#9C27B0' },
        { name: 'Красный', value: '#F44336' },
        { name: 'Оранжевый', value: '#FF9800' },
        { name: 'Бирюзовый', value: '#009688' },
        { name: 'Розовый', value: '#E91E63' },
        { name: 'Индиго', value: '#3F51B5' }
      ]
    }
  },
  
  watch: {
    // Синхронизируем настройки при изменении пропсов
    settings: {
      handler(newSettings) {
        this.localSettings = { ...newSettings }
        this.updateColorHue()
      },
      deep: true
    }
  },
  
  mounted() {
    // Вычисляем начальный оттенок
    this.updateColorHue()
    
    // Загружаем сохраненные настройки
    this.loadSavedSettings()
  },
  
  methods: {
    /**
     * Обновляет настройки в родительском компоненте
     */
    updateSettings() {
      this.$emit('update-settings', { ...this.localSettings })
      
      // Сохраняем в локальное хранилище
      this.saveSettings()
    },
    
    /**
     * Обновляет цвет карточки на основе оттенка
     */
    updateCardColor() {
      const hsl = `hsl(${this.colorHue}, 70%, 50%)`
      this.localSettings.cardColor = this.hslToHex(this.colorHue, 70, 50)
      this.updateSettings()
    },
    
    /**
     * Выбирает предустановленный цвет
     */
    selectPresetColor(color) {
      this.localSettings.cardColor = color.value
      this.updateColorHue()
      this.updateSettings()
    },
    
    /**
     * Обновляет значение оттенка на основе текущего цвета
     */
    updateColorHue() {
      const rgb = this.hexToRgb(this.localSettings.cardColor)
      if (rgb) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)
        this.colorHue = Math.round(hsl.h * 360)
      }
    },
    
    /**
     * Сбрасывает настройки к значениям по умолчанию
     */
    resetSettings() {
      this.localSettings = {
        hideId: false,
        cardColor: '#2196F3',
        showDescription: false,
        description: '',
        showWebsite: false,
        website: ''
      }
      
      this.colorHue = 210
      this.updateSettings()
    },
    
    /**
     * Сохраняет текущие настройки как шаблон
     */
    saveAsTemplate() {
      try {
        localStorage.setItem('business_card_template', JSON.stringify(this.localSettings))
        
        // Показываем уведомление об успешном сохранении
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        
        console.log('Шаблон сохранен успешно!')
        
      } catch (error) {
        console.error('Ошибка сохранения шаблона:', error)
      }
    },
    
    /**
     * Загружает сохраненные настройки
     */
    loadSavedSettings() {
      try {
        const saved = localStorage.getItem('business_card_settings')
        if (saved) {
          const savedSettings = JSON.parse(saved)
          this.localSettings = { ...this.localSettings, ...savedSettings }
          this.updateColorHue()
          this.updateSettings()
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
      }
    },
    
    /**
     * Сохраняет настройки в локальное хранилище
     */
    saveSettings() {
      try {
        localStorage.setItem('business_card_settings', JSON.stringify(this.localSettings))
      } catch (error) {
        console.error('Ошибка сохранения настроек:', error)
      }
    },
    
    /**
     * Конвертирует HSL в HEX
     */
    hslToHex(h, s, l) {
      h /= 360
      s /= 100
      l /= 100
      
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      let r, g, b
      
      if (s === 0) {
        r = g = b = l
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }
      
      const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    },
    
    /**
     * Конвертирует HEX в RGB
     */
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16), 
        b: parseInt(result[3], 16)
      } : null
    },
    
    /**
     * Конвертирует RGB в HSL
     */
    rgbToHsl(r, g, b) {
      r /= 255
      g /= 255
      b /= 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        
        h /= 6
      }
      
      return { h, s, l }
    }
  }
}
</script>

<style scoped>
.business-card-settings {
  width: 100%;
}

/* Стили карточки настроек */
.settings-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Секции настроек */
.settings-section {
  border-left: 3px solid var(--tg-button-color, #5288c1);
  padding-left: 16px;
}

.settings-section-title {
  color: var(--tg-text-color, #ffffff);
  font-weight: 500;
  display: flex;
  align-items: center;
}

/* Выбор цвета */
.color-picker-section {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.color-preview {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Предустановленные цвета */
.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-color-chip {
  color: white !important;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
}

.preset-color-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.selected-color {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white;
}

/* Действия с настройками */
.settings-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Адаптивные стили */
@media (max-width: 600px) {
  .settings-section {
    padding-left: 12px;
    border-left-width: 2px;
  }
  
  .color-picker-section {
    padding: 12px;
  }
  
  .preset-color-chip {
    font-size: 12px !important;
  }
}

/* Анимации переходов */
.v-enter-active, .v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 