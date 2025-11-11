const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/order', async (req, res) => {
  const { name, phone, address, paymentMethod, product, price } = req.body || {};

  if (!name || !phone || !address || !paymentMethod || !product) {
    return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram bot token/chat id не настроены на сервере' });
  }

  const text = `Новый заказ:\n\n` +
    `Товар: ${product} (${price ? price + ' ₸' : 'цена не указана'})\n` +
    `Имя: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Адрес: ${address}\n` +
    `Оплата: ${paymentMethod}`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Telegram error', err && err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Не удалось отправить сообщение в Telegram' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
