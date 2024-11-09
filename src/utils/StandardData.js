export const dateTimeToStandard = (dateTime) => {
    if(dateTime === undefined) {
        return ''
    }
    return dateTime.replace('T',' ')
}

export const getShareExpireTime = (expireTime) => {
    const now = new Date();
    let expireDate;

    if (expireTime == 1) {
        expireDate = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 加一天
    } else if (expireTime == 2) {
        expireDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 加七天
    } else if (expireTime == 3) {
        expireDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 加三十天
    }
    // 使用UT +8:00时区
    expireDate.setHours(expireDate.getHours() + 8)
    return expireDate.toISOString()
}

export const getShareShowExpireTime = (expireTime, notShowColor) => {
    const now = new Date();
    const expireDate = new Date(expireTime);
    const remainingTime = expireDate.getTime() - now.getTime();
    const remainingDays = Math.floor(remainingTime/24/60/60/1000);
    const remainingHours = Math.floor((remainingTime/1000 - remainingDays*24*60*60)/3600);
    const remainingMinutes = Math.floor((remainingTime/1000 - remainingDays*24*60*60 - remainingHours*3600)/60);
    if(!notShowColor){
        if(remainingDays > 0) {
            return "<span>"+ remainingDays + "天后过期</span>"
        } 
        if(remainingHours > 0) {
            return "<span style='color:orange'>"+ remainingHours + "小时后过期</span>"
        }
        return "<span style='color:red'>"+ remainingMinutes + "分钟后过期</span>"
    }
    if(remainingDays > 0) {
        return remainingDays + "天后过期"
    } 
    if(remainingHours > 0) {
        return remainingHours + "小时后过期"
    }
    return remainingMinutes + "分钟后过期"
}
        


export const getTransformStatus = (status) => {
    if(status === 1){
        return "转码中"
    }
    if(status === 2){
        return "转码失败"
    }
    return "转码完成"
}

export const sizeToStandard = (size) => {
    if(size === undefined) {
        return ''
    }
    if(size < 1024) {
        return size + 'B'
    } else if(size < 1048576) {
        return (size/1024).toFixed(2) + 'KB'
    } else if(size < 1073741824) {
        return (size/1048576).toFixed(2) + 'MB'
    } else {
        return (size/1073741824).toFixed(2) + 'GB'
    }
}

// 获取过期时间
export const getExpireTime = (updateTime) => {
    // 判断update是否在30天之内的剩余时间
    
    // 获取30天前的时间
    const thirtyDaysAgo = new Date(new Date().getTime() - 30*24*60*60*1000)
    // 获取updateTime的时间
    const updateDate = new Date(updateTime)
    // 计算剩余时间
    const remainingTime = updateDate.getTime() - thirtyDaysAgo.getTime()
    // 计算剩余天数
    const remainingDays = Math.floor(remainingTime/24/60/60/1000)
    if(remainingDays > 0) {
        return remainingDays + '天后过期'
    } 
    // 计算剩余小时数
    const remainingHours = Math.floor((remainingTime/1000 - remainingDays*24*60*60)/3600)
    if(remainingHours > 0) {
        return remainingHours + '小时后过期'
    }
    // 计算剩余分钟数
    const remainingMinutes = Math.floor((remainingTime/1000 - remainingDays*24*60*60 - remainingHours*3600)/60)
    return remainingMinutes + '分钟后过期'
}

export const getShareUrl = (url, password) => {
    return "链接: " + url + " 密码: " + password
}

export const getSignName = (name) => {
    if(name === undefined) {
        return ''
    }
    return name.substring(0, 1) + '***'
}