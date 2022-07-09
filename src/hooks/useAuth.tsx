import useApi from "../services/api";
import {useDispatch} from "react-redux";
import {useCallback } from "react";
import {setUser} from "../reducers/user/actions";
import {StackActions , useFocusEffect} from "@react-navigation/native";
import {validateEmail , validatePassword} from "../utils/form-validations";
import {Alert , BackHandler} from "react-native";
import useSafeState from "./useSafeState";

export function useAuth(navigation) {
    const errorResponse = {
        email : 'Enter a valid email address' ,
        password : 'Password must be at least 8 characters' ,
    };
    const api = useApi('');
    const dispatch = useDispatch();
    const [loading , setLoading] = useSafeState(false);
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Quit Application',
                    'Are you sure you want to quit the application?',
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => BackHandler.exitApp()
                        },
                    ]
                );
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );

    const onLogin = async (data) => {
        setLoading(true);
        api.post('/internal-signin' , {
            email : data.email ,
            password : data.password ,
        })
            .then(res => {
                setLoading(false);
                dispatch(setUser(res.data));
                navigation.dispatch(StackActions.replace('ActivitiesScreen'));
            })
            .catch(e => {
                setLoading(false);
                if (e) {


                    setFormValue({
                        ...formValue ,
                        email : {
                            ...formValue.email ,
                            hasValidation: true,
                            error : e?.response?.data?.message ||'Authentication failed'
                        }
                    });
                }
            });
    };
    const [formValue , setFormValue] = useSafeState({
        email : {

            value : '' ,
            isValid : false ,
            error : '' ,
            hasValidation: false,
           description: ''
        } ,
        password : {
            value : '' ,
            isValid : false ,
            error : '' ,
            hasValidation: false,
            description: '',
            characterLength : false ,
            upperAndLowerCase : false ,
            atLeastOneNumber : false ,
            strength : 'Weak' ,
        } ,
        showPassword : {
            value : false
        } ,
        keepLoggedIn : {
            value : false ,
        }
    });
    const onChangeValue = (key: string , value: any) => {
        switch (key) {
            case 'email': {
                const checked = validateEmail(value);
                return setFormValue({
                    ...formValue ,
                    [key] : {
                        value : value ,
                        isValid : checked ,
                        error : !checked ? errorResponse['email'] : ''
                    }
                });
            }
            case 'password': {
                const passwordTest=validatePassword(value,'length');
                return setFormValue({
                    ...formValue ,
                    [key] : {
                        value:value,
                        isValid:passwordTest?.isValid,
                        error:!passwordTest?.isValid ? errorResponse['password'] : '',
                        characterLength : passwordTest.characterLength ,
                        upperAndLowerCase : passwordTest.upperAndLowerCase ,
                        atLeastOneNumber : passwordTest.atLeastOneNumber ,
                        strength : passwordTest.strength ,
                    }
                });
            }
            case 'showPassword': {
                return setFormValue({
                    ...formValue ,
                    [key] : {
                        value : !formValue.showPassword.value ,
                    }
                });
            }
            case 'forgotPassword': {
                return navigation.navigate('ForgotPassword');
            }
            case 'login': {
                return onLogin(value)
            }
            default:
                return setFormValue({
                    ...formValue ,
                    [key] : {
                        value : value ,
                        isValid : !!value ,
                        error : '' ,
                    }
                });
        }
    };
    const onCheckValidation = () => {
        if (!formValue.email.isValid) {
            return onChangeValue('email' , formValue.email.value);
        }
        if (!formValue.password.isValid) {
            return onChangeValue('password' , formValue.password.value);
        } else {
            return onLogin({
                email : formValue?.email?.value ,
                password : formValue?.password?.value ,
            });
        }
    };
    const isValid =
        formValue.email.isValid &&
        formValue.password.isValid;
    return { loading , formValue , onChangeValue , onCheckValidation , isValid };
}
