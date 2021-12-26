import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Entypo} from '@expo/vector-icons'
import {styles} from "@pages/activities/styles";
import Collapsible from "react-native-collapsible";
import {DATE_ADDED} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setNotPinnedApplication, setPinnedApplication} from "../../../reducers/application/actions";
import ActivityModal from "@pages/activities/modal";
import axios from "axios";
import FilterIcon from "@assets/svg/filterIcon";
import {
    checkFormatIso,
} from "@pages/activities/script";
import {Activities, Application} from "@pages/activities/interface";
import SearchIcon from "@assets/svg/search";
import {ActivityItem} from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import {BASE_URL} from "../../../services/config";
import {setVisible} from "../../../reducers/activity/actions";


export default function ActivitiesPage(props:any) {




const user = useSelector((state: RootStateOrAny) => state.user);
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
const {pinnedApplications, notPinnedApplications} = useSelector((state: RootStateOrAny) => state.application)
    const dispatch = useDispatch()
    const ispinnedApplications = (applications: any) =>{
        setTotalPages(Math.ceil(applications.length / 10));
        const sortByDate = (arr: any) => {
            const sorter = (a: any, b: any) => {
                return new Date(checkFormatIso(a.createdAt, "-")).getTime() - new Date(checkFormatIso(b.createdAt, "-")).getTime();
            }
            return arr?.sort(sorter);
        };


        const selectedClone = selectedChangeStatus?.filter((status: string) => {
            return status != DATE_ADDED
        })
        const list = (selectedChangeStatus?.indexOf(DATE_ADDED) != -1 ? sortByDate(applications) : applications).filter((item: Application) => {
            return item?.applicant?.user?.firstName.includes(searchTerm) &&
                (selectedClone?.length ? selectedClone.indexOf(item.status) != -1 : true)
        });
        setIsPinnedActivity(0)
        const groups = list.reduce((groups: any, activity: any) => {
            const date = checkFormatIso(activity.createdAt, "-");
            if (activity.isPinned) {
                setIsPinnedActivity(isPinnedActivity + 1)
            }
            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(activity);
            return groups;
        }, {});
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                activity: groups[date]
            };
        });
        let a = [];
        for (let i = 0; i < groupArrays.length; i++) {
            a.push(0);
        }
        setNumberCollapsed(a)
        return groupArrays.slice(0, currentPage * 10);
    }

    useEffect(() => {
        const config = {
            headers: {
                Authorization: "Bearer ".concat(user.sessionToken)
            }
        }
        let res: any = [];
        dispatch(setNotPinnedApplication([]))
        dispatch(setPinnedApplication([]))

        axios.get(BASE_URL + '/applications/notpinned',config).then((response) =>{

            dispatch(setNotPinnedApplication(response.data))
        }).catch((err) =>{
            console.log(err)
        })
        axios.get(BASE_URL + '/applications/pinned',config).then((response) =>{
            dispatch(setPinnedApplication(response.data))
        }).catch((err) =>{
            console.log(err)
        })



    }, [])

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [offset, setOffset] = useState((currentPage - 1) * perPage)
    const [totalPages, setTotalPages] = useState(0)
    const [numberCollapsed, setNumberCollapsed] = useState<number[]>([])
    const [isPinnedActivity, setIsPinnedActivity] = useState(0)

    const pnApplications = useMemo(() => {
        return ispinnedApplications(pinnedApplications)
    }, [searchTerm, selectedChangeStatus?.length, pinnedApplications?.length, currentPage])

    const notPnApplications = useMemo(() => {
        return ispinnedApplications(notPinnedApplications)
    }, [searchTerm, selectedChangeStatus?.length, notPinnedApplications?.length, currentPage])


    const userPress = (index: number) => {
        var newArr = [...numberCollapsed]
        newArr[index] = newArr[index] ? 0 : 1
        setNumberCollapsed(newArr)
    }
    const [modalVisible, setModalVisible] = useState(false)
    const onDismissed = () => {
        setModalVisible(false)
    }

    const [details, setDetails] = useState({})
    return (
        <>

          <View  style={[styles.container]}>


                <View style={styles.group}>
                    <View style={styles.rect}>
                        <View style={styles.rect4Row}>
                            <View>

                                <Image style={styles.rect4} source={require('./../../../../assets/favicon.png')}/>

                            </View>
                            <Text style={styles.activity}>Activity</Text>
                        </View>
                        <View style={styles.rect4RowFiller}/>
                        <View style={styles.rect5}>
                            <TouchableOpacity onPress={() => {
                                dispatch(setVisible(true))
                            }

                            }>
                                <FilterIcon width={18} height={18} fill={"#fff"}/>

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.group9}>

                    <View style={styles.searcg}>
                        <View style={styles.rect26}>

                            <View style={styles.rect7}>
                                <View style={styles.iconRow}>

                                        <SearchIcon style={styles.icon}></SearchIcon>

                                        <TextInput
                                            placeholder="search"
                                            style={styles.textInput}
                                            onChange={(event) => setSearchTerm(event.nativeEvent.text)}
                                        ></TextInput>

                                </View>
                            </View>

                        </View>

                        {pnApplications.length > 0 &&
                        <View style={styles.pinnedgroup}>
                            <View style={styles.pinnedcontainer}>
                                <Text style={styles.pinnedActivity}>Pinned activity</Text>
                            </View>
                        </View>}

                        { pnApplications.map((item, index) => {


                                return item.activity.map((act: any, i: number) => {
                                    return  act?.assignedPersonnel == user?._id && <ActivityItem

                                        activity={act}
                                        onPressUser={() => {
                                            setDetails({...act, ...{isPinned: true}})
                                            setModalVisible(true)
                                        }} index={i} swiper = {renderSwiper}/>
                                })
                            })
                        }

                    </View>
                    <View style={styles.rect27}></View>
                </View>
                <ScrollView style={{flex: 1}} onScroll={(event) => {

                    let paddingToBottom = 10
                    paddingToBottom +=
                        event.nativeEvent.layoutMeasurement.height;
                    var currentOffset =
                        event.nativeEvent.contentOffset.y;
                    let direction = (currentOffset > event.nativeEvent.contentOffset.y ? 'down' : 'up');

                    if (direction === 'up') {

                        if (
                            event.nativeEvent.contentOffset.y >=
                            event.nativeEvent.contentSize.height -
                            paddingToBottom
                        ) {

                            if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1)
                                setOffset((currentPage - 1) * perPage)
                            }
                        }
                    }

                }}
                            scrollEventThrottle={16}
                >
                    {
                        notPnApplications.map((item: any, index: number) => {


                            return item.assignedPersonnel == user?.role?.key && <View key={index} style={styles.group26}>
                                <TouchableWithoutFeedback onPress={() => userPress(index)}>
                                    <View style={styles.group25}>
                                        <View style={styles.rect34}>
                                            <View style={styles.group24}>
                                                <View style={styles.dateStack}>
                                                    <Text style={styles.date}>{item.date}</Text>
                                                    <View style={styles.rect36}></View>
                                                </View>
                                            </View>
                                            <View style={styles.group24Filler}></View>
                                            <View style={styles.group23}>
                                                <View style={styles.stackFiller}></View>
                                                <View style={styles.icon4Stack}>
                                                    <Entypo
                                                        name="chevron-thin-down"
                                                        style={styles.icon4}
                                                    />
                                                    <View style={styles.rect35}></View>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Collapsible collapsed={numberCollapsed[index] == 1}>
                                    {item.activity.map((activity: any, i: number) => {
                                        return  <ActivityItem
                                            key={i}
                                            activity={activity}
                                            onPressUser={() => {
                                            setDetails({...activity, ...{isPinned: false}})
                                            setModalVisible(true)
                                        }} index={i} swiper={renderSwiper}/>
                                    })}
                                </Collapsible>

                            </View>
                        })
                    }
                </ScrollView>
                <ActivityModal details={details} visible={modalVisible} onDismissed={onDismissed}/>

            </View>
        </>

    );
}


