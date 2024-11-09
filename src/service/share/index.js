import { del, get, post } from "../api";

// @PostMapping("/create")
export function postCreateShare(data){
    return post("/share/create", data)
}

// @GetMapping("/sign/{shareId}")
export function getSignUrl(shareId, sign){
    const params = {}
    if(sign){
        params.sign = sign
    }
    return get("/share/sign/" + shareId, params)
}

//@GetMapping("/urlList")
export function getShareList(){
    return get("/share/urlList")
}

// @DeleteMapping("/cancel/{shareIds}")
export function delCancelShare(shareIds){
    return del("/share/cancel/" + shareIds)
}

//  @GetMapping("/info/{shareId}")
export function getShareInfo(shareId){
    return get("/share/info/" + shareId)
}

//@GetMapping("/list/{shareId}")
export function getShareFileList(shareId, path){
    const params = {}
    if(path){
        params.path = path
    }
    return get("/share/list/" + shareId, params)
}

// @GetMapping("/path/{shareId}/{path}")
export function getSharePathInfo(shareId, path){
    return get("/share/path/" + shareId, {path: path})
}

// @GetMapping("/download/{shareId}/{fid}")
export function getShareDownloadUrl(shareId, fid){
    return get("/share/download/" + shareId + "/" + fid)
}

// @GetMapping("/preview/{shareId}/{fid}")
export function getSharePreviewUrl(shareId, fid, category){
    const params = {}
    if(category){
        params.category = category
    }
    return get("/share/preview/" + shareId + "/" + fid, params)
}

// @PostMapping("/save/{shareId}")
export function PostSaveShareFileToMyDisk(shareId, fids, toMyPath){
    return post("/share/save/" + shareId, {fids: fids, path: toMyPath})
}