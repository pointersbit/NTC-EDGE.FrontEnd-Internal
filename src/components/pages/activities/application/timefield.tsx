import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useMemo} from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular,Regular500} from "@styles/font";
import useSafeState from "../../../../hooks/useSafeState";
import CheckIcon from "@assets/svg/check";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {ampmArray, datesArray, formatAMPM, hoursArray, toIsoFormat} from "../../../../utils/ntc";
import {disabledColor} from "@styles/color";
import CloseIcon from "@assets/svg/close";
import Moment from "moment";
const styles = StyleSheet.create({
    group2 : {
        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        marginTop : 8 ,
        flexWrap: "wrap",
        paddingHorizontal : 10  ,
        fontSize: fontValue(12)
    } ,
    detail : {
        fontSize: fontValue(14),
        fontFamily : Regular ,
        paddingRight : 0 ,
        textAlign : "left" ,
        flex : 1 ,
        alignSelf : "flex-start"
    } ,
    detailInput : {
        fontSize: fontValue(14),
        fontFamily : Regular500 ,
        color : "#121212" ,
        flex : 1 ,

        textAlign : "left"
    } ,
})





const TimeField = (props: { updateApplication?:any, hasChanges?:any, display?:string, showEdit?:boolean, show?:boolean, editable?:boolean, updateForm?:any, stateName?:string, edit:string, label: string, applicant?: any }) => {

    const dates = useMemo(() =>props?.applicant?.split('T')?.[0]?.split('-'), [props?.applicant])

    const year = dates?.[0]
    const month = dates?.[1]
    const day = dates?.[2]

    const [edit, setEdit] = useSafeState(false)
    const [hourValue, setHourValue] = useSafeState()



    const [minuteValue, setMinuteValue] = useSafeState(0)
    const [ampmValue, setAmpmValue] = useSafeState(0)
    const [cloneValue, setCloneValue] = useSafeState(props.applicant)


    const time = useMemo(() => {
        const format = formatAMPM(new Date(props?.applicant))
        setHourValue(format?.[0])
        setMinuteValue(format?.[1])
        setAmpmValue(format?.[2])
        return format
    }, [props?.applicant])

    useEffect(()=>{

        if(!props?.edit) return
        props.updateForm(props.stateName, toIsoFormat(Moment(`${year}-${month}-${day} ${hourValue}:${minuteValue} ${ampmValue}`,'YYYY-MM-DD HH:mm a')))
    }, [minuteValue, hourValue, ampmValue])

    return (!edit ? (props.show && (props.display || props.applicant) && !props.edit) || edit : !edit) ? <View  style={ styles.group2 }>
        <Text style={ styles.detail }>{ props.label }</Text>
        <Text style={ styles.detailInput }>{ props.display || props.applicant }</Text>
    </View> : <>
        {((props.edit && props.editable && props.showEdit) || edit)?  <View style={{paddingBottom: 10}}><View >
            <View style={{padding: 3,flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flex: 0.9}}>
                    <CustomDropdown value={hourValue}
                                    label="Hour"
                                    data={hoursArray}
                                    onSelect={({value}) => {
                                        if (value) setHourValue(value)
                                    }}/>
                </View>
                <View style={{flex:0.7, paddingHorizontal: 5}}>
                    <CustomDropdown value={minuteValue}
                                    label="Minute"
                                    data={datesArray}
                                    onSelect={({value}) => {
                                        if (value) setMinuteValue(value)
                                    }}/>
                </View>
                <View style={{flex:0.7}}>
                    <CustomDropdown value={ampmValue}
                                    label="AM/PM"
                                    data={ampmArray}
                                    onSelect={({value}) => {
                                        if (value) {
                                            setAmpmValue(value)

                                        }
                                    }}/>
                </View>

            </View>
            {/*<View style={{ flexDirection: "row", justifyContent: "space-around" , borderRadius: 1, borderTopWidth: 1, borderColor: disabledColor}}>
                <TouchableOpacity onPress={()=>{
                    //year, month, day, hour, minute, second, and millisecond


                    props?.updateApplication()
                    setEdit(false)
                }
                } style={{alignSelf: "center", padding: 3}}>
                    <CheckIcon color={"rgba(0, 0, 0, 0.5)"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    props.updateForm(props.stateName, cloneValue)
                    setEdit(false)

                }
                } style={{alignSelf: "center", padding: 3}}>
                    <CloseIcon color={"rgba(0, 0, 0, 0.5)"}/>
                </TouchableOpacity>
            </View>*/}
        </View></View> : <></>}
    </>

}

TimeField.defaultProps = {
    editable: true,
    show: true,
    showEdit: true
}
export default TimeField
