/**
 * Тестовые данные для локальной разработки
 * Используются когда приложение запущено вне Telegram WebApp
 */

import { devConfig, shouldEnableMocks, shouldShowDevTools, devLog } from './devConfig.js'

// Список тестовых пользователей
export const testUsers = [
  {
    id: 123456789,
    first_name: 'Иван',
    last_name: 'Петров',
    username: 'ivan_petrov',
    photo_url: 'https://i.pravatar.cc/300?img=12',
    language_code: 'ru'
  },
  {
    id: 987654321,
    first_name: 'Анна',
    last_name: 'Смирнова',
    username: 'anna_smirnova',
    photo_url: 'https://i.pravatar.cc/300?img=25',
    language_code: 'ru'
  },
  {
    id: 456789123,
    first_name: 'Алексей',
    last_name: 'Козлов',
    username: 'alex_kozlov',
    photo_url: 'https://i.pravatar.cc/300?img=33',
    language_code: 'ru'
  },
  {
    id: 789123456,
    first_name: 'Мария',
    last_name: 'Волкова',
    username: 'maria_volkova',
    photo_url: 'https://i.pravatar.cc/300?img=44',
    language_code: 'ru'
  },
  {
    id: 321654987,
    first_name: 'John',
    last_name: 'Smith',
    username: 'john_smith',
    photo_url: 'https://i.pravatar.cc/300?img=8',
    language_code: 'en'
  }
]

// Различные настройки визиток для тестирования
export const testSettings = [
  {
    hideId: false,
    cardColor: '#2196F3',
    showDescription: true,
    description: 'Full-stack разработчик с опытом работы более 5 лет. Специализируюсь на Vue.js, Node.js и мобильной разработке.',
    showWebsite: true,
    website: 'https://github.com/ivan-petrov'
  },
  {
    hideId: true,
    cardColor: '#E91E63',
    showDescription: true,
    description: 'UI/UX дизайнер и фронтенд разработчик. Создаю красивые и функциональные интерфейсы.',
    showWebsite: true,
    website: 'https://dribbble.com/anna-smirnova'
  },
  {
    hideId: false,
    cardColor: '#4CAF50',
    showDescription: true,
    description: 'DevOps инженер и системный администратор. Автоматизирую процессы и поддерживаю инфраструктуру.',
    showWebsite: false,
    website: ''
  },
  {
    hideId: true,
    cardColor: '#FF9800',
    showDescription: true,
    description: 'Маркетолог и SMM специалист. Помогаю брендам расти в цифровом пространстве.',
    showWebsite: true,
    website: 'https://linkedin.com/in/maria-volkova'
  },
  {
    hideId: false,
    cardColor: '#9C27B0',
    showDescription: true,
    description: 'Software Engineer and Tech Lead. Passionate about clean code and scalable architectures.',
    showWebsite: true,
    website: 'https://johnsmith.dev'
  }
]

// Дополнительные тестовые данные
export const testProfiles = testUsers.map((user, index) => ({
  userData: user,
  settings: testSettings[index] || testSettings[0]
}))

// Функция для получения случайного тестового профиля
export function getRandomTestProfile() {
  const randomIndex = Math.floor(Math.random() * testProfiles.length)
  return testProfiles[randomIndex]
}

// Функция для получения тестового профиля по ID
export function getTestProfileById(userId) {
  return testProfiles.find(profile => profile.userData.id === userId) || testProfiles[0]
}

// Мок данные Telegram WebApp для разработки
export const mockTelegramWebApp = {
  ready: () => console.log('Telegram WebApp ready (mock)'),
  expand: () => console.log('Telegram WebApp expanded (mock)'),
  close: () => console.log('Telegram WebApp closed (mock)'),
  sendData: (data) => console.log('Sending data to bot (mock):', data),
  
  MainButton: {
    text: 'Закрыть',
    show: () => console.log('Main button shown (mock)'),
    hide: () => console.log('Main button hidden (mock)'),
    setText: (text) => console.log('Main button text set (mock):', text),
    onClick: (callback) => {
      console.log('Main button click handler set (mock)')
      // Для тестирования можно добавить кнопку на страницу
      if (typeof window !== 'undefined') {
        const button = document.createElement('button')
        button.textContent = 'Закрыть (тест)'
        button.style.position = 'fixed'
        button.style.bottom = '20px'
        button.style.right = '20px'
        button.style.zIndex = '9999'
        button.style.padding = '10px 20px'
        button.style.backgroundColor = '#2196F3'
        button.style.color = 'white'
        button.style.border = 'none'
        button.style.borderRadius = '5px'
        button.style.cursor = 'pointer'
        button.onclick = callback
        document.body.appendChild(button)
      }
    }
  },
  
  HapticFeedback: {
    impactOccurred: (style) => console.log('Haptic feedback (mock):', style)
  },
  
  themeParams: {
    bg_color: '#17212b',
    text_color: '#ffffff',
    hint_color: '#708499',
    button_color: '#5288c1',
    button_text_color: '#ffffff'
  },
  
  initDataUnsafe: {
    user: null // Будет установлено динамически
  }
}

// Функция для инициализации моков в режиме разработки
export function initializeMockTelegram() {
  if (!shouldEnableMocks()) return
  
  // Выбираем пользователя согласно конфигурации
  let testProfile
  
  if (devConfig.fixedUserId) {
    testProfile = getTestProfileById(devConfig.fixedUserId)
    devLog('data', 'Использован фиксированный тестовый пользователь:', testProfile.userData)
  } else if (devConfig.randomUserOnStart) {
    testProfile = getRandomTestProfile()
    devLog('data', 'Выбран случайный тестовый пользователь:', testProfile.userData)
  } else {
    testProfile = testProfiles[0]
    devLog('data', 'Использован первый тестовый пользователь:', testProfile.userData)
  }
  
  mockTelegramWebApp.initDataUnsafe.user = testProfile.userData
  
  window.Telegram = {
    WebApp: mockTelegramWebApp
  }
  
  devLog('telegram', 'Telegram WebApp mock инициализирован')
  devLog('user', 'Активный тестовый пользователь:', testProfile.userData)
  devLog('data', 'Настройки визитки:', testProfile.settings)
  
  // Добавляем элементы UI для разработки
  if (shouldShowDevTools()) {
    if (devConfig.showUserSwitcher) {
      addUserSwitcher()
    }
    
    if (devConfig.showMockCloseButton) {
      addMockCloseButton()
    }
    
    addDevInfoPanel()
  }
}

// Функция для добавления переключателя пользователей в режиме разработки
function addUserSwitcher() {
  if (typeof window === 'undefined') return
  
  const position = getPositionStyle(devConfig.ui.switcherPosition)
  
  const switcher = document.createElement('div')
  switcher.id = 'dev-user-switcher'
  switcher.style.position = 'fixed'
  switcher.style.top = position.top
  switcher.style.left = position.left
  switcher.style.right = position.right
  switcher.style.bottom = position.bottom
  switcher.style.zIndex = '9999'
  switcher.style.backgroundColor = 'rgba(0,0,0,0.9)'
  switcher.style.color = 'white'
  switcher.style.padding = '10px'
  switcher.style.borderRadius = '8px'
  switcher.style.fontSize = '12px'
  switcher.style.fontFamily = 'monospace'
  switcher.style.minWidth = '200px'
  switcher.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
  
  const label = document.createElement('div')
  label.innerHTML = '🧪 <strong>DEV MODE</strong>'
  label.style.marginBottom = '8px'
  label.style.fontSize = '11px'
  label.style.opacity = '0.8'
  
  const select = document.createElement('select')
  select.style.width = '100%'
  select.style.padding = '6px'
  select.style.backgroundColor = '#333'
  select.style.color = 'white'
  select.style.border = '1px solid #555'
  select.style.borderRadius = '4px'
  select.style.fontSize = '11px'
  
  testUsers.forEach((user, index) => {
    const option = document.createElement('option')
    option.value = index
    option.textContent = `${user.first_name} ${user.last_name} (@${user.username})`
    if (mockTelegramWebApp.initDataUnsafe.user?.id === user.id) {
      option.selected = true
    }
    select.appendChild(option)
  })
  
  select.addEventListener('change', (e) => {
    const selectedIndex = parseInt(e.target.value)
    const newProfile = testProfiles[selectedIndex]
    
    mockTelegramWebApp.initDataUnsafe.user = newProfile.userData
    
    devLog('user', 'Переключение на пользователя:', newProfile.userData)
    
    // Перезагружаем страницу для применения изменений
    window.location.reload()
  })
  
  switcher.appendChild(label)
  switcher.appendChild(select)
  document.body.appendChild(switcher)
}

// Функция для добавления кнопки закрытия
function addMockCloseButton() {
  if (typeof window === 'undefined') return
  
  const button = document.createElement('button')
  button.textContent = '✕ Закрыть'
  button.style.position = 'fixed'
  button.style.bottom = '20px'
  button.style.right = '20px'
  button.style.zIndex = '9998'
  button.style.padding = '12px 20px'
  button.style.backgroundColor = '#5288c1'
  button.style.color = 'white'
  button.style.border = 'none'
  button.style.borderRadius = '8px'
  button.style.cursor = 'pointer'
  button.style.fontSize = '14px'
  button.style.fontWeight = 'bold'
  button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
  button.style.transition = 'all 0.2s ease'
  
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#4a7ba7'
    button.style.transform = 'translateY(-2px)'
  })
  
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#5288c1'
    button.style.transform = 'translateY(0)'
  })
  
  button.onclick = () => {
    devLog('telegram', 'Mock close button clicked')
    alert('В реальном Telegram приложение закроется')
  }
  
  document.body.appendChild(button)
}

// Функция для добавления информационной панели
function addDevInfoPanel() {
  if (typeof window === 'undefined') return
  
  const panel = document.createElement('div')
  panel.id = 'dev-info-panel'
  panel.style.position = 'fixed'
  panel.style.bottom = '20px'
  panel.style.left = '20px'
  panel.style.zIndex = '9997'
  panel.style.backgroundColor = 'rgba(0,0,0,0.8)'
  panel.style.color = 'white'
  panel.style.padding = '8px 12px'
  panel.style.borderRadius = '6px'
  panel.style.fontSize = '10px'
  panel.style.fontFamily = 'monospace'
  panel.style.maxWidth = '200px'
  panel.style.opacity = '0.7'
  
  const currentUser = mockTelegramWebApp.initDataUnsafe.user
  panel.innerHTML = `
    <div>👤 ${currentUser?.first_name} ${currentUser?.last_name}</div>
    <div>🆔 ID: ${currentUser?.id}</div>
    <div>📱 @${currentUser?.username || 'нет'}</div>
    <div style="margin-top: 4px; opacity: 0.6;">npm run dev</div>
  `
  
  document.body.appendChild(panel)
}

// Утилита для получения стилей позиционирования
function getPositionStyle(position) {
  const positions = {
    'top-left': { top: '20px', left: '20px', right: 'auto', bottom: 'auto' },
    'top-right': { top: '20px', right: '20px', left: 'auto', bottom: 'auto' },
    'bottom-left': { bottom: '80px', left: '20px', top: 'auto', right: 'auto' },
    'bottom-right': { bottom: '80px', right: '20px', top: 'auto', left: 'auto' }
  }
  
  return positions[position] || positions['top-left']
} 