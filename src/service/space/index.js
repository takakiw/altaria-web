import { get } from "../api";

export function getSpaceInfo(){
    return get('/space/info');
}