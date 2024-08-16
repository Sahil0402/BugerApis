import * as cookie from "./cookie_utils.js";
function getHeaders(){
    let headers = new Headers();
    let token = cookie.getCookie('jwtToken');
    headers.append('Authorization',`Bearer ${token}`);
    headers.append('Content-type',`application/json`);
    return headers;
}
function getUserId(){
    return cookie.getCookie("userId");
}

export {
    getHeaders,
    getUserId
}