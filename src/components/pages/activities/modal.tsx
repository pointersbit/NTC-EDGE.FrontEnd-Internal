import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert as RNAlert,
    Animated,
    BackHandler,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import Alert from '@atoms/alert';
import {infoColor, primaryColor} from "@styles/color";
import Disapproval from "@pages/activities/modal/disapproval";
import Endorsed from "@pages/activities/modal/endorse";
import Approval from "@pages/activities/modal/approval";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {getRole, PaymentStatusText, StatusText} from "@pages/activities/script";
import {
    ACCOUNTANT,
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
    FORAPPROVAL,
    FOREVALUATION,
    PAID,
    UNVERIFIED,
    VERIFIED,
} from "../../../reducers/activity/initialstate";
import Api from 'src/services/api';
import {
    setEdit,
    setHasChange,
    setRightLayoutComponent,
    updateApplicationStatus
} from "../../../reducers/application/actions";

import CustomAlert from "@pages/activities/alert/alert1";
import CloseIcon from "@assets/svg/close";
import {ApprovedButton} from "@pages/activities/button/approvedButton";
import {DeclineButton} from "@pages/activities/button/declineButton";
import {EndorsedButton} from "@pages/activities/button/endorsedButton";
import {Bold, Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import {useComponentLayout} from "../../../hooks/useComponentLayout";
import ModalTab from "@pages/activities/modalTab/modalTab";
import {isLandscapeSync, isTablet} from "react-native-device-info";
import {Toast} from "@atoms/toast/Toast";
import axios from "axios";
import useSafeState from "../../../hooks/useSafeState";
import {useNavigation} from "@react-navigation/native";
import {BASE_URL} from "../../../services/config";
import {isNumber} from "../../../utils/ntc";
import {useToast} from "../../../hooks/useToast";
import {ToastType} from "@atoms/toast/ToastProvider";
import ToastLoading from "@components/atoms/toast/ToastLoading";
import ChevronLeft from "@assets/svg/chevron-left";

const flatten = require('flat')


function ActivityModal(props: any) {
    const dispatch = useDispatch();
    const hasChange = useSelector((state: RootStateOrAny) => state.application.hasChange);
    const edit = useSelector((state: RootStateOrAny) => state.application.edit);

    const [userProfileForm, setUserProfileForm] = useSafeState(() => {
        return flatten.flatten(props.details)
    })
    const [userOriginalProfileForm, setUserOriginalProfileForm] = useSafeState(userProfileForm)
    const navigation = useNavigation();

    const dimensions = useWindowDimensions();
    const NativeView = ((isMobile && !Platform?.isPad) || dimensions?.width < 768 || Platform?.isPad && !isLandscapeSync()) ? Modal : View;
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [change, setChange] = useState<boolean>(false);
    const cashier = [CASHIER].indexOf(user?.role?.key) != -1;
    const [visible, setVisible] = useState(false);
    const [endorseVisible, setEndorseVisible] = useState(false);
    const [approveVisible, setApproveVisible] = useState(false);
    const [status, setStatus] = useState("");
    const [prevStatus, setPrevStatus] = useState("");
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [currentLoading, setCurrentLoading] = useState('');
    const [assignId, setAssignId] = useState("");
    const [prevAssignId, setPrevAssignId] = useState("");
    const [remarks, setRemarks] = useState("");
    const [prevRemarks, setPrevRemarks] = useState("");
    const [grayedOut, setGrayedOut] = useState(false);
    const cancelTokenSource = axios.CancelToken.source();
    const [showAlert1, setShowAlert1] = useState(false)
    const [showAlert2, setShowAlert2] = useState(false)
    const editModalVisible = useSelector((state: RootStateOrAny) => state.activity.editModalVisible);
    const onDismissed = () => {
        setVisible(false)
    };
    const onEndorseDismissed = () => {
        setEndorseVisible(false)
    };
    const onApproveDismissed = () => {
        setApproveVisible(false)
    };
    const onChangeApplicationStatus = async (status: string, callback = (err: any, appId?: any) => {
    }, event) => {
        console.log(event)
        setGrayedOut(true);
        const api = Api(user.sessionToken);
        const applicationId = props?.details?._id;
        let url = `/applications/${applicationId}/update-status`;
        let params: any = {
            status,
            remarks: user?.role?.key == CASHIER ? "" : event.remarks ? event.remarks : remarks,
            assignedPersonnel: event.cashier ? event.cashier : assignId,
        };
        let AddORNoparams: any =
            {
                orNumber: event.remarks ? event.remarks : remarks,
                orBy: event.cashier ? event.cashier : assignId,
            }
        setCurrentLoading(status);
        if (status == DECLINED) {
            setAssignId("")
        }
        if (user?.role?.key == ACCOUNTANT) {
            const assignUserId = status == DECLINED && props?.details?.approvalHistory?.[0]?.status == FORAPPROVAL && props?.details?.approvalHistory?.[0]?.userId != user?._id;
            assignUserId ? setAssignId(props?.details?.approvalHistory?.[0].userId) : (
                assignId ? assignId : undefined);
            params = {
                status: (
                    assignUserId) ? FOREVALUATION : status,
                assignedPersonnel: assignUserId ? props?.details?.approvalHistory?.[0].userId : (
                    assignId ? assignId : undefined),
                remarks: event.remarks ? event.remarks : remarks,
            };
        }
        if (user?.role?.key == CASHIER) {
            url = `/applications/${applicationId}/update-payment-status`;
            params = {
                paymentStatus: status,
                remarks: event.remarks ? event.remarks : remarks,
            };
        }
        if (props?.details?.service?.serviceCode === "service-22") {
            delete params.assignedPersonnel
        }
        const addORNumber = user?.role?.key == CASHIER ? await api.post(`/applications/${applicationId}/add-or-number`, AddORNoparams).catch(e => {
            setGrayedOut(false);
            setCurrentLoading('');
            RNAlert.alert('Alert', e?.message || 'Something went wrong.');
            return callback(e);
        }) : null
        if ((applicationId && (user?.role?.key == CASHIER && addORNumber?.status == 200)) || (getRole(user, [DIRECTOR, EVALUATOR, ACCOUNTANT]) && applicationId)) {
            await api.patch(url, {...params, cancelToken: cancelTokenSource?.token,})
                .then(res => {
                    setGrayedOut(false);
                    setCurrentLoading('');
                    if (res.status === 200) {
                        if (res.data) {
                            const data = res.data?.doc || res?.data;
                            dispatch(updateApplicationStatus({
                                application: data,
                                status: status,
                                assignedPersonnel: data?.assignedPersonnel?._id || data?.assignedPersonnel,
                                userType: user?.role?.key
                            }));
                            props.onChangeAssignedId(data);
                            //setStatus(cashier ? PaymentStatusText(status) : StatusText(status))
                            setChange(true);
                            // props.onDismissed(true, applicationId)
                            return callback(null, applicationId);
                        }
                    }
                    RNAlert.alert('Alert', 'Something went wrong.');
                    return callback('error');
                })
                .catch(e => {
                    setGrayedOut(false);
                    setCurrentLoading('');
                    RNAlert.alert('Alert', e?.message || 'Something went wrong.');
                    return callback(e);
                })
        }
    };

    const hasChanges = (bool: boolean) => {
        dispatch(setHasChange(bool))
    }



    const [prevId, setPrevId] = useSafeState(0)
    useEffect(() => {

        setUserProfileForm(flatten.flatten(props.details))
        setUserOriginalProfileForm(flatten.flatten(props.details))
       /* console.log(prevId != props?.details._id, prevId , props?.details._id)
        if(prevId != props?.details._id){
            setPrevId(props?.details._id)
            dispatch(setHasChange(false)
            setEdit(false)
        }
*/
        return () => {
            setChange(false);
            setStatus("");
            setAssignId("")

        }
    }, [props?.details._id,]);

    const statusMemo = useMemo(() => {
        setStatus(status);
        setAssignId(assignId || (
            props?.details?.assignedPersonnel?._id || props?.details?.assignedPersonnel));
        return status ? (
            cashier ? PaymentStatusText(status) : StatusText(status)) : (
            cashier ? PaymentStatusText(props.details.paymentStatus) : StatusText(props.details.status))
    }, [assignId, status, (
        props?.details?.assignedPersonnel?._id || props?.details?.assignedPersonnel), props.details.paymentStatus, props.details._id, props.details.status]);
    const approveButton = statusMemo === APPROVED || statusMemo === VERIFIED;
    const declineButton = cashier ? (statusMemo === UNVERIFIED || statusMemo === DECLINED) : statusMemo === DECLINED;

    const [loading, setLoading] = useSafeState(false)
    const [saved, setSaved] = useSafeState(false)
    const allButton = (
        cashier) ? (
        !!props?.details?.paymentMethod ? (
            assignId != user?._id ? true : (
                declineButton || approveButton || grayedOut)) : true) : (
        assignId != user?._id ? true : (
            declineButton || approveButton || grayedOut));
    const [alertLoading, setAlertLoading] = useState(false);
    const [approvalIcon, setApprovalIcon] = useState(false);
    const [title, setTitle] = useState("Approve Application");
    const [showClose, setShowClose] = useState(false);

    const [activityModalScreenComponent, onActivityModalScreenComponent] = useComponentLayout();
    useEffect(() => {
        dispatch(setRightLayoutComponent(activityModalScreenComponent))
    }, [activityModalScreenComponent]);
    const hitSlop = {top: 50, left: 50, bottom: 50, right: 50}
    const [discardAlert, setDiscardAlert] = useSafeState(false);
    const [editAlert, setEditAlert] = useSafeState(false);
    const handleBackButtonClick = () => {
        if (hasChange) setDiscardAlert(true);
        else {
            setAssignId("");
            props.onDismissed(change);
            setChange(false)
            return true;
        }
    };
    const routeIsFocused = navigation.isFocused();
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [routeIsFocused]);
    const editBtn = () => {
        if (hasChange) setEditAlert(true);
        else {
            dispatch(setEdit((bool) => !bool))
        }
    }
    const {showToast, hideToast} = useToast();
    const [messageUpdate, setMessageUpdate] = useSafeState("")
    const [titleUpdate, setTitleUpdate] = useSafeState("")
    const updateApplication = useCallback((callback) => {
       /* hideToast()
        showToast(ToastType.Info, <ToastLoading/>)*/
        setLoading(true)
        let profileForm = userProfileForm
        let dateOfBirth = profileForm?.['applicant.dateOfBirth'], region = profileForm?.['region.code'],
            dateValue = {year: "", month: "", day: ""}
        if (typeof dateOfBirth == 'string' && dateOfBirth) {
            let dateOfBirthSplit = dateOfBirth?.split('-')
            dateValue.year = dateOfBirthSplit[0]
            dateValue.month = dateOfBirthSplit[1]
            dateValue.day = dateOfBirthSplit[2]
            profileForm['applicant.dateOfBirth'] = dateValue
        }
        if (region) {
            profileForm['region'] = region
        }
        // /^soa.+(?:\[\d+])?(?:\.\w+(?:\[\d+])?)*$/;
        let pattern = /^soa\.\d+\.\w+$/
        let cleanSoa = {}
        for (const [key, value] of Object.entries(profileForm)) {
            if (key.match(pattern) && value) {
                cleanSoa = {...cleanSoa, ...{[key]: value}}
            }
        }
        const flattenSoa = flatten.unflatten(cleanSoa)?.soa?.filter(s => s)
        if (flattenSoa) profileForm['totalFee'] = flattenSoa.reduce((partialSum, a) => partialSum + (isNumber(parseFloat(a.amount)) ? parseFloat(a.amount) : 0), 0)
        //console.log({...flatten.unflatten(profileForm), ...{soa: flattenSoa}})
        setSaved(true)
        axios.patch(BASE_URL + `/applications/${props?.details?._id}`, {...flatten.unflatten(profileForm), ...{soa: flattenSoa}}, {
            headers: {
                Authorization: "Bearer ".concat(user?.sessionToken)
            }
        }).then((response) => {
           setSaved(false)
            setTimeout(()=>{
               setLoading(false)
           }, 2500)


            //hideToast()
            dispatch(setHasChange(false))
            dispatch(setEdit(false))
            /*setShowAlert2(true)
             setMessageUpdate('The Application has been updated!')
             setTitleUpdate("Success")*/
            var _flatten = flatten.flatten({...response.data.doc})
            setUserOriginalProfileForm({..._flatten})
            setUserProfileForm(_flatten)
            props.onChangeEvent(response.data.doc);
            //showToast(ToastType.Success, "Successfully updated!")
            callback()
        }).catch((error) => {
            dispatch(setEdit(false))
            dispatch(setHasChange(false))
            setLoading(false)
            //hideToast()
            let _err = '';
            for (const err in error?.response?.data?.errors) {
                _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
            }
            if (_err || error?.response?.data?.message || error?.response?.statusText) {
                showToast(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText)
            }
            /* setMessageUpdate(err?.message||'Something went wrong.')
            setTitleUpdate("Error")*/
            callback()
        });
    }, [userProfileForm])
    const visibleAnimated = useRef(new Animated.Value(Number(!edit))).current;
    const getAnimatedStyle = () => {
        Animated.timing(visibleAnimated, {
            toValue: Number(!edit),
            duration: 300,
            useNativeDriver: true
        }).start();
        return {
            position: visibleAnimated ? 'absolute' : undefined,
            opacity: visibleAnimated,
            transform: [{
                translateY: visibleAnimated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [dimensions.height / 2, 0]
                })
            }]
        };
    }
    return (
        <NativeView
            onLayout={onActivityModalScreenComponent}
            style={{height: "100%"}}
            supportedOrientations={['portrait', 'landscape']}
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={() => {
                setAssignId("");
                props.onDismissed(change);
                setChange(false)
            }}>
            <View style={(isMobile && !((Platform?.isPad || isTablet()) && isLandscapeSync())) && (
                visible || endorseVisible || showAlert) ? {
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            } : {position: "absolute",}}>
            </View>
            <CustomAlert
                showClose={showClose}
                type={approvalIcon ? APPROVED : ""}
                onDismissed={() => {
                    setShowAlert(false);
                    setApprovalIcon(false);
                    setShowClose(false)
                    props.onDismissed(true);
                }}
                onLoading={alertLoading}
                onCancelPressed={() => {
                    setShowAlert(false);
                    if (approvalIcon) {
                        setApprovalIcon(false);
                        setShowClose(false)
                    }
                }}
                onConfirmPressed={() => {
                    let status = "";
                    if ([CASHIER, DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1) {
                        status = APPROVED
                    } else {
                        status = DECLINED
                    }
                    // setShowAlert(false)
                    setAlertLoading(true);
                    onChangeApplicationStatus(status, (err) => {
                        setAlertLoading(false);
                        if (!err) {
                            setApprovalIcon(true);
                            setTitle("Application Approved");
                            setMessage("Application has been approved.");
                        } else {
                            setApprovalIcon(false);
                            setTitle("Alert");
                            setMessage(err?.message || 'Something went wrong.');
                        }
                        setShowClose(true)
                    }, {remarks: remarks, cashier: assignId})
                }}
                show={showAlert} title={title}
                message={message}/>
            <View style={{flex: 1}}>
                {(
                    isMobile || (Platform?.isPad)) && <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomColor: "#F0F0F0",
                    justifyContent: "space-around",
                    padding: 15,
                    paddingTop: 40,
                }}>

                    {edit ?<TouchableOpacity hitSlop={hitSlop} onPress={editBtn}>
                        <ChevronLeft width={fontValue(24)} height={fontValue(24)} color="#606A80"/>
                    </TouchableOpacity> :
                        <TouchableOpacity hitSlop={hitSlop} onPress={() => {
                        handleBackButtonClick()
                    }}>
                        <CloseIcon width={fontValue(16)} height={fontValue(16)} color="#606A80"/>
                    </TouchableOpacity>}
                    <Text
                        style={[styles.applicationType, {width: "90%"}]}>{props?.details?.applicationType || props?.details?.service?.name}</Text>

                    {editModalVisible ? edit  ? <TouchableOpacity hitSlop={hitSlop} onPress={() => {
                            updateApplication(() => {})
                        }
                        }>
                        {loading ? <ActivityIndicator color={infoColor}/> :
                            <Text style={{fontFamily: Regular, fontSize: fontValue(16), color: infoColor}}>Save</Text>}
                            {/* <EditIcon color="#606A80"/>*/}
                        </TouchableOpacity>

                       :  <TouchableOpacity hitSlop={hitSlop} onPress={editBtn}>
                            <Text style={{fontFamily: Regular, fontSize: fontValue(16), color: infoColor}}>Edit</Text>
                            {/* <EditIcon color="#606A80"/>*/}
                        </TouchableOpacity> : <></>
                    }

                </View>}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={[styles.container]}
                >

                    <ModalTab saved={saved} loading={loading} setEditAlert={setEditAlert} updateApplication={updateApplication} editBtn={editBtn}
                              userOriginalProfileForm={userOriginalProfileForm}
                              userProfileForm={userProfileForm}
                              setEdit={setEdit}
                              setUserProfileForm={setUserProfileForm}
                              setUserOriginalProfileForm={setUserOriginalProfileForm}
                              hasChanges={hasChanges} edit={edit} dismissed={() => {
                        props.onDismissed(change);
                    }} details={props.details} status={status}/>

                </KeyboardAvoidingView>

                {!edit &&
                    <View style={[{
                        paddingHorizontal: !isMobile ? 64 : 0,
                        borderTopColor: 'rgba(0, 0, 0, 0.1)',
                        borderTopWidth: 1, backgroundColor: "white"
                    }]}>
                        <View style={!(
                            isMobile) && {
                            width: dimensions?.width <= 768 ? "100%" : "60%",
                            alignSelf: "flex-end"
                        }}>
                            <View style={styles.footer}>
                                {getRole(user, [DIRECTOR, EVALUATOR, CASHIER, ACCOUNTANT]) &&
                                    <View style={styles.groupButton}>
                                        <ApprovedButton
                                            user={user}
                                            currentLoading={currentLoading}
                                            allButton={allButton}
                                            onPress={() => {
                                                if (getRole(user, [EVALUATOR])) {
                                                    setShowAlert1(true)
                                                    setApproveVisible(true)
                                                } else {
                                                    setApproveVisible(true)
                                                }
                                            }}/>

                                        {<DeclineButton
                                            currentLoading={currentLoading}
                                            allButton={allButton}
                                            onPress={() => {
                                                setVisible(true)
                                            }}/>}

                                    </View>}
                                {getRole(user, [EVALUATOR]) && props?.details?.service?.serviceCode !== "service-22" &&
                                    <EndorsedButton
                                        currentLoading={currentLoading}
                                        allButton={allButton}
                                        onPress={() => {
                                            setEndorseVisible(true)
                                        }}/>}
                            </View>
                        </View>
                    </View>
                }
            </View>

            <Approval
                showAlert={showAlert1}
                setShowAlert={setShowAlert1}
                size={activityModalScreenComponent}
                onModalDismissed={(event?: any) => {
                    if (event == "cancel") {
                        //cancelTokenSource?.cancel();
                    }
                    setStatus(prevStatus);
                    setRemarks(prevRemarks);
                    setAssignId(props?.details?.assignedPersonnel?._id || props?.details?.assignedPersonnel)
                    if (getRole(user, [EVALUATOR])) {
                        onApproveDismissed();
                    }

                }}
                onChangeRemarks={(_remark: string, _assign) => {

                    setPrevStatus(status);
                    setPrevRemarks(remarks);
                    setPrevAssignId(assignId);
                    if (getRole(user, [CASHIER, DIRECTOR, ACCOUNTANT])) {
                        setRemarks(_remark);
                        setAssignId(_assign)
                    }
                    setShowAlert1(true)

                }}


                visible={approveVisible}
                confirm={(event: any, callback: (res, callback) => {}) => {
                    setRemarks(event.remark);
                    setAssignId(event.cashier)
                    let status = "";

                    if (getRole(user, [DIRECTOR, EVALUATOR])) {
                        if (props?.details?.service?.serviceCode == "service-22") {
                            status = APPROVED
                        } else {
                            status = FORAPPROVAL
                        }

                    } else if (getRole(user, [ACCOUNTANT])) {
                        status = APPROVED
                    } else if (getRole(user, [CASHIER])) {
                        status = PAID
                    }
                    onChangeApplicationStatus(status, (err, appId) => {

                        if (!err) {

                            callback(true, (bool) => {

                            })
                        } else {

                            callback(false, (bool) => {

                            })
                        }

                    }, event)


                }}
                onExit={() => {

                    onApproveDismissed();
                    props.onDismissed(true);

                }}
                onDismissed={(event?: any, callback?: (bool) => {}) => {
                    if (event == APPROVED) {
                        onApproveDismissed();

                    }
                    if (callback) {
                        callback(true)
                    }
                }}
            />
            <Disapproval
                size={activityModalScreenComponent}
                user={props?.details?.applicant?.user}
                remarks={setRemarks}
                onChangeApplicationStatus={(event: any, callback: (bool, appId) => {}) => {

                    onChangeApplicationStatus(DECLINED, (err, id) => {

                        if (!err) {
                            callback(true, (response) => {

                            })
                        } else {
                            callback(false, (response) => {

                            })
                        }
                    }, event)
                }
                }
                visible={visible}
                onExit={() => {
                    onDismissed();
                    props.onDismissed(true);
                }}
                onDismissed={() => {

                    onDismissed()

                }}
            />
            <Endorsed
                size={activityModalScreenComponent}
                assignedPersonnel={props?.details?.assignedPersonnel?._id || props?.details?.assignedPersonnel}
                onModalDismissed={() => {
                    setRemarks(prevRemarks);
                    setAssignId(props?.details?.assignedPersonnel?._id || props?.details?.assignedPersonnel)
                }}
                remarks={(event: any) => {
                    setPrevRemarks(remarks);
                    setPrevAssignId(assignId);
                    setRemarks(event.remarks);
                    setAssignId(event.endorseId)
                }}
                onChangeApplicationStatus={(event: any, callback: (bool, response) => {}) => {
                    onChangeApplicationStatus(event.status, (err, id) => {
                        console.log(!err, err);
                        if (!err) {
                            callback(true, (response) => {

                            })
                        } else {
                            callback(false, (response) => {

                            })
                        }

                    }, event);
                }}
                visible={endorseVisible}
                onExit={() => {

                    onEndorseDismissed();
                    props.onDismissed(true);
                }}
                onDismissed={() => {

                    onEndorseDismissed()
                }}
            />
            <Toast/>
            <Alert
                visible={discardAlert}
                title={'Discard Changes'}
                message={'Any unsaved changes will not be saved. Continue?'}
                confirmText='OK'
                cancelText={"Cancel"}
                onConfirm={() => {
                    setAssignId("");
                    setStatus("");
                    props.onDismissed(change);
                    setChange(false)
                    setDiscardAlert(false)
                }
                }
                onCancel={() => setDiscardAlert(false)}
            />
            <CustomAlert
                showClose={true}
                onDismissed={() => {
                    setShowAlert2(false)
                }
                }
                onCancelPressed={() => {
                }
                }

                show={showAlert2}
                title={titleUpdate}
                message={messageUpdate}
                confirmText='OK'
                onConfirmPress={() => {
                    setShowAlert2(false)
                }
                }
            />
            <Alert
                visible={editAlert}
                title={'Edit Changes'}
                message={'Any unsaved changes will not be saved. Continue?'}
                confirmText='OK'
                cancelText={"Cancel"}
                onConfirm={() => {
                    dispatch(setHasChange(false))
                    dispatch(setEdit((bool) => !bool))
                    setEditAlert(false)
                    const myPromise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            setUserProfileForm(userOriginalProfileForm)
                        }, 300);
                    });


                }
                }
                onCancel={() => setEditAlert(false)}
            />
        </NativeView>
    );
}

export default memo(ActivityModal)
const styles = StyleSheet.create({
    applicationType: {
        textAlign: "center",
        fontFamily: Bold,
        fontSize: fontValue(12),
        color: "#606A80"
    },
    container: {
        flex: 1
    },
    groupButton: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    group13: {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
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
        width: "100%",
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
        fontFamily: Bold,
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

        paddingHorizontal: 20,
        paddingVertical: 30,
        flexDirection: 'row',

    }
});
