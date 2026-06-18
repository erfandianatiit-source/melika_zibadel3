// ===== تنظیمات ورود =====
const ADMIN_USER = 'melika';
const ADMIN_PASS = '137613';

// ===== ورود ادمین =====
document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        document.getElementById('loginAdmin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderPage('dashboard');
    } else {
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
});

// ===== خروج =====
function adminLogout() {
    if (confirm('آیا از خروج مطمئن هستید؟')) {
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('loginAdmin').style.display = 'flex';
        document.getElementById('adminLoginForm').reset();
    }
}

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

function getReservations() {
    return JSON.parse(localStorage.getItem('melikaReservations')) || [];
}

// ===== رندر صفحه =====
function renderPage(tab) {
    const content = document.getElementById('adminContent');
    const title = document.getElementById('pageTitle');
    
    document.querySelectorAll('.sidebar nav li').forEach(li => li.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
    
    switch(tab) {
        case 'dashboard': 
            title.textContent = '📊 داشبورد'; 
            content.innerHTML = renderDashboard(); 
            break;
        case 'users': 
            title.textContent = '👥 کاربران'; 
            content.innerHTML = renderUsers(); 
            break;
        case 'numbers': 
            title.textContent = '📱 شماره‌ها'; 
            content.innerHTML = renderNumbers(); 
            break;
        case 'contacts': 
            title.textContent = '✉️ پیام‌ها'; 
            content.innerHTML = renderContacts(); 
            break;
        case 'reservations': 
            title.textContent = '📅 رزروها'; 
            content.innerHTML = renderReservations(); 
            break;
        case 'discounts': 
            title.textContent = '🎯 تخفیف‌ها'; 
            content.innerHTML = renderDiscounts(); 
            break;
        default: 
            content.innerHTML = '<h2>صفحه پیدا نشد!</h2>';
    }
}

// ===== داشبورد =====
function renderDashboard() {
    const users = getUsers();
    const numbers = getNumbers();
    const contacts = getContacts();
    const reservations = getReservations();
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
            <div class="stat-card">
                <div class="icon">📅</div>
                <div class="number">${reservations.length}</div>
                <div class="label">رزروها</div>
            </div>
        </div>
        <div class="table-container">
            <h3>📋 آخرین رزروها</h3>
            <table>
                <tr><th>نام</th><th>شماره</th><th>خدمت</th><th>تاریخ</th><th>وضعیت</th></tr>
                ${reservations.slice(-5).reverse().map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td>${r.phone}</td>
                        <td>${r.service}</td>
                        <td>${new Date(r.date).toLocaleDateString('fa-IR')}</td>
                        <td><span class="status-${r.status || 'pending'}">${r.status === 'confirmed' ? '✅ تایید' : r.status === 'cancelled' ? '❌ لغو' : '⏳ در انتظار'}</span></td>
                    </tr>
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
                <tr><th>شماره</th><th>نام</th><th>مراجعه</th><th>تخفیف</th><th>عملیات</th></tr>
                ${Object.entries(users).map(([phone, data]) => {
                    const discount = getDiscount(data.visitCount);
                    return `
                        <tr>
                            <td>${phone}</td>
                            <td>${data.name || '---'}</td>
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
            <h3>
                📱 لیست شماره‌ها (${numbers.length})
                <button class="btn-export" onclick="exportNumbers()"><i class="fas fa-file-excel"></i> خروجی اکسل</button>
            </h3>
            <table>
                <tr><th>ردیف</th><th>شماره</th><th>تاریخ ثبت</th><th>عملیات</th></tr>
                ${numbers.map((num, i) => `
                    <tr>
                        <td>${i+1}</td>
                        <td>${num}</td>
                        <td>${new Date().toLocaleDateString('fa-IR')}</td>
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
            <h3>
                ✉️ لیست پیام‌ها (${contacts.length})
                <button class="btn-export" onclick="exportContacts()"><i class="fas fa-file-excel"></i> خروجی اکسل</button>
            </h3>
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

// ===== رزروها =====
function renderReservations() {
    const reservations = getReservations();
    return `
        <div class="table-container">
            <h3>
                📅 لیست رزروها (${reservations.length})
                <button class="btn-export" onclick="exportReservations()"><i class="fas fa-file-excel"></i> خروجی اکسل</button>
            </h3>
            <table>
                <tr><th>نام</th><th>شماره</th><th>خدمت</th><th>تاریخ رزرو</th><th>وضعیت</th><th>عملیات</th></tr>
                ${reservations.map((r, i) => `
                    <tr>
                        <td>${r.name}</td>
                        <td>${r.phone}</td>
                        <td>${r.service}</td>
                        <td>${new Date(r.date).toLocaleDateString('fa-IR')} - ${new Date(r.date).toLocaleTimeString('fa-IR')}</td>
                        <td><span class="status-${r.status || 'pending'}">${r.status === 'confirmed' ? '✅ تایید' : r.status === 'cancelled' ? '❌ لغو' : '⏳ در انتظار'}</span></td>
                        <td>
                            <button class="btn-edit" onclick="updateReservation(${i}, 'confirmed')" style="background:#27ae60;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;margin:2px;">✅</button>
                            <button class="btn-edit" onclick="updateReservation(${i}, 'cancelled')" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;margin:2px;">❌</button>
                            <button class="btn-delete" onclick="deleteReservation(${i})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// ===== تخفیف‌ها =====
function renderDiscounts() {
    return `
        <div class="table-container">
            <h3>🎯 تنظیمات تخفیف</h3>
            <p style="color:#666;margin-bottom:1rem;">تخفیف‌ها بر اساس تعداد مراجعه به صورت خودکار اعمال می‌شوند:</p>
            <table>
                <tr><th>تعداد مراجعه</th><th>درصد تخفیف</th></tr>
                <tr><td>۲ بار</td><td>۲٪</td></tr>
                <tr><td>۳ بار</td><td>۴٪</td></tr>
                <tr><td>۵ بار</td><td>۷٪</td></tr>
                <tr><td>۱۰ بار</td><td>۱۰٪</td></tr>
            </table>
            <div style="margin-top:1.5rem;padding:1rem;background:#faf0f5;border-radius:10px;">
                <p>💡 برای تغییر تخفیف‌ها، کد را در فایل script.js ویرایش کنید.</p>
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

// ===== عملیات حذف =====
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

function deleteReservation(index) {
    if (confirm('آیا از حذف این رزرو مطمئن هستید؟')) {
        let reservations = getReservations();
        reservations.splice(index, 1);
        localStorage.setItem('melikaReservations', JSON.stringify(reservations));
        renderPage('reservations');
    }
}

function updateReservation(index, status) {
    let reservations = getReservations();
    reservations[index].status = status;
    localStorage.setItem('melikaReservations', JSON.stringify(reservations));
    renderPage('reservations');
}

// ===== خروجی اکسل =====
function exportNumbers() {
    const numbers = getNumbers();
    if (numbers.length === 0) {
        alert('هیچ شماره‌ای برای خروجی وجود ندارد!');
        return;
    }
    let csv = 'ردیف,شماره موبایل,تاریخ ثبت\n';
    numbers.forEach((num, i) => {
        csv += `${i+1},${num},${new Date().toLocaleDateString('fa-IR')}\n`;
    });
    downloadCSV(csv, 'شماره_مشتریان');
}

function exportContacts() {
    const contacts = getContacts();
    if (contacts.length === 0) {
        alert('هیچ پیامی برای خروجی وجود ندارد!');
        return;
    }
    let csv = 'نام,شماره,خدمت,پیام,تاریخ\n';
    contacts.forEach(c => {
        csv += `${c.name},${c.phone},${c.service},${c.message || ''},${new Date(c.date).toLocaleDateString('fa-IR')}\n`;
    });
    downloadCSV(csv, 'پیام_مشتریان');
}

function exportReservations() {
    const reservations = getReservations();
    if (reservations.length === 0) {
        alert('هیچ رزروی برای خروجی وجود ندارد!');
        return;
    }
    let csv = 'نام,شماره,خدمت,تاریخ رزرو,وضعیت\n';
    reservations.forEach(r => {
        const status = r.status === 'confirmed' ? 'تایید' : r.status === 'cancelled' ? 'لغو' : 'در انتظار';
        csv += `${r.name},${r.phone},${r.service},${new Date(r.date).toLocaleDateString('fa-IR')},${status}\n`;
    });
    downloadCSV(csv, 'رزرو_مشتریان');
}

function downloadCSV(csv, filename) {
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toLocaleDateString('fa-IR')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ===== رویدادهای منو =====
document.querySelectorAll('.sidebar nav li').forEach(item => {
    item.addEventListener('click', function() {
        renderPage(this.dataset.tab);
    });
});

// ===== اجرا =====
document.addEventListener('DOMContentLoaded', () => {
    // اگر قبلاً وارد شده بود
    if (document.getElementById('adminPanel').style.display === 'block') {
        renderPage('dashboard');
    }
});
