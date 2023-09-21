const multer = require("multer")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        let uploadFolder = ""
        const uploadType = req.body.uploadType
        const userId = req.params.uid

        if (uploadType === "profile") {
            uploadFolder = "profiles"
        } else if (uploadType === "product") {
            uploadFolder = "products"
        } else if (uploadType === "document") {
            uploadFolder = "documents"
        }

        const userFolder = `${__dirname}/../files/${uploadFolder}/${userId}`
        
        if (!fs.existsSync(userFolder)) {fs.mkdirSync(userFolder)}

        cb(null, userFolder)
    },
    filename: function(req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const fileFilter = function(req, file, cb) {
    const validDocumentNames = [
        "Identificacion",
        "Comprobante de domicilio",
        "Comprobante de estado de cuenta"
    ]
    const validExtensions = [".jpg", ".jpeg", ".png", ".pdf"]

    const uploadType = req.body.uploadType
    if (uploadType === "document") {
        const fileName = file.originalname.split(".")
        const fileBaseName = fileName.slice(0, -1).join(".")
        const fileExtension = `.${fileName.pop()}`

        if (
            validDocumentNames.includes(fileBaseName) &&
            validExtensions.includes(fileExtension)
        ) {
            cb(null, true)
        } else {
            cb(new Error("Nombre de archivo o extensión no válidos para la carga de documentos"), false);
        }
    } else {
        cb(null, true)
    }
}

const uploader = multer({
    storage,
    fileFilter,
    onError: function(err, next){
        console.log(err)
        next()
    }
})

module.exports = {
    uploader
}