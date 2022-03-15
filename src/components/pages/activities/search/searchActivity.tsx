import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator ,
    Dimensions ,
    FlatList , Platform ,
    ScrollView ,
    Text ,
    TextInput ,
    TouchableOpacity ,
    View
} from "react-native";
import BackSpaceIcon from "@assets/svg/backspace";
import CloseCircleIcon from "@assets/svg/closeCircle";
import {styles} from "@pages/activities/search/styles";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {ActivityItem} from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import ApplicationList from "@pages/activities/applicationList";
import {unreadReadApplication} from "@pages/activities/script";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ActivityModal from "@pages/activities/modal";
import Loader from "@pages/activities/bottomLoad";
import useCountUp from "../../../../hooks/useCountUp";
import {Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";

import NoActivity from "@assets/svg/noActivity";

const {height} = Dimensions.get('screen');
import lodash from 'lodash';
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import ActivityModalView from "@pages/activities/nativeView/activityModalView";
import {setApplicationItem} from "../../../../reducers/application/actions";
export function SearchActivity(props: {isHandleLoad:any, isRecentSearches: any, clearAll: any, total: any, loading: boolean, setText: any, handleLoad: any, bottomLoader: any, size: any, refreshing: any, applications: any, onPress: () => void, value: string, onEndEditing: () => void, onChange: (event) => void, onChangeText: (text) => void, onPress1: () => void, translateX: any, nevers: [], callbackfn: (search, index) => JSX.Element }) {
    const inputRef = useRef(null);
    const [moreModalVisible, setMoreModalVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const user = useSelector((state: RootStateOrAny) => state.user);
    const dispatch = useDispatch()
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
        }
    }
    const {applicationItem} = useSelector((state: RootStateOrAny) => state.application)
    const [activityItemLength, setActivityItemLength] = useState(0)
    const [updateUnReadReadApplication, setUpdateUnReadReadApplication] = useState(false)
    const onFocusHandler = () => {
        inputRef.current && inputRef.current.focus();
    }
    useEffect(() => {
        onFocusHandler()
    }, [])

    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false)
    const unReadReadApplicationFn = (id, dateRead, unReadBtn, callback: (action: any) => void) => {
        unreadReadApplication({unReadBtn : unReadBtn, dateRead : dateRead, id : id, config : config, dispatch : dispatch, setUpdateUnReadReadApplication : setUpdateUnReadReadApplication, callback : callback});
    }
    const [isOpen, setIsOpen] = useState()

    const onMoreModalDismissed = (isOpen) => {

        setIsOpen(isOpen)
        setMoreModalVisible(false)
    }
    const onDismissed = () => {
        setModalVisible(false)
    }
    const AnimatedTotal = (props) => {
        const progress = useCountUp(2000)
        const countUp = Math.max(0, Math.round(progress * props.total))
        return <Text>{countUp}</Text>
    }
    return <View style={[styles.container, {flexDirection: "row"}]}>
        <View style={[styles.group9, { flex: (isMobile) ? 1 : 0.4,} ]}>
            <View style={styles.group4}>
                <View style={styles.rect}>
                    <View style={styles.group2}>
                        <TouchableOpacity style={{  paddingRight: 10}} onPress={()=> {
                            onDismissed()
                            props.onPress()
                        }}>
                            <BackSpaceIcon
                                width={fontValue(20)}
                                height={fontValue(16)}
                                style={styles.icon}
                            ></BackSpaceIcon>
                        </TouchableOpacity>

                        <View  style={styles.group}>
                            <InputField  ref={inputRef}
                                         inputStyle={{fontWeight: "400", fontSize: fontValue(14)}}
                                         value={props.value}
                                         onEndEditing={props.onEndEditing}
                                         onChange={props.onChange}
                                         onChangeText={props.onChangeText}
                                         placeholder="Search"/>

                        </View>

                    </View>
                </View>
            </View>

            <View
                style={[styles.group8, {backgroundColor: props.value.length < 1 || props.total == 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",}]}>

                {!props?.loading && props.value.length < 1 && <View style={[styles.header, { justifyContent: props.isRecentSearches ? "space-between": "center",}]}>

                    <Text
                        style={[styles.recentSearches]}>{props.nevers.length &&  props.isRecentSearches == true ? "Recent Searches" : props.isRecentSearches == true ? "No Recent Searches" : <ActivityIndicator/>}</Text>

                    <TouchableOpacity onPress={props.clearAll}>
                        <Text style={{
                            fontSize: fontValue(14),
                            color: '#2863D6',
                             fontFamily: Regular500  ,
                        }}>{props.nevers.length ? "Clear all" : ""}</Text>
                    </TouchableOpacity>

                </View>}


                {props?.loading &&
                <View style={{backgroundColor: "#fff", paddingVertical: 10}}>
                    <Loader/>
                </View>

                }
                <View style={{flex: 1}}>
                    {props.value.length < 1 ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {props.nevers.map(props.callbackfn)}
                        </ScrollView>
                        : <>
                            {!props?.loading && props.value.length > 0 &&
                            <View style={styles.header}>
                                <Text style={styles.recentSearches}>
                                    {props.isHandleLoad ? <AnimatedTotal total={props.total}/> : props.total } results of
                                    "<Text>{props.value}</Text>"</Text>
                            </View>
                            }
                            <FlatList
                                style={{flex: 1}}
                                data={props.applications}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={() => {
                                    if (    !onEndReachedCalledDuringMomentum) {
                                        props.handleLoad(props.value)
                                        setOnEndReachedCalledDuringMomentum(true);
                                    }

                                }}
                                onEndReachedThreshold={0.1}
                                onMomentumScrollBegin={() => {
                                    setOnEndReachedCalledDuringMomentum(false)
                                }}
                                renderItem={({item, index}) => (
                                    <ApplicationList

                                        key={index}
                                        onPress={() => {


                                        }}
                                        item={item}
                                        index={index}
                                        element={(activity: any, i: number) => {

                                            return (
                                                <ActivityItem
                                                    isOpen={isOpen}
                                                    config={config}
                                                    searchQuery={props.value}
                                                    key={i}
                                                    parentIndex={index}
                                                    role={user?.role?.key}
                                                    activity={activity}
                                                    currentUser={user}
                                                    selected={applicationItem?._id == activity?._id}
                                                    onPressUser={(event: any) => {
                                                        setIsOpen(undefined)
                                                        dispatch(setApplicationItem({...activity, isOpen:`${index}${i}`}))
                                                        if (event?.icon == 'more') {
                                                            setMoreModalVisible(true)
                                                        } else {
                                                            setModalVisible(true)
                                                        }

                                                    }} index={`${index}${i}`}
                                                    swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                                            )
                                        }}/>
                                )}
                            />
                        </>
                    }
                </View>
            </View>


        </View>

        {
            !(isMobile) && lodash.isEmpty(applicationItem) &&
            <View style={ [{ flex : 0.6 , justifyContent : "center" , alignItems : "center" }] }>

                <NoActivity/>
                <Text style={ { color : "#A0A3BD" , fontSize : fontValue(24) } }>No activity
                    selected</Text>



            </View>
        }


        { !lodash.isEmpty(applicationItem) && <ActivityModalView>
        <ItemMoreModal details={applicationItem} visible={moreModalVisible} onDismissed={()=>{
            onMoreModalDismissed(applicationItem?.isOpen)
        }
        }/>
        <ActivityModal details={applicationItem}
                       visible={modalVisible}
                       onDismissed={(event: boolean, _id: number) => {

                           dispatch(setApplicationItem({}))
                           if (event && _id) {
                               //  dispatch(deleteApplications(_id))
                           }
                           onDismissed()
                       }}/>  </ActivityModalView>}
    </View>;
}
