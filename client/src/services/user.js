import * as baseService from './base';

let loggedIn = false;

function isLoggedIn() {
    return loggedIn;
}

// checks if user is logged in using the 'me' function below
function checkLogin() {
    if (loggedIn) {
        return Promise.resolve(true);
    } else {
        baseService.populateAuthToken();
        return me()
        .then((user) => {
            loggedIn = true;
            return Promise.resolve(true);
        }).catch(() => {
            return Promise.resolve(false);
        });
    }
}

// logs user in
// server will check if the email and password match
function login(email, password) {
    return baseService.makeFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then((response) => {
        if (response.ok) {
            return response.json()
            .then((jsonResponse) => {
                baseService.setAuthToken(jsonResponse.token); // sets authToken in localStorage
                loggedIn = true;
            });
        } else if (response.status === 401) {
            return response.json()
            .then((jsonResponse) => {
                throw jsonResponse;
            });
        }
    });
}

function logout() {
    baseService.clearAuthToken(); // removes authToken from localStorage
    loggedIn = false;
}

function me() {
    return baseService.get('/api/users/me');
}

export { isLoggedIn, checkLogin, login, logout };
