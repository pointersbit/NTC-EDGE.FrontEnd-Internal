import {Menu,MenuOption,MenuOptions,MenuTrigger} from "react-native-popup-menu";
import ProfileImage from "@atoms/image/profile";
import {View} from "react-native";
import * as React from "react";
import {fontValue} from "@pages/activities/fontValue";
import Text from "@atoms/text"
function ProfileMenu(props:{onClose:()=>void,onSelect:(value)=>void,user:any}){
    return <Menu onClose={props.onClose} onSelect={props.onSelect}>

        <MenuTrigger>

            <ProfileImage
                style={{
                    borderRadius:26,
                }}
                size={28}
                image={props.user?.profilePicture?.small}
                name={`${props.user?.firstName} ${props.user?.lastName}`}
            />


        </MenuTrigger>

        <MenuOptions optionsContainerStyle={{
            marginTop:30,
            shadowColor:"rgba(0,0,0,1)",
            paddingVertical:10,
            borderRadius:8,
            shadowOffset:{
                width:0,
                height:0
            },
            elevation:45,
            shadowOpacity:0.1,
            shadowRadius:15,
        }}>
            <View style={{paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.3)"}}>
                <Text  style={{fontSize: fontValue(12) }} >Hello, {props.user?.firstName}!</Text>
            </View>
            <MenuOption value={"editProfile"}>

                <View style={{paddingTop: 10}}>
                    <Text style={{fontSize: fontValue(12) }}>{"Edit Profile"}</Text>
                </View>
            </MenuOption>
            <MenuOption value={"logout"}>
                <View>
                    <Text style={{fontSize: fontValue(12) }}>{"Logout"}</Text>
                </View>
            </MenuOption>
        </MenuOptions>

    </Menu>;
}

export default  ProfileMenu
