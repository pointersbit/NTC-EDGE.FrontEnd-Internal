import React, {useCallback, useState} from 'react';
import { StackActions } from '@react-navigation/native';
import ActivitiesPage from "@pages/activities/tabbar";
import {createDrawerNavigator} from "@react-navigation/drawer";
import CustomSidebarMenu from "@pages/activities/customNavigationDrawer";
import AccountIcon from "@assets/svg/account";
import BellIcon from "@assets/svg/bell";
import DonutIcon from "@assets/svg/donut";
import WarningIcon from "@assets/svg/warning";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import styles from "@screens/HomeScreen/DrawerNavigation/styles";
import {button} from "@styles/color";
import AwesomeAlert from "react-native-awesome-alerts";
import {setUser} from "../../reducers/user/actions";
import { resetMeeting } from 'src/reducers/meeting/actions';
import { resetChannel } from 'src/reducers/channel/actions';
import Api from 'src/services/api';
import UserProfileScreen from "@screens/HomeScreen/UserProfile";
const Drawer = createDrawerNavigator();


const ActivitiesScreen = (props:any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const onHide = () => setShowAlert(false)
    const onShow = () => setShowAlert(true);
    const [showAlert, setShowAlert] = useState(false);
    const onLogout = useCallback(() => {
        const api = Api(user.sessionToken);
        onHide();
        setTimeout(() => {
            api.post('/user/logout')
            .then(() => {
                dispatch(setUser({}));
                dispatch(resetMeeting());
                dispatch(resetChannel());
                props.navigation.dispatch(StackActions.replace('Login'));
            });
        }, 500);
    }, []);
    return <>
        <Drawer.Navigator
            screenOptions={{
                drawerItemStyle:{
                    backgroundColor: 'rgba(0,0,0,0)',
                    marginLeft: 20,
                    marginBottom: 20,
                }
            }}
            backBehavior='none'
            drawerContent={(props) => <CustomSidebarMenu onLogout={onShow} {...props} />} initialRouteName="Home">
            <Drawer.Screen   options={{ drawerLabel: `${user?.firstName} ${user?.lastName}`,   headerShown: false , drawerIcon: ({ color, size }) => <AccountIcon/>}}  name="profile" component={UserProfileScreen} />
            <Drawer.Screen   options={{ drawerLabel: "Home",   headerShown: false , drawerIcon: ({ color, size }) => <AccountIcon/>}}  name="Home"  component={ActivitiesPage} />
            <Drawer.Screen  options={{ drawerLabel: "Notifications",   headerShown: false , drawerIcon: ({ color, size }) => <BellIcon/> }}  name="notification" component={ActivitiesPage} />
            <Drawer.Screen  options={{ drawerLabel: "Help Center", headerShown: false , drawerIcon: ({ color, size }) => <DonutIcon/> }}  name="help" component={ActivitiesPage} />
            <Drawer.Screen  options={{drawerLabel: "About" ,headerShown: false , drawerIcon: ({ color, size }) => <WarningIcon/> }}  name="about" component={ActivitiesPage} />
        </Drawer.Navigator>
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            titleStyle={styles.alertMessage}
            title={'Are you sure you would like to log out?'}
            contentStyle={styles.contentStyle}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Yes"
            confirmText="No"
            confirmButtonColor={'white'}
            cancelButtonColor={button.primary}
            confirmButtonStyle={styles.cancelButton}
            confirmButtonTextStyle={styles.cancelText}
            cancelButtonStyle={styles.confirmButton}
            cancelButtonTextStyle={styles.confirmText}
            actionContainerStyle={styles.actionContainerStyle}
            onCancelPressed={onLogout}
            onConfirmPressed={onHide}
        />
    </>

}

export default ActivitiesScreen