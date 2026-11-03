const mineflayer = require('mineflayer');
const http = require('http');

// === Настройки ===
const config = {
  host: 'Adidaus.aternos.me',
  port: 43947,
  username: 'Birzui',          // твой ник бота
  version: '1.21.1',
  password: 'BotPass123'       // пароль от AuthMe
};

let bot;
let isLoggedIn = false;

// Создаём простое веб-сервер (нужно для Render)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running\n');
});
server.listen(10000);

// Функция создания бота
function createBot() {
  console.log('Запускаю бота...');

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    hideErrors: true
  });

  bot.on('login', () => {
    console.log('Подключился к серверу');
    isLoggedIn = false;
  });

  bot.on('spawn', () => {
    console.log('Заспавнился');

    setTimeout(() => {
      if (!isLoggedIn) {
        bot.chat(`/login ${config.password}`);
        console.log('Отправил /login');
      }
    }, 2500);

   // Лёгкий анти-АФК (почти не лагает)
setInterval(() => {
  if (!bot || !isLoggedIn) return;
  try {
    // Только слегка поворачивает голову раз в 45 секунд
    bot.look(bot.entity.yaw + 0.3, 0);
  } catch (e) {}
}, 45000);
  });

  bot.on('messagestr', (msg) => {
    const message = msg.toLowerCase();
    console.log('[Сервер]:', msg);

    if (!isLoggedIn && (message.includes('login') || message.includes('войдите'))) {
      bot.chat(`/login ${config.password}`);
    }

    if (!isLoggedIn && (message.includes('register') || message.includes('зарегистрируйтесь'))) {
      bot.chat(`/register ${config.password} ${config.password}`);
    }

    if (message.includes('успешно') || message.includes('successfully') || message.includes('вы вошли')) {
      isLoggedIn = true;
      console.log('Успешно авторизовался!');
    }
  });

  bot.on('kicked', (reason) => {
    console.log('Кикнули:', reason.toString());
    reconnect();
  });

  bot.on('end', () => {
    console.log('Соединение разорвано');
    reconnect();
  });

  bot.on('error', (err) => {
    if (err.message.includes('PartialReadError')) return; // игнорируем
    console.log('Ошибка:', err.message);
  });
}

// Переподключение
function reconnect() {
  isLoggedIn = false;
  console.log('Перезапуск через 10 секунд...');
  setTimeout(createBot, 10000);
}

// Запуск
createBot();
