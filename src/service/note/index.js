import { del, get, post, put } from "../api";

export function getNoteList(cid, isPrivate){
    return get("/note/list", {cid, isPrivate})
}

export function getNoteInfo(id){
    return get("/note/" + id)
}

export function postCreateNote(title, text, isPrivate, cid){
    const data = {
        title,
        text,
        isPrivate,
        cid
    }
    return post("/note/create", data)
}


export function PutUpdateNote(id, title, text, isPrivate, cid){
    const data = {
        id
    }
    if(title){
        data.title = title
    }
    if(text){
        data.text = text
    }
    if(isPrivate !== null){
        data.isPrivate = isPrivate
    }
    if(cid){
        data.cid = cid
    }
    console.log(data);
    return put("/note/update" , data)
}

export function delNote(id){
    return del("/note/delete/" + id)
}

export function getPublicNoteInfoList(){
    return get("/note/public")
}

// Note Category
export function getNoteCategories(){
    return get("/note/category/list")
}

export function PostAddNoteCategory(name){
    const data = {
        name
    }
    return post("/note/category/add", data)
}

export function updateNoteCategory(id, name){
    const data = {
        id,
        name
    }
    return put("/note/category/update", data)
}

export function deleteNoteCategory(id){
    return del("/note/category/delete/" + id)
}

// Note Comment
export function getNoteCommentList(nid){
    return get("/note/comment/list/" + nid)
}

export function postAddNoteComment(nid, content, pid, toId){
    const data = {
        nid,
        content
    }
    if(pid){
        data.pid = pid
    }
    if(toId){
        data.toId = toId
    }
    return post("/note/comment/add", data)
}

export function deleteNoteComment(id){
    return del("/note/comment/delete/" + id)
}

export function getPublicNoteList(page, size){
    return get("/note/public/all", {page, size})
}