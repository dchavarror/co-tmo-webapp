import { Injectable } from "@angular/core";
@Injectable()
export class Utils{

    convertBase64ToBlobURL(documento){
        const b64toBlob = (documento, contentType='', sliceSize=512) => {
            const byteCharacters = atob(documento);
            const byteArrays = [];
          
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              const slice = byteCharacters.slice(offset, offset + sliceSize);
          
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
          
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
          
            const blob = new Blob(byteArrays, {type: contentType});
            return blob;
          }
          const blob = b64toBlob(documento, 'application/pdf');
          const blobUrl = URL.createObjectURL(blob);

          return blobUrl;
    }
 
}