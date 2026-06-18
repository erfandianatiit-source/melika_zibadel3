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

// ===== گالری شینیون =====
const galleryData = [
    { id: 1, title: "شینیون مجلسی", image: "https://images.unsplash.com/photo-1583265709629-6003f291a18a?w=600&h=400&fit=crop" },
    { id: 2, title: "شینیون ساده", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop" },
    { id: 3, title: "شینیون عروس", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop" },
    { id: 4, title: "شینیون مدرن", image: "
