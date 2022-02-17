import {StyleSheet} from "react-native";
import {Bold} from "@styles/font";

export const requirementStyles = StyleSheet.create({
    container : {
        flex : 1
    } ,
    card : {
        padding : 10 ,
        width : "100%" ,

    } ,
    cardContainer : {

        backgroundColor : "rgba(255,255,255,1)" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            width : 0 ,
            height : 0
        } ,
        elevation : 1.5 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 5 ,
        borderRadius : 5
    } ,
    cardLabel : {
        width : "100%" ,
        justifyContent : "center" ,
        paddingVertical : 12 ,
        paddingLeft : 12
    } ,
    cardTitle : {
        flexDirection : 'row' ,
        justifyContent : "center" ,

    } ,
    title : {
        fontSize: 16,
        fontFamily: Bold,
        color : "#1F2022"
    } ,
    description : {
        color : "#1F2022",
        justifyContent: "center"
    } ,
    cardDocument : {
        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        margin : 0
    } ,
    text : {

        width : "80%" ,
        color : "#606A80"
    } ,
    cardPicture : {

        height : "70%" ,

        backgroundColor : "#E6E6E6"
    }
});