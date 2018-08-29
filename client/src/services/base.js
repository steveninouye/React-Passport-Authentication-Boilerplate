import 'isomorphic-fetch';

const AUTH_TOKEN_KEY = 'authtoken';  // localStorage sets item in key value pair so this will be the key
let authToken = '';  // original value of authToken which will be set below in setAuthToken function

// sets an the authorization token to localStorage
function setAuthToken(token) {
    // prepends 'Bearer' with space to the auth token
    // this format is needed for authentication with the BearerStrategy on the server
    authToken = `Bearer ${token}`;  
    if (localStorage) {
        localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    }
}

function clearAuthToken() {
    authToken = '';
    if (localStorage) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
}

// gets the authToken if the user has one and sets it as authToken in order to make authorized requests
function populateAuthToken() {
    if (localStorage) {
        let token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token && token !== null) {
            authToken = token;
        }
    }
}

// makes request to a url
function makeFetch(url, info) {
    return fetch(url, info);
}


// returns a promise of the response so that when this function is called no deconstruction is needed
// see 20 lines below for reference
function json(url, method = 'GET', payload = {}) {
    let data = {
        method,
        body: JSON.stringify(payload),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': authToken
        })
    };

    if (method === 'GET') {
        delete data.body; // GET methods are not allowed to have a body
    }

    return makeFetch(url, data)
        .then((response) => {
            if (response.ok) {
                let contentType = response.headers.get('Content-Type');

                if (contentType.indexOf('application/json') > -1) {
                    return response.json();
                }

                return response.statusText;
            }

            throw response;
        });
}

function get(url) {
    return json(url);
}

function post(url, payload) {
    return json(url, 'POST', payload);
}

function put(url, payload) {
    return json(url, 'PUT', payload);
}

// delete is a key word not able to be used as a variable/function so destroy is used instead
function destroy(url, payload) {
    return json(url, 'DELETE', payload);
}

export {
    setAuthToken,
    populateAuthToken,
    clearAuthToken,
    get,
    post,
    put,
    destroy,
    makeFetch
};