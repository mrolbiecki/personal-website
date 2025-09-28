(function () {
    var storageKey = 'preferred-theme';
    var root = document.documentElement;

    function applyTheme(theme) {
        root.dataset.theme = theme;
        var toggle = document.querySelector('[data-theme-toggle]');
        if (toggle) {
            var isDark = theme === 'dark';
            toggle.textContent = isDark ? '☾' : '☀︎';
            toggle.setAttribute('aria-label', isDark ? 'Activate light mode' : 'Activate dark mode');
        }
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (err) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch (err) {
            /* ignore storage failures */
        }
    }

    var storedTheme = getStoredTheme();
    if (storedTheme && storedTheme !== root.dataset.theme) {
        root.dataset.theme = storedTheme;
    }

    if (!storedTheme && !root.dataset.theme && window.matchMedia) {
        root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (window.matchMedia) {
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', function (event) {
                if (!getStoredTheme()) {
                    applyTheme(event.matches ? 'dark' : 'light');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }

    function ready() {
        applyTheme(root.dataset.theme || 'light');
        var toggle = document.querySelector('[data-theme-toggle]');
        if (!toggle) {
            return;
        }
        toggle.addEventListener('click', function () {
            var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            setStoredTheme(next);
        });
    }
})();
