import React, {Component, memo} from 'react';
import { StyleSheet, View, Dimensions, Animated, Platform } from 'react-native';
import {fontValue} from "@pages/activities/fontValue";


type Props = {};
class Skeleton extends Component<Props> {
    constructor(props) {
        super(props)
        this.circleAnimatedValue = new Animated.Value(0)

    }
    state = {
        isMounted: true
    }
    circleAnimated = () => {
        if(this.state.isMounted){
            this.circleAnimatedValue.setValue(0)
            Animated.timing(
                this.circleAnimatedValue,
                {
                    useNativeDriver: true,
                    toValue: 1,
                    duration: 350
                }
            ).start(() => {

                this.circleAnimated()
            })
        }

    }
    componentWillUnmount() {
        this.setState({
            isMounted: false
        })
    }
    componentDidMount() {
        this.setState({
            isMounted: true
        })
        this.circleAnimated()
    }

    render() {
        const translateX = this.circleAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 100]
        })

        const translateX2 = this.circleAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 200]
        })
        return (
            <View style={styles.container}>
                <View style={[{ marginBottom: 2 }, styles.card]}>
                    <View style={{ width: fontValue(70), height: fontValue(70), borderRadius: fontValue(35), backgroundColor: '#ECEFF1', overflow: 'hidden', marginRight: fontValue(20) }}>
                        <View style={{ width: '35%', opacity: 0.5, height: '100%', backgroundColor: 'white',}}></View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-evenly', overflow: 'hidden' }}>
                        <View style={{ backgroundColor: '#ECEFF1', height: fontValue(32/2) }}>
                            <View style={{ width: '10%', height: '100%', backgroundColor: 'white', opacity: 0.5,  }}></View>
                        </View>
                        <View style={{ backgroundColor: '#ECEFF1', height: 32/2 }}>
                            <View style={{ width: '10%', height: '100%', backgroundColor: 'white', opacity: 0.5, }}></View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
export default memo(Skeleton)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        paddingTop: fontValue(6),
        paddingHorizontal: fontValue(16),
        paddingBottom: fontValue(6),
        borderRadius: fontValue(10),
    },
    card: {
        padding: fontValue(20),
        shadowColor: "#000",
        shadowOffset: {
            width: fontValue(1),
            height: fontValue(1),
        },
        shadowRadius: fontValue(3.84),
        elevation: fontValue(5),
        borderRadius: fontValue(10),
        backgroundColor: '#Fff',
        shadowOpacity: fontValue(0.1),
        flexDirection: 'row'
    }
});
