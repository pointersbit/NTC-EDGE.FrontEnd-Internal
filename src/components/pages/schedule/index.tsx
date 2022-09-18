import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {Animated, FlatList, Platform, TextInput, TouchableOpacity, View} from "react-native";
import {isTablet} from "react-native-device-info";
import Text from "@atoms/text"
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React from "react";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";
import LeftSideWeb from "@atoms/left-side-web";
import lodash from "lodash";
import {disabledColor, input, successColor} from "@styles/color";
import {setSchedule} from "../../../reducers/schedule/actions";
import ScheduleCreateEdit from "@pages/schedule/ScheduleCreateEdit";
import useSchedule from "../../../hooks/useSchedule";

const {text, background} = input;


export default function SchedulePage(props: any) {
    const {
        dimensions,
        animation,
        background,
        display,
        success,
        dispatch,
        schedule,
        value,
        setValue,
        createSchedule,
        setCreateSchedule,
        onClose,
        formValue,
        setFormValue,
        onUpdateForm,
        handleStartPress,
        handleEndPress,
        onUpdateCreateSchedule,
        onDateChange,
        updateValid,
        renderListItem,
        schedulesMemo,
        listEmptyComponent
    } = useSchedule(props);

    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>

            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Schedules"}>
                        <TouchableOpacity onPress={() => {
                            let _formValue = [...formValue]
                            for (let i = 0; i < _formValue.length; i++) {
                                _formValue[i].value = ""
                            }
                            setFormValue(_formValue)
                            dispatch(setSchedule([]))
                            if (isMobile) {
                                props.navigation.push('CreateScheduleScreen')
                            } else {
                                setCreateSchedule(true)
                            }


                        }}>
                            <Text style={{fontSize: fontValue(12)}}>Add a New Schedule</Text>
                        </TouchableOpacity>
                    </Header>
                    <View style={{marginHorizontal: 26,}}>

                        <View style={{
                            paddingTop: 14,
                            paddingBottom: 12,
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}>
                            <View style={{flex: 1, paddingRight: 15}}>
                                <TextInput value={value} onChangeText={text => {
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>


                        </View>


                    </View>

                </View>
                <View style={{flex: 1}}>
                    <FlatList
                        ListEmptyComponent={listEmptyComponent}
                        data={schedulesMemo}
                        contentContainerStyle={{padding: 10,}}
                        renderItem={renderListItem}
                        keyExtractor={item => item._id}
                    />
                </View>
            </LeftSideWeb>


            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && (!createSchedule) && lodash.isEmpty(schedule) && dimensions?.width > 768 ?
                    <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                        <NoActivity/>
                        <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                            selected</Text>


                    </View> : <></>
            }

            {
                !lodash.isEmpty(schedule) && Platform.OS == "web" ? <View style={[{flex: 1, backgroundColor: "#fff",}]}>

                    <Header size={24} title={"Schedule: "}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>


                    <ScheduleCreateEdit formElements={formValue} onChange={onUpdateForm} onPress={handleStartPress}
                                        onPress1={handleEndPress} backgroundColor={background} scale={display}
                                        translateY={success} onPress2={() => {
                        Animated.spring(animation, {
                            toValue: 0,
                            useNativeDriver: false,
                        }).start();
                    }} dimensions={dimensions} onDateChange={onDateChange}/>
                    <View style={{

                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateSchedule('patch')} disabled={!updateValid}
                                          style={{
                                              backgroundColor: updateValid ? successColor : disabledColor,
                                              paddingVertical: 10,
                                              paddingHorizontal: 20,
                                              borderRadius: 10
                                          }}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Update Schedule</Text>

                        </TouchableOpacity>
                    </View>


                </View> : <></>
            }


            {(createSchedule && lodash.isEmpty(schedule) && !isMobile) ?
                <View style={[{flex: 1, backgroundColor: "#fff",}]}>
                    <Header size={24} title={"Create Schedule"}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </Header>
                    <ScheduleCreateEdit formElements={formValue} onChange={onUpdateForm} onPress={handleStartPress}
                                        onPress1={handleEndPress} backgroundColor={background} scale={display}
                                        translateY={success} onPress2={() => {
                        Animated.spring(animation, {
                            toValue: 0,
                            useNativeDriver: false,
                        }).start();
                    }} dimensions={dimensions} onDateChange={onDateChange}/>
                    <View style={{
                        bottom: 0,
                        margin: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => onUpdateCreateSchedule('post')} style={styles.scheduleButton}>

                            <Text style={[styles.text, {color: "#fff"}]} size={14}>Create Schedule</Text>

                        </TouchableOpacity>
                    </View>
                </View> : <></>

            }

        </View>
    )
}
