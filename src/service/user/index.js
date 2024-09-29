import { get, post, put } from "../api";

export function postLoginByPassword(userName, password) {
    return post("/user/login/login", { userName, password });
}

export function postLoginByEmail(email, code) {
    return post("/user/login/login", { email, code });
}

export function getCode(email, type) {
    const data = {email: email};
    if (type) {
        data.type = type;
    }
    return get("/user/login/code",  data );
}

export function postRegister(userName, password, email, code) {
    return post("/user/login/register", { userName, password, email, code });
}

export function getUserInfo(id) {
    return get("/user/user/"+String(id));
}

export function putUpdateUserInfo(id, data) {
    return put("/user/user/"+String(id), data);
}

export function putUpdateUserPassword(id, oldPassword, newPassword) {
    return put("/user/password/"+String(id), { oldPassword, newPassword });
}