import React, {useState} from "react";
import {StyleSheet, View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions} from "react-native";
import { InputField } from "@components/molecules/form-fields";
import {Feather, Ionicons} from "@expo/vector-icons";
import {DECLINED} from "../../../reducers/activity/initialstate";
import AwesomeAlert from "react-native-awesome-alerts";
import useKeyboard from 'src/hooks/useKeyboard';

const { height } = Dimensions.get('window');

function Disapproval(props:any) {
  const [showAlert, setShowAlert] = useState(false)
    const [text, setText] = useState("")
    const isKeyboardVisible = useKeyboard();
   return (
       <View style={props.visible ? {
           position: "absolute",
           zIndex: 2,
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           backgroundColor: "rgba(0, 0, 0, 0.5)",
       } : {}}>
           <Modal
               animationType="slide"
               transparent={true}
               visible={props.visible}

               onRequestClose={() => {
               }}>
               <AwesomeAlert
                   show={showAlert}
                   showProgress={false}
                   title="Confirm?"
                   message={`are you sure you want to decline ` + props?.user?.firstName + " " +  props?.user?.lastName }
                   messageStyle={{ textAlign: 'center' }}
                   closeOnTouchOutside={true}
                   closeOnHardwareBackPress={false}
                   showCancelButton={true}
                   showConfirmButton={true}
                   cancelText="Cancel"
                   confirmText="Yes"
                   confirmButtonColor="#DD6B55"
                   onCancelPressed={() => {
                       setShowAlert(false)
                   }}
                   onConfirmPressed={() => {
                       props.onChangeApplicationStatus(DECLINED)
                       props.onDismissed()
                       setShowAlert(false)
                   }}
               />
               <KeyboardAvoidingView
                   behavior={Platform.OS === "ios" ? "padding" : "height"}
                   style={styles.container}
               >
                   <View style={styles.rectFiller}></View>
                   <View style={styles.rect}>
                       <View style={{ padding: 10 }}>
                           <TouchableOpacity onPress={()=>{
                               props.onDismissed()
                           }}>
                               <Ionicons name="md-close" style={styles.icon}/>
                           </TouchableOpacity>
                       </View>
                       <View
                           style={{
                               flexDirection: 'row',
                               alignItems: 'center',
                               paddingHorizontal: 20
                           }}
                       >
                           <Feather
                               name="file-text"
                               style={styles.icon2}
                           />
                           <View style={styles.nodRemarksColumn}>
                               <Text style={styles.nodRemarks}>NOD/Remarks</Text>
                               <Text style={styles.pleaseProvide}>
                                   Please provide reason of disapproval
                               </Text>
                           </View>
                       </View>
                       <View style={{ paddingHorizontal: 20 }}>
                           <InputField
                               style={{ fontWeight: 'normal' }}
                               outlineStyle={{
                                   borderColor: "rgba(202,210,225,1)",
                                   paddingTop: 5,
                                   height: (height < 720 && isKeyboardVisible) ? 100 : height * 0.25
                               }}
                               placeholder={'Remarks'}
                               multiline={true}
                               value={text}
                               onChangeText={setText}
                           />
                       </View>
                       <View style={{ padding: 20, paddingBottom: 25 }}>
                           <TouchableOpacity onPress={() => {
                               props.remarks(text)
                               setShowAlert(true)
                           }}>
                               <View style={styles.confirmButton}>
                                   <Text style={styles.confirm}>Confirm</Text>
                               </View>
                           </TouchableOpacity>
                       </View>
                   </View>
               </KeyboardAvoidingView>
           </Modal>
       </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    group3Filler: {
        flex: 1
    },
    group3: {
        width: "100%",
        height: 540
    },
    rectFiller: {
        flex: 1
    },
    rect: {
        borderRadius: 15,
        width: "100%",
        backgroundColor: "rgba(255,255,255,1)",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    icon: {
        color: "rgba(0,0,0,1)",
        fontSize: 30,
        marginLeft: 4
    },
    group: {
        width: 232,
        height: 35,
        marginTop: 12
    },
    icon2: {
        color: "rgba(53,62,89,1)",
        fontSize: 30
    },
    nodRemarks: {
        color: "#363f59",
        textAlign: "left",
        fontSize: 18,
        marginLeft: -1
    },
    pleaseProvide: {

        color: "#121212",
        fontSize: 12,
        marginLeft: -1
    },
    nodRemarksColumn: {
        marginLeft: 6
    },
    icon2Row: {
        height: 35,
        flexDirection: "row"
    },
    rect2: {

        width: 355,
        height: 290,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(218,218,222,1)",
        borderRadius: 8,
        marginTop: 12,
        marginLeft: 1
    },
    iconColumn: {

        width: 340,
        marginTop: 14,
        marginLeft: 17
    },
    iconColumnFiller: {
        flex: 1
    },
    group2: {
        width: 340,
        height: 40,
        marginBottom: 94,
        marginLeft: 17
    },
    rect3: {
        width: 340,
        height: 40,
        backgroundColor: "rgba(47,91,250,1)",
        borderRadius: 9
    },
    confirm: {
        color: "rgba(255,255,255,1)",
    },
    confirmButton: {
        backgroundColor: "#2f5cfa",
        borderRadius: 6,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Disapproval;
