import React,{useState} from "react";
import {Dimensions,Modal,Pressable,ScrollView,StyleSheet,Text,useWindowDimensions,View} from "react-native";
import {Bold,Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {input,primaryColor} from "@styles/color";
import PdfViewr from "@pages/activities/application/application_pdf/pdfViewr";
import {isMobile} from "@pages/activities/isMobile";
import {OnBackdropPress} from "@pages/activities/modal/onBackdropPress";
import {RFValue} from "react-native-responsive-fontsize";
import {RootStateOrAny,useSelector} from "react-redux";

const { width , height } = Dimensions.get("screen");

let outputLabel = (applicationType: string) => {
    applicationType = applicationType?.toLowerCase();
    if (applicationType?.match('admission slip') || service?.serviceCode === 'service-1') return 'Admission Slip';
    else if (applicationType?.match('certificate')) return 'Certificate';
    else if (applicationType?.match('license')) return 'License';
    else if (applicationType?.match('permit')) return 'Permit';
    return '';
};
const ApplicationDetails = (props: any) => {

    const dimensions=useWindowDimensions();
    const {rightLayoutComponent}=useSelector((state:RootStateOrAny)=>state.application);
    const [modalVisible, setModalVisible] = useState(false);
    return <ScrollView style={ { paddingTop : 20 , width : "100%" , backgroundColor : "#f8f8f8" , } }>
        {/*<PdfViewrWeb height={height}
                  width={width} requirement={props?.documents}/>*/}
            <View style={ [styles.container , { marginVertical : 12 }] }>
                <View style={ styles.group2 }>
                    <View style={ styles.rect }>
                        <Text style={ styles.file }>APPLICATION FORM</Text>
                    </View>
                    <Text style={ styles.applicationType }>{ props?.applicantType ||  props?.service?.name   }</Text>
                    <Text style={ [styles.service, {fontFamily: Regular500}] }>{  props?.service?.applicationType?.label || props?.service?.name }</Text>
                    <Text style={ [styles.service, {fontFamily: Regular500}] }>{  props?.service?.applicationType?.element  || props?.service?.radioType?.label }</Text>

                    <Pressable
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={ {fontFamily: Regular500,  color: primaryColor}}>{  outputLabel(props?.applicantType ||  props?.service?.name) }</Text>
                    </Pressable>

                    { props?.service?.radioType?.selected && <Text style={ [styles.service, {fontFamily: Regular500}] }>{ `\u2022${ props?.service?.radioType?.selected }` }</Text>}
                    { props?.selectedType?.map((type: any , idx: number) => {
                        return <Text key={ idx } style={ styles.text }>
                            { type?.name } { type?.selectedItems.map((item: string , index: number) => {
                            return <Text  key={ index } style={{fontFamily: Bold}}>{ `\n\u2022${ item }` }</Text>
                        }) }
                        </Text>
                    })
                    }

                </View>

            </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={[{flex: 1},isMobile||dimensions?.width<768 ? {} : {
                alignItems:"flex-end",
                top: rightLayoutComponent?.top
            }]}>
            <OnBackdropPress styles={{}}  onPressOut={() => setModalVisible(!modalVisible)}/>
            <OnBackdropPress styles={isMobile|| dimensions?.width<768 ? {} : {
                alignSelf: "flex-end",
                width:rightLayoutComponent?.width||undefined,
                backgroundColor:"rgba(0, 0, 0, 0.5)"
            }} onPressOut={() => setModalVisible(!modalVisible)}/>

                <View style={{zIndex: 1, flexDirection: "row", justifyContent: "flex-end", }}>
                    <View style={{padding: 20}}>
                        <Pressable
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={ {fontFamily: Regular500, fontSize: RFValue(14),  color: "#fff"}}>Close</Text>
                        </Pressable>
                    </View>

                </View>
            <View style={{flex: 1, position: "absolute"}}>
                <ScrollView>
                    <PdfViewr width={rightLayoutComponent?.width}
                              height={rightLayoutComponent?.height} requirement={props?.documents}/>
                </ScrollView>

            </View>
            </View>
        </Modal>
    </ScrollView>

};
const styles = StyleSheet.create({
    subChildSeparator: {
        height: 1,
        backgroundColor: input.background.default,
        marginVertical: 10,
    },
    container : {

        flex : 1 ,
        paddingHorizontal : 15 ,
    } ,
    group2 : {
        paddingBottom : 20 ,
        width: "100%",
        borderRadius : 5 ,
        alignSelf : "center" ,

        backgroundColor : "#fff" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            height : 0 ,
            width : 0
        } ,
        elevation : 2 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 2 ,
        padding : 10
    } ,
    rect : {
        padding : 10 ,
        paddingVertical : 5 ,
        backgroundColor : "#EFF0F6"
    } ,
    file : {
        fontSize : fontValue(12) ,
          fontFamily: Regular500   ,
        color : "#565961" ,
    } ,
    applicationType : {
        fontFamily: Bold,
        color : "#121212" ,
        fontSize : fontValue(16) ,
        marginTop : 8 ,
        marginLeft : 1
    } ,
    service : {
        fontSize: fontValue(14),
        color : "#121212" ,
        marginLeft : 1
    } ,
    text : {
        fontSize: fontValue(14),
        color : "#121212" ,
        marginTop : 2 ,
        marginLeft : 1
    } ,
    rect4 : {
        width : '100%' ,
        paddingBottom : 10 ,
        //backgroundColor: "#E6E6E6",
        marginTop : 15
    } ,

});
export default ApplicationDetails