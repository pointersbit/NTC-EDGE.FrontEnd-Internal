import {Dimensions, StyleSheet} from "react-native";
import {Bold , Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
const { height, width } = Dimensions.get('window');
export const styles = StyleSheet.create({
    rect19: {
        justifyContent: "center",
        flex: 1
    },
    icon2: {
        color: "rgba(128,128,128,1)",
        fontSize: 40,
        alignSelf: "center"
    },
    group34:{
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    container: {
        flex: 1
    },
    group7: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },

    rect: {
        height: 100,

    },
    qrReader: {
        alignItems: "center",
        fontFamily: Bold,
        color: "rgba(255,255,255,1)",
        fontSize: RFValue(18),
        textAlign: "center",
        paddingVertical: 20
    },
    group32: {
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
        height: height,
        position: "absolute",
        alignItems: 'center',
        justifyContent: 'center',
    },
    rect13: {
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 14,
        width: '100%',
        maxHeight: height * 0.75,
        overflow: 'hidden',
    },
    group31: {
        height: 443,
        justifyContent: "space-between",
        alignItems: "center"
    },
    group30: {
        height: 50,
        alignSelf: "stretch"
    },
    rect14: {
        height: 50,

        borderTopLeftRadius: 14,
        borderTopRightRadius: 14
    },
    group33: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1
    },
    group12: {
        
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        margin: 0
    },
    rect15: {
        width: 15,
        height: 15,
        alignSelf: "center",
        padding: 5,
        justifyContent: "center"
    },
    verified: {
        fontWeight: "bold",
      fontSize: fontValue(18),
        textAlign: "center",
        letterSpacing: 0
    },
    rect18: {
        width: "33.33%",
        paddingRight: "5%",
        margin: 0,
    },
    rect17: {
        width: 150,
        height: 150,
        backgroundColor: "#E6E6E6",
        borderRadius: 5
    },
    group29: {
        width: '100%',
        height: 202,
        justifyContent: "flex-start",
    },
    group17: {
        paddingBottom: 10,
        justifyContent: "space-between",
        marginLeft: 10
    },
    examDetails: {
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
        lineHeight: 22
    },
    group18: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    group19: {
        height: 29,
        justifyContent: "space-between"
    },
    name2: {
        color: "#606A80"
    },
    address2: {
        color: "#606A80"
    },
    group20: {
        justifyContent: "space-between"
    },
    name3: {
        color: "#121212"
    },
    address3: {
        color: "#121212"
    },
    group11: {
        width: 337,
        flex: 1,
        justifyContent: "center",
        alignSelf: "center",
    },
    errorContainer:{
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        height: 180, backgroundColor: "#fff"
    },
    group10: {
        padding: 5,
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    rect6: {
        width: 60,
        height: 60,
        alignSelf: "center"
    },

    invalidQrCode: {
        fontWeight: "700",
        color: "#121212",
        fontSize: 17,
        textAlign: "center",
        lineHeight: 28,
        alignSelf: "center"
    },
    group9: {
        width: 302,
        height: 22,
        alignSelf: "center"
    },
    rect9: {
        height: 22,
        justifyContent: "center",
    },
    pleaseTryAgain: {
        color: "#121212",
        textAlign: "center",
    },
    group8: {

        backgroundColor: "#fff",
        borderBottomStartRadius: 14,
        borderBottomRightRadius: 14,
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: "rgba(217,219,233,1)",
    },
    rect11: {

    },
    rect12: {
        paddingVertical: 22,

        justifyContent: "center"
    },
    close: {
        fontWeight: "bold",
        color: "#121212",
        height: 16,
        width: 100,
        textAlign: "center",
        alignSelf: "center"
    },
    group6: {
      flex: 1,
        paddingVertical: 15,
       alignSelf: "center",
        justifyContent: "flex-end"
    },
    group3: {

    },
    rect2: {
        backgroundColor: "#fff",
        borderRadius: 10,

    },
    group2: {
        height: 44,
        justifyContent: "space-around",
        marginTop: 13
    },
    icon: {
        color: "rgba(128,128,128,1)",
        alignSelf: "center"
    },
    generateQrCode: {
        color: "#121212",
        alignSelf: "center",
        flex: 1
    },
    group4: {
        width: 160,
        height: 70
    },
    rect4: {
        backgroundColor: "#E6E6E6",
        borderRadius: 10,
        justifyContent: "center",
        flex: 1
    },
    group5: {
        height: 44,
        justifyContent: "space-between",
        alignItems: "center"
    },
    icon1: {
        color: "rgba(128,128,128,1)",
        fontSize: 26,
        alignSelf: "center"
    },
    generateQrCode1: {
        fontFamily: Regular,
        fontWeight: "500",
           paddingTop: 5,
        fontSize: fontValue(14),
        color: "#606A80",
        alignSelf: "center"
    }
});