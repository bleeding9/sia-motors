// Контент, общий для всех вариантов. Машины — из постов t.me/siamotorss (цены под ключ до Москвы на дату поста).
window.SIA = {
  // Приём заявок с формы: бот на Amvera пересылает их в группу менеджеров.
  leadEndpoint: 'https://tg-bot-sia-motors-jvan555.msk1.amvera.tech/lead',
  cars: [
    { name: 'Changan Q07', year: '2025', km: '20 000 км', spec: 'Гибрид, 224 л.с.', price: '3 150 000 ₽', img: 'img/cars/3940_0.jpg', post: 'https://t.me/siamotorss/3940' },
    { name: 'Geely Galaxy M7', year: '2026', km: 'Новый', spec: 'Гибрид, 238 л.с.', price: '3 240 000 ₽', img: 'img/cars/3932_0.jpg', post: 'https://t.me/siamotorss/3932' },
    { name: 'Haval Raptor', year: '2026', km: '9 000 км', spec: '1.5 л, 154 л.с., полный привод', price: '3 320 000 ₽', img: 'img/cars/3817_2.jpg', post: 'https://t.me/siamotorss/3817' },
    { name: 'Geely XinYuan', year: '2025', km: '3 800 км', spec: 'Электро, 116 л.с., запас хода 410 км', price: '1 850 000 ₽', img: 'img/cars/3835_0.jpg', post: 'https://t.me/siamotorss/3835' },
    { name: 'Jetta VS7', year: '2022', km: '21 000 км', spec: '1.4 л, 150 л.с.', price: '1 950 000 ₽', img: 'img/cars/3850_0.jpg', post: 'https://t.me/siamotorss/3850' },
    { name: 'Toyota Camry', year: '2025', km: '10 000 км', spec: '2.0 л, 173 л.с.', price: '3 380 000 ₽', img: 'img/cars/3915_0.jpg', post: 'https://t.me/siamotorss/3915' },
    { name: 'Audi Q3', year: '2023', km: '19 000 км', spec: '1.4 л, 150 л.с.', price: '3 100 000 ₽', img: 'img/cars/3813_0.jpg', post: 'https://t.me/siamotorss/3813' },
    { name: 'Audi A3 Sportback', year: '2022', km: '19 000 км', spec: '1.4 л, 150 л.с.', price: '2 300 000 ₽', img: 'img/cars/3855_0.jpg', post: 'https://t.me/siamotorss/3855' },
    // Характеристики — из открытых обзоров (5koleso, rg.ru, avtomir, yiche): приблизительные, пробег не выдумываем.
    { name: 'Skynomad N70', year: '2026', km: '', spec: 'Гибрид EREV, 286–422 л.с.', price: '7 300 000 ₽', img: 'img/cars/skynomad-n70.jpg', post: 'https://t.me/siamotorss' },
    { name: 'Lynk & Co 900', year: '2026', km: '', spec: 'Гибрид 2.0T, до 734 л.с.', price: '6 800 000 ₽', img: 'img/cars/lynk-co-900.jpg', post: 'https://t.me/siamotorss' },
    { name: 'Volkswagen Teramont Pro', year: '2026', km: '', spec: '2.0 TSI, 272 л.с., полный привод', price: '5 800 000 ₽', img: 'img/cars/teramont-pro.jpg', post: 'https://t.me/siamotorss' },
    // Двенадцатая — из первого экрана: BMW M5 Touring в наличии в Корее (пост канала 3562).
    { name: 'BMW M5 Touring', year: '2025', km: '100 км', spec: 'Touring', price: '19 450 000 ₽', img: 'img/cars/3562_0.jpg', post: 'https://t.me/siamotorss/3562' }
  ],
  // Видеоотзывы клиентов (со старого сайта, пережаты под веб: 540px, faststart). Постеры — кадр на 2-й секунде.
  reviews: [
    { img: 'r1', video: 'video/r1.mp4' },
    { img: 'r3', video: 'video/r3.mp4' },
    { img: 'r8', video: 'video/r8.mp4' },
    { img: 'r4', video: 'video/r4.mp4' },
    { img: 'r9', video: 'video/r9.mp4' },
    { img: 'r5', video: 'video/r5.mp4' },
    { img: 'r10', video: 'video/r10.mp4' },
    { img: 'r11', video: 'video/r11.mp4' }
  ]
};
