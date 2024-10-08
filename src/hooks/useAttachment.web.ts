import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import {isMobile} from "@pages/activities/isMobile";

const useAttachmentPicker = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentResult | ImagePicker.ImagePickerResult | object>({});
  
  const pickDocument = async () => {
    let result:any = await DocumentPicker.getDocumentAsync({
      type: [
        'application/msword',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'text/csv',
      ],
      copyToCacheDirectory: true,
    });
    if (result.type === 'success') {
      setSelectedFile(result)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      presentationStyle: 0,
    });

    console.log(result);

    if (!result.cancelled) {
      let uri = result?.uri;
      let split = uri?.split('/');
      let name = split?.[split?.length - 1];
      let mime=uri?.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      let mimeResult:any=null;
      if(mime&&mime.length){
        mimeResult=mime[1];
      }
      let mimeType=mimeResult?.split("/")?.[1];
      const file = {
        name,
        mimeType: 'application/octet-stream',
        uri,
      };

      setSelectedFile(file)
    }
  };


  return {
    selectedFile,
    pickDocument,
    pickImage,
  };
}

export default useAttachmentPicker;