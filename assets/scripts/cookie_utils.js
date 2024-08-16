function setCookie(name, value, hours, secure = true) {
    let expires = "";
    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); 
        expires = "; expires=" + date.toUTCString();
    }
    const cookieString = `${name}=${encodeURIComponent(value)}${expires}; path=/` +
        (secure ? "; Secure" : "") + 
        "; SameSite=Strict"; 
    document.cookie = cookieString;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift()).trim().replace(/"/g, '');;
}

function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Strict`;
}

export {
    setCookie,
    getCookie,
    deleteCookie
};