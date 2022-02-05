import React, {useEffect, useMemo, useState} from "react";
import {ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {primaryColor} from "@styles/color";
import Disapproval from "@pages/activities/disapproval";
import Endorsed from "@pages/activities/endorse";
import Approval from "@pages/activities/approval";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {PaymentStatusText, StatusText} from "@pages/activities/script";
import {
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
    FOREVALUATION,
    FORVERIFICATION,
    PAID,
    PENDING,
    UNVERIFIED,
    VERIFIED,
} from "../../../reducers/activity/initialstate";
import Api from 'src/services/api';
import {updateApplicationStatus} from "../../../reducers/application/actions";
import {ModalTab} from "@pages/activities/modalTab";
import CustomAlert from "@pages/activities/alert/alert";
import ForwardIcon from "@assets/svg/forward";
import CloseIcon from "@assets/svg/close";

const {width, height} = Dimensions.get('window');

function ActivityModal(props: any) {
    const dispatch = useDispatch();

    const user = useSelector((state: RootStateOrAny) => state.user);
    const applicant = props?.details?.applicant?.user
    const [change, setChange] = useState<boolean>(false)
    const cashier = [CASHIER].indexOf(user?.role?.key) != -1
    const director = [DIRECTOR].indexOf(user?.role?.key) != -1
    const [visible, setVisible] = useState(false)
    const [endorseVisible, setEndorseVisible] = useState(false)
    const [approveVisible, setApproveVisible] = useState(false)
    const [status, setStatus] = useState("")
    const [message, setMessage] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [currentLoading, setCurrentLoading] = useState('');
    const [assignId, setAssignId] = useState("")
    const [prevAssignId, setPrevAssignId] = useState("")
    const [remarks, setRemarks] = useState("")
    const [prevRemarks, setPrevRemarks] = useState("")
    const [grayedOut, setGrayedOut] = useState(false)
    const onDismissed = () => {
        setVisible(false)
    }
    const onEndorseDismissed = () => {
        setEndorseVisible(false)
    }
    const onApproveDismissed = () => {
        setApproveVisible(false)
    }
    const onChangeApplicationStatus = async (status: string, callback = (err: any, appId?: any) => {
    }) => {
        setGrayedOut(true)
        const api = Api(user.sessionToken);
        const applicationId = props?.details?._id;
        let url = `/applications/${applicationId}/update-status`;
        let params: any = {
            status,
            remarks: remarks ? remarks : undefined,
            assignedPersonnel: assignId && !director ? assignId : undefined,
        };
        setCurrentLoading(status);
        if (status == DECLINED) {
            setAssignId("")
        }
        if (user?.role?.key == CASHIER) {
            url = `/applications/${applicationId}/update-payment-status`;
            params = {
                paymentStatus: status,
                remarks: remarks ? remarks : undefined,
            };
        }
        console.log(url, params, assignId)
        if (applicationId) {
            await api.patch(url, params)
                .then(res => {
                    setGrayedOut(false)
                    setCurrentLoading('');
                    if (res.status === 200) {
                        if (res.data) {
                            console.log(200)
                            dispatch(updateApplicationStatus({
                                application: res.data,
                                status: status,
                                assignedPersonnel: assignId,
                                userType: user?.role?.key
                            }))
                            props.onChangeAssignedId(assignId)
                            setStatus(cashier ? PaymentStatusText(status) : StatusText(status))
                            setChange(true)
                            // props.onDismissed(true, applicationId)

                            return callback(null, applicationId);
                        }
                    }

                    Alert.alert('Alert', 'Something went wrong.');

                    return callback('error');
                })
                .catch(e => {

                    setGrayedOut(false)
                    setCurrentLoading('');
                    Alert.alert('Alert', e?.message || 'Something went wrong.')
                    return callback(e);
                })
        }
    }

    function onShowConfirmation(status: string) {
        const name = props?.details?.applicant?.user
        setMessage(`Are you sure you want to approve this application?`)
        setShowAlert(true)

    }

    useEffect(() => {

        return () => {
            setChange(false)
            setStatus("")
            setAssignId("")
        }
    }, [])
    useEffect(() => {

    }, [])

    const statusMemo = useMemo(() => {
        console.log("props?.details?.assignedPersonnel:",props?.details?.assignedPersonnel)
        setStatus(status)
        setAssignId(assignId ? assignId : props?.details?.assignedPersonnel)
        return status ? (cashier ? PaymentStatusText(status) : StatusText(status)) : (cashier ? PaymentStatusText(props.details.paymentStatus) : StatusText(props.details.status))
    }, [assignId, status, props?.details?.assignedPersonnel, props.details.paymentStatus, props.details.status])
    const approveButton = cashier ? statusMemo === APPROVED || statusMemo === VERIFIED : (statusMemo === APPROVED || statusMemo === VERIFIED)
    const declineButton = cashier ? (statusMemo === UNVERIFIED || statusMemo === DECLINED) : statusMemo === DECLINED
    const allButton = (statusMemo == FORVERIFICATION || statusMemo == PENDING || statusMemo == FOREVALUATION) && [CASHIER, EVALUATOR].indexOf(user?.role?.key) != -1 && assignId != user?._id ? true : (declineButton || approveButton || grayedOut)
    console.log("----------------------------------------------",
        "\napplication id:", props?.details?._id,
        "\nuser:", props?.details?.applicant?.user?.firstName,
        "\ncashier:", cashier,
        "\nassign id:", assignId,
        "\nid:", user?._id,
        "\nstatus:", status,
        "\npayment status:", props.details.paymentStatus,
        "\nstatus: ", props.details.status)
    const [alertLoading, setAlertLoading] = useState(false)
    const [approvalIcon, setApprovalIcon] = useState(false)
    const [title, setTitle] = useState("Approve Application")
    const [showClose, setShowClose] = useState(false)

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={() => {
                setAssignId("")
                props.onDismissed(change)
                setChange(false)
            }}>
            <View style={approveVisible || visible || endorseVisible || showAlert ? {

                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                width: width,
                height: height,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            } : {}}>

            </View>


            <CustomAlert
                showClose={showClose}
                type={approvalIcon ? APPROVED : ""}
                onDismissed={() => {
                    setShowAlert(false)
                    setApprovalIcon(false)
                    setShowClose(false)
                }}
                onLoading={alertLoading}
                onCancelPressed={() => {
                    setShowAlert(false)
                    if (approvalIcon) {
                        setApprovalIcon(false)
                        setShowClose(false)
                    }
                }}
                onConfirmPressed={() => {
                    let status = ""
                    if ([CASHIER, DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1) {
                        status = APPROVED
                    } else {
                        status = DECLINED
                    }

                    // setShowAlert(false)
                    setAlertLoading(true)
                    onChangeApplicationStatus(status, () => {
                        setApprovalIcon(true)
                        setAlertLoading(false)

                        setTitle("Application Approved")
                        setMessage("Application has been approved.")
                        setShowClose(true)
                    })
                }}
                show={showAlert} title={title}
                message={message}/>
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", padding: 15, paddingTop: 35}}>
                    <TouchableOpacity onPress={() => {
                        setAssignId("")
                        setStatus("")
                        props.onDismissed(change)
                        setChange(false)
                    }}>
                        <CloseIcon color="#606A80"/>
                    </TouchableOpacity>
                    <Text style={{
                        fontWeight: "600",
                        fontSize: 14,
                        lineHeight: 16.5,
                        color: "#606A80"
                    }}>{props?.details?.applicationType}</Text>
                    <View></View>
                </View>

                <ModalTab details={props.details} status={status}/>
                {
                    <View style={styles.footer}>
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                        }}>
                            {[DIRECTOR, EVALUATOR, CASHIER].indexOf(user?.role?.key) != -1 &&
                            <View style={{flex: 1, paddingRight: 5}}>
                                <TouchableOpacity
                                    disabled={currentLoading === APPROVED || allButton}
                                    onPress={() => {
                                        if (cashier) {
                                            onShowConfirmation(APPROVED)
                                        } else {
                                            setApproveVisible(true)
                                        }


                                    }}
                                >
                                    {/* <View style={styles.rect22Filler}></View>
                                <View style={styles.rect22}>
                                    <View style={styles.approvedFiller}></View>
                                    <Text style={styles.approved}>Approved</Text>
                                </View> */}
                                    <View style={[styles.rect22, {

                                        backgroundColor: (allButton ? "#C4C4C4" : "rgba(0,171,118,1)"),
                                        height: undefined,
                                        paddingVertical: currentLoading === APPROVED ? 6 : 10.5
                                    }]}>
                                        {
                                            currentLoading === APPROVED ? (
                                                <ActivityIndicator color={'white'} size={'small'}/>
                                            ) : (
                                                <Text
                                                    style={[styles.approved, {
                                                        fontWeight: '600',
                                                        color: allButton ? "#808196" : "rgba(255,255,255,1)",
                                                    }]}>
                                                    Approve
                                                </Text>
                                            )
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>}
                            {[DIRECTOR, EVALUATOR, CASHIER].indexOf(user?.role?.key) != -1 &&
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    disabled={(currentLoading === DECLINED || allButton)}
                                    onPress={() => {
                                        setVisible(true)
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.rect24,
                                            {
                                                backgroundColor: (allButton) ? "#C4C4C4" : "#fff",
                                                height: undefined,
                                                paddingVertical: currentLoading === DECLINED ? 5 : 9,
                                                borderWidth: 1,
                                                borderColor: (allButton) ? "#C4C4C4" : "rgba(194,0,0,1)",
                                            }]
                                        }>

                                        {
                                            currentLoading === DECLINED ? (
                                                <ActivityIndicator color={"rgba(194,0,0,1)"} size={'small'}/>
                                            ) : (
                                                <Text
                                                    style={[styles.endorse1, {
                                                        fontWeight: '600',
                                                        color: (allButton) ? "#808196" : "rgba(194,0,0,1)",
                                                    }]}>Decline</Text>
                                            )
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                            }

                        </View>

                        {[EVALUATOR].indexOf(user?.role?.key) != -1 &&
                        <View style={{flex: 0.6, paddingHorizontal: 5,}}>
                            <TouchableOpacity
                                disabled={(currentLoading === FOREVALUATION || allButton)}
                                onPress={() => {
                                    setEndorseVisible(true)
                                }}
                            >
                                <View style={[{
                                    width: "85%",
                                    alignSelf: "flex-end",
                                    borderWidth: 1,
                                    borderRadius: 24,
                                    borderColor: "#c4c4c4",
                                    backgroundColor: ((allButton) ? "#C4C4C4" : "#fff"),
                                    height: undefined,
                                    paddingVertical: currentLoading === FOREVALUATION ? 6.5 : 10
                                }]}>
                                    <View
                                        style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                        {
                                            currentLoading === FOREVALUATION ? (
                                                <ActivityIndicator color={'white'} size={'small'}/>
                                            ) : (
                                                <Text style={[styles.endorse, {
                                                    fontWeight: '600',
                                                    color: (allButton) ? "#808196" : "#031A6E",
                                                }]}>Endorse</Text>

                                            )
                                        }
                                        <ForwardIcon isDisable={allButton} style={{marginLeft: 6}}/>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </View>}


                    </View>
                }
            </View>
            <Approval
                onChangeRemarks={(remark: string) => {
                    setRemarks(remark)
                }}
                visible={approveVisible}
                confirm={(event: any, callback: (res, callback) => {}) => {

                    setAssignId(event.cashier)
                    let status = ""
                    if ([DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1) {
                        status = APPROVED
                    } else if ([CASHIER].indexOf(user?.role?.key) != -1) {
                        status = PAID
                    }
                    onChangeApplicationStatus(status, (err, appId) => {
                        if (!err) {
                            callback(true, (bool) => {
                                // props.onDismissed(true, appId)
                            })
                        }
                    })


                }}
                isCashier={user?.role?.key === CASHIER}
                onDismissed={(event?: any, callback?: (bool) => {}) => {

                    onApproveDismissed()

                    if (callback) {
                        callback(true)
                    }
                }}
            />
            <Disapproval
                user={props?.details?.applicant?.user}
                remarks={setRemarks}
                onChangeApplicationStatus={(event: any, callback: (bool, appId) => {}) => {
                    onChangeApplicationStatus(DECLINED, (err, id) => {
                        if (!err) {
                            callback(true, (response) => {
                                // props.onDismissed(true, id)
                            })
                        }
                    })
                }
                }
                visible={visible}
                onDismissed={onDismissed}
            />
            <Endorsed
                onModalDismissed={() => {
                    setRemarks(prevRemarks)
                    setAssignId(prevAssignId)
                }}
                remarks={(event: any) => {
                    setPrevRemarks(remarks)
                    setPrevAssignId(assignId)
                    setRemarks(event.remarks)
                    setAssignId(event.endorseId)
                }}
                onChangeApplicationStatus={(event: any, callback: (bool, response) => {}) => {
                    onChangeApplicationStatus(event.status, (err, id) => {

                        if (!err) {
                            callback(true, (response) => {

                            })
                        }
                    },);
                }}
                visible={endorseVisible}
                onDismissed={onEndorseDismissed}
            />
        </Modal>
    );
}

export default ActivityModal
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group13: {
        top: 0,
        left: 0,
        width: width,
        height: 812,
        position: "absolute"
    },
    rect16: {
        backgroundColor: "rgba(255,255,255,1)",
        flex: 1
    },
    group: {
        height: 100,
        flex: 0
    },
    rect3: {
        height: 100
    },
    rect2: {
        height: 100,
        backgroundColor: "#041B6E"
    },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 24,
        marginTop: 55,
        marginLeft: 14
    },
    group3: {
        width: 100,
        height: 97,
        flex: 0
    },
    rect4: {
        top: 0,
        left: 0,
        width: 100,
        height: 97,
        position: "absolute"
    },
    ellipse: {
        borderRadius: 40,
        top: 17,
        left: 20,
        width: 81,
        height: 81,
        position: "absolute"
    },
    rect4Stack: {
        width: 101,
        height: 98
    },
    group8: {
        width: 309,
        height: 30,
        marginTop: 29,
        marginLeft: 33
    },
    rect11: {
        height: 28,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        marginLeft: -33,
        marginRight: -33
    },
    group5: {
        height: 28
    },
    rect6: {
        height: 3,
        marginTop: 8
    },
    group6: {
        height: 28,
        marginLeft: 19
    },
    application: {
        color: primaryColor
    },
    rect8: {
        height: 2,
        backgroundColor: primaryColor,
        marginTop: 10
    },
    group7: {
        height: 28,
        marginLeft: 29
    },
    requirement: {
        color: primaryColor
    },
    rect10: {
        height: 2,
        backgroundColor: primaryColor,
        marginTop: 10
    },
    group5Row: {
        height: 28,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        marginLeft: "5%"
    },
    rect12: {
        width: width,
        height: 1,
        backgroundColor: "#E6E6E6",
        marginTop: 1,
        marginLeft: -33
    },
    group10: {
        height: "60%",
    },


    groupColumn: {},
    groupColumnFiller: {
        flex: 1,

    },
    group14: {},
    rect18Filler: {
        flex: 1
    },
    rect18: {
        height: 50,
        backgroundColor: "rgba(255,255,255,1)"
    },
    endWrapperFiller: {
        flex: 1
    },
    rect19: {
        height: 1,
        backgroundColor: "#E6E6E6",
        marginBottom: 14
    },
    group15: {
        width: 331,
        height: 32,
        flexDirection: "row",
        alignSelf: "center"
    },
    button3: {
        width: 100,
        height: 31
    },
    rect22Filler: {
        flex: 1
    },
    rect22: {
        height: 31,

        borderRadius: 24
    },
    approvedFiller: {
        flex: 1
    },
    approved: {

        textAlign: "center",
        alignSelf: "center"
    },
    button2: {
        width: 100,
        height: 31,
        marginLeft: 15
    },
    rect23Filler: {
        flex: 1
    },
    rect23: {
        height: 31,

        borderRadius: 6
    },
    endorseFiller: {
        flex: 1
    },
    endorse: {
        textAlign: "center",
    },
    button3Row: {
        height: 31,
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 1
    },
    button3RowFiller: {
        flex: 1,
        flexDirection: "row"
    },
    button: {
        width: 100,
        height: 31,
        borderWidth: 1,
        borderColor: "rgba(194,0,0,1)",
        borderRadius: 6,
        alignSelf: "flex-end"
    },
    rect24Filler: {
        flex: 1
    },
    rect24: {
        height: 31,
        borderRadius: 24
    },
    endorse1Filler: {
        flex: 1
    },
    endorse1: {

        textAlign: "center",
    },
    rect19Column: {
        marginBottom: 10
    },
    group4: {
        top: 100,
        width: 264,
        height: 97,
        position: "absolute",
        right: 0,
        flex: 0,
        backgroundColor: "rgba(230, 230, 230,1)"
    },
    rect5: {
        top: 0,
        width: 264,
        height: 97,
        position: "absolute",
        right: 0,
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,1)"
    },
    group11: {
        width: 264,
        height: 39,
        backgroundColor: "rgba(255,255,255,1)",
        marginTop: 26
    },
    name: {
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
        fontSize: 20
    },
    job: {
        color: "rgba(98,108,130,1)",
        fontSize: 10,
        textAlign: "left"
    },
    group2: {
        width: 264,
        height: 21,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row",
        marginLeft: -264,
        marginTop: 65
    },


    icon2Row: {
        height: 11,
        flexDirection: "row",
        flex: 1,
        marginRight: 171,
        marginTop: 6
    },
    group12: {
        top: 26,
        left: 195,
        width: 69,
        height: 72,
        position: "absolute"
    },

    rect5Stack: {
        width: 264,
        height: 98
    },
    group13Stack: {
        width: 376,
        height: 812
    },
    footer: {
        padding: 15,
        paddingTop: 10,
        paddingBottom: 25,

        flexDirection: 'row',
        width: '100%',
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: 1,
    }
});