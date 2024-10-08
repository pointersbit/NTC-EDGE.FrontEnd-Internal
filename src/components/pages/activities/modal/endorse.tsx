import React , {useEffect , useState} from "react";
import {
    Alert ,
    Dimensions ,
    KeyboardAvoidingView ,
    Modal ,
    Platform ,
    StyleSheet ,
    Text ,
    TouchableOpacity , TouchableWithoutFeedback , useWindowDimensions ,
    View
} from "react-native";
import {InputField} from "@molecules/form-fields";
import axios from "axios";
import EndorseToIcon from "@assets/svg/endorseTo";
import {BASE_URL} from "../../../../services/config";
import {RootStateOrAny , useSelector} from "react-redux";
import {ACCOUNTANT , DIRECTOR , EVALUATOR , FOREVALUATION} from "../../../../reducers/activity/initialstate";
import useKeyboard from 'src/hooks/useKeyboard';
import {disabledColor , errorColor , primaryColor} from "@styles/color";
import CustomAlert from "@pages/activities/alert/alert";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {useOrientation} from "../../../../hooks/useOrientation";
import {getRole} from "@pages/activities/script";
import {Bold , Regular500} from "@styles/font";
import CloseIcon from "@assets/svg/close";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import hairlineWidth = StyleSheet.hairlineWidth;
import button from "@pages/activities/modal/styles";
import ConfirmRightArrow from "@assets/svg/confirmArrow";
import {isLandscapeSync,isTablet} from "react-native-device-info";

const { height , width } = Dimensions.get('window');

const Endorsed = (props: any) => {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const [pickedEndorsed , setPickedEndorsed] = useState<any[]>();
    const [text , setText] = useState("");
    const [endorsed , setEndorsed] = useState();
    const [showAlert , setShowAlert] = useState(false);
    const isKeyboardVisible = useKeyboard();
    const [message , setMessage] = useState("");
    const [alertLoading , setAlertLoading] = useState(false);
    const [showClose , setShowClose] = useState(false);
    const [title , setTitle] = useState("Endorse Application to");
    const [selected , setSelected] = useState(undefined);
    const [validateRemarks , setValidateRemarks] = useState<{ error: boolean }>({ error : false });

    const fetchEndorse = async (isCurrent: boolean) => {
        await axios.get(BASE_URL + '/users' ,
            {
                headers : {
                    Authorization : "Bearer ".concat(user.sessionToken)
                }
            }).then((response) => {

            const filterResponse = [...(response?.data?.docs || response?.data)].filter((item) => {
                return getRole(item , [DIRECTOR , EVALUATOR , ACCOUNTANT]) //&& user?._id != item?._id
            });

            const res = filterResponse?.map((item) => {
                return { value : item?._id , label : item?.firstName + " " + item?.lastName }
            });

            if (isCurrent && !!res) {
                setPickedEndorsed(res);
                setEndorsed( res[0]?.value || (props?.assignedPersonnel?._id || props?.assignedPersonnel))
            }

        })
    };

    useEffect(() => {
        let isCurrent = true;
        fetchEndorse(isCurrent);
        return () => {
            isCurrent = false
        }
    } , []);
    const [picked , setPicked] = useState(false);
    useEffect(() => {

        setPicked(pickedEndorsed?.find(picked => {
            return picked.value === endorsed
        })?.label);
    } , [endorsed , picked]);

    const onEndorseConfirm = () => {


        setMessage(`` + picked);
        props.remarks({ endorseId : endorsed , remarks : text , message });
        if (pickedEndorsed && !!picked) {
            setShowAlert(true)
        } else {
            Alert.alert('Alert' , "Something went wrong.")
        }


    };
    const onCancelPress = () => {
        setTitle("Endorse Application to");
        if (showClose) {
            setShowAlert(false);
            setShowClose(false);

            props.onExit()
        } else {
            setShowClose(false);
            setShowAlert(false);
            props.onModalDismissed()
        }
        setAlertLoading(false)
    };


    const orientation = useOrientation();
    const dimensions = useWindowDimensions();

    useEffect(()=>{
        if(showAlert || props.visible){
            //TODO: add state
            props.onExit()
            props.onModalDismissed()
        }

    }, [isLandscapeSync()])
    return (
        <Modal
            supportedOrientations={ ['portrait' , 'landscape'] }
            animationType="slide"
            transparent={ true }
            visible={ props.visible }

            onRequestClose={ () => {
                onCancelPress()
            } }>

            <View style={ showAlert ? {
                zIndex : 1 ,
                flex : 1 ,
                width : "100%" ,
                height : "100%" ,
                alignItems : 'center' ,
                justifyContent : 'center' ,
                position : 'absolute' ,
                backgroundColor : 'rgba(52,52,52,0.5)'
            } : {} }/>

            <CustomAlert

                showClose={ showClose }
                type={ FOREVALUATION }
                onDismissed={ onCancelPress }
                onLoading={ alertLoading }
                onCancelPressed={ onCancelPress }
                confirmButton={ "Proceed" }
                onConfirmPressed={ () => {

                    setAlertLoading(true);

                    props.onChangeApplicationStatus({
                        status : FOREVALUATION ,
                        id : endorsed ,
                        remarks : text
                    } , (bool , callback: (bool) => {}) => {
                        if (bool) {
                            setAlertLoading(false);
                            setShowClose(true);
                            callback(true);

                            setTitle("Application has been endorsed to")
                        } else {
                            onCancelPress()
                        }


                    })


                } } show={ showAlert } title={ title }
                message={ message }/>
            <KeyboardAvoidingView
                behavior={ Platform.OS === "ios" ? "padding" : "height" }
                style={ [styles.container ,  {

                       width: "100%",
                    display : !showAlert ? undefined : "none" }] }
            >


                  <View style={{flex: 1,  paddingHorizontal: !((isMobile&& !(Platform?.isPad||isTablet()))) ? 64 : 0, alignItems: "flex-end", justifyContent: "flex-end"}}>
                      <TouchableWithoutFeedback onPressOut={ props.onDismissed}>
                          <View style={   {

                              flex : 1 ,
                              width : "100%" ,
                              height : "100%" ,
                              alignItems : 'center' ,
                              justifyContent : 'center' ,
                              position : 'absolute' ,
                          } }/>
                      </TouchableWithoutFeedback>
                      <View style={ [styles.rect , styles.shadow, { width:  ((isMobile&& !(Platform?.isPad||isTablet()))) || dimensions.width <= 768 ? "100%" : "32.6%", height : ((isMobile&& !(Platform?.isPad||isTablet()))) ? orientation == "LANDSCAPE"  ? "100%" : "80%" : "65%" , }] }>

                          <View >
                              <View style={ styles.iconColumn }>
                                  <View style={ {
                                      flexDirection : 'row' ,
                                      alignItems : 'center' ,
                                      paddingHorizontal : 5 ,
                                      paddingVertical : 10
                                  } }>
                                      <EndorseToIcon style={ styles.icon2 }/>
                                      <Text style={ styles.endorseTo }>Endorse to</Text>
                                  </View>

                                  <TouchableOpacity onPress={ () => {
                                      setValidateRemarks({ error : false });
                                      props.onDismissed()
                                  } }>
                                      <CloseIcon/>
                                  </TouchableOpacity>
                              </View>
                              <View style={ {paddingVertical: 20,  paddingHorizontal : 20 } }>


                                  <CustomDropdown value={ endorsed }
                                                  label="Select Item"
                                                  data={ pickedEndorsed }
                                                  onSelect={ ({ value }) => {
                                                      if (value) setEndorsed(value)
                                                  } }/>
                                  <View style={ { paddingVertical : 10 } }>
                                      <InputField

                                          clearable={ false }
                                          containerStyle={ {
                                              height : undefined ,
                                              borderColor : "#D1D1D6" ,
                                              borderWidth : 1 ,
                                              backgroundColor : undefined ,
                                          } }
                                          outlineStyle={ {
                                              borderRadius : 4 ,
                                              paddingTop : 10 ,
                                              height : (
                                                           height < 720 && isKeyboardVisible) ? 75 : height * 0.15
                                          } }
                                          inputStyle={ { [Platform.OS == "android" ? "padding" : "height"] : (
                                                                      height < 720 && isKeyboardVisible) ? 70 : height * 0.15,fontWeight : "400" , fontSize : fontValue(14) } }
                                          error={ validateRemarks.error }
                                          errorColor={ errorColor }
                                          placeholder={ 'Remarks' }
                                          multiline={ true }
                                          value={ text }
                                          onChangeText={ (text: string) => {

                                              setText(text)
                                          } }
                                      />
                                  </View>

                              </View>
                          </View>
                           <View style={ button.confirmButtonContainer}>
                               <View style={ [{  padding : 15 }, ]}>
                                   <TouchableOpacity disabled={ !picked } onPress={ onEndorseConfirm }>
                                       <View
                                           style={ [button.confirmButton , { gap: 5,  backgroundColor : picked ? primaryColor : disabledColor , }] }>

                                           <Text style={ button.confirm }>Confirm</Text>
                                           <ConfirmRightArrow></ConfirmRightArrow>
                                       </View>
                                   </TouchableOpacity>
                               </View>
                           </View>

                      </View>
                  </View>

            </KeyboardAvoidingView>
        </Modal>

    );
};

const styles = StyleSheet.create({

    shadow: {shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 60,
        shadowOpacity: 0.25,
        shadowRadius: 20,},
    container : {
        flex : 1 ,
        justifyContent : "flex-end"
    } ,
    rectFiller : {
        flex : 1
    } ,
    rect : {

        justifyContent : "space-between" ,
       


        backgroundColor : "rgba(255,255,255,1)" ,
        borderRadius : 15 ,
        borderBottomRightRadius : 0 ,
        borderBottomLeftRadius : 0 ,
    } ,
    icon : {
        color : "rgba(128,128,128,1)" ,
        fontSize : fontValue(25) ,
    } ,
    group : {
        width : 138 ,
        height : 30 ,
        flexDirection : "row" ,
        marginTop : 17
    } ,
    icon2 : {
        color : "#000" ,
        fontSize : fontValue(30)
    } ,
    endorseTo : {
        fontFamily : Regular500 ,
        color : "#121212" ,
        fontSize : fontValue(18) ,
        paddingLeft : 10 ,
        paddingTop : 3
    } ,
    icon2Row : {
        height : 30 ,
        flexDirection : "row" ,
        flex : 1
    } ,
    rect5 : {
        width : 355 ,
        height : 50 ,
        backgroundColor : "rgba(255,255,255,1)" ,
        borderWidth : 1 ,
        borderColor : "rgba(202,210,225,1)" ,
        borderRadius : 6 ,
        padding : 5 ,
        marginTop : 9 ,
    } ,
    iconColumn : {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: hairlineWidth,
        borderBottomColor: "#E5E5E5",
        paddingVertical : 20 ,
        paddingHorizontal: 24,
    } ,
    iconColumnFiller : {
        flex : 1
    } ,
    rect6 : {
        paddingHorizontal : 15 ,
        width : '100%' ,
    } ,

});

export default Endorsed;