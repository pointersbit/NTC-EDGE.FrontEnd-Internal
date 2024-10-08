import React, {useEffect, useState} from "react";
import {Pressable, View, Text, InteractionManager, Platform, PermissionsAndroid, Alert} from "react-native";
import {fontValue} from "@pages/activities/fontValue";
import {DownloadIcon} from "@atoms/icon";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import {useToast} from "../../../../../hooks/useToast";
import {ToastType} from "@atoms/toast/ToastProvider";
import RNFetchBlob from "react-native-blob-util";

const PdfDownloadWeb = (props: { url: string; }) => {
    const {showToast}=useToast();
    const checkPermission = async () => {

        if (Platform.OS === 'ios') {
            onDownload();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        buttonNegative: undefined, buttonNeutral: undefined, buttonPositive: "",
                        title: 'Storage Permission Required',
                        message:
                            'Application needs access to your storage to download File'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    onDownload();
                } else {
                    showToast(ToastType.Error,'Storage Permission Not Granted')
                }
            } catch (err) {
                console.log("++++"+err);
            }
        }
    };


    const onDownload = async () => {
        const { dirs } = RNFetchBlob.fs;
        const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
        const configfb = {
            fileCache: true,
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title:  props.url.split('/').pop(),
            path: `${dirToSave}/${ props.url}`,
        }
        const configOptions = Platform.select({
            ios: {
                fileCache: configfb.fileCache,
                title: configfb.title,
                path: configfb.path,
                appendExt: 'pdf',
            },
            android: configfb,
        });

        RNFetchBlob.config(configOptions)
            .fetch('GET', props.url, {})
            .then((res) => {
                if (Platform.OS === "ios") {
                    RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64').then(()=> {
                        showToast(ToastType.Success,"File downloaded")
                    }).catch((e) => {

                        showToast(ToastType.Error,props.url?.split('/')?.pop() + " could not be written")
                    });
                    RNFetchBlob.ios.previewDocument(configfb.path);
                }
                //setisdownloaded(false)
                if (Platform.OS == 'android') {
                    showToast(ToastType.Success,"File downloaded")
                }
                console.log('The file saved to ', res);
            })
            .catch((e) => {
               // setisdownloaded(true)
                showToast(ToastType.Success,e.message);
                console.log('The file saved to ERROR', e.message)
            });
    }
    return <Pressable onPress={() => {
        checkPermission()
    }
    }>
        <View style={{flexDirection: "row"}}>
            <View style={{paddingRight: fontValue(10)}}>
                <DownloadIcon color={"#606A80"} height={fontValue(20)} width={fontValue(16)}/>
            </View>
            <Text style={requirementStyles.text}>Download</Text>
        </View>
    </Pressable>;
}

export default PdfDownloadWeb