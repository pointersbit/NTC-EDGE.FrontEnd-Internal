import React, { FC, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions, Image } from 'react-native'
import Text from '@components/atoms/text'
import { NewFileIcon } from '@components/atoms/icon'
import { bubble, outline } from '@styles/color'
import { fontValue } from '@components/pages/activities/fontValue';
import { getFileSize } from 'src/utils/formatting';
import * as Progress from 'react-native-progress';

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
  seenContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
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
    borderRadius: fontValue(12),
    width: fontValue(12),
    height: fontValue(12),
    borderColor: outline.error,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    paddingTop: 0.5,
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })
  },
  progress: {
    marginLeft: 2,
    paddingLeft: 0,
    paddingTop: 0,
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
  }
})

interface Props {
  message?: string;
  messageId?: string;
  messageType?: string;
  channelId?: string;
  groupName?: string;
  participants?: any;
  error?: boolean;
  maxWidth?: any;
  style?: any;
  createdAt?: any;
  onLongPress?: any;
  onSendMessage?: any;
  onSendFile?: any;
  [x: string]: any;
}

const PendingBubble:FC<Props> = ({
  message = '',
  messageId = '',
  messageType = 'text',
  channelId = '',
  groupName = '',
  participants = [],
  attachment = {},
  error = false,
  maxWidth = '60%',
  style,
  createdAt,
  onLongPress,
  onSendMessage = () => {},
  onSendFile = () => {},
  ...otherProps
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const formData = new FormData();
    const controller = new AbortController();
    const config = {
      signal: controller.signal,
      onUploadProgress ({ loaded, total }:any) {
        const percentComplete = loaded / total;
        setProgress(percentComplete);
      },
    };
    
    if (messageType === 'file') {
      let file:any = {
        name: attachment?.name,
        type: attachment?.mimeType,
        uri: attachment?.uri,
      };

      formData.append('file', file);
    }

    formData.append('message', message);
    
    if (!channelId) {
      formData.append('name', groupName);
      formData.append('participants', JSON.stringify(participants));
    } else {
      formData.append('roomId', channelId);
    }

    onSendMessage(formData, messageId, config, !channelId);

    return () => {
      controller.abort();
    }
  }, [messageId]);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      {...otherProps}
    >
      <View style={[styles.container, { maxWidth }, style]}>
        <View style={styles.bubbleContainer}>
          {
            attachment?.mimeType === 'image' ? (
              <Image
                resizeMode={'cover'}
                style={[
                  {
                    marginRight: 2,
                    width: width * 0.3,
                    height: width * 0.3,
                  }
                ]}
                borderRadius={10}
                source={{ uri: attachment.uri }}
              />
            ) : (
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: bubble.primary
                  },
                ]}
              >
                {
                  messageType === 'file' ? (
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
                  ) : (
                    <Text
                      size={14}
                      color={'white'}
                    >
                      {message}
                    </Text>
                  )
                }
              </View>
            )
          }
        </View>
        {
          error ? (
            <View
              style={[styles.check]}
            />
          ) : (
            <Progress.Circle
              style={styles.progress}
              size={fontValue(12)}
              progress={progress}
              thickness={1.5}
              borderWidth={0}
              color={outline.info}
              unfilledColor={outline.default}
            />
          )
        }
      </View>
    </TouchableOpacity>
  )
}

export default PendingBubble
