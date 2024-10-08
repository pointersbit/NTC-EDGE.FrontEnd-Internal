import React, {Component, memo} from 'react';
import { Text, TouchableOpacity, View, Animated, ScrollView } from 'react-native';
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

import styles from './styles';

function transformOrigin(matrix, origin) {
    const { x, y, z } = origin;

    const translate = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
    MatrixMath.multiplyInto(matrix, translate, matrix);

    const untranslate = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
    MatrixMath.multiplyInto(matrix, matrix, untranslate);
}

function createTranslateXScaleX(scaleXFactor, x) {
    return [
        scaleXFactor, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, 0, 0, 1,
    ];
}


class TabBar extends Component{
    static defaultProps = {
        tabMargin: 20,
        tabBarTextStyle: {},
        tabStyles: {
            tab: {},
        },
        scrollContainerStyle: {},
        style: {},
        underlineColor: 'navy',
        underlineHeight: 2,
        underlineBottomPosition: 0,
    };
    initialSetupWasDone = false;
    currentContentOffset= { x: 0, y: 0 };
    tabState = {};
    tabContainerLayout = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    };
    scrollContainerLayout = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    };
    underlineRef = null;
    scrollView = null;
    _animateListenerId = null;
    offsetCollection = null;
    widthCollection = null;
    scrollOffsetsCollection = null;
    state = {
        renderUnderline: false,
        tabScrollValue: 0,
    };

    componentDidMount() {
        this._animateListenerId = this.props.scrollValue.addListener(this.handleScrolling);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const serializedState = JSON.stringify(this.props) + JSON.stringify(this.state);
        const serializedNextState = JSON.stringify(nextProps) + JSON.stringify(nextState);
        return serializedState !== serializedNextState;
    }

    componentWillUnmount() {
        if (this._animateListenerId) {
            this.props.scrollValue.removeListener(this._animateListenerId);
        }
    }

    measureTabsContainer = (event) => {
        this.tabContainerLayout = event.nativeEvent.layout;
        this.checkMeasures();
    };

    onScrollContentSizeChange = (width, height) => {
        this.scrollContainerLayout = { width, height, x: 0, y: 0 };
        this.checkMeasures()
    };

    setUnderlineRef = (ref) => {
        this.underlineRef = ref;
    };

    handleScrolling = (event) => {
        const { value } = event;
        const dx = (this.offsetCollection && this.offsetCollection._interpolation(value)) || 0;
        const scaleX = (this.widthCollection && this.widthCollection._interpolation(value)) || 0;
        this.applyTransformToUnderline(scaleX, dx);
        if (this.scrollOffsetsCollection) {
            const scrollOffset =
                this.scrollOffsetsCollection && this.scrollOffsetsCollection._interpolation(value);
            const curOffsetX = this.currentContentOffset.x;
            const tabContainerWidth = this.tabContainerLayout.width;
            const scrollWidth = this.scrollContainerLayout.width;
            const restSpaceWillBe = scrollWidth - (tabContainerWidth + scrollOffset);
            const restSpaceNow = scrollWidth - (tabContainerWidth + curOffsetX);
            const shouldScroll = Math.abs(restSpaceNow - restSpaceWillBe) < tabContainerWidth / 4;
            if (this.scrollView && shouldScroll) {
                this.scrollView.scrollTo({ x: scrollOffset, animated: false, useNativeDriver: true });
            }
        }
    };

    applyTransformToUnderline(scaleXFactor, dx) {
        const { underlineRef } = this;
        if (!underlineRef) return;
        const matrix = createTranslateXScaleX(scaleXFactor, dx);
        transformOrigin(matrix, { x: -0.5, y: 0, z: 0 });
        underlineRef.setNativeProps({
            style: {
                transform: [
                    {
                        matrix,
                    },
                ],
            },
        });
    }
    onTabLayout(event, page) {
        const { x, y, width, height } = event.nativeEvent.layout;
        this.tabState[page] = { x, y, width, height };
        if (this.props.tabs.length === Object.keys(this.tabState).length) {
            this.setState({ renderUnderline: true }, this.checkMeasures);
        }
    }

    checkMeasures = () => {
        if (
            this.state.renderUnderline &&
            this.tabContainerLayout.width !== 0 &&
            this.scrollContainerLayout.width !== 0
        ) {
            if (!this.initialSetupWasDone) {
                const { activeTab } = this.props;
                this.applyTransformToUnderline(this.tabState[activeTab].width, this.tabState[activeTab].x);
                this.initialSetupWasDone = true;
            }
            this.calculateInterpolations();
        }
    };

    calculateInterpolations = () => {
        const inputRange = Object.keys(this.tabState).map(Number);
        const outputRangeLeft = [];
        const outputRangeWidth = [];
        const tabContainerWidth = this.tabContainerLayout.width;
        const scrollWidth = this.scrollContainerLayout.width;
        const marginValue = this.props.tabMargin;
        for (let i = 0, len = inputRange.length; i < len; i += 1) {
            const key = inputRange[i];
            outputRangeLeft.push(this.tabState[key].x);
            outputRangeWidth.push(this.tabState[key].width);
        }
        // Serve the case when we have only one tab
        // Also it doesn't make sense to handle case when we don't have tabs at all
        // because ScrollableTabView wouldn't work
        if (inputRange.length < 2) {
            inputRange.push(1);
            outputRangeLeft.push(0);
            outputRangeWidth.push(0);
        }
        // $FlowFixMe
        this.offsetCollection = this.props.scrollValue.interpolate({
            inputRange, // $FlowFixMe
            outputRange: outputRangeLeft, // $FlowFixMe
        });
        // $FlowFixMe
        this.widthCollection = this.props.scrollValue.interpolate({
            inputRange, // $FlowFixMe
            outputRange: outputRangeWidth, // $FlowFixMe
        });
        if (scrollWidth <= tabContainerWidth) {
            return;
        }
        const outputRangeScroll = [];
        for (let i = 0, len = inputRange.length; i < len; i += 1) {
            if (i === 0) {
                outputRangeScroll.push(0);
                continue; // eslint-disable-line
            }
            const isLast = i === len - 1;
            const offset = outputRangeLeft[i];
            const tabWidth = outputRangeWidth[i];
            const nextTabWidth = outputRangeWidth[i + 1] || 0;
            let scrollOffset = offset;

            if (offset + tabWidth + nextTabWidth + 2 * marginValue >= scrollWidth) {
                if (isLast) {
                    scrollOffset = offset - (tabContainerWidth - (tabWidth + marginValue));
                } else {
                    // 1.3 - is a magical constant
                    // actually it is just 1.3 of margins. If to place 2
                    // scrollOffset will match with last tab's offset
                    // And it will prevent bounce effect while scrolling
                    scrollOffset =
                        offset - (tabContainerWidth - (tabWidth + nextTabWidth + 1.3 * marginValue));
                }
            } else {
                scrollOffset =
                    offset -
                    (tabContainerWidth - (tabWidth + marginValue) + (nextTabWidth + 2 * marginValue)) / 2;
                scrollOffset = scrollOffset >= 0 ? scrollOffset : 0;
            }
            outputRangeScroll.push(scrollOffset);
        }
        // $FlowFixMe
        this.scrollOffsetsCollection = this.props.scrollValue.interpolate({
            inputRange: [-1, ...inputRange], // $FlowFixMe
            outputRange: [-40, ...outputRangeScroll], // $FlowFixMe
        });
    };

    onTabBarScrolling = (e) => {
        this.currentContentOffset = e.nativeEvent.contentOffset;
    };

    renderUnderline () {
        const tabUnderlineStyle = {
            position: 'absolute',
            backgroundColor: this.props.underlineColor,
            height: this.props.underlineHeight,
            width: 1,
            bottom: this.props.underlineBottomPosition,
            padding: 0,
        };

        return <Animated.View ref={this.setUnderlineRef} style={[tabUnderlineStyle]} />;
    }

    renderTab = (
        tab,
        page,
        isTabActive,
        onPressHandler,
        onTabLayout,
    ) => {
        const { tabBadgeColor, activeTabTextStyle } = this.props;
        const { label, badge, badgeColor } = tab;
        const activeTextColor = this.props.activeTextColor || 'navy';
        const inactiveTextColor = this.props.inactiveTextColor || 'black';
        const textStyle = this.props.tabBarTextStyle;
        return (
            <TouchableOpacity
                style={[
                    styles.tab,
                    this.props.tabMargin && { marginLeft: this.props.tabMargin },
                    this.props.tabStyles.tab,
                ]}
                key={page}
                onPress={onPressHandler}
                onLayout={onTabLayout}
            >
                <Text
                    style={[
                        {
                            color: isTabActive ? activeTextColor : inactiveTextColor,
                        },
                        textStyle,
                        isTabActive && activeTabTextStyle,
                    ]}
                >
                    {label}
                </Text>
                {badge != null &&
                    +badge > 0 && (
                        <View
                            style={[
                                styles.badgeBubble,
                                this.props.tabStyles.badgeBubble,
                                { backgroundColor: badgeColor || tabBadgeColor || activeTextColor },
                            ]}
                        >
                            <Text style={[styles.badgeText, this.props.tabStyles.badgeText]}>{badge}</Text>
                        </View>
                    )}
            </TouchableOpacity>
        );
    };

    render() {
        const {
            style,
            backgroundColor,
            tabBarStyle,
            tabMargin,
            scrollContainerStyle,
            tabs,
        } = this.props;
        return (
            <View
                style={[styles.tabs, { backgroundColor }, style, tabBarStyle]}
                onLayout={this.measureTabsContainer}
            >
                <ScrollView
                    horizontal
                    contentContainerStyle={ [
                        tabs?.length < 4 ? { width : "100%" } : {},
                        styles.scrollContainer ,
                        tabMargin && { paddingRight : tabMargin } ,
                        scrollContainerStyle ,
                    ] }
                    showsHorizontalScrollIndicator={ false }
                    onContentSizeChange={ this.onScrollContentSizeChange }
                    ref={ node => (
                        this.scrollView = node) }
                    bounces={ false }
                    scrollEventThrottle={ 16 }
                    onScroll={ this.onTabBarScrolling }
                >
                    <View style={ { flexDirection : "row" , flex : 1 , width : "100%" , justifyContent : "space-evenly" } }>
                        { tabs.map((tab: TabType , page: number) => {
                            const renderTab = this.props.renderTab || this.renderTab;
                            const isTabActive = this.props.activeTab === page;
                            const onPressHandler = () => this.props.goToPage(page);
                            const onTabLayout = (event: Object) => this.onTabLayout(event , page);
                            return renderTab(tab , page , isTabActive , onPressHandler , onTabLayout);
                        }) }



                    </View>

                   { this.state.renderUnderline && this.renderUnderline() }

                </ScrollView>
            </View>
        );
    }
}

export default (TabBar);
