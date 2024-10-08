import React, { FC, ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import StatusBar from '@atoms/status-bar';
import Text from '@atoms/text';
import { disabledColor, primaryColor } from '@styles/color';
import styles from './styles';
import {fontValue} from "@pages/activities/fontValue";

interface Props {
  title?: string;
  titleStyle?: any;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onLeft?: any;
  onRight?: any;
  shadow?: any;
  light?: boolean;
};

const NavBar: FC<Props> = ({
  title = '',
  titleStyle = {},
  leftIcon,
  rightIcon,
  onLeft = () => {},
  onRight = () => {},
  shadow,
  light,
}) => {
  leftIcon = !!leftIcon ? leftIcon : <View style={{width: fontValue(24)}} />
  rightIcon = !!rightIcon ? rightIcon : <View style={{width: fontValue(24)}} />
  const backgroundColor = light ? '#fff' : primaryColor;
  const statusBar = {
    backgroundColor,
    barStyle: light ? 'dark-content' : 'light-content',
  };
  return (
    <>

      <StatusBar {...statusBar} />

      <View style={shadow && styles.shadowContainer}>

        <View style={[
          styles.container,
          shadow && styles.shadow,
          light && {backgroundColor},
          light && {borderBottomColor: disabledColor}
        ]}>

          <TouchableOpacity onPress={onLeft}>
            {leftIcon}
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text
              numberOfLines={3}
              style={[
                styles.title,
                light && styles.lightTitle,
                titleStyle
              ]}>
              {title}
            </Text>
          </View>

          <TouchableOpacity onPress={onRight}>
            {rightIcon}
          </TouchableOpacity>

        </View>

      </View>

    </>
  )
};

export default NavBar;