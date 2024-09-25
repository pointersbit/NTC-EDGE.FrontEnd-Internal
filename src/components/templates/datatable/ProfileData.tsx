import {FlatList, ScrollView, Text, View} from "react-native";
import Row from "@pages/activities/application/Row";
import React, {memo, useEffect, useMemo} from "react";
import styles from "@styles/applications/basicInfo"
import {transformText} from "../../../utils/ntc";
import _ from "lodash";
import NavBar from "@molecules/navbar";
import ProfileImage from "@components/atoms/image/profile";
import {fontValue} from "@pages/activities/fontValue";
import {RootStateOrAny, useSelector} from "react-redux";
import RenderServiceMiscellaneous from "@pages/activities/application/renderServiceMiscellaneous";

const ProfileData = () => {
    const data = useSelector((state: RootStateOrAny) => {
        return state.application.data
    });

    return <ScrollView>
        <View style={[styles.elevation, {padding: 20}]}>
        <View style={{alignItems: "center", justifyContent: "center", paddingVertical: 15 }}>
        <ProfileImage
            size={fontValue(150)}
            style={{borderRadius:4}}

            textSize={22}
            image={data?.profilePicture?.small.match(/[^/]+(jpeg|jpg|png|gif)$/i) ? data?.profilePicture?.small : data?.profilePicture?.small+".png"}
            name={data?.firstName  && data?.lastName ? data?.firstName+(data?.middleName ? " "+data?.middleName?.charAt()+"." : "")+" "+data?.lastName : data?.applicantName ? data?.applicantName : ""}
        /></View>

                        <Text style={[styles.header, styles.group3]}>Basic Information</Text>
            <RenderServiceMiscellaneous isTitleVisible={false} exclude={ ["sessionToken", "createdAt","applicationTypes", "about", '_id', 'role', 'profilePicture', 'updatedAt',  'createdAt'] }
                                        service={data}/>


        </View>
    </ScrollView>
}

export default memo(ProfileData)



/*

<View style={[styles.elevation]}>

        <View style={[styles.container, {marginVertical: 20}]}>
            <View style={styles.group3}>
                <View style={{alignItems: "center", justifyContent: "center", paddingVertical: 15 }}>
                    <ProfileImage
                        size={fontValue(150)}
                        style={{borderRadius:4}}

                        textSize={22}
                        image={data?.profilePicture?.small.match(/[^/]+(jpeg|jpg|png|gif)$/i) ? data?.profilePicture?.small : data?.profilePicture?.small+".png"}
                        name={data?.firstName  && data?.lastName ? data?.firstName+(data?.middleName ? " "+data?.middleName?.charAt()+"." : "")+" "+data?.lastName : data?.applicantName ? data?.applicantName : ""}
                    />
                    <View style={styles.group3}>

                        <Text style={styles.header}>Basic Information</Text>

                        <FlatList
                            showsVerticalScrollIndicator={true}
                            style={styles.group3}
                            data={Object.keys(_.omit(data, ['_id', 'role', 'profilePicture', 'createdAt'] ))}
                            renderItem={(a) => {
                                return  <Row label={`${transformText(a?.item)}:`} applicant={data?.[a?.item]}/>
                            }
                            }
                            keyExtractor={(item,index)=>`${index}`}
                            scrollEnabled={false}
                        />
                    </View>
                </View>


            </View>
        </View>
    </View>
*/
