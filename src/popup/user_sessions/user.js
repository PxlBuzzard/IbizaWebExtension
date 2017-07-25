class User {
    constructor(localStorage, sessionStorage, cookieStorage) {
        this.local = localStorage;
        this.session = sessionStorage;
        this.cookie = cookieStorage;
    }
}