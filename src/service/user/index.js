import { get, post, put } from "../api";

export function postLoginByPassword(username, password) {
    return post("/user/login/login", { username, password });
}

export function postLoginByEmail(email, code) {
    return post("/user/login/login", { email, password: code });
}

export function getCode(email) {
    return get("/user/login/code", { email });
}