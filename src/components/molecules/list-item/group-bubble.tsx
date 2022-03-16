import React, { FC, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import { CheckIcon, DeleteIcon, WriteIcon } from '@components/atoms/icon';
import { getChatTimeString } from 'src/utils/formatting'
import { primaryColor, bubble, text, outline } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import { RFValue } from 'react-native-responsive-fontsize';
import { Regular500 } from '@styles/font';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubbleContainer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    borderRadius: RFValue(15),
    padding: RFValue(5),
    paddingHorizontal: RFValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? undefined : 1,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: primaryColor,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seenContainer: {
    paddingTop: 3,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  seenTimeContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  flipX: {
    transform: [
      {
        scaleX: -1
      }
    ]
  },
  check: {
    borderRadius: 12,
    width: 12,
    height: 12,
    borderColor: text.info,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 0 : 1
  }
})

interface Props {
  message?: string;
  sender?: any;
  isSender?: boolean;
  maxWidth?: any;
  style?: any;
  createdAt?: any;
  seenByOthers?: any;
  seenByEveryone?: boolean;
  showSeen?: boolean;
  showDate?: boolean;
  onLongPress?: any;
  deleted?: boolean;
  unSend?: boolean;
  edited?: boolean;
  system?: boolean;
  delivered?: boolean;
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
  sender = {},
  isSender = false,
  maxWidth = '60%',
  style,
  createdAt,
  seenByOthers = [],
  seenByEveryone = false,
  showSeen = false,
  isSeen = false,
  showDate = false,
  onLongPress,
  deleted = false,
  unSend = false,
  edited = false,
  system = false,
  delivered = false,
  ...otherProps
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const _getSenderName = () => {
    let result = '';
    if (sender.title) result += sender.title + ' ';
    result += sender.firstName;
    return result;
  }

  return (
    <>
      {
        (showDetails || showDate || system) && (
          <View style={styles.seenTimeContainer}>
            <Text
              color={text.default}
              size={12}
            >
              {getChatTimeString(createdAt)}
            </Text>
          </View>
        )
      }
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        onLongPress={(isSender && !(deleted || unSend || system)) ? onLongPress : null}
        {...otherProps}
      >
        <View style={[styles.container, { maxWidth }, style]}>
          {
            !isSender ?(
              <ProfileImage
                image={sender?.profilePicture?.thumb}
                name={`${sender.firstName} ${sender.lastName}`}
                size={25}
                textSize={10}
                style={{ marginLeft: -5 }}
              />
            ) : null
          }
          {
            (edited && isSender && !(deleted || unSend)) && (
              <View style={{ alignSelf: 'center', marginRight: 0 }}>
                <WriteIcon
                  type='pen'
                  color={text.info}
                  size={14}
                />
              </View>
            )
          }
          <View style={{ marginLeft: 5 }}>
            {
              !isSender ? (
                <Text
                  size={10}
                  color={text.default}
                >
                  {_getSenderName()}
                </Text>
              ) : null
            }
            <View style={styles.bubbleContainer}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isSender ? bubble.primary : bubble.secondary
                  },
                  (deleted || (unSend && isSender) || system) && {
                    backgroundColor: '#E5E5E5'
                  },
                ]}
              >
                {
                  (deleted || (unSend && isSender)) ? (
                    <>
                      <NewDeleteIcon
                        height={RFValue(18)}
                        width={RFValue(18)}
                        color={'#979797'}
                      />
                      <Text
                        style={{ marginLeft: 5 }}
                        size={14}
                        color={'#979797'}
                      >
                        {
                          (unSend && isSender) ?
                          'Unsent for you'
                          : `${isSender ? 'You' : sender.firstName } deleted a message`
                        }
                      </Text>
                    </>
                  ) : (
                    <Text
                      size={14}
                      color={(isSender && !system) ? 'white' : 'black'}
                    >
                      {message}
                    </Text>
                  )
                }
              </View>
            </View>
          </View>
          {
            (edited && !isSender && !(deleted || unSend)) && (
              <View style={{ alignSelf: 'center', marginTop: 10, marginLeft: 5 }}>
                <WriteIcon
                  type='pen'
                  color={text.default}
                  size={14}
                />
              </View>
            )
          }
          {
            (!isSeen && isSender && !deleted && !system) && (
              <View
                style={[styles.check, delivered && { backgroundColor: text.info }]}
              >
                <CheckIcon
                  type='check1'
                  size={8}
                  color={delivered ? 'white' : text.info}
                />
              </View>
            )
          }
        </View>
      </TouchableOpacity>
      {
        ((showDetails || showSeen) && lodash.size(seenByOthers) > 0) && (
          <View
            style={[
              styles.seenContainer,
              {
                maxWidth,
                alignSelf: isSender ? 'flex-end' : 'flex-start',
                paddingLeft: isSender ? 0 : 30,
              }
            ]}
          >
            {
              seenByEveryone ? (
                <Text
                  color={text.default}
                  numberOfLines={2}
                  size={10}
                >
                  <Text
                    color={text.default}
                    size={10}
                    style={{ fontFamily: Regular500 }}
                  >
                    {'Seen by '}
                  </Text>
                  everyone
                </Text>
              ) : (
                <View
                  style={[{ flexDirection: 'row' }, isSender && styles.flipX]}
                >
                  {
                    seenByOthers.map(seen => (
                      <ProfileImage
                        style={[{ marginHorizontal: 1, }, isSender && styles.flipX]}
                        key={seen._id}
                        image={seen?.profilePicture?.thumb}
                        name={`${seen.firstName} ${seen.lastName}`}
                        size={12}
                        textSize={5}
                      />
                    ))
                  }
                </View>
              )
            }
          </View>
        )
      }
    </>
  )
}

export default ChatBubble
