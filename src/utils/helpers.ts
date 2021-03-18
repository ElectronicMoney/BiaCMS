import path from 'path'
import {FileFilterCallback} from 'multer'
import {API_URL} from '../config';

// Check fileType
export const checkFileExtention = (file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedFileExt = ['.jpeg', '.jpg','.png', '.gif'];
    const allowedMimeType = ['image/jpeg', 'image/jpg','image/png', 'image/gif'];

    // Get the file extention name
    const fileExtName = path.extname(file.originalname).toLocaleLowerCase()
    // Get the file mineType
    const mimeType = file.mimetype
    //  Check if file Extention Name is allowed
    if (allowedFileExt.includes(fileExtName) && allowedMimeType.includes(mimeType)) {
        return cb(null, true);
    } else {
        return cb({name: 'Wrong file extention', message: 'You can only upload an image file!'});
    }

}

// Post Parser
export const postParser = (post: any) => {
    let originalUrl:string = "";
    let generatedUrl:string = "";
    let postBody = post.body;

    post.mediaMetadata.forEach((metadata: { originalName: string, generatedName: string }) => {
        originalUrl  = metadata.originalName
        generatedUrl = `${API_URL}/static/images/posts/${metadata.generatedName}`
        /**
         * The over all concept is that in replace function of JavaScript 
         * we can not pass a variable to replace, we have to pass a regular expression – 
         * if we want to use a variable to replace we have to convert it to regularexpression.
         */
        let sRegExInput = new RegExp(originalUrl, "g");    
        postBody = postBody.replace(sRegExInput, generatedUrl); 

    });
    // return the post body 
    return postBody;
}