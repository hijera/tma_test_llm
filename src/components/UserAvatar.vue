<template>
  <div class="user-avatar">
    <!-- Аватар с фото или инициалами -->
    <v-avatar 
      :size="size"
      class="avatar-container"
      :class="{ 'avatar-with-border': hasPhoto }"
    >
      <!-- Фото пользователя -->
      <v-img
        v-if="hasPhoto"
        :src="photoUrl"
        :alt="`Аватар ${firstName}`"
        class="avatar-image"
        cover
        @error="onImageError"
      />
      
      <!-- Заглушка с инициалами -->
      <div
        v-else
        class="avatar-placeholder"
        :style="placeholderStyles"
      >
        <span class="avatar-initials" :style="{ fontSize: initialsSize }">
          {{ initials }}
        </span>
      </div>
    </v-avatar>
    
    <!-- Индикатор онлайн (декоративный) -->
    <div 
      v-if="showOnlineIndicator"
      class="online-indicator"
      :style="{ 
        width: indicatorSize, 
        height: indicatorSize,
        bottom: indicatorPosition,
        right: indicatorPosition
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  
  props: {
    // URL фото пользователя
    photoUrl: {
      type: String,
      default: ''
    },
    
    // Имя пользователя для инициалов
    firstName: {
      type: String,
      default: ''
    },
    
    // Фамилия пользователя для инициалов
    lastName: {
      type: String,
      default: ''
    },
    
    // Размер аватара
    size: {
      type: [Number, String],
      default: 80
    },
    
    // Показывать ли индикатор онлайн
    showOnlineIndicator: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      // Флаг ошибки загрузки изображения
      imageError: false
    }
  },
  
  computed: {
    /**
     * Есть ли фото у пользователя
     */
    hasPhoto() {
      return this.photoUrl && !this.imageError
    },
    
    /**
     * Инициалы пользователя
     */
    initials() {
      let initials = ''
      
      if (this.firstName) {
        initials += this.firstName.charAt(0).toUpperCase()
      }
      
      if (this.lastName) {
        initials += this.lastName.charAt(0).toUpperCase()
      }
      
      // Если нет имени, используем иконку пользователя
      return initials || '👤'
    },
    
    /**
     * Размер шрифта для инициалов (зависит от размера аватара)
     */
    initialsSize() {
      const baseSize = parseInt(this.size)
      return `${Math.max(baseSize * 0.4, 16)}px`
    },
    
    /**
     * Стили для заглушки аватара
     */
    placeholderStyles() {
      return {
        background: this.generateGradient(),
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    
    /**
     * Размер индикатора онлайн
     */
    indicatorSize() {
      const baseSize = parseInt(this.size)
      return `${Math.max(baseSize * 0.25, 12)}px`
    },
    
    /**
     * Позиция индикатора онлайн
     */
    indicatorPosition() {
      const baseSize = parseInt(this.size)
      return `${Math.max(baseSize * 0.05, 2)}px`
    }
  },
  
  methods: {
    /**
     * Обработчик ошибки загрузки изображения
     */
    onImageError() {
      this.imageError = true
    },
    
    /**
     * Генерирует градиент для заглушки на основе имени
     */
    generateGradient() {
      const colors = [
        ['#FF6B6B', '#FF8E53'],
        ['#4ECDC4', '#44A08D'],
        ['#A8E6CF', '#7FCDCD'],
        ['#FFD93D', '#FF6B6B'],
        ['#74B9FF', '#0984E3'],
        ['#FD79A8', '#E84393'],
        ['#FDCB6E', '#E17055'],
        ['#6C5CE7', '#A29BFE']
      ]
      
      // Выбираем градиент на основе первой буквы имени
      let index = 0
      if (this.firstName && this.firstName.trim()) {
        const firstChar = this.firstName.trim().charAt(0).toUpperCase()
        index = firstChar.charCodeAt(0) % colors.length
      } else if (this.lastName && this.lastName.trim()) {
        // Если нет имени, используем фамилию
        const firstChar = this.lastName.trim().charAt(0).toUpperCase()
        index = firstChar.charCodeAt(0) % colors.length
      } else {
        // Если нет ни имени, ни фамилии, используем случайный индекс
        index = Math.floor(Math.random() * colors.length)
      }
      
      const [color1, color2] = colors[index]
      
      return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
    }
  }
}
</script>

<style scoped>
.user-avatar {
  position: relative;
  display: inline-block;
}

/* Контейнер аватара */
.avatar-container {
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.avatar-with-border {
  border-color: rgba(255, 255, 255, 0.5);
}

/* Изображение аватара */
.avatar-image {
  transition: all 0.3s ease;
}

/* Заглушка аватара */
.avatar-placeholder {
  border-radius: 50%;
}

.avatar-initials {
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Индикатор онлайн */
.online-indicator {
  position: absolute;
  background: #4CAF50;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Анимации при наведении */
.avatar-container:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.8);
}

.avatar-container:hover .avatar-image {
  transform: scale(1.1);
}

/* Пульсация для индикатора онлайн */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.online-indicator {
  animation: pulse 2s infinite;
}
</style> 