import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    useWindowDimensions,
    Platform,
    RefreshControl,
    ScrollView,
    Animated,
    FlatList, ViewProps, StyleProp, ViewStyle, FlatListProps, TouchableOpacity, StatusBar
} from "react-native";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import FilterPressIcon from "@assets/svg/filterPress";
import FilterIcon from "@assets/svg/filterIcon";
import {
    CBAnimatedNavBar,
    CBAnimatedHeader,
    CBAnimatedTabBar,
    CBTabRoute,
    CBTabView,
    CBTabBar, Theme,
} from "./lib";
import {
    setApplicationItem,
    setEdit,
    setHasChange,
    setNotPinnedApplication,
    setPinnedApplication,
    setSelectedYPos
} from "../../../reducers/application/actions";
import { useScrollManager } from "./hooks";
import { Scene, NavBar, NavBarTitle, Header } from "./components";
import ApplicationList from "@pages/activities/applicationList";
import {isMobile} from "@pages/activities/isMobile";
import {isLandscapeSync, isTablet} from "react-native-device-info";
import useActivities from "../../../hooks/useActivities";
import {ActivityItem} from "@pages/activities/activityItem";
import {infoColor, primaryColor} from "@styles/color";
import {AnimatedFlatList} from "@pages/activities/components/ConnectionList";
import listEmpty from "@pages/activities/listEmpty";
import {ACTIVITYITEM, SEARCH, SEARCHMOBILE} from "../../../reducers/activity/initialstate";
import {styles as styles1} from "@pages/activities/styles";
import {RootStateOrAny, useSelector} from "react-redux";
import lodash from "lodash";
import {
    removeActiveMeeting,
    resetCurrentMeeting,
    setActiveMeetings,
    setMeeting,
    setOptions
} from "../../../reducers/meeting/actions";
import IMeetings from "../../../interfaces/IMeetings";
import IParticipants from "../../../interfaces/IParticipants";
import {openUrl} from "../../../utils/web-actions";
import {setSelectedChannel} from "../../../reducers/channel/actions";
import {HeaderConfig} from "@pages/activities/types/HeaderConfig";
import {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue
} from "react-native-reanimated";
import {ScrollPair} from "@pages/activities/types/ScrollPair";
import useScrollSync from "@pages/activities/hooks/useScrollSync";
import {Visibility} from "@pages/activities/types/Visibility";
import {Connection} from "@pages/activities/types/Connection";
import {Regular, Regular500} from "@styles/font";
import {MeetingNotif} from "@molecules/list-item";
import {getChannelName} from "../../../utils/formatting";
import {FakeSearchBar} from "@pages/activities/fakeSearchBar";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ActivityModal from "@pages/activities/modal";
import RefreshWeb from "@assets/svg/refreshWeb";
import RefreshRN from "@assets/svg/refreshRN";
import HomeMenuIcon from "@assets/svg/homemenu";
import {setVisible} from "../../../reducers/activity/actions";
import useMemoizedFn from "../../../hooks/useMemoizedFn";
import {TabBar, TabBarIndicator} from "react-native-tab-view";
const initialWidth = Dimensions.get("window").width;
export type tabKeys = "all" | "pending" | "history";
export const tabs = [
    { key: "all" as tabKeys, title: "All" },
    { key: "pending" as tabKeys, title: "Pending" },
    { key: "history" as tabKeys, title: "History" },
];

const TAB_BAR_HEIGHT = 48;
const OVERLAY_VISIBILITY_OFFSET = 32;
const ActivitiesPage = (props) => {
    const dimensions = useWindowDimensions();
    const Filter = (
        isMobile && !(
            Platform?.isPad || isTablet())) || dimensions?.width <= 768 ? FilterIcon : FilterPressIcon;
    const {
        isReady,
        user,
        setUpdateModal,
        config,
        visible,
        applicationItem,
        dispatch,
        getActiveMeetingList,
        endMeeting,
        leaveMeeting,
        searchTerm,
        refreshing,
        onRefresh,
        numberCollapsed,
        searchVisible,
        pnApplications,
        notPnApplications,
        userPress,
        modalVisible,
        setModalVisible,
        moreModalVisible,
        setMoreModalVisible,
        onDismissed,
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
        bottomLoader,
        handleLoad,
        unReadReadApplicationFn,
        updateModalFn,
        isOpen,
        onMoreModalDismissed,
        sizeComponent,
        onLayoutComponent,
        onSearchLayoutComponent,
        onActivityLayoutComponent,
        containerHeight,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        onScrollEndDrag,
        headerTranslate,
        opacity,
        activitySizeComponent,
        scrollViewRef, yPos, setYPos,
        flatListViewRef,
        pinnedApplications,
        notPinnedApplications
    } = useActivities(props);




    const normalizeActiveMeetings = useSelector((state: RootStateOrAny) => state.meeting.normalizeActiveMeetings);

    const meeting = useSelector((state: RootStateOrAny) => state.meeting.meeting);
    const meetingList = useMemo(() => {
        if (meeting?._id) {
            return [];
        }
        let meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m]);
        meetingList = lodash.reject(meetingList, (m: IMeetings) => lodash.find(m.participants, (p: IParticipants) => p._id === user._id && (p.status === 'busy' || p.muted)));
        return lodash.orderBy(meetingList, 'updatedAt', 'desc');
    }, [normalizeActiveMeetings, meeting]);

    useEffect(() => {
        let unMount = false;
        getActiveMeetingList((err, result) => {
            if (!unMount) {
                if (result) {
                    dispatch(setActiveMeetings(result));
                }
            }
        });
        return () => {
            unMount = true;
        }
    }, []);
    const onJoin = (item: IMeetings) => {
        if (Platform.OS === 'web') {
            return openUrl(`/VideoCall?meetingId=${item._id}`);
        }
        dispatch(setSelectedChannel(item.room));
        dispatch(resetCurrentMeeting());
        setTimeout(() => {
            dispatch(setOptions({
                isHost: item.host._id === user._id,
                isVoiceCall: item.isVoiceCall,
                isMute: false,
                isVideoEnable: true,
            }));
            dispatch(setMeeting(item));
        }, 100);
    };

    const onClose = (item: IMeetings, leave = false) => {
        if (leave && item?.isGroup) {
            dispatch(removeActiveMeeting(item?._id));
            return leaveMeeting(item?._id, 'busy');
        } else if (item?.host?._id === user?._id || !item?.isGroup) {
            return endMeeting(item._id);
        } else {
            return dispatch(removeActiveMeeting(item?._id));
        }
    };


    const {top, bottom} = useSafeAreaInsets();

    const {height: screenHeight} = useWindowDimensions();

    const allRef = useRef<FlatList>(null);
    const pendingRef = useRef<FlatList>(null);
    const historyRef = useRef<FlatList>(null);

    const [tabIndex, setTabIndex] = useState(0);

    const [headerHeight, setHeaderHeight] = useState(0);
    const {
        scrollY,
        index,
        setIndex,
        getRefForKey,
        ...sceneProps
    } = useScrollManager(tabs, Theme.sizing, headerHeight);
    const defaultHeaderHeight = (!!lodash.size(meetingList) ? 80 : 0) + (Platform.OS == "web" ? 0 : 44);

    const headerConfig = useMemo<HeaderConfig>(
        () => ({
            heightCollapsed: defaultHeaderHeight,
            heightExpanded: headerHeight,
        }),
        [defaultHeaderHeight, headerHeight]
    );

    const {heightCollapsed, heightExpanded} = headerConfig;

    const headerDiff = heightExpanded - heightCollapsed;

    const rendered = headerHeight > 0;

    const handleHeaderLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
        useMemoizedFn((event) => {
            return setHeaderHeight(event.nativeEvent.layout.height)
        }),
        []
    );

    const allScrollValue = useSharedValue(0);

    const allScrollHandler = useAnimatedScrollHandler(
        (event) => (allScrollValue.value = event.contentOffset.y)
    );

    const pendingScrollValue = useSharedValue(0);

    const pendingScrollHandler = useAnimatedScrollHandler(
        (event) => (pendingScrollValue.value = event.contentOffset.y)
    );
    const historyScrollValue = useSharedValue(0);

    const historyScrollHandler = useAnimatedScrollHandler(
        (event) => (historyScrollValue.value = event.contentOffset.y)
    );
    const scrollPairs = useMemo<ScrollPair[]>(
        () => [
            {list: allRef, position: allScrollValue},
            {list: pendingRef, position: pendingScrollValue},
            {list: historyRef, position: historyScrollValue},
        ],
        [allRef, allScrollValue, pendingRef, pendingScrollValue, historyRef, historyScrollValue]
    );

    const {sync} = useScrollSync(scrollPairs, headerConfig);

    const сurrentScrollValue = useDerivedValue(
        () =>
            tabIndex === 0 ? allScrollValue.value : tabIndex == 1 ? pendingScrollValue.value : historyScrollValue.value,
        [tabIndex, allScrollValue, pendingScrollValue, historyScrollValue]
    );

    const translateY = useDerivedValue(
        () => -Math.min(сurrentScrollValue.value, headerDiff)
    );

    const tabBarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
    }));

    const headerAnimatedStyle = useAnimatedStyle(() => {

        return {
            transform: [{translateY: translateY.value}],
            opacity: interpolate(
                translateY.value,
                [-headerDiff, 0],
                [Visibility.Hidden, Visibility.Visible],
            ),
        };
    })

    const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => ({
            paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
            paddingBottom: bottom,
            minHeight: screenHeight + headerDiff,
        }),
        [rendered, headerHeight, bottom, screenHeight, headerDiff]
    );

    const sharedProps = useMemo<Partial<FlatListProps<Connection>>>(
        () => ({
            contentContainerStyle,
            onMomentumScrollEnd: sync,
            onScrollEndDrag: sync,
            scrollEventThrottle: 16,
            scrollIndicatorInsets: {top: heightExpanded},
        }),
        [contentContainerStyle, sync, heightExpanded]
    );
    const onDismissedModal = (event: boolean, _id: number) => {
        setUpdateModal(false);
        console.log("onRefresh")
        dispatch(setApplicationItem({}));
        if (event && _id) {
            //  dispatch(deleteApplications(_id))
        }
        if (event) {
            console.log("onRefresh")
            onRefresh()
        }
        onDismissed()
    };
    const onChangeAssignedId = (event) => {
        let _notPinnedApplications = [...notPinnedApplications]
        let _pinnedApplications = [...pinnedApplications]
        let flag = 1

        for (let i = 0; i < _notPinnedApplications?.length; i++) {
            if (!flag) break
            if (_notPinnedApplications?.[i]?._id == event?._id) {
                _notPinnedApplications[i] = event
            }
        }
        flag = 1
        for (let i = 0; i < _pinnedApplications?.length; i++) {
            if (!flag) break
            if (_pinnedApplications?.[i]?._id == event?._id) {
                _notPinnedApplications.unshift(event)
                _pinnedApplications.splice(i, 1)
            }
        }

        dispatch(setApplicationItem(event))
        dispatch(setNotPinnedApplication(_notPinnedApplications))
        dispatch(setPinnedApplication(_pinnedApplications))
        setUpdateModal(true);
    };
    const onChangeEvent = (event) => {
        dispatch(setApplicationItem(event))
        setUpdateModal(true);
    };

    const listHeaderComponent = () => <>
        {!searchVisible && !!pnApplications?.length && containerHeight &&
            <View style={[styles1.pinnedActivityContainer, {
                marginBottom: 5,
                paddingBottom: 20,
                backgroundColor: "#fff"
            }]}>
                {!!pnApplications?.length &&
                    <View style={[styles1.pinnedgroup, {height: undefined}]}>
                        <View style={[styles1.pinnedcontainer, {paddingVertical: 10}]}>
                            <Text style={[styles1.pinnedActivity, {fontFamily: Regular500,}]}>Pinned
                                Activity</Text>
                        </View>
                    </View>}
                {/* <TouchableOpacity onPress={()=>{
            scrollViewRef?.current?.scrollTo({ y: yPos, animated: true });
            }}>
                <Text>test</Text>
            </TouchableOpacity>*/}
                <ScrollView showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            onScroll={(event) => {
                                if (!isMobile) {
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            resolve(event?.nativeEvent?.contentOffset?.y)
                                        }, 1000);
                                    }).then((data) => {
                                        setYPos(data)
                                    });
                                }

                            }}
                            scrollEventThrottle={16}
                            ref={scrollViewRef}
                            style={{maxHeight: 300}}>
                    {
                        pnApplications.map((item: any, index: number) => {
                            return item?.activity && <FlatList
                                scrollEventThrottle={16}
                                key={index}
                                listKey={(item, index) => `_key${index.toString()}`}
                                showsVerticalScrollIndicator={false}
                                style={styles.items}
                                data={item?.activity}

                                renderItem={(act, i) => {
                                    return (
                                            act?.item?.assignedPersonnel?._id || act?.item?.assignedPersonnel) == user?._id &&
                                        <ActivityItem
                                            isOpen={isOpen}
                                            config={config}
                                            key={i}
                                            selected={applicationItem?._id == act?.item?._id}
                                            currentUser={user}
                                            role={user?.role?.key}
                                            searchQuery={searchTerm}
                                            activity={act?.item}
                                            isPinned={true}
                                            onPressUser={(event: any) => {


                                                /*unReadReadApplicationFn(act?._id, false, true, (action: any) => {
                                                })*/
                                                dispatch(setApplicationItem({...act?.item, isOpen: `pin${i}${index}`}));
                                                //setDetails({ ...act , isOpen : `pin${ i }${ index }` });
                                                if (event?.icon == 'more') {
                                                    setMoreModalVisible(true)
                                                } else {
                                                    if (Platform.OS == "web") {
                                                        setModalVisible(true)
                                                    } else {
                                                        props.navigation.navigate(ACTIVITYITEM, {
                                                            onDismissed: onDismissedModal,
                                                            onChangeEvent: onChangeEvent,
                                                            onChangeAssignedId: onChangeAssignedId
                                                        });
                                                    }
                                                }
                                                dispatch(setSelectedYPos({yPos, type: 1}))

                                            }} index={`pin${i}${index}`}
                                            swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, act?.item, unReadReadApplicationFn)}/>
                                }
                                }
                                keyExtractor={(item, index) => `_key${index.toString()}`}
                            />
                        })
                    }
                </ScrollView>

            </View>}
    </>;
    const  onEndReached = () => {
        if (!onEndReachedCalledDuringMomentum || !(
            isMobile && !(
                Platform?.isPad || isTablet()))) {
            handleLoad();
            setOnEndReachedCalledDuringMomentum(true);
        }
    }

    const  listEmptyComponent = () => listEmpty(refreshing, searchTerm, (tabIndex == 0) ? notPnApplications.length + pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
        act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : tabIndex == 1 ? pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
        act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : notPnApplications.length);

    const renderAllActivities = useCallback(
        () => <AnimatedFlatList

            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    progressViewOffset={headerHeight + 42}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            ListHeaderComponent={listHeaderComponent()}
            style={{flex: 1,}}
            data={notPnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={onEndReached}
            ref={allRef}
            onScroll={allScrollHandler}
            {...sharedProps}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [allRef, allScrollHandler, sharedProps]
    );


    const renderPending = useCallback(
        () => <AnimatedFlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    progressViewOffset={headerHeight + 42}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            style={{flex: 1, }}
            data={pnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={onEndReached}
            ref={pendingRef}
            onScroll={pendingScrollHandler}
            {...sharedProps}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [pendingRef, pendingScrollHandler,sharedProps]
    );

    const renderHistory = useCallback(
        () => <AnimatedFlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    progressViewOffset={headerHeight + 42}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            style={{flex: 1,}}
            data={notPnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={onEndReached}
            ref={historyRef}
            onScroll={historyScrollHandler}
            {...sharedProps}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [historyRef, historyScrollHandler,  sharedProps]
    );
    const renderScene = useCallback(
        ({ route: tab }: { route: CBTabRoute }) => {

            return (
                <Scene
                    headerHeight={headerHeight}
                    refreshControl={
                        <RefreshControl
                            tintColor={primaryColor} // ios
                            progressBackgroundColor={infoColor} // android
                            colors={['white']} // android
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            progressViewOffset={140}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    ListHeaderComponent={tab.key == 'all' ? listHeaderComponent() : null}
                    ListFooterComponent={refreshing ? <View/> : bottomLoader}
                    ListEmptyComponent={listEmptyComponent}
                    isActive={tabs[index].key === tab.key}
                    routeKey={tab.key}
                    scrollY={scrollY}
                    data={tab.key == "pending" ? pnApplications : notPnApplications}
                    renderItem={({item, index}) => (
                        <>
                            <ApplicationList
                                key={index}
                                onPress={() => {
                                    userPress(index)

                                }}
                                item={item}
                                numbers={numberCollapsed}
                                index={index}

                                element={(activity: any, i: number) => {
                                    return (
                                        <ActivityItem
                                            isOpen={isOpen}

                                            config={config}
                                            /*
                                                isPinned={true}
                                            */
                                            searchQuery={searchTerm}
                                            key={i}
                                            selected={applicationItem?._id == activity?._id}
                                            parentIndex={index}
                                            role={user?.role?.key}
                                            activity={activity}
                                            currentUser={user}
                                            onPressUser={(event: any) => {
                                                dispatch(setEdit(false))
                                                dispatch(setHasChange(false))
                                                dispatch(setSelectedYPos({yPos, type: 0}))
                                                dispatch(setApplicationItem({
                                                    ...activity,
                                                    isOpen: `${index}${i}`
                                                }));
                                                //setDetails({ ...activity , isOpen : `${ index }${ i }` });
                                                /*unReadReadApplicationFn(activity?._id, false, true, (action: any) => {
                                                })*/
                                                if (event?.icon == 'more') {
                                                    setMoreModalVisible(true)
                                                } else {
                                                    if (Platform.OS == "web") {
                                                        setModalVisible(true)
                                                    } else {
                                                        props.navigation.navigate(ACTIVITYITEM, {
                                                            onDismissed: onDismissedModal,
                                                            onChangeEvent: onChangeEvent,
                                                            onChangeAssignedId: onChangeAssignedId
                                                        });
                                                    }


                                                    //
                                                }

                                            }}

                                            index={`${index}${i}`}
                                            swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                                    )
                                }}/>
                        </>

                    )}
                    {...sceneProps}
                />
            )},
        [getRefForKey, index, tabs,  scrollY, refreshing, pnApplications, notPnApplications]
    );
    return (
        <>
            <StatusBar barStyle={'light-content'}/>
            <View style={{flex: 1, backgroundColor: primaryColor,}}>
                <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
                    <View style={[styles1.container, styles1.shadow, {
                        flexBasis: (
                            (
                                isMobile && !(
                                    Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                                (
                                    Platform?.isPad || isTablet()) && !isLandscapeSync())) ? "100%" : 466,
                        flexGrow: 0,
                        flexShrink: 0
                    }]}>

                        <NavBar>
                            <CBAnimatedNavBar  headerHeight={headerHeight}  scrollY={scrollY}>
                                <View>
                                    {
                                        !!lodash.size(meetingList) && (
                                            <FlatList
                                                data={meetingList}
                                                bounces={false}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                snapToInterval={activitySizeComponent?.width || dimensions?.width}
                                                decelerationRate={0}
                                                keyExtractor={(item: any) => item._id}
                                                renderItem={({item}) => (
                                                    <MeetingNotif
                                                        style={{
                                                            ...Platform.select({
                                                                native: {
                                                                    width: activitySizeComponent?.width || dimensions?.width
                                                                },
                                                                default: {
                                                                    width: 466
                                                                }
                                                            })
                                                        }}
                                                        name={getChannelName({
                                                            ...item,
                                                            otherParticipants: item?.participants
                                                        })}
                                                        time={item.createdAt}
                                                        host={item.host}
                                                        onJoin={() => onJoin(item)}
                                                        onClose={(leave: any) => onClose(item, leave)}
                                                        closeText={'Cancel'}
                                                    />
                                                )}
                                            />
                                        )
                                    }

                                </View>
                            </CBAnimatedNavBar>
                        </NavBar>

                        <View style={styles.container}>
                                <CBAnimatedHeader  headerHeight={headerHeight}  scrollY={scrollY}>
<View onLayout={handleHeaderLayout}>
    <View onLayout={onLayoutComponent}>
        <Animated.View style={[styles1.rect, styles1.horizontal, {
            backgroundColor: ((isMobile && !(Platform?.isPad || isTablet()))) ? "#041B6E" : "#fff",
            ...Platform.select({
                native: {
                    paddingTop: 20,
                },
                web: {
                    paddingTop: 10,
                }
            })
        },]}>

            {(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet())) || dimensions?.width < 768) &&
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Settings')/*openDrawer()*/}>
                    <HomeMenuIcon height={fontValue(24)} width={fontValue(24)}/>
                </TouchableOpacity>}

            <Text
                style={[styles1.activity,  {
                    color: (
                        isMobile && !(
                            Platform?.isPad || isTablet())) || dimensions?.width < 768 ? "rgba(255,255,255,1)" : primaryColor,
                }]}>{(
                isMobile && !(
                    Platform?.isPad || isTablet())) || dimensions?.width < 768 ? `Activity` : `Feed`}</Text>
            <View style={{flex: 1}}/>
            <TouchableOpacity onPress={() => {
                dispatch(setVisible(true))
            }

            }>

                <Filter pressed={visible} width={fontValue(Platform.OS == "web" ? 26 : 18)}
                        height={fontValue(Platform.OS == "web" ? 26 : 18)}/>
            </TouchableOpacity>
            {
                <TouchableOpacity onPress={onRefresh}>
                    {(
                        !(
                            isMobile && !(
                                Platform?.isPad || isTablet())) && dimensions?.width > 768) ?
                        <RefreshWeb style={{paddingLeft: 15}} width={fontValue(26)}
                                    height={fontValue(24)} fill={"#fff"}/> :
                        <View style={{paddingLeft: 23}}><RefreshRN/></View>}
                </TouchableOpacity>
            }
        </Animated.View>
    </View>
    <View>
        {
            !!lodash.size(meetingList) && (
                <FlatList
                    data={meetingList}
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={activitySizeComponent?.width || dimensions?.width}
                    decelerationRate={0}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({item}) => (
                        <MeetingNotif
                            style={{
                                ...Platform.select({
                                    native: {
                                        width: activitySizeComponent?.width || dimensions?.width
                                    },
                                    default: {
                                        width: 466
                                    }
                                })
                            }}
                            name={getChannelName({
                                ...item,
                                otherParticipants: item?.participants
                            })}
                            time={item.createdAt}
                            host={item.host}
                            onJoin={() => onJoin(item)}
                            onClose={(leave: any) => onClose(item, leave)}
                            closeText={'Cancel'}
                        />
                    )}
                />
            )
        }

    </View>
    <FakeSearchBar onSearchLayoutComponent={onSearchLayoutComponent}
                   animated={{}} onPress={() => {

        //setSearchVisible(true)
        dispatch(setApplicationItem({}));

        props.navigation.navigate(isMobile ? SEARCHMOBILE : SEARCH);
    }} searchVisible={searchVisible}/>

</View>

                                </CBAnimatedHeader>

                            <CBTabView

                                width={initialWidth}
                                index={index}
                                setIndex={setIndex}
                                routes={tabs}
                                renderTabBar={(props) => {

                                    return (
                                    <CBAnimatedTabBar  headerHeight={headerHeight}  scrollY={scrollY}>
                                        <TabBar
                                            renderLabel={({route, focused}) => {
                                                return (
                                                    <View>
                                                        <Text style={{
                                                            color: focused ? infoColor : "#606A80",
                                                            fontFamily: Regular, // focused ? Bold : Regular
                                                            fontSize: fontValue(12)
                                                        }}>{route.title}</Text>
                                                    </View>
                                                );
                                            }}
                                            {...props}
                                            indicatorStyle={{height: 4,
                                                backgroundColor: infoColor,
                                                borderRadius: 4,}}

                                            tabStyle={{width: fontValue(136)}}
                                            style={{backgroundColor: 'white'}}
                                        />
                                    </CBAnimatedTabBar>
                                )}}
                                renderScene={renderScene}
                            />
                        </View>
                    </View>
                    {
                        !(
                            (
                                isMobile && !(
                                    Platform?.isPad || isTablet()))) && lodash.isEmpty(applicationItem) && dimensions?.width > 768 &&
                        <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                            <NoActivity/>
                            <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                                selected</Text>


                        </View>
                    }


                    {(
                        (!lodash.isEmpty(applicationItem)) && Platform.OS == "web") && <View style={{flex: 1}}>
                        <ItemMoreModal details={applicationItem} visible={moreModalVisible} onDismissed={() => {
                            onMoreModalDismissed(applicationItem?.isOpen)
                        }}/>
                        <ActivityModal updateModal={updateModalFn}
                                       readFn={unReadReadApplicationFn}
                                       onChangeEvent={onChangeEvent}
                                       onChangeAssignedId={onChangeAssignedId}
                                       visible={modalVisible}
                                       onDismissed={onDismissedModal}/>
                    </View>}
                </View>
            </View>
        </>
    );
}
export default ActivitiesPage
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#F8F8F8"
    },
    tabBarContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: "absolute",
        zIndex: 1,
    },
    overlayName: {
        fontSize: 24,
    },
    collapsedOvarlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        justifyContent: "flex-end",
        zIndex: 1,
    },
    headerContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: "absolute",
        zIndex: 2,
    },
});