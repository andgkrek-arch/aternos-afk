const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'Adidaus.aternos.me',
  port: 43947,
  username: 'Birzui',
  version: '1.21.1'
});

// Более нормальный пароль (AuthMe часто не принимает слишком простые)
const password = 'BotPass123';

let isLoggedIn = false; // чтобы не спамить

bot.on('login', () => {
  console.log('Подключился к серверу');
});

bot.on('spawn', () => {
  console.log('Заспавнился в мире');

  // Пробуем войти через 3 секунды
  setTimeout(() => {
    if (!isLoggedIn) {
      bot.chat(`/login ${password}`);
      console.log('Пробую /login');
    }
  }, 3000);

  // Анти-АФК
  setInterval(() => {
    if (!isLoggedIn) return;

    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 400);

    const yaw = Math.random() * Math.PI * 2;
    bot.look(yaw, 0);
  }, 25000);
});

// Слушаем сообщения от сервера
bot.on('messagestr', (msg) => {
  const message = msg.toLowerCase();
  console.log('[Сервер]:', msg); // чтобы видеть, что пишет сервер

  // Если просят зарегистрироваться
  if (!isLoggedIn && (message.includes('register') || message.includes('зарегистрируйтесь') || message.includes('/reg'))) {
    bot.chat(`/register ${password} ${password}`);
    console.log('Отправил /register');
  }

  // Если просят войти
  if (!isLoggedIn && (message.includes('login') || message.includes('войдите') || message.includes('/login'))) {
    bot.chat(`/login ${password}`);
    console.log('Отправил /login');
  }

  // Если успешно вошли
  if (message.includes('успешно') || message.includes('successfully') || message.includes('logged in') || message.includes('вы вошли')) {
    isLoggedIn = true;
    console.log('Успешно авторизовался!');
  }
});

bot.on('kicked', (reason) => {
  console.log('Кикнули:', reason.toString());
  setTimeout(() => process.exit(1), 5000);
});

bot.on('error', (err) => {
  console.log('Ошибка:', err.message);
});

bot.on('end', () => {
  console.log('Отключился...');
  setTimeout(() => process.exit(1), 5000);
});