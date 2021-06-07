window._ = require('lodash');

const lang_ar = {
    'messages': require('./components/langs/ar/messages')
};
const lang_en = {
    'messages': require('./components/langs/en/messages')
};

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

/** configs **/
localStorage.setItem('host', "http://ecommerce.local/");
localStorage.setItem('api_extension', "api");
localStorage.setItem('api_password', "e8tGHfbfIwJ5Yp0XNpK21QIHFAC");

/************ helper functions ****************/
window.__ = (wordKey, file) => {
    if(localStorage.getItem('lang') == 'ar') {
        if(lang_ar[file]) {
            return lang_ar[file].default[wordKey] || wordKey;
        } else {
            return 'The lang file is invalid';
        }
    } else {
        if(lang_en[file]) {
            return lang_en[file].default[wordKey] || wordKey;
        } else {
            return 'The lang file is invalid';
        }
    }
}
window.getQueryParam = (paramName) => {
    let url = decodeURI(window.location.href);
    let paramStart = url.search(paramName + "=") + paramName.length + 1;
    let paramEnd = 0;
    let paramVal = "";

    if(paramStart !== -1) {
        paramEnd = url.slice(paramStart).search('&');
        if(paramEnd === -1) {
            paramVal = url.slice(paramStart);
        } else {
            paramVal = url.slice(paramStart, paramEnd + paramStart);
        }
    } else {
        return "null";
    }
    return paramVal;
}











