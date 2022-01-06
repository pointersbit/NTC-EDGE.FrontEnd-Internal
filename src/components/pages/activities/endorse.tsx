import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity, Modal, Alert, Platform, KeyboardAvoidingView, Dimensions} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Dropdown from "@atoms/dropdown";
import { InputField } from "@components/molecules/form-fields";
import axios from "axios";
import EndorseToIcon from "@assets/svg/endorseTo";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";
import {DIRECTOR, EVALUATOR, FOREVALUATION} from "../../../reducers/activity/initialstate";
import AwesomeAlert from "react-native-awesome-alerts";
import useKeyboard from 'src/hooks/useKeyboard';

const { height } = Dimensions.get('window');

function Endorsed(props:any) {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedEndorsed, setPickedEndorsed] = useState<any[]>()
    const [text, setText] = useState("")
    const [endorsed, setEndorsed] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const isKeyboardVisible = useKeyboard();

    useEffect(()=>{
        axios.get(BASE_URL + '/users' ,
            {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }).then((response)=>{
            const filterResponse = [...response.data].filter((item) =>{
                return ([DIRECTOR].indexOf(item?.role?.key) != -1)
            })

            const res = filterResponse.map((item) =>{
                return {value: item._id, label: item.firstName + " " + item.lastName}
            })

            setPickedEndorsed(res)
            if(res){
                setEndorsed(res[0]?.value)
            }

        })
    }, [])
    const onEndorseConfirm = () => {
        props.remarks({ endorseId: endorsed, remarks: text })
       setShowAlert(true)

    }

    return (
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
                message={`are you sure you want to endorse to ` +  pickedEndorsed?.find(picked => {
                    return picked.value == endorsed
                })?.label}
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
                    props.onChangeApplicationStatus({status: FOREVALUATION })
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
                    <View style={styles.iconColumn}>
                        <TouchableOpacity onPress={()=>{
                            props.onDismissed()
                        }}>
                            <Ionicons name="md-close" style={styles.icon}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
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
                                style={{ width: '100%' }}
                                value={endorsed}
                                onChangeValue={(value: any) => {
                                    setEndorsed(value)}
                                }
                                placeholder={{}}
                                items={pickedEndorsed}
                            />
                        </View>
                        <InputField
                            style={{ fontWeight: 'normal' }}
                            outlineStyle={{
                                borderColor: "rgba(202,210,225,1)",
                                paddingTop: 5,
                                height: (height < 720 && isKeyboardVisible) ? 75 : height * 0.25
                            }}
                            placeholder={'Remarks'}
                            multiline={true}
                            value={text}
                            onChangeText={setText}
                        />
                    </View>
                    <View
                        style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 25, }}
                    >
                        <TouchableOpacity onPress={() =>{
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
        marginTop:  9,
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
        backgroundColor: "#2f5cfa",
        borderRadius: 6,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Endorsed;
