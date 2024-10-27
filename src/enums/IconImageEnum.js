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
IconURL.DIRECTORY = "/src/assets/icon-image/dir.ico"
IconURL.IMAGE = '/src/assets/icon-image/image.ico'
IconURL.VIDEO = '/src/assets/icon-image/video.ico'
IconURL.AUDIO = '/src/assets/icon-image/audio.ico'
IconURL.PDF = '/src/assets/icon-image/pdf.ico'
IconURL.WORD = '/src/assets/icon-image/word.ico'
IconURL.EXCEL = '/src/assets/icon-image/excel.ico'
IconURL.TEXT = '/src/assets/icon-image/text.ico'
IconURL.OTHER = '/src/assets/icon-image/other.ico'

export const getIconImage = (type) => {
    return IconURL[type] || IconURL.OTHER
}

export default IconImageEnum