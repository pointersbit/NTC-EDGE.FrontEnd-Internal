import React, {memo} from "react";
import {ScrollView, Text, View} from "react-native";
import {styles as styles1} from "@pages/activities/styles";
import {Regular500} from "@styles/font";
function ListHeaderComponent(props: { searchVisible: boolean, pnApplications: { date: string; activity: any; readableHuman: string }[], containerHeight: number, onScroll: (event) => void, ref: React.MutableRefObject<undefined>, callbackfn: (item: any, index: number) => any }) {
    return <>
        {!props.searchVisible && !!props.pnApplications?.length && props.containerHeight &&
            <View style={[styles1.pinnedActivityContainer, {
                marginBottom: 5,
                paddingBottom: 20,
                backgroundColor: "#fff"
            }]}>
                {!!props.pnApplications?.length &&
                    <View style={[styles1.pinnedgroup, {height: undefined}]}>
                        <View style={[styles1.pinnedcontainer, {paddingVertical: 10}]}>
                            <Text style={[styles1.pinnedActivity, {fontFamily: Regular500,}]}>Pinned
                                Activity</Text>
                        </View>
                    </View>}
                {/* <TouchableOpacity onPress={()=>{
            scrollViewRef?.current?.scrollTo({ y: yPos, animated: true });
            }}>
                <Text>test</Text>
            </TouchableOpacity>*/}
                <ScrollView showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            onScroll={props.onScroll}
                            scrollEventThrottle={16}
                            ref={props.ref}
                            style={{maxHeight: 300}}>
                    {
                        props.pnApplications.map(props.callbackfn)
                    }
                </ScrollView>

            </View>}
    </>;
}

export default memo(ListHeaderComponent)