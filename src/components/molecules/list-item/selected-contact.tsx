import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { text, primaryColor } from 'src/styles/color';
import { CloseIcon } from '@components/atoms/icon';
import ProfileImage from '@components/atoms/image/profile'

const imageSize = 42;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    width: imageSize + 15,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    paddingLeft: 10
  },
  channelInfo: {
    paddingBottom: 3,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floating: {
    position: 'absolute',
    zIndex: 9,
    right: 3,
    top: 0,
  },
  button: {
    height: 18,
    width: 18,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})

interface Props {
  image?: string;
  name?: string;
  contact?: string;
  onPress?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  name = '',
  contact = '',
  onPress = () => {},
  ...otherProps
}) => {

  return (
    <View style={[styles.container]} {...otherProps}>
      <View style={styles.floating}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.button, styles.shadow]}>
            <CloseIcon
              type={'md-close'}
              color={text.default}
              size={14}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ProfileImage
        image={image}
        name={name}
        size={imageSize}
        textSize={10}
      />
      <Text
        size={10}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  )
}

export default ChatItem
