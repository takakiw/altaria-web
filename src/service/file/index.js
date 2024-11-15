import axios from "axios"
import {get, post, put, del} from "../api"

// 上传文件
export function postUploadFile(fid, pid, file, filename, type, md5, index, total){
    const data = new FormData()
    data.append('fid', fid)
    data.append('pid', pid)
    data.append('file', file)
    data.append('fileName', filename)
    data.append('type', type)
    data.append('md5', md5)
    data.append('index', index)
    data.append('total', total)
    return post("/file/file/upload", data)
}

// 下载文件
export function getDownloadSignUrl(id){
    return get("/file/file/download/sign/" + id)
}

// 创建文件夹
export function postCreateFolder(pid, name){
    const data = {
        pid: pid,
        fileName: name
    }
    return post("/file/file/mkdir", data)
}

// 移动文件
export function putMoveFile(oldPid, pid, ids){
    const data = {
        oldPid: oldPid,
        pid: pid,
        ids: ids
    }
    return put("/file/file/mvfile", data)
}

// 重命名文件
export function putRenameFile(id, name){
    const data = {
        id: id,
        fileName: name
    }
    return put("/file/file/rename", data)
}

// 获取文件列表
export function getFileList(id, type, fileName, order){
    const params = {}
    if(id != undefined){
        params.id = id
    }
    if(type != undefined){
        params.type = type
    }
    if(fileName != undefined){
        params.fileName = fileName
    }
    if(order != undefined){
        params.order = order
    }
    return get("/file/file/list", params)
}

// 获取文件路径
export function getFilePath(path){
    return get("/file/file/path", { path })
}
// 删除文件
export function delFile(ids){
    return del("/file/file/del/" + ids)
}

// 彻底删除文件
export function removeFile(ids){
    return del("/file/file/remove/" + ids)
}

// 恢复文件
export function putRestoreFile(ids){
    return put("/file/file/restore/" + ids)
}

// 获取回收站文件列表
export function getRecycleList(){
    return get("/file/file/recycle/list")
}


// 获取文件签名链接
export function getFileSignUrl(id, category){
    return get("/preview/sign/" + id, {category: category})
}

export function getFileBlob(url){
    return axios.get(url, {responseType: 'blob'});
}

export function delUploadFile(id){
    return del("/file/file/delUpload/" + id);
}