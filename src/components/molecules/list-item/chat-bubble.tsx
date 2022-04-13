import React, { FC, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions, Image } from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import { CheckIcon, DeleteIcon, NewFileIcon, WriteIcon } from '@components/atoms/icon'
import { getChatTimeString, getFileSize } from 'src/utils/formatting'
import { primaryColor, bubble, text, outline } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import { fontValue } from '@components/pages/activities/fontValue';
import IAttachment from 'src/interfaces/IAttachment';

const { width } = Dimensions.get('window');

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
    borderRadius: fontValue(15),
    padding: fontValue(5),
    paddingHorizontal: fontValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })
  },
  imageBubble: {
    marginRight: 2,
    marginTop: 2,
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: bubble.primary,
  },
  seenContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  seenTimeContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  flipX: {
    transform: [
      {
        scaleX: -1
      }
    ]
  },
  check: {
    borderRadius: fontValue(12),
    width: fontValue(12),
    height: fontValue(12),
    borderColor: text.info,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })
  },
  file: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  imageFile: {
    width: width * 0.3,
    height: width * 0.3,
  },
  hrText:{
    flex:1,
    paddingVertical: 20,
    alignSelf:'center',
    width:"100%",
    flexDirection:"row",
    justifyContent:"center"
  },
  border:{
    flex:1,
    backgroundColor:  "#D1D1D6",
    width:"100%",
    height:1,
    alignSelf:"center"
  },
  hrContent:{
    color:  "#2863D6",
    paddingHorizontal:20,
    textAlign:'center'
  },
  notif: {
    backgroundColor: '#C4C4C4',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 15,
    marginTop: 5,
  }
})

interface Props {
  message?: string;
  messageType?: string;
  attachment?: IAttachment;
  isSender?: boolean;
  sender?: any;
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
  onPreview?: any;
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
  messageType,
  attachment,
  isSender = false,
  sender = {},
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
  onPreview = () => {},
  ...otherProps
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const deletedOrUnsend = deleted || (unSend && isSender);
  const senderName = isSender ? 'You' : sender.firstName;

  const checkIfImage = (uri:any) => {
    if (uri && (uri.endsWith(".png") || uri.endsWith(".jpg"))) return true;
    return false;
  };

  const renderContent = () => {
    if (deletedOrUnsend) {
      return (
        <Text
          style={{ marginLeft: 5 }}
          size={14}
          color={'#979797'}
        >
          {
            (unSend && isSender) ?
            'Unsent for you'
            : `${senderName} deleted a message`
          }
        </Text>
      )
    }
    else if (!!attachment) {
      return (
        <View style={styles.file}>
          <NewFileIcon
            color={'#606A80'}
          />
          <View style={{ paddingHorizontal: 5, maxWidth: width * 0.3 }}>
            <Text
              size={12}
              color={'#606A80'}
            >
              {attachment.name}
            </Text>
            <Text
              size={10}
              color={'#606A80'}
              style={{ top: -2 }}
            >
              {getFileSize(attachment.size)}
            </Text>
          </View>
          <View style={{ width: 10 }} />
        </View>
      )
    }
    if (messageType === 'callended') {
      return (
        <Text
          size={14}
          color={'#979797'}
        >
          {message}
        </Text>
      )
    }
    return (
      <Text
        size={14}
        color={(isSender && !system) ? 'white' : 'black'}
      >
        {message}
      </Text>
    )
  }

  if (messageType === 'leave' || messageType === 'removed' || messageType === 'added') {
    return (
      <>
        {
          (showDetails || showDate) && (
              Platform.select({
                native:(
                    <View style={styles.seenTimeContainer}>
                      <Text
                          color={text.default}
                          size={12}
                      >
                        {getChatTimeString(createdAt)}
                      </Text>
                    </View>
                ),
                web:(
                    <View style={styles.hrText}>
                      <View style={styles.border}/>
                      <View>
                        <Text style={[styles.hrContent, {color:  "#808196",}]}>{getChatTimeString(createdAt)}</Text>
                      </View>
                      <View style={styles.border}/>
                    </View>
                )
              })
          )
        }
        <View style={styles.notif}>
          <Text
            size={14}
            color={'#fff'}
            style={{ textAlign: 'center' }}
          >
            {`${(messageType === 'removed' || messageType === 'added') ? senderName : ''} ${message}`}
          </Text>
        </View>
      </>
    )
  }

  return (
    <>
      {
        (showDetails || showDate || system) && (
            Platform.select({
              native:(
                  <View style={styles.seenTimeContainer}>
                    <Text
                        color={text.default}
                        size={12}
                    >
                      {getChatTimeString(createdAt)}
                    </Text>
                  </View>
              ),
              web:(
                  <View style={styles.hrText}>
                    <View style={styles.border}/>
                    <View>
                      <Text style={[styles.hrContent, {color:  "#808196",}]}>{getChatTimeString(createdAt)}</Text>
                    </View>
                    <View style={styles.border}/>
                  </View>
              )
            })
        )
      }
      <TouchableOpacity
        onPress={() => !!attachment ? onPreview() : setShowDetails(!showDetails)}
        onLongPress={(isSender && !(deleted || unSend || system)) ? onLongPress : null}
        {...otherProps}
      >
        <View style={[styles.container, { maxWidth }, style]}>
          {
            (edited && isSender && !(deleted || unSend)) && (
              <View style={{ alignSelf: 'center', marginRight: 5 }}>
                <WriteIcon
                  type='pen'
                  color={text.info}
                  size={14}
                />
              </View>
            )
          }
          {
            checkIfImage(attachment?.uri) && !deletedOrUnsend ? (
              <Image
                resizeMode={'cover'}
                style={[
                  styles.imageBubble,
                  {
                    backgroundColor: isSender ? bubble.primary : bubble.secondary
                  }
                ]}
                borderRadius={10}
                source={{ uri: attachment?.uri }}
              />
            ) : (
              <View style={styles.bubbleContainer}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isSender ? bubble.primary : bubble.secondary
                    },
                    (deletedOrUnsend || system) && {
                      backgroundColor: '#E5E5E5'
                    },
                  ]}
                >
                  {renderContent()}
                </View>
              </View>
            )
          }
          {
            (edited && !isSender) && (
              <View style={{ alignSelf: 'center', marginLeft: 5 }}>
                <WriteIcon
                  type='pen'
                  color={text.default}
                  size={14}
                />
              </View>
            )
          }
          {
            (!isSeen && isSender && !deleted && !system && !(unSend && isSender)) && (
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
        ((showDetails || showSeen) && seenByEveryone) && !edited && (
          <View
            style={[{ flexDirection: 'row', paddingTop: 3, paddingBottom: 10 }, isSender && styles.flipX]}
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
    </>
  )
}

export default ChatBubble
