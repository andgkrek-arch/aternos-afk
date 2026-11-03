const mineflayer = require('mineflayer');
const http = require('http');

const config = {
  host: 'Adidaus.aternos.me',
  port: 43947,
  username: 'Birzui',
  version: '1.21.1',
  password: 'BotPass123'
};

let bot;
let isLoggedIn = false;

// Веб-сервер для Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive\n');
});
server.listen(10000, () => {
  console.log('Веб-сервер запущен на порту 10000');
});

function createBot() {
  console.log('==============================');
  console.log('Пытаюсь подключиться к серверу...');
  console.log('Host:', config.host);
  console.log('Port:', config.port);
  console.log('Version:', config.version);
  console.log('==============================');

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    hideErrors: false,
    checkTimeoutInterval: 60000
  });

  bot.on('login', () => {
    console.log('✅ Успешно залогинился на сервер');
  });

  bot.on('spawn', () => {
    console.log('✅ Заспавнился в мире');
    isLoggedIn = false;

    setTimeout(() => {
      bot.chat(`/login ${config.password}`);
      console.log('→ Отправил /login');
    }, 3000);
  });

  bot.on('messagestr', (msg) => {
    console.log('[Чат]', msg);

    const message = msg.toLowerCase();

    if (message.includes('успешно') || message.includes('вы вошли') || message.includes('successfully')) {
      isLoggedIn = true;
      console.log('✅ Успешно авторизовался через AuthMe');
    }
  });

  bot.on('kicked', (reason) => {
    console.log('❌ Кикнули:', reason.toString());
    setTimeout(createBot, 15000);
  });

  bot.on('end', () => {
    console.log('❌ Соединение закрыто');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('❌ Ошибка:', err.message);
  });
}

createBot();
