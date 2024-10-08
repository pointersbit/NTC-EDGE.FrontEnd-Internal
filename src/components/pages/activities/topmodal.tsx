import React,{useEffect,useRef} from "react";
import {
    Dimensions ,
    Modal ,
    Platform , SafeAreaView ,
    StyleSheet ,
    Text ,
    TouchableOpacity ,
    TouchableWithoutFeedback ,
    View,
    StatusBar as bar
} from "react-native";
import {Ionicons ,} from '@expo/vector-icons'

import {RootStateOrAny , useDispatch , useSelector} from "react-redux";
import {on_checked , setVisible} from "../../../reducers/activity/actions";
import CalendarIcon from "@assets/svg/calendar";
import EvaluationIcon from "@assets/svg/evaluation";
import ApprovedIcon from "@assets/svg/approved";
import DeclineIcon from "@assets/svg/decline";
import lodash from 'lodash';
import RadioButtonOnIcon from "@assets/svg/radioButtonOn";
import RadioButtonOffIcon from "@assets/svg/radioButtonOff";
import {getRole} from "@pages/activities/script";
import {Bold , Regular , Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import CloseIcon from "@assets/svg/close";
import Constants from 'expo-constants';
import {isTablet} from "react-native-device-info";

const window = Dimensions.get("window");

function TopModal(props: any) {
    
    const { filterRect, topBarNav } = useSelector((state: RootStateOrAny) => state.application);
    const { visible , statusCode } = useSelector((state: RootStateOrAny) => state.activity);
    const { drawerLayout } = useSelector((state: RootStateOrAny) => state.layout);
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const renderIcon = (item) => {
        switch (item.iconBrand) {
            case 'feather': {
                return (
                    <CalendarIcon width={ fontValue(20) } height={ fontValue(20) }
                                  fill={ item.checked ? "#003aa9" : "black" }/>
                );
            }
            case 'evil': {
                return (
                    <EvaluationIcon width={ fontValue(20) } height={ fontValue(20) }
                                    fill={ item.checked ? "#003aa9" : "black" }/>
                )
            }
            case 'material-community': {
                return (
                    <ApprovedIcon width={ fontValue(20) } height={ fontValue(20) }
                                  fill={ item.checked ? "#003aa9" : "black" }/>
                )
            }
            case 'ionicons': {
                return (
                    <DeclineIcon width={ fontValue(22) } height={ fontValue(22) }
                                 fill={ item.checked ? "#003aa9" : "black" }/>
                )
            }
            default:
                return null
        }
    };

    const inputRef = useRef();

    return (
        <Modal

            supportedOrientations={ ['portrait' , 'landscape'] }
            animationType="fade"
            transparent={ true }
            visible={ visible }

            onRequestClose={ () => {
                dispatch(setVisible(false))
            } }>

            <View ref={ inputRef } style={ visible ? {

                position : "absolute" ,
                zIndex : 2 ,
                top : 0 ,
                left : 0 ,
                width : '100%' ,
                height : '100%' ,
            } : {} }>

                { <TouchableWithoutFeedback onPressOut={ () => dispatch(setVisible(false)) }>

                    <View style={ styles.container }>

                        {  (isMobile && !(Platform?.isPad || isTablet()))  && <View style={ styles.header1 }>
                            <View style={ { width : 25 } }>

                            </View>
                            <View>
                                <Text style={ styles.filter1 }>FILTER</Text>
                            </View>

                            <View>
                                <TouchableOpacity onPress={ () => dispatch(setVisible(false)) }>
                                    <Ionicons name="md-close" style={ styles.icon1 }></Ionicons>
                                </TouchableOpacity>
                            </View>


                        </View> }
                        <View style={ !(isMobile && !(Platform?.isPad || isTablet())) ? {
                            width : filterRect?.width ,
                            left : filterRect?.left || (drawerLayout?.width || 0),
                            top : !isNaN(filterRect?.top + filterRect?.height) ? filterRect?.top + filterRect?.height :  ((topBarNav?.height || 0) + (filterRect?.height || 0) + (Constants?.statusBarHeight || 0))
                        } : {} }>
                            <View style={ styles.rect2_1 }>
                                <Text style={ styles.sort1 }>Sort By</Text>
                                {!isMobile &&  <View  style={{paddingHorizontal: 10}}>
                                    <TouchableOpacity onPress={ () => dispatch(setVisible(false))}>
                                        <CloseIcon/>
                                    </TouchableOpacity>
                                </View> }

                            </View>
                            <View style={ styles.group7_1 }>

                                { statusCode.filter((item: any) => {
                                    return getRole(user , item?.isShow)
                                }).map((top: any , index: number) => {
                                    return (
                                        <TouchableOpacity
                                            key={ index }
                                            onPress={ () => dispatch(on_checked(top)) }
                                        >
                                            <View style={ [
                                                styles.itemGroup ,
                                                styles.item ,
                                                lodash.size(statusCode) - 1 === index && {
                                                    borderBottomWidth : 0 ,
                                                }
                                            ] }>
                                                <View style={ [styles.itemGroup , { paddingHorizontal : 0 }] }>
                                                    { renderIcon(top) }
                                                    <Text
                                                        style={ [styles.label1 , { color : top.checked ? "#003aa9" : "#1F2022" }] }>{ top.status }</Text>
                                                </View>
                                                <TouchableOpacity onPress={ () => {

                                                    dispatch(on_checked(top))
                                                } }>
                                                    {
                                                        top.checked ? <RadioButtonOnIcon width={ fontValue(32) }
                                                                                         height={ fontValue(32) }/> :
                                                        <RadioButtonOffIcon width={ fontValue(32) }
                                                                            height={ fontValue(32) }/>
                                                    }

                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }) }
                            </View>

                        </View>
                    </View>


                </TouchableWithoutFeedback> }

            </View>
        </Modal>

    );
}


const styles = StyleSheet.create({
    container : {
        flex : 1 ,

    } ,
    group : {
        height : 56 ,
        marginTop : 100
    } ,
    rect2 : {
        height : 56 ,
        backgroundColor : "rgba(255,255,255,1)"
    } ,
    rect2_1 : {
        flexDirection : "row" ,
        justifyContent : "space-between" ,
        alignSelf : "center" ,
        width : "100%" ,
        backgroundColor : "rgba(255,255,255,1)" ,

        ...Platform.select({
                native : {
                    paddingHorizontal : 15 ,
                    paddingTop : 15 ,
                } ,
                default : {
                    paddingHorizontal : 15 ,
                    paddingTop : 0
                }
            }
        ) ,

    } ,
    sort : {
        fontSize : fontValue(15) ,
        fontFamily : Bold ,
        color : "#121212" ,
        textAlign : "left" ,
        marginTop : 20 ,
        marginLeft : 18
    } ,
    sort1 : {
        fontSize : fontValue(16) ,
        fontFamily : Regular500 ,
        color : "#000" ,
    } ,
    header : {
        height : 100 ,
        marginTop : -156
    } ,
    header1 : {
        flexDirection : 'row' ,
        justifyContent : 'space-between' ,
        alignItems : 'center' ,
        padding  : 15 ,
        paddingTop: 40 ,
        backgroundColor : '#041B6E'
    } ,
    rect : {
        height : 100 ,
        backgroundColor : "#041B6E" ,
        flexDirection : "row"
    } ,
    filter : {
        fontFamily : Bold ,
        color : "rgba(255,255,255,1)" ,
        fontSize : fontValue(16) ,
        marginTop : 5
    } ,
    filter1 : {
        alignSelf : "center" ,
        fontFamily : Bold ,
        color : "rgba(255,255,255,1)" ,
        fontSize : fontValue(18) ,
    } ,
    icon : {
        color : "rgba(255,255,255,1)" ,
        fontSize : fontValue(25) ,
        marginLeft : 272
    } ,
    icon1 : {
        color : "rgba(255,255,255,1)" ,
        fontSize : fontValue(25) ,
    } ,
    filterRow : {
        height : 29 ,
        justifyContent : "space-between" ,
        flexDirection : "row" ,
        flex : 1 ,
        marginRight : 20 ,
        marginLeft : 20 ,
        marginTop : 47
    } ,
    group7 : {
        height : 58 ,
        marginTop : 56
    } ,
    group7_1 : {
        paddingTop: 5,
        backgroundColor : 'white'
    } ,
    group6 : {
        height : 60 ,
        backgroundColor : "rgba(255,255,255,1)" ,
        flexDirection : "row"
    } ,
    group5 : {

        marginLeft : 18 ,
        alignSelf : "center"
    } ,
    icon4 : {

        fontSize : fontValue(32)
    } ,
    label : {
        fontFamily : Bold ,
        color : "#121212" ,
        marginLeft : 7 ,
    } ,
    label1 : {
        fontSize : fontValue(14) ,
        fontFamily : Regular ,
        color : "#121212" ,
        marginLeft : 7 ,
    } ,
    icon4Row : {
        height : 34 ,
        flexDirection : "row" ,
        marginTop : 5 ,
        marginRight : 7
    } ,
    rect7 : {
        height : 2 ,
        backgroundColor : "#e2e2e2" ,
    } ,
    rect6 : {
        height : 58 ,
        backgroundColor : "rgba(255,255,255,1)" ,
        flexDirection : "row" ,
        flex : 1 ,
    } ,
    icon6Filler : {
        flex : 1 ,
        flexDirection : "row"
    } ,
    icon6 : {
        color : "rgba(128,128,128,1)" ,
        fontSize : fontValue(25) ,
        marginRight : 21 ,
        marginTop : 15
    } ,
    icon6_1 : {
        color : "rgba(128,128,128,1)" ,
        fontSize : fontValue(25) ,
    } ,
    item : {
        justifyContent : 'space-between' ,
        paddingVertical : 10 ,
        borderBottomColor : 'rgba(128,128,128,1)' ,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal : 0 ,
        marginHorizontal : 15 ,
    } ,
    itemGroup : {
        flexDirection : 'row' ,
        alignItems : 'center' ,
        paddingHorizontal : 15
    } ,
    itemContent : {} ,

});


export default TopModal;
