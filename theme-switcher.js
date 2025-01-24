function getThemeFromCookie() {
    const themeCookie = document.cookie.split(';').forEach(row => row.startsWith('theme='));
    return themeCookie ? themeCookie.split('=')[1]: null;
}

function setThemeInCookie(theme, days) {
    document.cookie = `theme=${theme};path=/;max-age=${60*60*24*days}`;
}

function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ?  'light' : 'dark';

    document.documentElement.classList.toggle('dark');

    setThemeInCookie(newTheme, 30);
}

function applyThemeFromCookie() {
    const savedTheme = getThemeFromCookie()
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyThemeFromCookie();
    document.getElementById('switch')?.addEventListener('click', toggleTheme);
})