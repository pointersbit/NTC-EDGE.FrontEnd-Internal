import React from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import Header from "@molecules/header";
import {setRole} from "../../../reducers/role/actions";
import Text from "@atoms/text";
import {InputField} from "@molecules/form-fields";
import {disabledColor, successColor} from "@styles/color";
import {
    activity,
    chat,
    employeeCreate, employeeDelete, employeeEdit, employeeView,
    meet, resetPasswordPermission, rolePermissionCreate, rolePermissionDelete, rolePermissionEdit, rolePermissionView,
    userCreate,
    userDelete,
    userEdit,
    userView
} from "../../../reducers/role/initialstate";
import {styles} from "@pages/activities/styles";
import useRoleAndPermission from "../../../hooks/useRoleAndPermission";
import {CheckboxList} from "@atoms/checkboxlist/CheckboxList";
import {isMobile} from "@pages/activities/isMobile";

const CreateRoleAndPermissionScreen = (props) => {
    const {
        dispatch,
        role,
        access,
        setAccess,
        setCreateRole,
        createRoleInput,
        setCreateRoleInput,
        onCreateAccess,
    } = useRoleAndPermission();
    return <View style={[{flex:1, backgroundColor: "#fff",}]}>
        <Header size={24} title={ "Create Role and Permission"}>
            <TouchableOpacity onPress={()=>{
              if(props.navigation.canGoBack() && isMobile) props.navigation.goBack()
                dispatch(setRole({}))
            }
            }>
                <Text>Close</Text>
            </TouchableOpacity>
        </Header>
        <View style={{paddingHorizontal: 26}}>
            <InputField   onChangeText={setCreateRoleInput}
                          value={createRoleInput} placeholder={"Create a Role"} label={"Create a Role"} />
        </View>

        { role?.description ? <Header size={14} title={"Description:" + role?.description}/> : <></>}
        <Header size={14} title={"Access:"}/>
        <ScrollView style={{ borderTopWidth: 1, borderTopColor: disabledColor}}>
            <View style={{padding: 20}}>

                <View>

                    <CheckboxList
                        containerStyle={{flex: 1}}
                        showCheckAll={false}
                        value={access}
                        onChange={(value)=>{

                            setAccess(value)
                        }
                        }
                        options={[
                            { label: 'Chat', value: chat },
                            { label: 'Meet', value: meet },
                            { label: 'Activity', value: activity},
                        ]}
                    />
                    <View style={{paddingTop: 10}}>
                        <Text size={14} style={styles.text}>User</Text>
                        <CheckboxList
                            showCheckAll={false}
                            value={access}
                            onChange={(value)=>{

                                setAccess(value)
                            }
                            }
                            options={[
                                { label: 'Create', value: userCreate },
                                { label: 'Read', value: userView },
                                { label: 'Update', value: userEdit },
                                { label: 'Delete', value: userDelete },
                            ]}
                        />
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text size={14} style={styles.text}>Employee</Text>
                        <CheckboxList
                            showCheckAll={false}
                            value={access}
                            onChange={(value)=>{

                                setAccess(value)
                            }
                            }
                            options={[
                                { label: 'Create', value: employeeCreate },
                                { label: 'Read', value: employeeView },
                                { label: 'Update', value: employeeEdit },
                                { label: 'Delete', value: employeeDelete },
                            ]}
                        />
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text size={14} style={styles.text}>Role and Permission</Text>
                        <CheckboxList
                            size={12}
                            showCheckAll={false}
                            value={access}
                            onChange={(value)=>{
                                setAccess(value)
                            }
                            }
                            options={[
                                { label: 'Create', value: rolePermissionCreate },
                                { label: 'Read', value: rolePermissionView },
                                { label: 'Update', value: rolePermissionEdit },
                                { label: 'Delete', value: rolePermissionDelete },
                            ]}
                        />
                    </View>
                </View>
                <Text size={14} style={styles.text}>Reset Password</Text>
                <CheckboxList
                    size={12}
                    showCheckAll={false}
                    value={access}
                    onChange={(value)=>{
                        setAccess(value)
                    }
                    }
                    options={[
                        { label: 'Reset Password', value: resetPasswordPermission },
                    ]}
                />
            </View>
        </ScrollView>
        <View style={{

            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',}}>
            {/* <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={newToken}>

                            <Text style={[styles.text,  ]} size={14}>new token</Text>

                        </TouchableOpacity>*/}
            <TouchableOpacity style={{backgroundColor: successColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10}} onPress={onCreateAccess}>

                <Text style={[styles.text, {color: "#fff"} ]} size={14}>Create</Text>

            </TouchableOpacity>
        </View>



    </View>
}

export default CreateRoleAndPermissionScreen
