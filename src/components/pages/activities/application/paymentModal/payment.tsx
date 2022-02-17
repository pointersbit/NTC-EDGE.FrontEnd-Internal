import React, {useState} from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Entypo, EvilIcons} from "@expo/vector-icons";
import PaymentModal from "@pages/activities/application/paymentModal/index";
import Text from "@atoms/text";
import {styles} from "@pages/activities/application/paymentModal/styles"
import {requirementStyles} from "@pages/activities/application/requirementModal/styles"
import FileOutlineIcon from "@assets/svg/fileOutline";
import {Bold , Regular , Regular500} from "@styles/font";
import RequirementModal from "@pages/activities/application/requirementModal";
import _ from "lodash";
const {width, height} = Dimensions.get("screen")
const Payment = (props:any) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleRequireModal, setVisibleRequireModal] = useState(false)
    const [selectImage , setSelectImage] = useState('');
    const onDismissed = () =>{

        setVisibleModal(false)
    }

    const onDismissedModal = ()=>{
        setSelectImage("");
        setVisibleRequireModal(false)
    }

    const getTotal = (soa) => {
        let total = 0;
        soa.map(s => total += s.amount);
        return total;
    }
    function capitalize(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ');
    }
    return <ScrollView style={{backgroundColor: "#fff", width: "100%", paddingTop: 10}}>
        <View style={[styles.container, {marginTop: 12}]}>

            <View style={{  padding: 5, alignItems: 'center' }}>
                <Text
                  style={{fontFamily: Bold} }
                    color="#37405B"
                    fontSize={14}
                >
                    Statement of Account
                </Text>
            </View>
            <View style={{ paddingVertical: 10, marginTop: 20 }}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <Text
                        style={{fontFamily: Bold} }
                        color="#37405B"
                        fontSize={14}
                    >
                        Particular
                    </Text>
                    <Text
                        style={{fontFamily: Bold} }
                        color="#37405B"
                        fontSize={14}
                    >
                        Amount
                    </Text>
                </View>
                {
                    props?.soa?.map(soa => (
                        <View
                            key={soa._id}
                            style={styles.soaItem}
                        >
                            <Text
                                color="#37405B"
                                fontSize={14}
                            >
                                {soa.item}
                            </Text>
                            <Text
                                color="#37405B"
                                fontSize={14}
                            >
                                P{soa.amount}
                            </Text>
                        </View>
                    ))
                }
                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15 }}
                >
                    <Text
                        color="#37405B"
                        fontSize={16}
                        style={{ marginRight: 15, fontFamily: Bold }}
                    >
                        Total
                    </Text>
                    <Text
                        style={{fontFamily: Bold} }
                        color="#37405B"
                        fontSize={16}
                    >
                        P{props.totalFee}
                    </Text>
                </View>
            </View>





                <View style={requirementStyles.container}>
                    <View style={[requirementStyles.card, {padding: undefined}]}>
                        <View style={requirementStyles.cardContainer}>
                            <TouchableOpacity onPress={() => {
                                setVisibleModal(true)
                            }}  >
                            <View style={requirementStyles.cardLabel}>
                                <Text style={requirementStyles.title}>Payment</Text>
                                <View style={requirementStyles.cardTitle}>

                                    <View style={{alignItems: "center"}}>

                                        <Text style={{fontFamily: Regular}}>Payment received for</Text>
                                        <Text style={{fontFamily: Regular}}>NTC-EDGE</Text>
                                        <Text style={{fontFamily: Regular}}>the amout of PHP {props?.totalFee}</Text>
                                        {props?.paymentMethod && <View style={{paddingVertical: 10 }}>
                                             <Text>
                                                <Text style={{fontFamily: Bold}}>
                                                     Payment method: {capitalize(props?.paymentMethod.replace("-", " "))}
                                                 </Text>
                                             </Text>
                                         </View>}

                                    </View>

                                </View>
                                {props?.proofOfPayment?.small && <View style={[{paddingTop: 5, paddingBottom: 9}, requirementStyles.cardDocument]}>
                                    <View style={{paddingRight: 10}}>
                                        <FileOutlineIcon/>
                                    </View>

                                </View>}

                            </View>
                            </TouchableOpacity>
                            {props?.proofOfPayment?.small && <View style={{
                                height: 216,
                                backgroundColor: "rgba(220,226,229,1)",
                                borderWidth: 1,
                                borderColor: "rgba(213,214,214,1)",
                                borderStyle: "dashed",
                            }}>
                                <TouchableOpacity onPress={ () => {
                                    setSelectImage(props?.proofOfPayment?.large);
                                    setVisibleRequireModal(true)
                                }
                                }>

                                    <Image
                                        style={{height: 216}}
                                        source={{
                                            uri: props?.proofOfPayment?.small,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View> }

                        </View>
                    </View>
                </View>


        </View>
        <RequirementModal
            image={ selectImage }
            visible={ visibleRequireModal }
            onDismissed={ onDismissedModal }/>
        <PaymentModal   updatedAt={props?.updatedAt} paymentMethod={props?.paymentMethod} applicant={props?.applicant}  totalFee={props?.totalFee} visible={visibleModal} onDismissed={onDismissed}  />
    </ScrollView>

}


export default Payment