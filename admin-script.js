// ===== دریافت داده‌ها =====
function getUsers() {
    return JSON.parse(localStorage.getItem('melikaUsers')) || {};
}

function getNumbers() {
    return JSON.parse(localStorage.getItem('melikaNumbers')) || [];
}

function getContacts() {
    return JSON.parse(localStorage.getItem('melikaContacts')) || [];
}

function getGallery() {
    return JSON.parse(localStorage.getItem('melikaGallery')) || [
        { id: 1, title: "شینیون مجلسی", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=600&h=400&fit=crop" },
        { id: 2, title: "شینیون ساده", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop" }
    ];
}

// ===== رندر صفحه =====
function renderPage(tab) {
    const content = document.getElementById('adminContent');
    const title = document.getElementById('pageTitle');
    
    document.querySelectorAll('.sidebar nav li').forEach(li => li.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
    
    switch(tab) {
        case 'dashboard': title.textContent = '📊 داشبورد'; content.innerHTML = renderDashboard(); break;
        case 'users': title.textContent = '👥 کاربران'; content.innerHTML = renderUsers(); break;
        case 'numbers': title.textContent = '📱 شماره‌ها'; content.innerHTML = renderNumbers(); break;
        case 'contacts': title.textContent = '✉️ پیام‌ها'; content.innerHTML = renderContacts(); break;
        case 'gallery': title.textContent = '🖼️ گالری'; content.innerHTML = renderGallery(); break;
        case 'discounts': title.textContent = '🎯 تخفیف‌ها'; content.innerHTML = renderDiscounts(); break;
        default: content.innerHTML = '<h2>صفحه پیدا نشد!</h2>';
    }
}

// ===== داشبورد =====
function renderDashboard() {
    const users = getUsers();
    const numbers = getNumbers();
    const contacts = getContacts();
    const totalUsers = Object.keys(users).length;
    const totalVisits = Object.values(users).reduce((sum, u) => sum + u.visitCount, 0);
    
    return `
        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="icon">👤</div>
                <div class="number">${totalUsers}</div>
                <div class="label">کاربران</div>
            </div>
            <div class="stat-card">
                <div class="icon">📋</div>
                <div class="number">${totalVisits}</div>
                <div class="label">مراجعات</div>
            </div>
            <div class="stat-card">
                <div class="icon">📱</div>
                <div class="number">${numbers.length}</div>
                <div class="label">شماره‌ها</div>
            </div>
            <div class="stat-card">
                <div class="icon">✉️</div>
                <div class="number">${contacts.length}</div>
                <div class="label">پیام‌ها</div>
            </div>
        </div>
        <div class="table-container">
            <h3>📋 آخرین پیام‌ها</h3>
            <table>
                <tr><th>نام</th><th>شماره</th><th>خدمت</th><th>تاریخ</th></tr>
                ${contacts.slice(-5).reverse().map(c => `
                    <tr><td>${c.name}</td><td>${c.phone}</td><td>${c.service}</td><td>${new Date(c.date).toLocaleDateString('fa-IR')}</td></tr>
                `).join('')}
            </table>
        </div>
    `;
}

// ===== کاربران =====
function renderUsers() {
    const users = getUsers();
    return `
        <div class="table-container">
            <h3>👥 لیست کاربران</h3>
            <table>
                <tr><th>شماره</th><th>مراجعه</th><th>تخفیف</th><th>عملیات</th></tr>
                ${Object.entries(users).map(([phone, data]) => {
                    const discount = getDiscount(data.visitCount);
                    return `
                        <tr>
                            <td>${phone}</td>
                            <td>${data.visitCount}</td>
                            <td>${discount}%</td>
                            <td><button class="btn-delete" onclick="deleteUser('${phone}')">🗑️</button></td>
                        </tr>
                    `;
                }).join('')}
            </table>
        </div>
    `;
}

// ===== شماره‌ها =====
function renderNumbers() {
    const numbers = getNumbers();
    return `
        <div class="table-container">
            <h3>📱 لیست شماره‌ها</h3>
            <button class="btn-export" onclick="exportExcel()"><i class="fas fa-file-excel"></i> خروجی اکسل</button>
            <table>
                <tr><th>ردیف</th><th>شماره</th><th>عملیات</th></tr>
                ${numbers.map((num, i) => `
                    <tr>
                        <td>${i+1}</td>
                        <td>${num}</td>
                        <td><button class="btn-delete" onclick="deleteNumber('${num}')">🗑️</button></td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// ===== پیام‌ها =====
function renderContacts() {
    const contacts = getContacts();
    return `
        <div class="table-container">
            <h3>✉️ لیست پیام‌ها</h3>
            <table>
                <tr><th>نام</th><th>شماره</th><th>خدمت</th><th>پیام</th><th>تاریخ</th><th>عملیات</th></tr>
                ${contacts.map((c, i) => `
                    <tr>
                        <td>${c.name}</td>
                        <td>${c.phone}</td>
                        <td>${c.service}</td>
                        <td>${c.message || '-'}</td>
                        <td>${new Date(c.date).toLocaleDateString('fa-IR')}</td>
                        <td><button class="btn-delete" onclick="deleteContact(${i})">🗑️</button></td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// ===== گالری =====
function renderGallery() {
    const gallery = getGallery();
    return `
        <div class="admin-form">
            <h3>➕ افزودن عکس جدید</h3>
            <form id="galleryForm">
                <label>عنوان</label>
                <input type="text" id="galleryTitle" placeholder="عنوان عکس" required>
                <label>آدرس عکس (لینک)</label>
                <input type="url" id="galleryImage" placeholder="https://example.com/image.jpg" required>
                <button type="submit">افزودن به گالری</button>
            </form>
        </div>
        <div class="table-container" style="margin-top: 2rem;">
            <h3>🖼️ گالری شینیون</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                ${gallery.map(item => `
                    <div style="border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover;">
                        <div style="padding: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                            <span>${item.title}</span>
                            <button class="btn-delete" onclick="deleteGalleryItem(${item.id})">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== تخفیف‌ها =====
function renderDiscounts() {
    return `
        <div class="admin-form">
            <h3>🎯 تنظیمات تخفیف</h3>
            <form id="discountForm">
                <label>تعداد مراجعه برای ۲٪ تخفیف</label>
                <input type="number" id="d2" value="2" min="1">
                <label>تعداد مراجعه برای ۴٪ تخفیف</label>
                <input type="number" id="d4" value="3" min="1">
                <label>تعداد مراجعه برای ۷٪ تخفیف</label>
                <input type="number" id="d7" value="5" min="1">
                <label>تعداد مراجعه برای ۱۰٪ تخفیف</label>
                <input type="number" id="d10" value="10" min="1">
                <button type="submit">💾 ذخیره تنظیمات</button>
            </form>
            <div style="margin-top: 2rem; padding: 1.5rem; background: #faf0f5; border-radius: 15px;">
                <h4>📊 وضعیت فعلی تخفیف‌ها</h4>
                <p>۲٪ تخفیف: بعد از <span id="showD2">2</span> مراجعه</p>
                <p>۴٪ تخفیف: بعد از <span id="showD4">3</span> مراجعه</p>
                <p>۷٪ تخفیف: بعد از <span id="showD7">5</span> مراجعه</p>
                <p>۱۰٪ تخفیف: بعد از <span id="showD10">10</span> مراجعه</p>
            </div>
        </div>
    `;
}

// ===== توابع کمکی =====
function getDiscount(visitCount) {
    if (visitCount >= 10) return 10;
    if (visitCount >= 5) return 7;
    if (visitCount >= 3) return 4;
    if (visitCount >= 2) return 2;
    return 0;
}

// ===== عملیات =====
function deleteUser(phone) {
    if (confirm(`آیا از حذف کاربر ${phone} مطمئن هستید؟`)) {
        let users = getUsers();
        delete users[phone];
        localStorage.setItem('melikaUsers', JSON.stringify(users));
        renderPage('users');
    }
}

function deleteNumber(phone) {
    if (confirm(`آیا از حذف شماره ${phone} مطمئن هستید؟`)) {
        let numbers = getNumbers().filter(n => n !== phone);
        localStorage.setItem('melikaNumbers', JSON.stringify(numbers));
        renderPage('numbers');
    }
}

function deleteContact(index) {
    if (confirm('آیا از حذف این پیام مطمئن هستید؟')) {
        let contacts = getContacts();
        contacts.splice(index, 1);
        localStorage.setItem('melikaContacts', JSON.stringify(contacts));
        renderPage('contacts');
    }
}

function deleteGalleryItem(id) {
    if (confirm('آیا از حذف این عکس مطمئن هستید؟')) {
        let gallery = getGallery().filter(item => item.id !== id);
        localStorage.setItem('melikaGallery', JSON.stringify(gallery));
        renderPage('gallery');
    }
}

// ===== خروجی اکسل =====
function exportExcel() {
    const numbers = getNumbers();
    if (numbers.length === 0) {
        alert('هیچ شماره‌ای برای خروجی وجود ندارد!');
        return;
    }
    
    let csv = 'ردیف,شماره موبایل\n';
    numbers.forEach((num, i) => {
        csv += `${i+1},${num}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `شماره_مشتریان_${new Date().toLocaleDateString('fa-IR')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ===== خروج =====
function logout() {
    if (confirm('آیا مطمئن هستید؟')) {
        window.location.href = 'index.html';
    }
}

// ===== رویدادها =====
document.querySelectorAll('.sidebar nav li').forEach(item => {
    item.addEventListener('click', function() {
        renderPage(this.dataset.tab);
    });
});

// ===== فرم گالری =====
document.addEventListener('submit', function(e) {
    if (e.target.id === 'galleryForm') {
        e.preventDefault();
        const title = document.getElementById('galleryTitle').value;
        const image = document.getElementById('galleryImage').value;
        if (!title || !image) return alert('لطفاً همه فیلدها را پر کنید!');
        
        let gallery = getGallery();
        gallery.push({ id: Date.now(), title, image });
        localStorage.setItem('melikaGallery', JSON.stringify(gallery));
        alert('✅ عکس با موفقیت اضافه شد!');
        e.target.reset();
        renderPage('gallery');
    }
    
    if (e.target.id === 'discountForm') {
        e.preventDefault();
        alert('✅ تنظیمات تخفیف ذخیره شد!');
    }
});

// ===== اجرا =====
document.addEventListener('DOMContentLoaded', () => {
    renderPage('dashboard');
    
    // نمایش تنظیمات تخفیف
    const d2 = document.getElementById('showD2');
    const d4 = document.getElementById('showD4');
    const d7 = document.getElementById('showD7');
    const d10 = document.getElementById('showD10');
    if (d2) d2.textContent = document.getElementById('d2')?.value || 2;
    if (d4) d4.textContent = document.getElementById('d4')?.value || 3;
    if (d7) d7.textContent = document.getElementById('d7')?.value || 5;
    if (d10) d10.textContent = document.getElementById('d10')?.value || 10;
});
