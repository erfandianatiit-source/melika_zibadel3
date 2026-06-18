const servicesData = [
    { id: 1, title: "آرایش عروس", description: "خاص‌ترین روز زندگیتان", price: "۲,۵۰۰,۰۰۰ تومان", image: "" },
    { id: 2, title: "میکاپ حرفه‌ای", description: "آرایش روز و مجلسی", price: "۱,۲۰۰,۰۰۰ تومان", image: "" },
    { id: 3, title: "آموزش آرایش", description: "از مبتدی تا پیشرفته", price: "۸۰۰,۰۰۰ تومان", image: "" },
    { id: 4, title: "خدمات پوست", description: "مراقبت تخصصی پوست", price: "۹۰۰,۰۰۰ تومان", image: "" }
];

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = servicesData.map(s => `
        <div class="service-card">
            <img src="https://via.placeholder.com/400x220/FF6B9D/FFFFFF?text=${s.title}" alt="${s.title}">
            <div class="content">
                <h3>${s.title}</h3>
                <p>${s.description}</p>
                <span class="price">${s.price}</span>
                <button class="btn-primary" onclick="bookService(${s.id})">رزرو کنید</button>
            </div>
        </div>
    `).join('');
}

function bookService(id) {
    alert('لطفاً ابتدا وارد حساب خود شوید');
    document.getElementById('loginModal').style.display = 'block';
}

document.getElementById('loginBtn')?.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'block';
});

document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
    }
});

document.querySelector('.hamburger')?.addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) btn.style.display = 'block';
    else btn.style.display = 'none';
});

// سیستم تخفیف و کاربران
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('phoneInput').value;
    if (phone.length < 11) {
        alert('شماره موبایل صحیح نیست');
        return;
    }
    let users = JSON.parse(localStorage.getItem('melikaUsers')) || {};
    if (!users[phone]) users[phone] = { visitCount: 0 };
    users[phone].visitCount += 1;
    localStorage.setItem('melikaUsers', JSON.stringify(users));

    let numbers = JSON.parse(localStorage.getItem('melikaNumbers')) || [];
    if (!numbers.includes(phone)) numbers.push(phone);
    localStorage.setItem('melikaNumbers', JSON.stringify(numbers));

    const visit = users[phone].visitCount;
    let discount = 0;
    if (visit >= 10) discount = 10;
    else if (visit >= 5) discount = 7;
    else if (visit >= 3) discount = 4;
    else if (visit >= 2) discount = 2;

    document.getElementById('userPhone').textContent = phone;
    document.getElementById('visitCount').textContent = visit;
    document.getElementById('discountPercent').textContent = discount + '%';
    document.getElementById('userInfo').style.display = 'block';
    alert(`خوش آمدید! تعداد مراجعه: ${visit} - تخفیف شما: ${discount}%`);
    document.getElementById('loginModal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', renderServices);