/**
 * Конфигурация для режима разработки
 * Позволяет настроить различные аспекты тестирования
 */

export const devConfig = {
  // Включить/выключить моки Telegram WebApp
  enableTelegramMocks: true,
  
  // Показывать ли переключатель пользователей
  showUserSwitcher: true,
  
  // Показывать ли кнопку "Закрыть" в режиме разработки
  showMockCloseButton: true,
  
  // Автоматически выбирать случайного пользователя при запуске
  randomUserOnStart: true,
  
  // ID конкретного пользователя для тестирования (если не нужен случайный)
  fixedUserId: null, // например: 123456789
  
  // Настройки логирования
  logging: {
    showTelegramEvents: true,
    showUserActions: true,
    showDataLoading: true
  },
  
  // Настройки UI для разработки
  ui: {
    showDevTools: true,
    switcherPosition: 'top-left', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    compactMode: false
  }
}

// Функции для работы с конфигурацией
export function isDevMode() {
  return import.meta.env.DEV
}

export function shouldShowDevTools() {
  return isDevMode() && devConfig.ui.showDevTools
}

export function shouldEnableMocks() {
  return isDevMode() && devConfig.enableTelegramMocks && !window.Telegram?.WebApp?.initDataUnsafe?.user
}

// Логирование для режима разработки
export function devLog(category, message, data = null) {
  if (!isDevMode()) return
  
  const logConfig = devConfig.logging
  let shouldLog = false
  
  switch (category) {
    case 'telegram':
      shouldLog = logConfig.showTelegramEvents
      break
    case 'user':
      shouldLog = logConfig.showUserActions
      break
    case 'data':
      shouldLog = logConfig.showDataLoading
      break
    default:
      shouldLog = true
  }
  
  if (shouldLog) {
    const emoji = {
      telegram: '📱',
      user: '👤',
      data: '📊',
      default: '🔧'
    }
    
    console.log(`${emoji[category] || emoji.default} [DEV ${category.toUpperCase()}]`, message, data || '')
  }
} 