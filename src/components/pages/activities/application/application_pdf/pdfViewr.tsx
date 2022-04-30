import Pdf from "react-native-pdf";
import {View,Text} from "react-native";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";
import WebView from "react-native-webview";
import {Bold} from "@styles/font";


const PdfViewr=(props:{requirement:any,extension:any})=>{

    const extension=props?.requirement?.substring(props.requirement.lastIndexOf('.')+1,props.requirement.length)||props.requirement;

    return extension=="pdf" ? <View style={{flex:1, alignItems: "center", justifyContent: "center",  }}><Pdf  cache={true} style={requirementStyles.pdf}
                                                                                                              source={{uri:props.requirement,}}/><Text style={{position: "absolute", textAlign: "center", color: "#fff", fontFamily: Bold, fontSize: 18}}>{"Loading..."}</Text></View> :
           <WebView   style={requirementStyles.pdf} originWhitelist={['*']}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     source={{uri:'https://docs.google.com/gview?url='+props.requirement+'&embedded=true'}}
                    />
        ;
};

export default PdfViewr