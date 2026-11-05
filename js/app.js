
const coupons = [
    {id:1,title:'Скидка 15% на первый заказ',code:'SHOP15NOW',cat:'Магазины',status:'active',desc:'Скидка 15% для новых клиентов на первый заказ.'},
    {id:2,title:'Бесплатная доставка от 2000₽',code:'FREESHIP2000',cat:'Магазины',status:'expired',desc:'Бесплатная доставка при заказе от 2000 рублей.'},
    {id:3,title:'Скидка 500₽ на электронику',code:'TECH500OFF',cat:'Электроника',status:'limited',desc:'Скидка 500 рублей на выбранные товары электроники.'},
    {id:4,title:'Чёрная пятница — 30%',code:'BLACKFRIDAY30',cat:'Магазины',status:'active',desc:'Скидка до 30% на товары из специальной подборки.'},
    {id:5,title:'2=3 на все товары',code:'TAKE3PAY2',cat:'Магазины',status:'active',desc:'При покупке трёх товаров оплачиваются только два.'},
    {id:6,title:'Скидка 10% новым клиентам',code:'WELCOME10',cat:'Магазины',status:'limited',desc:'Приветственная скидка для новых пользователей.'},
    {id:7,title:'Бесплатный кофе в подарок',code:'COFFEEFREE',cat:'Рестораны',status:'expired',desc:'Кофе в подарок при выполнении условий акции.'},
    {id:8,title:'Скидка 20% на пиццу',code:'PIZZA20PRO',cat:'Рестораны',status:'active',desc:'Скидка 20% на заказ пиццы.'},
    {id:9,title:'Второй ролл в подарок',code:'ROLL2GET1',cat:'Рестораны',status:'expired',desc:'Второй ролл в подарок при заказе.'},
    {id:10,title:'Бесплатная доставка еды',code:'FOODDELIVO',cat:'Рестораны',status:'active',desc:'Бесплатная доставка при заказе еды.'},
    {id:11,title:'Скидка 300₽ на обед',code:'LUNCH300',cat:'Рестораны',status:'limited',desc:'Скидка 300 рублей на обеденное меню.'},
    {id:12,title:'Десерт бесплатно',code:'SWEETGIFT',cat:'Рестораны',status:'active',desc:'Десерт в подарок к заказу.'},
    {id:13,title:'3 месяца подписки бесплатно',code:'3MONTHFREE',cat:'Электроника',status:'expired',desc:'Пробный период подписки на три месяца.'},
    {id:14,title:'Скидка 50% на онлайн-курс',code:'STUDY50',cat:'Магазины',status:'active',desc:'Скидка 50% на выбранные обучающие курсы.'},
    {id:15,title:'Промокод на такси −20%',code:'TAXI20RIDE',cat:'Магазины',status:'active',desc:'Скидка 20% на поездку на такси.'},
    {id:16,title:'1000 бонусов при регистрации',code:'BONUS1000',cat:'Магазины',status:'active',desc:'Бонусные баллы новым пользователям после регистрации.'},
    {id:17,title:'Скидка 25% на авиабилеты',code:'FLY25SALE',cat:'Магазины',status:'limited',desc:'Скидка 25% на выбранные авиабилеты.'},
    {id:18,title:'Месяц музыки в подарок',code:'MUSICFREE',cat:'Электроника',status:'active',desc:'Месяц подписки на музыкальный сервис в подарок.'},
    {id:19,title:'Скидка 10% на витамины',code:'HEALTH10',cat:'Аптеки',status:'active',desc:'Скидка 10% на выбранные товары аптечного ассортимента.'},
    {id:20,title:'Бонус при покупке от 1500₽',code:'APTEKA1500',cat:'Аптеки',status:'limited',desc:'Дополнительные бонусы при покупке от 1500 рублей.'}
];

const STORAGE = {
    favorites: 'promokod_favorites',
    votes: 'promokod_votes',
    userVotes: 'promokod_user_votes',
    reports: 'promokod_reports'
};

let selectedCategory = 'Все';
let selectedView = 'all';
let selectedCoupon = null;
let toastTimer;

function readStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        showToast('Не удалось сохранить данные браузера');
    }
}

function getFavorites() {
    return readStorage(STORAGE.favorites, []);
}

function getVotes() {
    return readStorage(STORAGE.votes, {});
}

function getUserVotes() {
    return readStorage(STORAGE.userVotes, {});
}

function getReports() {
    return readStorage(STORAGE.reports, []);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}

function getCouponVotes(code) {
    const votes = getVotes();
    return votes[code] || {works: 0, fails: 0};
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

function statusText(status) {
    if (status === 'active') return 'Актуален';
    if (status === 'limited') return 'Ограниченное';
    return 'Возможно истёк';
}

/* Отображение каталога */

function render() {
    const query = document.getElementById('search').value.trim().toLowerCase();
    const favorites = getFavorites();

    let list = coupons.filter(coupon => {
        const categoryMatch =
            selectedCategory === 'Все' || coupon.cat === selectedCategory;

        const queryMatch =
            `${coupon.title} ${coupon.code} ${coupon.cat} ${coupon.desc}`
            .toLowerCase()
            .includes(query);

        const viewMatch =
            selectedView === 'all' || favorites.includes(coupon.code);

        return categoryMatch && queryMatch && viewMatch;
    });

    const sort = document.getElementById('sortSelect').value;

    if (sort === 'popular') {
        list.sort((a, b) => {
            const av = getCouponVotes(a.code);
            const bv = getCouponVotes(b.code);

            return (bv.works + bv.fails) - (av.works + av.fails);
        });
    }

    if (sort === 'working') {
        list.sort((a, b) => {
            const av = getCouponVotes(a.code);
            const bv = getCouponVotes(b.code);

            return (bv.works - bv.fails) - (av.works - av.fails);
        });
    }

    if (sort === 'alphabet') {
        list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    }

    const grid = document.getElementById('couponGrid');

    grid.innerHTML = list.map(coupon => {
        const votes = getCouponVotes(coupon.code);
        const isFavorite = favorites.includes(coupon.code);

        return `
            <article class="coupon" data-id="${coupon.id}" tabindex="0" role="button">
                <div class="coupon-top">
                    <span class="coupon-tag">${escapeHTML(coupon.cat)}</span>
                    <span class="status ${coupon.status}">${statusText(coupon.status)}</span>
                </div>

                <h3 class="coupon-title">${escapeHTML(coupon.title)}</h3>

                <p class="coupon-desc">${escapeHTML(coupon.desc)}</p>

                <div class="coupon-bottom">
                    <span class="coupon-code">${escapeHTML(coupon.code)}</span>

                    <span class="coupon-votes">
                        ✓ ${votes.works} · × ${votes.fails}
                    </span>

                    <button
                        class="favorite-card ${isFavorite ? 'active' : ''}"
                        data-favorite="${escapeHTML(coupon.code)}"
                        aria-label="Избранное">
                        ${isFavorite ? '♥' : '♡'}
                    </button>
                </div>
            </article>
        `;
    }).join('');

    document.getElementById('empty').classList.toggle('hidden', list.length > 0);
    grid.classList.toggle('hidden', list.length === 0);

    document.getElementById('catalogCount').textContent = coupons.length;
    document.getElementById('resultsCount').textContent = `${list.length} найдено`;

    document.getElementById('resultsLabel').textContent =
        selectedView === 'favorites'
            ? 'Избранные промокоды'
            : selectedCategory === 'Все'
                ? 'Все промокоды'
                : selectedCategory;

    document.getElementById('favoritesCount').textContent = favorites.length;

    document.getElementById('activeCount').textContent =
        coupons.filter(c => c.status === 'active').length;

    const votes = getVotes();

    document.getElementById('votesCount').textContent =
        Object.values(votes).reduce((sum, item) =>
            sum + (item.works || 0) + (item.fails || 0), 0
        );

    document.getElementById('reportsCount').textContent = getReports().length;
}

/* Избранное */

function toggleFavorite(code) {
    const favorites = getFavorites();
    const index = favorites.indexOf(code);

    if (index >= 0) {
        favorites.splice(index, 1);
        showToast('Удалено из избранного');
    } else {
        favorites.push(code);
        showToast('Добавлено в избранное');
    }

    writeStorage(STORAGE.favorites, favorites);

    render();

    if (selectedCoupon && selectedCoupon.code === code) {
        updateFavoriteButton();
    }
}

function updateFavoriteButton() {
    if (!selectedCoupon) return;

    const active = getFavorites().includes(selectedCoupon.code);
    const button = document.getElementById('favoriteToggle');

    button.classList.toggle('active', active);

    button.textContent = active
        ? '♥ Убрать из избранного'
        : '♡ Добавить в избранное';
}

/* Голосование */

function updateVoteDisplay() {
    if (!selectedCoupon) return;

    const code = selectedCoupon.code;
    const votes = getCouponVotes(code);
    const userVote = getUserVotes()[code];

    document.getElementById('worksCount').textContent = votes.works;
    document.getElementById('failsCount').textContent = votes.fails;

    document.getElementById('voteWorks')
        .classList.toggle('selected', userVote === 'works');

    document.getElementById('voteFails')
        .classList.toggle('selected', userVote === 'fails');

    document.getElementById('voteMessage').textContent = userVote
        ? 'Твой голос учтён. Нажми ещё раз, чтобы отменить.'
        : 'Твой голос поможет другим пользователям!';
}

function vote(type) {
    if (!selectedCoupon) return;

    const code = selectedCoupon.code;
    const votes = getVotes();
    const userVotes = getUserVotes();

    if (!votes[code]) {
        votes[code] = {works: 0, fails: 0};
    }

    const previousVote = userVotes[code];

    if (previousVote === type) {
        votes[code][type] = Math.max(0, votes[code][type] - 1);
        delete userVotes[code];

        document.getElementById('voteMessage').textContent =
            'Голос отменён. Можешь проголосовать снова.';

        showToast('Голос отменён');
    } else {
        if (previousVote) {
            votes[code][previousVote] =
                Math.max(0, votes[code][previousVote] - 1);
        }

        votes[code][type] += 1;
        userVotes[code] = type;

        showToast(previousVote ? 'Голос изменён' : 'Голос учтён');
    }

    writeStorage(STORAGE.votes, votes);
    writeStorage(STORAGE.userVotes, userVotes);

    updateVoteDisplay();
    render();
}

/* Окно промокода */

function openCoupon(coupon) {
    selectedCoupon = coupon;

    document.getElementById('detailCategory').textContent =
        coupon.cat.toUpperCase();

    document.getElementById('detailTitle').textContent = coupon.title;
    document.getElementById('detailDescription').textContent = coupon.desc;
    document.getElementById('detailCode').textContent = coupon.code;

    updateVoteDisplay();
    updateFavoriteButton();

    document.getElementById('couponDialog').showModal();
}

/* Копирование */

async function copyCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        showToast('Промокод скопирован!');
    } catch {
        const temp = document.createElement('textarea');

        temp.value = code;
        document.body.appendChild(temp);
        temp.select();

        const copied = document.execCommand('copy');
        temp.remove();

        showToast(
            copied
                ? 'Промокод скопирован!'
                : 'Не удалось скопировать код'
        );
    }
}

/* Жалобы */

function openReport() {
    document.getElementById('reportForm').reset();
    document.getElementById('reportSuccess').classList.add('hidden');
    document.getElementById('reportDialog').showModal();
}

/* Обработчики */

document.getElementById('search').addEventListener('input', render);

document.getElementById('sortSelect').addEventListener('change', render);

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll('.category-btn').forEach(item => {
            item.classList.toggle('active', item === button);
        });

        render();
    });
});

document.querySelectorAll('.view-tab').forEach(button => {
    button.addEventListener('click', () => {
        selectedView = button.dataset.view;

        document.querySelectorAll('.view-tab').forEach(item => {
            item.classList.toggle('active', item === button);
        });

        render();
    });
});

document.getElementById('couponGrid').addEventListener('click', event => {
    const favoriteButton = event.target.closest('[data-favorite]');

    if (favoriteButton) {
        event.stopPropagation();
        toggleFavorite(favoriteButton.dataset.favorite);
        return;
    }

    const card = event.target.closest('.coupon');

    if (card) {
        const coupon = coupons.find(
            item => item.id === Number(card.dataset.id)
        );

        if (coupon) openCoupon(coupon);
    }
});

document.getElementById('couponGrid').addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const card = event.target.closest('.coupon');

    if (card && event.target === card) {
        event.preventDefault();

        const coupon = coupons.find(
            item => item.id === Number(card.dataset.id)
        );

        if (coupon) openCoupon(coupon);
    }
});

document.getElementById('detailCopy').addEventListener('click', () => {
    if (selectedCoupon) copyCode(selectedCoupon.code);
});

document.getElementById('favoriteToggle').addEventListener('click', () => {
    if (selectedCoupon) toggleFavorite(selectedCoupon.code);
});

document.getElementById('voteWorks').addEventListener('click', () => {
    vote('works');
});

document.getElementById('voteFails').addEventListener('click', () => {
    vote('fails');
});

document.getElementById('resetFilters').addEventListener('click', () => {
    selectedCategory = 'Все';
    selectedView = 'all';

    document.getElementById('search').value = '';
    document.getElementById('sortSelect').value = 'default';

    document.querySelectorAll('.category-btn').forEach(button => {
        button.classList.toggle(
            'active',
            button.dataset.category === 'Все'
        );
    });

    document.querySelectorAll('.view-tab').forEach(button => {
        button.classList.toggle(
            'active',
            button.dataset.view === 'all'
        );
    });

    render();
});

document.getElementById('footerReport').addEventListener('click', openReport);

document.getElementById('reportForm').addEventListener('submit', event => {
    event.preventDefault();

    const reports = getReports();

    reports.push({
        coupon: document.getElementById('reportCoupon').value.trim(),
        type: document.getElementById('reportType').value,
        comment: document.getElementById('reportComment').value.trim(),
        date: new Date().toISOString()
    });

    writeStorage(STORAGE.reports, reports);

    document.getElementById('reportSuccess').classList.remove('hidden');

    render();
    showToast('Сообщение отправлено');

    setTimeout(() => {
        document.getElementById('reportDialog').close();
    }, 1300);
});

/* Закрытие окон */

document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById(button.dataset.close).close();
    });
});

document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
});

/* Первый запуск */

render();
