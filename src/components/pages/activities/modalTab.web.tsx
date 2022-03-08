import {RootStateOrAny , useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import React , {useCallback , useEffect , useRef , useState} from "react";
import {ACCOUNTANT , CASHIER , CHECKER , DIRECTOR , EVALUATOR} from "../../../reducers/activity/initialstate";
import {primaryColor , text} from "@styles/color";
import {Animated , StyleSheet , Text , TouchableOpacity , View} from "react-native";
import {Bold , Regular , Regular500} from "@styles/font";
import {ViewPaged} from 'react-scroll-paged-view'
import TabBar from 'react-underline-tabbar'
import BasicInfoWebIcon from "@assets/svg/basicInfoWebIcon";
import ApplicationDetailWebIcon from "@assets/svg/applicationDetailWebIcon";
import RequirementWebIcon from "@assets/svg/requirementWebIcon";
import SoaPaymentWebIcon from "@assets/svg/soaPaymentWebIcon";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import {getRole} from "@pages/activities/script";


export const ModalTab = props => {
    const user = useSelector((state: RootStateOrAny) => state.user);

    const [tabs , setTabs] = useState([
        {
            id : 1 ,
            name : 'Basic Info' ,
            active : true ,
            isShow : [CHECKER , ACCOUNTANT , CASHIER , DIRECTOR , EVALUATOR] ,
            label :  <View style={[styles.tabItem, {gap: 5}]}><BasicInfoWebIcon/> <Text style={styles.tabTextItem}>Basic Info</Text></View>
        } ,
        {
            id : 2 ,
            name : 'Application Details' ,
            active : false ,
            isShow : [CHECKER , ACCOUNTANT , CASHIER , DIRECTOR , EVALUATOR],
            label :  <View style={[styles.tabItem, {gap: 5}]}><ApplicationDetailWebIcon/><Text style={styles.tabTextItem}> Application</Text></View>
        } ,
        {
            id : 3 ,
            name : 'Requirements' ,
            active : false ,
            isShow : [CHECKER , DIRECTOR , EVALUATOR],
            label :  <View style={[styles.tabItem, {gap: 5}]}><RequirementWebIcon/><Text style={styles.tabTextItem}> Requirements</Text></View>
        } ,
        {
            id : 4 ,
            name : 'SOA & Payment' ,
            active : false ,
            isShow : [CASHIER , ACCOUNTANT] ,
            label :  <View style={[styles.tabItem, {gap: 5}]}><SoaPaymentWebIcon/><Text style={styles.tabTextItem}> SOA & Payment</Text></View>
        } ,
    ]);
    const applicant = props?.details?.applicant ,
        selectedTypes = props?.details?.selectedTypes ,
        applicationType = props?.details?.applicationType ,
        service = props?.details?.service ,
        soa = props?.details?.soa ,
        totalFee = props?.details?.totalFee ,
        paymentMethod = props?.details?.paymentMethod ,
        requirements = props?.details?.requirements ,
        updatedAt = props?.details?.updatedAt ,
        approvalHistory = props?.details?.approvalHistory ,
        assignedPersonnel = props?.details?.assignedPersonnel ,
        createdAt = props?.details?.createdAt ,
        proofOfPayment = props?.details?.proofOfPayment;


    return <ViewPaged
         render
        vertical={ false }
        renderPosition='top'

        renderHeader={ (params) => {
            const _tabs = [...tabs]

            _tabs[0].label = <View style={[styles.tabItem, {gap: 5}]}><BasicInfoWebIcon/> <Text style={[styles.tabTextItem]}>Basic Info</Text></View>
            _tabs[1].label = <View style={[styles.tabItem, {gap: 5}]}><ApplicationDetailWebIcon/><Text style={[styles.tabTextItem]}>Application</Text></View>
            _tabs[2].label = <View style={[styles.tabItem, {gap: 5}]}><RequirementWebIcon/><Text style={[styles.tabTextItem]}>Requirements</Text></View>
            _tabs[3].label = <View style={[styles.tabItem, {gap: 5}]}><SoaPaymentWebIcon/><Text style={[styles.tabTextItem]}> SOA & Payment</Text></View>
              if(params.activeTab == 0) {
                  _tabs.find(a => a.id == 1 ).label = <View style={[styles.tabItem, {gap: 5}]}><BasicInfoWebIcon fill={"#2863D6"}/> <Text style={[styles.tabTextItem, styles.tabSelected]}>Basic Info</Text></View>
              }
              if(params.activeTab == 1) {
                _tabs.find(a => a.id == 2 ).label = <View style={[styles.tabItem, {gap: 5}]}><ApplicationDetailWebIcon fill={"#2863D6"}/><Text style={[styles.tabTextItem,  styles.tabSelected]}>Application</Text></View>
            }
            if(params.activeTab == 2) {
                if(getRole(user, [ACCOUNTANT, CASHIER])){
                    _tabs.find(a => a.id == 4 ).label = <View style={[styles.tabItem, {gap: 5}]}><SoaPaymentWebIcon fill={"#2863D6"}/><Text style={[styles.tabTextItem,styles.tabSelected]}> SOA & Payment</Text></View>
                }else{
                    _tabs.find(a => a.id == 3 ).label = <View style={[styles.tabItem, {gap: 5}]}><RequirementWebIcon fill={"#2863D6"}/><Text style={[styles.tabTextItem,styles.tabSelected ]}>Requirements</Text></View>
                }
            }

            
            return (
                <View style={{backgroundColor: "#fff"}}>
                    <TabBar
                        style={{paddingTop: 20, }}
                        tabTextStyle={{marginBottom: 21}}
                        scrollViewStyle={ { paddingLeft: 60, flex : 1 , justifyContent : "flex-start" , gap : 35 } }
                        underlineStyle={ { backgroundColor: "#2863D6",     height : 7 } }
                        tabs={ tabs.filter((tab, index) => tab.isShow.indexOf(user?.role?.key) !== -1) }
                        { ...params }
                        vertical={ false }
                    />
                </View>

            )
        } }
    >
        {

            tabs.map((tab , index) => {
                const isShow = tab.isShow.indexOf(user?.role?.key) !== -1;
                if (isShow && tab.id === 1) {


                    
                    return <BasicInfo
                        tabLabel={ { label : tab.name } } label={ tab.name }
                        paymentMethod={ paymentMethod }
                        assignedPersonnel={ assignedPersonnel }
                        approvalHistory={ approvalHistory }
                        status={ props.details.status }
                        paymentHistory={ props?.details?.paymentHistory }
                        paymentStatus={ props?.details?.paymentStatus }
                        detailsStatus={ props?.details?.status }
                        user={ user }
                        createdAt={ createdAt }
                        applicant={ applicant }
                        key={ index }/>
                } else if (isShow && tab.id === 2) {

                    return <ApplicationDetails
                        tabLabel={ { label : tab.name } } label={ tab.name }
                        service={ service }
                        selectedType={ selectedTypes }
                        applicantType={ applicationType }
                        key={ index }/>
                } else if (isShow && tab.id === 3) {
                    return <Requirement  tabLabel={ { label : tab.name } } label={ tab.name }
                                         requirements={ requirements } key={ index }/>
                } else if (isShow && tab.id === 4) {
                    return <Payment  tabLabel={ { label : tab.name } } label={ tab.name }
                                     proofOfPayment={ proofOfPayment }
                                     updatedAt={ updatedAt }
                                     paymentMethod={ paymentMethod }
                                     applicant={ applicant }
                                     totalFee={ totalFee }
                                     soa={ soa }
                                     key={ index }/>
                }
            })
        }
    </ViewPaged>

};

const styles = StyleSheet.create({
    tabSelected:{
        color: "#2863D6",
        fontFamily: Regular500,
        fontWeight: "500",
        lineHeight: 24,
        textAlign: "center"
    },
    tabItem:{
        flexDirection: "row", alignItems: "center"
    },
    tabTextItem : {
        color: "#A0A3BD",
        lineHeight: 24,
        textAlign: "center",
        fontFamily : Regular ,
        fontSize : 16,
    } ,
    rect6 : {
        height : 3 ,
        marginTop : -5
    } ,
});