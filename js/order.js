document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product') || '';
  const price = params.get('price') || '';

  document.getElementById('product-name').textContent = product || '—';
  document.getElementById('product-price').textContent = price ? price + ' ₸' : '';
  document.getElementById('product').value = product;
  document.getElementById('price').value = price;

  const form = document.getElementById('order-form');
  const statusEl = document.getElementById('status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = form.payment.value;

    if (!name || !phone || !address) {
      statusEl.textContent = 'Пожалуйста, заполните все поля.';
      return;
    }

    const payload = { name, phone, address, paymentMethod, product, price };

    try {
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Отправка...';

      const resp = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (resp.ok && data.ok) {
        statusEl.textContent = 'Заказ успешно отправлен! Мы свяжемся с вами.';
        form.reset();
      } else {
        statusEl.textContent = data.error || 'Ошибка на сервере. Попробуйте позже.';
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Ошибка сети. Попробуйте позже.';
    } finally {
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = false;
      btn.textContent = 'Отправить заказ';
    }
  });
});
