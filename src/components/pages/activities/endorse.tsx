import React, {useEffect, useState} from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Dropdown from "@atoms/dropdown";
import {InputField} from "@components/molecules/form-fields";
import axios from "axios";
import EndorseToIcon from "@assets/svg/endorseTo";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import {DIRECTOR, FOREVALUATION} from "../../../reducers/activity/initialstate";
import useKeyboard from 'src/hooks/useKeyboard';
import {errorColor} from "@styles/color";
import CustomAlert from "@pages/activities/alert/alert";

const {height, width} = Dimensions.get('window');

function Endorsed(props: any) {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedEndorsed, setPickedEndorsed] = useState<any[]>()
    const [text, setText] = useState("")
    const [endorsed, setEndorsed] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const isKeyboardVisible = useKeyboard();
    const [message, setMessage] = useState("")
    const [validateRemarks, setValidateRemarks] = useState<{ error: boolean }>({error: false})
    useEffect(() => {
        let isCurrent = true
        axios.get(BASE_URL + '/users',
            {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }).then((response) => {
            const filterResponse = [...response.data].filter((item) => {
                return ([DIRECTOR].indexOf(item?.role?.key) != -1)
            })

            const res = filterResponse.map((item) => {
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            if (isCurrent) setPickedEndorsed(res)
            if (res) {
                if (isCurrent) setEndorsed(res[0]?.value)
            }

        })
        return () => {
            isCurrent = false
        }
    }, [])
    const onEndorseConfirm = () => {

        setMessage(`` + pickedEndorsed?.find(picked => {
            return picked.value == endorsed
        })?.label)
        props.remarks({endorseId: endorsed, remarks: text, message})

        setShowAlert(true)

    }
    const onCancelPress = () =>{
        setTitle(  "Endorse Application to" )
        if(showClose){
            setShowAlert(false)
            setShowClose(false)

            props.onDismissed()
        } else{
            setShowClose(false)
            setShowAlert(false)
            props.onModalDismissed()
        }
    }



    const [alertLoading, setAlertLoading] = useState(false)
    const [showClose, setShowClose] = useState(false)
    const [title, setTitle] = useState("Endorse Application to")

    return (
        <Modal

            animationType="slide"
            transparent={true}
            visible={props.visible}

            onRequestClose={() => {
            }}>
            <View style={showAlert ? {
                zIndex: 1,
                flex: 1,
                width: width,
                height: height,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                backgroundColor: 'rgba(52,52,52,0.5)'
            } : {}}>

            </View>

            <CustomAlert

                showClose={showClose}
                type={FOREVALUATION}
                onDismissed={onCancelPress}
                onLoading={alertLoading}
                onCancelPressed={onCancelPress}
                confirmButton={"Proceed"}
                onConfirmPressed={() => {

                    setAlertLoading(true)

                    props.onChangeApplicationStatus({
                        status: FOREVALUATION,
                        id: endorsed,
                        remarks: text
                    }, (bool, callback: (bool) => {}) => {

                        setAlertLoading(false)
                        setShowClose(true)
                        callback(true)

                        setTitle("Application has been endorsed to")

                    })


                }} show={showAlert} title={ title}
                message={message}/>
            {/*<AwesomeAlert
                    actionContainerStyle={alertStyle.actionContainerStyle}
                    overlayStyle = {showAlert ? alertStyle.overlayStyle: {}}
                    confirmButtonColor="#fff"
                    titleStyle={alertStyle.titleStyle}
                    contentContainerStyle={alertStyle.contentContainerStyle}
                    confirmButtonTextStyle={alertStyle.confirmButtonTextStyle}
                    cancelButtonColor="#fff"
                    cancelButtonTextStyle={alertStyle.cancelButtonTextStyle}
                    show={showAlert}
                    showProgress={false}
                    title="Confirm?"
                    message={message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Cancel"
                    confirmText="Proceed"
                    onCancelPressed={() => {
                        setShowAlert(false)
                    }}
                    onConfirmPressed={() => {
                        props.onChangeApplicationStatus({status: FOREVALUATION }, (bool, callback:(bool) =>{}) =>{
                            setShowAlert(false)

                                props.onDismissed()
                                callback(true)

                        })


                    }}
                />*/}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container]}
            >
                <View style={styles.rectFiller}></View>
                <View style={styles.rect}>
                    <View style={styles.iconColumn}>
                        <TouchableOpacity onPress={() => {
                            setValidateRemarks({error: false})
                            props.onDismissed()
                        }}>
                            <Ionicons name="md-close" style={styles.icon}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal: 20}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <EndorseToIcon style={styles.icon2}/>
                            <Text style={styles.endorseTo}>Endorse to</Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: "rgba(255,255,255,1)",
                                borderWidth: 1,
                                borderColor: "rgba(202,210,225,1)",
                                borderRadius: 6,
                                padding: 10,
                                width: '100%',
                            }}
                        >
                            <Dropdown
                                style={{width: '100%'}}
                                value={endorsed}
                                onChangeValue={(value: any) => {
                                    setEndorsed(value)
                                }
                                }
                                placeholder={{}}
                                items={pickedEndorsed}
                            />
                        </View>
                        <InputField
                            style={{fontWeight: 'normal'}}
                            outlineStyle={{
                                borderColor: "rgba(202,210,225,1)",
                                paddingTop: 5,
                                height: (height < 720 && isKeyboardVisible) ? 75 : height * 0.25
                            }}
                            error={validateRemarks.error}
                            errorColor={errorColor}
                            placeholder={'Remarks'}
                            multiline={true}
                            value={text}
                            onChangeText={(text: string) => {

                                setText(text)
                            }}
                        />
                    </View>
                    <View
                        style={{width: '100%', paddingHorizontal: 20, paddingBottom: 25,}}
                    >
                        <TouchableOpacity onPress={() => {

                            onEndorseConfirm()
                        }}>
                            <View style={styles.confirmButton}>
                                <Text style={styles.confirm}>Confirm</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rectFiller: {
        flex: 1
    },
    rect: {
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    icon: {
        color: "rgba(128,128,128,1)",
        fontSize: 25,
        paddingHorizontal: 10,
    },
    group: {
        width: 138,
        height: 30,
        flexDirection: "row",
        marginTop: 17
    },
    icon2: {
        color: "rgba(128,128,128,1)",
        fontSize: 30
    },
    endorseTo: {
        color: "#121212",
        fontSize: 20,
        marginLeft: 12,
        marginTop: 3
    },
    icon2Row: {
        height: 30,
        flexDirection: "row",
        flex: 1
    },
    rect5: {
        width: 355,
        height: 50,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(202,210,225,1)",
        borderRadius: 6,
        padding: 5,
        marginTop: 9,
    },
    iconColumn: {
        width: '100%',
        marginTop: 10,
    },
    iconColumnFiller: {
        flex: 1
    },
    rect6: {
        paddingHorizontal: 15,
        marginBottom: 90,
        width: '100%',
    },
    confirm: {
        color: "rgba(255,255,255,1)",
    },
    confirmButton: {
        paddingVertical: 16,
        backgroundColor: "##031A6E",
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Endorsed;
