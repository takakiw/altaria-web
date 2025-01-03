import axios from 'axios'
import router from '../../router'
import JSONBIG from 'json-bigint'
import { useUserStore } from '../../store'

const userStore = useUserStore()

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI,
  timeout: 5000,
  transformResponse: [
    (data) => {
      const json = JSONBIG({
        storeAsString: true
      })
      const res = json.parse(data)
      return res
    }
  ],
  withCredentials: true, // 允许携带cookie
})

instance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token')
    if (!token) token = ''
    config.headers.Authorization = 'Bearer ' + token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


instance.interceptors.response.use(
  (response) => {
    if (response.data.code === 2010){
      localStorage.removeItem('token')
      userStore.resetUser()
    }
    const authorization = response.headers.getAuthorization()
    if (!authorization) return response
    let token = authorization.substring(7)
    if (token) {
      localStorage.setItem('token', token)
    }
    return response
  },
  (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }
    if (error.response.status === 401) {
      Message.error('请先登录账号')
      router.replace('/login')
    }
    if (error.response.status === 403) {
      Message.error('无操作权限')
    }
    return Promise.reject(error)
  }
)

export default instance
