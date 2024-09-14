import React, {memo, useMemo, useRef, useState} from "react";
import {Animated, Text, TouchableWithoutFeedback, View} from "react-native";
import {styles} from "@pages/activities/styles";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
import {formatDate, readableToHuman} from "@pages/activities/script";
import moment from "moment";
import {useAlert} from "../../../hooks/useAlert";
import ChevronUpIcon from "@assets/svg/chevron-up";
import {fontValue} from "@pages/activities/fontValue";

const ApplicationList=(_props:{onPress:()=>void,item:any,numbers:{parentIndex:number,child:number[]}[],index:number,element:(activity:any,i:number)=>JSX.Element})=>{
    const props = useMemo(() => _props , [_props])
    const chevronValue=useRef(new Animated.Value(0)).current;
    const [isOpen,setIsOpen]=useState(true);
    const {springValue,_springHide}=useAlert(true,()=>{
    });

    const container = useMemo(() => {
        return [styles.group26,]
    }, [])

    const subcontainer = useMemo(() => {
        return [styles.group25]
    }, [])
    const rect = useMemo(() => {
        return [styles.rect34]
    }, [])
    const date = useMemo(() => {
        return [styles.date]
    }, [])
    const dateText = useMemo(() => {
        return [styles.dateText]
    }, [])
    const content = useMemo(() => {
        return {flexDirection:"row",justifyContent:"space-between",alignItems:"center",}
    }, [])
    const ActivityMemo = useMemo(() => {

        return props.item.activity.map(props.element)
    }, [props.element ])
    return <View style={container}>
        <View>
            <View style={subcontainer}>

                <View style={rect}>

                    <View>

                        <View style={date}>
                            <Text
                                style={dateText}>{`${readableToHuman(props.item.date)} • ${moment(props.item.date).format('MMM DD, yyyy')}`} </Text>
                        </View>
                    </View>
                    <View style={content}>
                        <View style={{flex:0.1,alignItems:"center"}}>

                            <TouchableWithoutFeedback onPress={()=>setIsOpen(open=>!open)}>
                                <View>

                                    {isOpen ?
                                     <ChevronUpIcon width={fontValue(24)} height={fontValue(24)} color={"#000"}/> :
                                     <ChevronDownIcon width={fontValue(24)} height={fontValue(24)} color={"#000"}/>}


                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                        {/*<View style={{alignItems: "center"}}>
                            <TouchableOpacity>
                                <DotVertical  width={fontValue(4)} height={fontValue(18)}  />
                            </TouchableOpacity>

                        </View>*/}


                    </View>
                </View>
            </View>
        </View>
        {
            isOpen ? <View>
                {ActivityMemo}
                <View style={{height:30,backgroundColor:"white"}}/>
            </View> : null
        }


    </View>;
};


export default (ApplicationList);
