// ===== داده‌های خدمات =====
const servicesData = [
    { id: 1, title: "آرایش عروس", description: "خاص‌ترین روز زندگیتان را بی‌نظیر کنید", price: "۲,۵۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop" },
    { id: 2, title: "میکاپ حرفه‌ای", description: "آرایش روز و مجلسی با جدیدترین تکنیک‌ها", price: "۱,۲۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop" },
    { id: 3, title: "آموزش آرایش", description: "از مبتدی تا پیشرفته با مدرک معتبر", price: "۸۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop" },
    { id: 4, title: "شینیون", description: "مدل‌های شیک و مدرن شینیون", price: "۹۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=400&h=300&fit=crop" }
];

// ===== گالری شینیون (عکس‌های باکیفیت از Unsplash) =====
const galleryData = [
    { id: 1, title: "شینیون مجلسی", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=600&h=400&fit=crop" },
    { id: 2, title: "شینیون ساده", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop" },
    { id: 3, title: "شینیون عروس", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop" },
    { id: 4, title: "شینیون مدرن", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop" },
    { id: 5, title: "شینیون کلاسیک", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=600&h=400&fit=crop" },
    { id: 6, title: "شینیون روز", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop" }
];

// ===== رندر خدمات =====
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = servicesData.map(s => `
        <div class="service-card">
            <img src="${s.image}" alt="${s.title}" loading="lazy">
            <div class="content">
                <h3>${s.title}</h3>
                <p>${s.description}</p>
                <span class="price">${s.price}</span>
                <button class="btn-primary" onclick="bookService(${s.id})">رزرو کنید</button>
            </div>
        </div>
    `).join('');
}

// ===== رندر گالری =====
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = galleryData.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="overlay">
                <h4>${item.title}</h4>
            </div>
        </div>
    `).join('');
}

// ===== رزرو خدمت =====
function bookService(id) {
    const service = servicesData.find(s => s.id === id);
    if (!service) return;
    document.getElementById('loginModal').style.display = 'block';
    localStorage.setItem('selectedService', JSON.stringify(service));
}

// ===== سیستم کاربران =====
const userManager = {
    users: JSON.parse(localStorage.getItem('melikaUsers')) || {},
    
    addUser(phone) {
        if (!this.users[phone]) {
            this.users[phone] = { visitCount: 0, name: '', joinDate: new Date().toISOString() };
        }
        this.users[phone].visitCount += 1;
        this.saveUsers();
        return this.users[phone];
    },
    
    saveUsers() {
        localStorage.setItem('melikaUsers', JSON.stringify(this.users));
    },
    
    getDiscount(visitCount) {
