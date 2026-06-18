// ===== بستن ولکام =====
function closeWelcome() {
    document.getElementById('welcomePopup').style.display = 'none';
}

// ===== داده‌های خدمات =====
const servicesData = [
    { id: 1, title: "آرایش عروس", description: "خاص‌ترین روز زندگیتان را بی‌نظیر کنید", price: "۲,۵۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop" },
    { id: 2, title: "میکاپ حرفه‌ای", description: "آرایش روز و مجلسی با جدیدترین تکنیک‌ها", price: "۱,۲۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop" },
    { id: 3, title: "آموزش آرایش", description: "از مبتدی تا پیشرفته با مدرک معتبر", price: "۸۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop" },
    { id: 4, title: "شینیون", description: "مدل‌های شیک و مدرن شینیون", price: "۹۰۰,۰۰۰ تومان", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=400&h=300&fit=crop" }
];

// ===== گالری =====
const galleryData = [
    { id: 1, title: "شینیون مجلسی", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=600&h=400&fit=crop" },
    { id: 2, title: "شینیون ساده", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop" },
    { id: 3, title: "شینیون عروس", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop" },
    { id: 4, title: "شینیون مدرن", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop" }
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
            <div class="overlay"><h4>👑 ${item.title}</h4></div>
        </div>
    `).join('');
}

// ===== رزرو خدمت =====
function bookService(id) {
    const service = servicesData.find(s => s.id === id);
    if (!service) return;
    
    // باز کردن مودال ورود
    document.getElementById('loginModal').style.display = 'block';
    
    // ذخیره خدمت انتخاب شده
    localStorage.setItem('selectedService', JSON.stringify(service));
}

// ===== سیستم کاربران =====
const userManager = {
    users: JSON.parse(localStorage.getItem('melikaUsers')) || {},
    
    addUser(phone, name = '') {
        if (!this.users[phone]) {
            this.users[phone] = { visitCount: 0, name: name, joinDate: new Date().toISOString() };
        }
        this.users[phone].visitCount += 1;
        if (name && !this.users[phone].name) {
            this.users[phone].name = name;
        }
        this.saveUsers();
        return this.users[phone];
    },
    
    saveUsers() {
        localStorage.setItem('melikaUsers', JSON.stringify(this.users));
    },
    
    getDiscount(visitCount) {
        if (visitCount >= 10) return 10;
        if (visitCount >= 5) return 7;
        if (visitCount >= 3) return 4;
        if (visitCount >= 2) return 2;
        return 0;
    }
};

// ===== ورود =====
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('phoneInput').value;
    const code = document.getElementById('codeInput').value;
    
    if (phone.length < 11) {
        alert('لطفاً شماره موبایل را به درستی وارد کنید!');
        return;
    }
    
    if (code !== '1234') {
        alert('کد تایید اشتباه است! (کد صحیح: 1234)');
        return;
    }
    
    // اضافه کردن کاربر
    const user = userManager.addUser(phone);
    const discount = userManager.getDiscount(user.visitCount);
    
    // نمایش اطلاعات کاربر
    document.getElementById('userPhone').textContent = phone;
    document.getElementById('visitCount').textContent = user.visitCount;
    document.getElementById('discountPercent').textContent = discount + '%';
    document.getElementById('userInfo').style.display = 'block';
    
    // ذخیره شماره در لیست
    let numbers = JSON.parse(localStorage.getItem('melikaNumbers')) || [];
    if (!numbers.includes(phone)) {
        numbers.push(phone);
        localStorage.setItem('melikaNumbers', JSON.stringify(numbers));
    }
    
    // بررسی خدمت انتخاب شده
    const selectedService = JSON.parse(localStorage.getItem('selectedService'));
    if (selectedService) {
        // ایجاد رزرو
        const reservation = {
            name: user.name || 'کاربر',
            phone: phone,
            service: selectedService.title,
            date: new Date().toISOString(),
            status: 'pending'
        };
        let reservations = JSON.parse(localStorage.getItem('melikaReservations')) || [];
        reservations.push(reservation);
        localStorage.setItem('melikaReservations', JSON.stringify(reservations));
        
        let msg = `✅ رزرو شما برای "${selectedService.title}" ثبت شد!\n`;
        msg += `📞 شماره تماس: ${phone}\n`;
        msg += `⏰ زمان ثبت: ${new Date().toLocaleDateString('fa-IR')}\n`;
        msg += `📌 در اسرع وقت با شما تماس گرفته می‌شود.`;
        alert(msg);
        
        localStorage.removeItem('selectedService');
    } else {
        alert(`✅ خوش آمدید!\nتعداد مراجعه: ${user.visitCount}\nتخفیف شما: ${discount}%`);
    }
    
    document.getElementById('loginModal').style.display = 'none';
});

// ===== مودال =====
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

// ===== منو همبرگری =====
document.querySelector('.hamburger')?.addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// ===== دکمه بازگشت =====
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) btn.style.display = 'block';
    else btn.style.display = 'none';
});

// ===== انیمیشن شمارنده =====
const counters = document.querySelectorAll('.number');
counters.forEach(counter => {
    const updateCount = () => {
        const target = parseInt(counter.getAttribute('data-count'));
        const count = parseInt(counter.innerText);
        const increment = target / 100;
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target + '+';
        }
    };
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            updateCount();
            observer.disconnect();
        }
    });
    observer.observe(counter);
});

// ===== فرم تماس =====
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phoneNumber').value;
    const service = document.getElementById('serviceSelect').value;
    const message = document.getElementById('messageText').value;
    
    // ذخیره در localStorage
    let contacts = JSON.parse(localStorage.getItem('melikaContacts')) || [];
    contacts.push({ name, phone, service, message, date: new Date().toISOString() });
    localStorage.setItem('melikaContacts', JSON.stringify(contacts));
    
    // ذخیره شماره
    let numbers = JSON.parse(localStorage.getItem('melikaNumbers')) || [];
    if (!numbers.includes(phone)) {
        numbers.push(phone);
        localStorage.setItem('melikaNumbers', JSON.stringify(numbers));
    }
    
    alert('✅ پیام شما با موفقیت ارسال شد! در اسرع وقت با شما تماس گرفته می‌شود.');
    this.reset();
});

// ===== اجرا =====
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderGallery();
});
