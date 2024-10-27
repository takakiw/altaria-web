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

// 获取用户信息
export function getUserInfo(id) {
    return get("/user/info/"+String(id));
}

export function getCodeByEmail(email) {
    return get("/user/code", { email });
}

// 更新用户信息
export function putUpdateUserInfo(data) {
    return put("/user/update", data);
}

// 上传头像
export function postUploadAvatar(file) {
    const formData = new FormData();
    formData.append("file", file)
    return post("/user/uploadAvatar", formData);
}