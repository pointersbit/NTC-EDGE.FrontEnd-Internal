import React , {useEffect , useRef , useState} from "react";
import { Swipeable } from "react-native-gesture-handler";
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from "react-native";
import Text from "@components/atoms/text";
import ProfileImage from "@components/atoms/image/profile";
import FileIcon from "@assets/svg/file";
import {
    formatDate ,
    statusBackgroundColor ,
    statusColor ,
    statusIcon ,
    PaymentStatusText , StatusText , getRole
} from "@pages/activities/script";

import {APPROVED , CASHIER , DIRECTOR , EVALUATOR , FORAPPROVAL} from "../../../reducers/activity/initialstate";
import { outline } from 'src/styles/color';
import Highlighter from "@pages/activities/search/highlighter";

import EndorseIcon from "@assets/svg/endorse";
import {useAssignPersonnel} from "@pages/activities/hooks/useAssignPersonnel";
import {Bold , Regular , Regular500} from "@styles/font";

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
             paddingRight: 20,
    },
    horizontal: {

        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {

        flex: 1,
        paddingBottom: 10,
        borderBottomColor: outline.default,
       // borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: 5,
        paddingTop: 15
    },
    name: {
        marginBottom: 5,
    },
    date: {

    },
    application: {

        paddingHorizontal: 3,
        paddingVertical: 3,
        borderRadius: 5,
        marginLeft: 0,
        //borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#163776',
    },
    status: {
        paddingLeft: 5,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 15
    },
    circle: {
        width: 8,
        height: 8,

        borderRadius: 8,
        marginLeft: -8,
        marginRight: 5,
    },
    applicationContainer: {

        flexDirection: 'row',
        alignItems: 'center',

    }
})

const RenderStatus = ({trigger, status }:any) => {

    return (
        <View
            style={[
                styles.horizontal,
                //statusBackgroundColor(status),
                styles.status,
            ]}
        >
            {statusIcon(status, { marginRight: 3 })}
            <Text
                style={[statusColor(status)]}
                size={12}
                numberOfLines={1}
            >
                {status?.toUpperCase()}
            </Text>
        </View>
    )
}


const RenderApplication = ({ applicationType }:any) => {
    return (
        <View
            style={[
                {backgroundColor: "#BFBEFC"},
                styles.horizontal,
                styles.application
            ]}
        >
            <FileIcon
                width={20}
                height={20}
            />
            <Text
                style={{ marginLeft: 3, marginRight: 5 }}
                color="#2A00A2"
                size={10}
                numberOfLines={1}
            >
                {applicationType}
            </Text>
        </View>
    )
}



const RenderPinned = ({ assignedPersonnel, config }:any) => {
    const {personnel, loading} = useAssignPersonnel(assignedPersonnel, config);
    return (
        <View
            style={[
                {backgroundColor: "#F3F7FF", marginTop: 5},
                styles.horizontal,
                styles.application
            ]}
        >
            { loading ? <></>  :<EndorseIcon
                width={20}
                height={20}
            /> }
            { loading ? <ActivityIndicator/>  :
                <Text
                    style={{"marginLeft": 3, "marginRight": 5}}
                    color="#606A80"
                    size={10}
                    numberOfLines={1}
                >
                    {personnel != undefined ?  `${personnel?.firstName} ${personnel?.lastName}` : ``}
                </Text>
            }
        </View>
    )
}
let row: Array<any> = [];
let prevOpenedRow;

const closeRow = (index)=>{
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
}
export function ActivityItem(props:any) {
    const  status =  [CASHIER].indexOf(props?.role) != -1 ? PaymentStatusText(props?.activity?.paymentStatus) :  StatusText(props?.activity?.status)
    const userActivity = props?.activity?.applicant?.user
    const getStatus = getRole(props.currentUser , [EVALUATOR , DIRECTOR]) &&  status == FORAPPROVAL && !!props?.activity?.approvalHistory?.[0]?.userId ? APPROVED : status

    useEffect(()=>{
        if(props.isOpen == props.index)  row[props.index].close()
    }, [props.isOpen == props.index])
    return (
            <View style={{backgroundColor: "#fff"}}>


                    <TouchableOpacity onPress={() =>{
                        props.onPressUser()
                    }}>
                        <Swipeable
                            ref={ref => row[props.index] = ref}
                            key={props.index}


                            onSwipeableRightOpen={()=>{
                                closeRow(props.index)
                            }}
                            renderRightActions={
                                (progress, dragX) => props.swiper(props.index, progress, dragX, props.onPressUser)
                            }
                        >

                        <View  style={styles.container}>

                            <View style={styles.applicationContainer}>
                                <View style={{padding: 5}} >
                                    <View style={{
                                    height: 8,
                                    width: 8,
                                    backgroundColor: "#fff" ,//props?.activity?.dateRead  ? "#fff" : "#2863D6" ,
                                    borderRadius: 4
                                }}/>
                                </View>
                                <View style={{
                                    borderRadius: 10,
                                    backgroundColor: "#fff",
                                    shadowColor: "rgba(0,0,0,1)",
                                    shadowOffset: {
                                        height: 0,
                                        width: 0
                                    },
                                    elevation: 2,
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    padding: 10,
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <ProfileImage
                                        size={45}
                                        image={userActivity?.profilePicture?.small}
                                        name={`${userActivity?.firstName} ${userActivity?.lastName}`}
                                    />
                                    <View style={styles.content}>
                                        <View style={styles.section}>
                                            <View style={styles.name}>
                                                <Text
                                                    //style={{color: props?.activity?.dateRead ? "#565961" : "#000"}}
                                                    style={{fontFamily: Bold,
                                                        fontSize: 14}}
                                                    numberOfLines={1}
                                                >
                                                    <Highlighter
                                                        highlightStyle={{backgroundColor: '#BFD6FF'}}
                                                        searchWords={[props?.searchQuery]}
                                                        textToHighlight= {`${userActivity?.firstName} ${userActivity?.lastName}`}
                                                    />

                                                </Text>
                                            </View>
                                            <View style={styles.date}>

                                                <Text
                                                    style={{fontFamily: Regular,
                                                        fontSize: 10}}
                                                    numberOfLines={1}
                                                >
                                                    {formatDate(props.activity.createdAt)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.section}>
                                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                                <RenderApplication applicationType={props?.activity?.applicationType} />
                                            </View>

                                            <RenderStatus
                                                status={getStatus}
                                            />
                                        </View>
                                        {props?.isPinned && props?.activity?.assignedPersonnel && <View style={styles.section}>
                                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                                <RenderPinned  config={props.config} assignedPersonnel={props?.activity?.assignedPersonnel} />
                                            </View>
                                        </View>}
                                    </View>
                                </View>
                            </View>

                            {/*<View  style={[styles.circle,{ backgroundColor: 'rgba(26,89,211,1)'}]} /> */}

                        </View>
                        </Swipeable>
                    </TouchableOpacity>
            </View>


    );
}