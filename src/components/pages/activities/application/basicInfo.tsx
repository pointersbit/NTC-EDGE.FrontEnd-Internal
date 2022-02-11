import React from "react";
import {ActivityIndicator , Dimensions , ScrollView , StyleSheet , Text , View} from "react-native";
import {formatDate , PaymentStatusText , statusColor , statusIcon , StatusText} from "@pages/activities/script";
import ProfileImage from "@atoms/image/profile";
import CustomText from "@atoms/text";
import {CASHIER} from "../../../../reducers/activity/initialstate";
import {useAssignPersonnel} from "@pages/activities/hooks/useAssignPersonnel";
import {Role} from "@pages/activities/interface";
import moment from "moment";

const { width , height } = Dimensions.get("screen");

function getStatus(props: any , personnel: { _id: string | undefined; updatedAt: string | undefined; createdAt: string | undefined; username: string | undefined; role: Role | undefined; email: string | undefined; firstName: string | undefined; lastName: string | undefined; password: string | undefined; contactNumber: string | undefined; __v: number | undefined; address: string | undefined; profilePicture: ProfilePicture | undefined; avatar: string | undefined }, wordCase?: string) {
    return props.status ?
           props.status :
           (
               props?.user?.role?.key == CASHIER || personnel?.role?.key == CASHIER ?
               (wordCase === "toUpperCase" ?  PaymentStatusText(props?.paymentStatus).toUpperCase() :  PaymentStatusText(props?.paymentStatus)) :
               (wordCase === "toUpperCase" ?
               (
                   props.status ?
                   props.status :
                   StatusText(props.detailsStatus).toUpperCase()
               ) : (
                    props.status ?
                    props.status :
                    StatusText(props.detailsStatus)
                )
               )
           );
}

const Row = (props: { label: string,  applicant: any }) => <View style={ styles.group2 }>
    <Text style={ styles.detail }>{ props.label }</Text>
    <Text style={ styles.detailInput }>{ props.applicant }</Text>
</View>;

const BasicInfo = (props: any) => {

    const {
        personnel ,
        loading
    } = useAssignPersonnel(props.assignedPersonnel || props?.paymentHistory?.[0]?.userId || props?.approvalHistory?.[0]?.userId , {
        headers : {
            Authorization : "Bearer ".concat(props.user?.sessionToken)
        }
    });


    const applicant = props.applicant;
    return <ScrollView style={ { width : "100%" , backgroundColor : "#fff" , } }>
        <View style={ { padding : 10 , flex : 1 , alignSelf : "center" } }>
            <ProfileImage
                style={ { borderRadius : 4 } }
                size={ 150 }
                textSize={ 22 }
                image={ applicant?.user.profilePicture?.small }
                name={ `${ applicant?.user.firstName } ${ applicant?.user.lastName }` }
            />

        </View>

        { props.applicant &&
        <View style={ styles.elevation}>
            <View style={ [styles.container , { marginTop : 20 }] }>
                <View style={ styles.group4 }>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Status</Text>
                            </View>
                        </View>

                        <View>
                            <View style={ styles.status }>

                                    {
                                        statusIcon(
                                            getStatus(props , personnel)
                                            ,
                                            styles.icon2 ,
                                            1
                                        )
                                    }
                                    <CustomText
                                        style={ [
                                            styles.role ,
                                            statusColor(
                                                getStatus(props , personnel)
                                            ) ,
                                            {
                                                fontSize : 16 ,
                                                fontWeight : '500' ,
                                            }
                                        ] }
                                        numberOfLines={ 1 }
                                    >
                                        {
                                            getStatus(props , personnel , "toUpperCase")
                                        }
                                    </CustomText>
                                    <CustomText style={ { color : "#37405B" } }>
                                        { loading ?
                                          <ActivityIndicator/> : (
                                              personnel != undefined ? `by ${ personnel?.firstName } ${ personnel?.lastName }` : ``) }

                                    </CustomText>

                            </View>
                        </View>
                    </View>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Basic Information</Text>
                            </View>
                        </View>
                        <Row label={"Full Name:"} applicant={ applicant?.user?.firstName + " " + applicant?.user?.middleName?.charAt() +"." + " "+ applicant?.user?.lastName  }/>
                        <Row label={"Date of Birth:"} applicant={ moment(applicant?.user?.dateOfBirth).format('LL')  }/>
                        <Row label={"Gender:"} applicant={ applicant?.user?.gender  }/>
                        <Row label={"Nationality:"} applicant={ applicant?.user?.nationality  }/>
                    </View>
                    <View style={ styles.divider }/>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Address</Text>
                            </View>
                        </View>
                        <Row label={"Unit/Rm/House/Bldg No.:"} applicant={ applicant?.unit }/>
                        <Row label={"Barangay:"} applicant={ applicant?.barangay }/>
                        <Row label={"Province:"} applicant={ applicant?.province }/>
                        <Row label={"City/Municipality:"} applicant={ applicant?.city }/>
                        <Row label={"Zip Code:"} applicant={ applicant?.zipCode }/>

                    </View>
                    <View style={ styles.divider }/>
                    <View style={ styles.group3 }>
                        <View style={ styles.group }>
                            <View style={ styles.rect }>
                                <Text style={ styles.header }>Additional Details</Text>
                            </View>
                        </View>
                        <Row label={"School Attended:"} applicant={ applicant?.schoolAttended }/>
                        <Row label={"Course Taken:"} applicant={ applicant?.courseTaken }/>
                        <Row label={"Year Graduated:"} applicant={ applicant?.yearGraduated }/>
                        <Row label={"Contact Number:"} applicant={  applicant?.user?.contactNumber }/>
                        <Row label={"Email:"} applicant={applicant?.user?.email }/>

                    </View>
                    <View style={ styles.divider }/>

                </View>

            </View>
        </View>
        }
    </ScrollView>

};
const styles = StyleSheet.create({
    elevation: {
        marginBottom : 20 ,
        borderRadius : 5 ,
        alignSelf : "center" ,
        width : "90%" ,
        backgroundColor : "#fff" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            height : 0 ,
            width : 0
        } ,
        elevation : 10 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 2 ,
    } ,
    icon2 : {
        color : "rgba(248,170,55,1)" ,
        fontSize : 10
    } ,
    role : {

        fontWeight : "bold" ,
        fontSize : 14 ,
        textAlign : "left" ,
        paddingRight: 20
    } ,
    submitted : {
        color : "rgba(105,114,135,1)" ,
        textAlign : "right" ,
        fontSize : 10
    } ,
    container : {

        flex : 1
    } ,
    group4 : {} ,
    group3 : {
        paddingRight : 10 ,
        paddingLeft : 10
    } ,
    group : {} ,
    rect : {

        backgroundColor : "#EFF0F6"
    } ,
    header : {
        fontWeight : "500" ,
        color : "#565961" ,
        padding : 5 ,
        marginLeft : 5
    } ,
    group2 : {
        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        marginTop : 8,
        paddingHorizontal: 10
    } ,
    detail : {
        fontWeight : "400" ,
        paddingRight : 0 ,
        textAlign : "left" ,
        flex : 1 ,
        alignSelf : "flex-start"
    } ,
    detailInput : {
        fontWeight : "500" ,
        color : "#121212" ,
        flex : 1 ,
        textAlign : "left"
    } ,
    divider : {
        padding : 2 ,
        paddingBottom : 20
    } ,
    status : {
        flexDirection : 'row' ,
        flexWrap : "wrap" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        paddingTop : 15,
        paddingBottom : 20,
        paddingHorizontal: 10
    }
});
export default BasicInfo