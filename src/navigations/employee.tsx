import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeScreen from "@pages/employee/index";
import UserEdit from "@templates/datatable/userEdit";
type RootStackParamList = {
    EmployeeScreen: undefined;
    UserEdit: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const EmployeeNavigator = ({ navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
            initialRouteName={"EmployeeScreen"}
        >
            <Stack.Screen name={"EmployeeScreen"}  component={EmployeeScreen} />
            <Stack.Screen name={"UserEdit"}  component={UserEdit} />
        </Stack.Navigator>
    );
};

export default EmployeeNavigator;
