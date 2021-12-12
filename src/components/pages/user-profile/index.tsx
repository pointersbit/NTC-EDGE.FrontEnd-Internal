import React, {useState} from "react";
import FormField from "@organisms/forms/form";
import InputStyles from "@styles/input-style";
import Text from '@atoms/text';
import {primaryColor, text} from "@styles/color";
import {Image, SafeAreaView, ScrollView, StyleSheet, View,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import Button from "@atoms/button";
import {Ionicons} from "@expo/vector-icons";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {setUser} from "../../../reducers/user/actions";

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerPadding: {
        paddingHorizontal: 18,
        paddingTop: 32,
    },
    container: {
        flex: 1,
    },
    profile: {
        flexDirection: 'row',
        marginTop: 20
    },
    name: {
        fontSize: 22,
        color: primaryColor,
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: 10
    },
    shareButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: primaryColor,
    },
    shareButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
    }
})
const UserProfile = ({ navigation }: any) => {
    const FIRST_NAME_LABEL = "First Name",
        MIDDLE_NAME_LABEL = "Middle Name",
        LAST_NAME_LABEL = "Last Name";
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [fullName, setFullName] = useState("")
    const [profileImage, setProfile] = useState("")
    const user = useSelector((state: RootStateOrAny) => state.user);
    const [userProfile, setUserProfile] = useState()
    const [userProfileForm, setUserProfileForm] = useState([
        {
            id: 1,
            key: 1,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "User Name",
            type: "input",
            placeholder: "User Name",
            value: user.username || '',
            stateName: 'username',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'email',
            id: 2,
            key: 2,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Email",
            type: "input",
            placeholder: "Email",
            value: user.email || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'password',
            id: 3,
            key: 3,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Password",
            secureTextEntry: true,
            type: "password",
            placeholder: "Password",
            value: user.password || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'userType',
            id: 4,
            key: 4,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "User Type",
            type: "input",
            placeholder: "User Type",
            value: user.userType || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'permitType',
            id: 5,
            key: 5,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Permit Type",
            type: "input",
            placeholder: "Permit Type",
            value: user.permitType || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: "firstname",
            id: 6,
            key: 6,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: FIRST_NAME_LABEL,
            type: "input",
            placeholder: "First Name",
            value: user.firstname || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'middlename',
            id: 7,
            key: 7,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: MIDDLE_NAME_LABEL,
            type: "input",
            placeholder: "Middle Name",
            value: user.middlename || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'lastname',
            id: 8,
            key: 8,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: LAST_NAME_LABEL,
            type: "input",
            placeholder: "Last Name",
            value: user.lastname || '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'phone',
            id: 9,
            key: 9,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Phone",
            type: "input",
            placeholder: "Phone",
            value: '',
            inputStyle: InputStyles.text,
            error: false,
        },
        {
            stateName: 'address',
            id: 10,
            key: 10,
            required: true,
            outlineStyle: InputStyles.outlineStyle,
            activeColor: text.primary,
            errorColor: text.error,
            requiredColor: text.error,
            label: "Address",
            type: "input",
            placeholder: "Address",
            value: user.address || '',
            inputStyle: InputStyles.text,
            error: false,
        },

    ])

    const set_FullName = () => {
        for (let i = 0; i < userProfileForm.length; i++) {

            if (userProfileForm[i].label == FIRST_NAME_LABEL) {
                 setFirstName(userProfileForm[i].value)
            } else if (userProfileForm[i].label == MIDDLE_NAME_LABEL) {
                 setMiddleName(userProfileForm[i].value)
            } else if (userProfileForm[i].label == LAST_NAME_LABEL) {
                 setLastName(userProfileForm[i].value)
            }
        }
        setFullName(`${firstName} ${middleName} ${lastName}`)
    }

    const onChangeUserProfile = (id: number, text: any, element?: string) => {

        const index = userProfileForm.findIndex(app => app.id == id)
        let newArr = [...userProfileForm];
        if (element == 'password') {
            newArr[index]['value'] = text;
        } else if (element == "input") {
            newArr[index]['value'] = text;
            if (newArr[index].label === FIRST_NAME_LABEL || newArr[index].label === MIDDLE_NAME_LABEL || newArr[index].label === LAST_NAME_LABEL) {
                set_FullName()
            }
        }
        setUserProfileForm(newArr);
    }

    const onPressed = (id?: number, type?: string | number) => {
        let index, newArr;

        if (type === 'image-picker') {
            openImagePickerAsync().then((r: any) => {
                setUserProfile(r?.uri)
            })
        }
    }
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let picker = await ImagePicker.launchImageLibraryAsync()
        return picker
    }

    const onUserSubmit = () =>{
        let userInput = {} as any;

        for (let i = 0; i < userProfileForm.length; i++) {
            userInput[`${userProfileForm[i]?.stateName}`] = userProfileForm[i].value
        }
        dispatch(setUser(userInput))
    }
    return <>

            <View style={{ flex: 1, backgroundColor: "white",   padding: 20}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.profile}>
                        {userProfile ? <Image
                                style={styles.avatar}
                                source={{uri: userProfile}}
                                resizeMode={"cover"}/>
                            : <Image style={styles.avatar}
                                     source={require('@assets/favicon.png')}/>}

                        <Text style={styles.name}>
                            {fullName}
                        </Text>

                    </View>
                    <Button style={styles.shareButton} onPress={() => onPressed(0, 'image-picker')}>
                        <Text fontSize={16} color={'white'}>Pick an image</Text>
                    </Button>

                    <FormField formElements={userProfileForm} onChange={onChangeUserProfile} onSubmit={onPressed}/>
                </ScrollView>
            </View>
            <View style={bottom.bottomView}>
                <Button onPress={()=>{
                    onUserSubmit()
                }} style={[button.color, button.borderRadius]}>
                    <Text fontSize={16} color={'white'}>
                        Submit
                    </Text>
                </Button>
            </View>

    </>
}
const bottom = StyleSheet.create({

    bottomView: {
        width: '100%',
        backgroundColor: '#fff',
        bottom: 0,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        },
        padding: 20
    },
});
const button = StyleSheet.create({
    color: {
        backgroundColor: primaryColor
    },
    borderRadius: {

        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
})

export default UserProfile
