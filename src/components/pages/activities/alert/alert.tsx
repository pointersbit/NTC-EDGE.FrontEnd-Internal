import React from "react";
import {ActivityIndicator, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import {alertStyle} from "@pages/activities/alert/styles";
import CloseModal from "@assets/svg/closeModal";
import {APPROVED, DECLINED, FOREVALUATION} from "../../../../reducers/activity/initialstate";
import EndorseToIcon from "@assets/svg/endorseTo";
import ApplicationApproved from "@assets/svg/application-approved";
import {useAlert} from "@pages/activities/hooks/useAlert";

const {width} = Dimensions.get('window');

function CustomAlert(props) {
    const {springValue, _springHide} = useAlert(props.show, props.onDismissed);
    return (
        <Modal
            supportedOrientations={['portrait', 'landscape']}
            animationType="none"
            transparent={true}
            visible={props.show}
            onRequestClose={() => {
                _springHide()
            }}
        >
            <Animated.View style={[ { transform: [{ scale: !props.onLoading ? springValue : 1}] }]}>
                <View style={styles.group}>
                    <View style={styles.container___}>
                        <View style={styles.container__}>

                            <View style={[styles.container_, {padding: "5%"}]}>
                                {
                                    props?.type == DECLINED && <View>
                                        <CloseModal></CloseModal>
                                    </View>

                                }
                                {
                                    props?.type == FOREVALUATION && <View>
                                        <EndorseToIcon height_={60} width_={60} color={"#2863D6"}></EndorseToIcon>
                                    </View>
                                }
                                {
                                    props?.type == APPROVED && <View>
                                        <ApplicationApproved/>
                                    </View>
                                }
                                <Text style={[styles.title, alertStyle.titleStyle]}>{props?.title}</Text>
                                <Text style={styles.description_}>
                                    {props?.message ? props?.message : "Are you sure you want to approve this application?"}

                                </Text>

                            </View>


                        </View>
                        <View style={[styles.action, {alignItems: "flex-end", paddingVertical: 15}]}>
                            {

                                props?.showClose == false && <>
                                    {props.onLoading ? <ActivityIndicator style={{alignSelf: "center"}}
                                                                          color={"rgba(40,99,214,1)"}/> :
                                        <TouchableOpacity onPress={props.onConfirmPressed}>

                                            <Text
                                                style={[alertStyle.confirmButtonTextStyle]}>{props?.confirmButton || 'Yes'}</Text>

                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity onPress={_springHide}>
                                        <Text style={[alertStyle.cancelButtonTextStyle]}>Close</Text>
                                    </TouchableOpacity>

                                </>

                            }

                            {props?.showClose == true &&
                            <TouchableOpacity onPress={_springHide}>
                                <Text style={[alertStyle.confirmButtonTextStyle]}>Close</Text>
                            </TouchableOpacity>
                            }

                        </View>
                    </View>
                </View>
            </Animated.View>

        </Modal>

    );
}

const styles = StyleSheet.create({
    group: {

        alignSelf: "center"
    },
    container___: {
                flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        borderWidth: 0,
        borderColor: "#000000"
    },
    container__: {

         
        //paddingVertical: 15
     
    },
    container_: {
        width: "100%",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#121212",
        textAlign: "center"
    },
    description_: {

        padding: 10,
        color: "#121212",
        textAlign: "center"
    },
    
    action: {
        borderTopWidth: 1,
        borderTopColor: "rgba(217,219,233,1)",

        flexDirection: "row",
        justifyContent: "space-around"
    },
});

export default CustomAlert;
