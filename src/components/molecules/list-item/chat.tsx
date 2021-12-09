import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import lodash from 'lodash';
import Text from '@components/atoms/text'
import GroupImage from '@components/molecules/image/group';
import ProfileImage from '@components/atoms/image/profile';
import { text, primaryColor } from 'src/styles/color';
import { GroupIcon } from '@components/atoms/icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 45,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
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
  seenIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: primaryColor
  }
})

interface Props {
  image?: string;
  imageSize?: number;
  textSize?: number;
  name?: string;
  time?: string;
  seen?: boolean,
  isGroup?: boolean,
  message?: any;
  onPress?: any;
  participants?: any;
  user?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  imageSize = 35,
  textSize = 18,
  name = '',
  time = '',
  seen = false,
  isGroup = false,
  message = {},
  onPress = () => {},
  participants = [],
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, styles.horizontal]}>
        {
          !isGroup ? (
            <ProfileImage
              image={image}
              name={name}
              size={imageSize}
              textSize={textSize}
            />
          ) : (
            <GroupImage
              participants={participants}
              size={imageSize}
              textSize={textSize}
            />
          )
        }
        <View style={styles.content}>
          <View style={[styles.horizontal, styles.channelInfo]}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Text
                color={text.default}
                weight={!seen ? 'bold' : 'normal'}
                size={18}
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>
            <Text
              color={'#9FBCF2'}
              size={12}
            >
              {time}
            </Text>
          </View>
          <View style={styles.horizontal}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Text
                weight={!seen ? 'bold' : 'normal'}
                color={text.default}
                size={14}
                numberOfLines={1}
              >
                {message.message}
              </Text>
            </View>
            {
              !seen && (
                <View style={styles.seenIndicator} />
              )
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
    
  )
}

export default ChatItem
