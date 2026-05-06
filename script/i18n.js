'use strict';

const translations = {
    en: {
        chooseService: 'Choose a service:',
        movieTitle: 'Movie title:',
        priceBase: 'Price base:',
        addNew: 'Add new',
        saveChanges: 'Save changes',
        delete: 'Delete',
        editPrices: "Edit sectors' prices",
        priceMultipliers: 'Price multipliers for each sector:',
        save: 'Save',
        tickets: 'Tickets:',
        buy: 'Buy',
        screen: 'Screen'
    },
    zh: {
        chooseService: '选择场次：',
        movieTitle: '电影名称：',
        priceBase: '基础票价：',
        addNew: '新增场次',
        saveChanges: '保存修改',
        delete: '删除',
        editPrices: '编辑区域价格',
        priceMultipliers: '各区域价格倍率：',
        save: '保存',
        tickets: '已选座位：',
        buy: '购买',
        screen: '银幕'
    }
};

let currentLang = 'en';

function applyLanguage(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.documentElement.setAttribute('lang', lang);
    const btn = document.getElementById('lang-toggle');
    btn.textContent = lang === 'en' ? '中文' : 'English';
}

document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    applyLanguage(newLang);
});