
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'expired', 'limited')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    promo_code_id INTEGER REFERENCES promo_codes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, promo_code_id)
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    promo_code_id INTEGER REFERENCES promo_codes(id) ON DELETE CASCADE,
    vote INTEGER CHECK (vote IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, promo_code_id)
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    promo_code_id INTEGER REFERENCES promo_codes(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'reviewed', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    promo_code_id INTEGER REFERENCES promo_codes(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO promo_codes (title, code, category, status, description)
VALUES
('Скидка 15% на первый заказ', 'SHOP15NOW', 'Магазины', 'active', 'Скидка 15% для новых клиентов на первый заказ.'),
('Бесплатная доставка от 2000₽', 'FREESHIP2000', 'Магазины', 'expired', 'Бесплатная доставка при заказе от 2000 рублей.'),
('Скидка 500₽ на электронику', 'TECH500OFF', 'Электроника', 'limited', 'Скидка 500 рублей на выбранные товары электроники.'),
('Чёрная пятница — 30%', 'BLACKFRIDAY30', 'Магазины', 'active', 'Скидка до 30% на товары из специальной подборки.'),
('2=3 на все товары', 'TAKE3PAY2', 'Магазины', 'active', 'При покупке трёх товаров оплачиваются только два.'),
('Скидка 10% новым клиентам', 'WELCOME10', 'Магазины', 'limited', 'Приветственная скидка для новых пользователей.'),
('Бесплатный кофе в подарок', 'COFFEEFREE', 'Рестораны', 'expired', 'Кофе в подарок при выполнении условий акции.'),
('Скидка 20% на пиццу', 'PIZZA20PRO', 'Рестораны', 'active', 'Скидка 20% на заказ пиццы.'),
('Второй ролл в подарок', 'ROLL2GET1', 'Рестораны', 'expired', 'Второй ролл в подарок при заказе.'),
('Бесплатная доставка еды', 'FOODDELIVO', 'Рестораны', 'active', 'Бесплатная доставка при заказе еды.'),
('Скидка 300₽ на обед', 'LUNCH300', 'Рестораны', 'limited', 'Скидка 300 рублей на обеденное меню.'),
('Десерт бесплатно', 'SWEETGIFT', 'Рестораны', 'active', 'Десерт в подарок к заказу.'),
('3 месяца подписки бесплатно', '3MONTHFREE', 'Электроника', 'expired', 'Пробный период подписки на три месяца.'),
('Скидка 50% на онлайн-курс', 'STUDY50', 'Магазины', 'active', 'Скидка 50% на выбранные обучающие курсы.'),
('Промокод на такси −20%', 'TAXI20RIDE', 'Магазины', 'active', 'Скидка 20% на поездку на такси.'),
('1000 бонусов при регистрации', 'BONUS1000', 'Магазины', 'active', 'Бонусные баллы новым пользователям после регистрации.'),
('Скидка 25% на авиабилеты', 'FLY25SALE', 'Магазины', 'limited', 'Скидка 25% на выбранные авиабилеты.'),
('Месяц музыки в подарок', 'MUSICFREE', 'Электроника', 'active', 'Месяц подписки на музыкальный сервис в подарок.'),
('Скидка 10% на витамины', 'HEALTH10', 'Аптеки', 'active', 'Скидка 10% на выбранные товары аптечного ассортимента.'),
('Бонус при покупке от 1500₽', 'APTEKA1500', 'Аптеки', 'limited', 'Дополнительные бонусы при покупке от 1500 рублей.');
