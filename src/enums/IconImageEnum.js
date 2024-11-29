const IconImageEnum = {
    0: "DIRECTORY",
    1: "IMAGE",
    2: "VIDEO",
    3: "AUDIO",
    4: "PDF",
    5: "WORD",
    6: "EXCEL",
    7: "TEXT",
    8: "OTHER"
}

const IconURL = {}
IconURL.DIRECTORY = "/public/icon-image/dir.ico"
IconURL.IMAGE = '/public/icon-image/image.ico'
IconURL.VIDEO = '/public/icon-image/video.ico'
IconURL.AUDIO = '/public/icon-image/audio.ico'
IconURL.PDF = '/public/icon-image/pdf.ico'
IconURL.WORD = '/public/icon-image/word.ico'
IconURL.EXCEL = '/public/icon-image/excel.ico'
IconURL.TEXT = '/public/icon-image/text.ico'
IconURL.OTHER = '/public/icon-image/other.ico'

export const getIconImage = (type) => {
    return IconURL[type] || IconURL.OTHER
}

export default IconImageEnum