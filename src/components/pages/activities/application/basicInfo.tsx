import React, {useEffect, useMemo, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import axios from "axios";
import {RootStateOrAny, useSelector} from "react-redux";
import {Applicant} from "@pages/activities/interface";
import {formatDate} from "@pages/activities/script";



const BasicInfo = (props: any) => {
    const applicant = props.applicant
    return <>

        {props.applicant && <View style={styles.container}>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Basic Information</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                    <Text style={styles.label}>Last Name</Text>
                    <View style={styles.labelFiller}></View>
                    <Text style={styles.input}>{applicant?.user.lastName}</Text>
                </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Middle Name</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.user.middleName}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>First Name</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.user.firstName}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{formatDate(applicant?.user?.dateOfBirth)}</Text>
                    </View>
                </View>

                <View style={[styles.rect4]}></View>
                <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
            </View>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Address</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Unit/Rm/House/Bldg No.:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.unit}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Barangay:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.barangay?.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Province:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.province?.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>City/Municipality:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.city?.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant?.zipCode}</Text>
                    </View>
                </View>
                <View style={[styles.rect4]}></View>
                <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
            </View>
            <View style={styles.group2}>
                <View style={styles.rect}>
                    <Text style={styles.basicInfo}>Additional Details</Text>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>School Attended:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.schoolAttended}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Course Taken:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.courseTaken}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Year Graduated:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.yearGraduated}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Contact Number:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.user.contactNumber}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Email:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.user.email}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>City/Municipality:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.city.name}</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.rect3}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <View style={styles.labelFiller}></View>
                        <Text style={styles.input}>{applicant.zipCode}</Text>
                    </View>
                </View>
                <View style={[styles.rect4]}></View>
                <View style={[styles.rect4, {backgroundColor: "#E6E6E6"}]}></View>
            </View>
        </View>}
    </>

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 15,
    },
    group2: {
        marginBottom: 10,
        width: '100%',

    },
    rect: {
        width: '100%',
        height: 27,
        backgroundColor: "#E6E6E6"
    },
    basicInfo: {

        color: "rgba(86,89,97,1)",
        marginTop: 6,
        marginLeft: 13
    },
    group: {
        width: '100%',
        marginTop: 11
    },
    rect3: {

        height: 14,
        backgroundColor: "rgba(255,255,255,1)",
        flexDirection: "row"
    },
    label: {

        color: "rgba(86,89,97,1)",
        fontSize: 12,

    },
    labelFiller: {
        flex: 1,
        flexDirection: "row"
    },
    input: {
        fontWeight: "bold",
        color: "#000",
        fontSize: 12,
    },
    rect4: {
        width: '100%',
        height: 10,
    }
});
export default BasicInfo