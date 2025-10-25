// Nike Shop - Главный JavaScript файл
console.log("Nike Shop запущен! 🔥");

// Корзина товаров
let cart = [];

// Обновление счетчика корзины
function refreshCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Обновление интерфейса корзины
function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    
    if (!itemsContainer || !totalPriceEl) return;
    
    itemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Корзина пуста</p>';
    } else {
        cart.forEach((item, idx) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <p>${item.name} - ${item.price.toLocaleString()} ₸</p>
                <button class="remove-btn" onclick="removeItem(${idx})">Удалить</button>
            `;
            itemsContainer.appendChild(div);
        });
    }
    
    totalPriceEl.textContent = total.toLocaleString();
}

// Добавление товара в корзину
function addToCart(name, price) {
    cart.push({ name, price });
    refreshCartCount();
    updateCartUI();
    
    // Показываем уведомление
    showNotification('Товар добавлен в корзину! ✓');
}

// Удаление товара из корзины
function removeItem(index) {
    cart.splice(index, 1);
    refreshCartCount();
    updateCartUI();
    showNotification('Товар удален из корзины');
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const message = `Спасибо за покупку!\n\nИтого: ${total.toLocaleString()} ₸\nТоваров: ${cart.length}`;
    
    alert(message);
    cart = [];
    refreshCartCount();
    updateCartUI();
    closeCart();
}

// Закрытие корзины
function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Управление авторизацией
let isLoginMode = false;
let currentUser = null;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const authTitle = document.querySelector('.auth-content h2');
    const authSwitch = document.querySelector('.auth-switch');
    const emailInput = document.getElementById('email');
    const confirmInput = document.getElementById('confirm-password');
    const authBtn = document.querySelector('.auth-btn');
    
    if (isLoginMode) {
        authTitle.textContent = 'Вход';
        authSwitch.innerHTML = 'Нет аккаунта? <a href="#" onclick="toggleAuthMode()">Зарегистрироваться</a>';
        emailInput.parentElement.style.display = 'none';
        confirmInput.parentElement.style.display = 'none';
        authBtn.textContent = 'Войти';
    } else {
        authTitle.textContent = 'Регистрация';
        authSwitch.innerHTML = 'Уже есть аккаунт? <a href="#" onclick="toggleAuthMode()">Войти</a>';
        emailInput.parentElement.style.display = 'block';
        confirmInput.parentElement.style.display = 'block';
        authBtn.textContent = 'Зарегистрироваться';
    }
}

function handleAuth(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Форма отправлена:', { username, password });
    
    if (isLoginMode) {
        // Логика входа
        const storedUser = localStorage.getItem(username);
        if (storedUser && JSON.parse(storedUser).password === password) {
            currentUser = JSON.parse(storedUser);
            showNotification('Успешный вход!');
            closeAuth();
            updateAuthButton();
        } else {
            showNotification('Неверное имя пользователя или пароль');
        }
    } else {
        // Логика регистрации
        const email = document.getElementById('email').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            showNotification('Пароли не совпадают');
            return false;
        }
        
        if (localStorage.getItem(username)) {
            showNotification('Пользователь уже существует');
            return false;
        }
        
        const user = { username, email, password };
        localStorage.setItem(username, JSON.stringify(user));
        currentUser = user;
        showNotification('Регистрация успешна!');
        closeAuth();
        updateAuthButton();
    }
    
    return false;
}

function closeAuth() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.style.display = 'none';
    }
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (currentUser) {
        authBtn.textContent = '👤 ' + currentUser.username;
        authBtn.onclick = logout;
    } else {
        authBtn.textContent = '👤 Войти';
        authBtn.onclick = () => {
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.style.display = 'flex';
            }
        };
    }
}

function logout() {
    currentUser = null;
    updateAuthButton();
    showNotification('Вы вышли из аккаунта');
}

// Функция открытия модального окна авторизации
function openAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.style.display = 'flex';
    }
}

// Функция закрытия модального окна авторизации
function closeAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.style.display = 'none';
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Ensure auth button shows correct text/state and is wired
    try {
        updateAuthButton();
    } catch (e) {
        console.warn('updateAuthButton not available yet', e);
    }
    // Инициализация модального окна авторизации
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth');

    if (authBtn) {
        // defensive binding: ensure click opens modal and log for debugging
        authBtn.addEventListener('click', (e) => {
            console.log('auth button clicked', e);
            openAuthModal();
        });
    }

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', closeAuthModal);
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Открытие корзины
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            updateCartUI();
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) {
                cartModal.style.display = 'flex';
            }
        });
    }
    
    // Закрытие корзины по крестику
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Закрытие корзины при клике вне модального окна
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target.id === 'cart-modal') {
                closeCart();
            }
        });
    }
    
    // Бургер меню
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');
    
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Прогресс бар прокрутки и активные секции
    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById('progress-bar');
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        if (progressBar) {
            const scroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scroll / height) * 100;
            progressBar.style.width = progress + '%';
        }

        // Определяем текущую активную секцию
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        // Обновляем активную ссылку в навигации
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Эффект при прокрутке навигации
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    // Анимация счетчиков достижений
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats');
    let hasAnimated = false;

    const animateCounter = (counter, target) => {
        let count = 0;
        const duration = 2000; // 2 seconds
        const frames = 60; // 60 frames per second
        const increment = target / (duration / 1000 * frames);
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.textContent = Math.floor(count);
                setTimeout(() => requestAnimationFrame(updateCount), 1000/frames);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCount();
    };

    const checkScroll = () => {
        if (hasAnimated) return;
        
        const triggerBottom = window.innerHeight * 0.8;
        const statsSectionTop = statsSection.getBoundingClientRect().top;

        if (statsSectionTop < triggerBottom) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
            });
            hasAnimated = true;
            window.removeEventListener('scroll', checkScroll);
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
});