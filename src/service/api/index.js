import instance from './instance.js' // 获取json

export async function get(url, params) {
  const response = await instance.get(url, { params })
  return response.data
}

export async function post(url, data) {
  const response = await instance.post(url, data)
  return response.data
}

export async function put(url, data) {
  const response = await instance.put(url, data)
  return response.data
}

export async function del(url, params) {
  const response = await instance.delete(url, { params })
  return response.data
}