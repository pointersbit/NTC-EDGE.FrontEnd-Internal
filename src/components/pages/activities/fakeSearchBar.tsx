import {Text , TouchableOpacity , View , Animated , useWindowDimensions} from "react-native";
import {styles} from "@pages/activities/styles";
import SearchIcon from "@assets/svg/search";
import React, {memo, useMemo} from "react";
import {Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";

 const FakeSearchBar = (_props: { onSearchLayoutComponent,  animated,  onPress: () => void, searchVisible: boolean }) => {
    const props = useMemo(() => _props, [_props])
     const dimensions = useWindowDimensions();
    return <Animated.View
        //onLayout={ props.onSearchLayoutComponent}
        style={[styles.searcg, props.animated]}>
        <View style={[styles.rect26, {paddingVertical: isMobile || dimensions?.width < 800 ?  10 : undefined } ]}>
            <TouchableOpacity testID={'fake-search'} onPress={props.onPress}>
                <View style={[styles.rect7, {marginTop: 0, width: "100%", marginLeft: 0}]}>
                        <View style={styles.iconRow}>

                                <SearchIcon height={fontValue(20)} width={fontValue(20)} style={styles.icon}></SearchIcon>

                                <View

                                    style={styles.textInput}

                                >
                                <Text style={{fontFamily: Regular, fontSize: fontValue(12), color: "rgba(128,128,128,1)",}}>Search</Text>
                            </View>

                        </View>
                    </View>
            </TouchableOpacity>
        </View>
    </Animated.View>;
}
export default memo(FakeSearchBar)
