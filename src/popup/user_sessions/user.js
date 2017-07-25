class User {
    constructor() {
        this.dict = {local: null, session: null, cookie: null};
    }
    
    //Set local storage
    setLocalStorage(localStorage) {
        this.dict["local"] = localStorage;
    }

    //Set session storage
    setSessionStorage(sessionStorage) {
        this.dict["session"] = sessionStorage;
    }

    //Set cookie storage
    setCookieStorage(cookieStorage) {
        this.dict["cookie"] = cookieStorage;
    }

    //Get storage table
    get getStorageTable() {
        return this.dict;
    }

}