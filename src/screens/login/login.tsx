import {Dimensions,Image,ImageBackground,InteractionManager,Platform,ScrollView,StatusBar,View} from "react-native";
import Text from "@atoms/text";
import LoginForm from "@organisms/forms/login";
import Button from "@atoms/button";
import {button , text} from "@styles/color";
import Ellipsis from "@atoms/ellipsis";
import React,{useEffect} from "react";
import {styles} from "@screens/login/styles";
import {useAuth} from "../../hooks/useAuth";
import {fontValue} from "@pages/activities/fontValue";

const logo = require('@assets/ntc-edge-horizontal.png');
const background = require('@assets/background.png');
const { height } = Dimensions.get('screen');
const navigationBarHeight = height - Dimensions.get('window').height;
const Login = ({ navigation }: any) => {

    const { loading , formValue , onChangeValue , onCheckValidation , isValid } = useAuth(navigation);


    return (
        <ImageBackground
            resizeMode="stretch"
            source={ background }
            style={ styles.bgImage }
            imageStyle={ { flex : 1 } }
        >
            <StatusBar barStyle="dark-content"/>

            <ScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={ { flexGrow : 1 } }
                showsVerticalScrollIndicator={ false }
            >

                <Image
                    resizeMode="contain"
                    source={ logo }
                    style={ styles.image }
                />

                <View style={ styles.formContainer }>

                    <Text style={ styles.formTitleText }>Login</Text>

                    <LoginForm onChangeValue={ onChangeValue } form={ formValue }/>

                    <View style={ styles.bottomContainer }>
                        <Button
                            style={ [
                                styles.loginButton ,
                                {

                                  
                                    backgroundColor : loading
                                                      ? button.info
                                                      : isValid
                                                        ? button.primary
                                                        : button.default
                                }
                            ] }
                            disabled={ loading }
                            onPress={ onCheckValidation }
                        >
                            {
                                loading ? (
                                    <View style={ { paddingVertical : fontValue(10) } }>
                                        <Ellipsis color="#fff" size={ 10 }/>
                                    </View>

                                ) : (
                                    <View>
                                        <Text style={ styles.boldText } color={ isValid ? "#fff" : text.disabled }
                                              size={ fontValue(18) }>Login</Text>
                                    </View>

                                )
                            }
                        </Button>
                        {
                            Platform.OS === "android" && <View style={ { height : navigationBarHeight } }/>
                        }
                    </View>

                </View>

            </ScrollView>

        </ImageBackground>);
};

export default Login