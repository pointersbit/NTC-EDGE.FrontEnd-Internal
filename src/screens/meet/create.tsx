import React, { useState, useCallback } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import { setMeetingId, setMeeting } from 'src/reducers/meeting/actions';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ArrowLeftIcon, ToggleIcon, CheckIcon } from '@components/atoms/icon'
import { InputField } from '@components/molecules/form-fields'
import useFirebase from 'src/hooks/useFirebase';
import useSignalr from 'src/hooks/useSignalr';
import Button from '@components/atoms/button';
import lodash from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    fontSize: RFValue(18),
    backgroundColor: '#EEEEEE',
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  icon: {
    fontSize: 16
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: button.primary
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: '#687287',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  toggleDefault: {
    transform: [{ scaleX: -1 }],
    color: '#687287',
  },
  toggleActive: {
    color: button.primary,
  }
})

const CreateMeeting = ({ navigation, route }:any) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const {
    participants = [],
    isChannelExist = false,
    isVideoEnable = true,
    isVoiceCall = false,
    isMute = false,
    channelId,
  } = route.params;
  const { createMeeting } = useSignalr();
  const [loading, setLoading] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [videoOn, setVideoOn] = useState(isVideoEnable);
  const [micOn, setMicOn] = useState(!isMute);
  const onBack = () => navigation.goBack();
  const onStartMeeting = () => {
    setLoading(true);
    if (isChannelExist) {
      createMeeting({ roomId: channelId, isVoiceCall, participants, name: meetingName }, (error, data) => {
        setLoading(false);
        if (!error) {
          const { room } = data;
          data.otherParticipants = lodash.reject(data.participants, p => p._id === user._id);
          room.otherParticipants =  data.otherParticipants;
          dispatch(setSelectedChannel(data.room, isChannelExist));
          dispatch(setMeeting(data));
          navigation.replace('JoinVideoCall', {
            isHost: true,
            isVoiceCall,
            options: {
              isMute: !micOn,
              isVideoEnable: videoOn,
            }
          });
        }
      });
    } else {
      createMeeting({ participants, name: meetingName }, (error, data) => {
        setLoading(false);
        if (!error) {
          const { room } = data;
          data.otherParticipants = lodash.reject(data.participants, p => p._id === user._id);
          room.otherParticipants =  data.otherParticipants;
          dispatch(setSelectedChannel(data.room));
          dispatch(setMeeting(data));
          navigation.replace('VideoCall', {
            isHost: true,
            options: {
              isMute: !micOn,
              isVideoEnable: videoOn,
            }
          });
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5 }]}>
          <TouchableOpacity onPress={onBack}>
            <ArrowLeftIcon
              size={24}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              color={text.default}
              weight={'600'}
              size={16}
            >
              Create Meeting
            </Text>
          </View>
        </View>
        <InputField
          containerStyle={{ backgroundColor: '#EEEEEE', borderWidth: 0 }}
          inputStyle={[InputStyles.text, styles.input]}
          iconStyle={styles.icon}
          placeholder="Meeting name"
          outlineStyle={[InputStyles.outlineStyle, styles.outline]}
          placeholderTextColor="#979797"
          value={meetingName}
          onChangeText={setMeetingName}
          onSubmitEditing={(event:any) => setMeetingName(event.nativeEvent.text)}
        />
        <View style={{ paddingTop: 20, paddingBottom: 60 }}>
          <View style={styles.section}>
            <Text
              color='#687287'
              size={18}
            >
              Video {videoOn ? 'On' : 'Off'}
            </Text>
            <TouchableOpacity
              onPress={() => setVideoOn(!videoOn)}
            >
              <ToggleIcon
                style={
                  videoOn ?
                    styles.toggleActive :
                    styles.toggleDefault
                }
                size={28}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text
              color='#687287'
              size={18}
            >
              Mic {micOn ? 'On' : 'Off'}
            </Text>
            <TouchableOpacity
              onPress={() => setMicOn(!micOn)}
            >
              <ToggleIcon
                style={
                  micOn ?
                    styles.toggleActive :
                    styles.toggleDefault
                }
                size={28}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          style={styles.button}
          disabled={loading}
          onPress={onStartMeeting}
        >
          {
            loading ? (
              <ActivityIndicator color={'white'} size={24} />
            ) : (
              <Text
                size={18}
                weight='bold'
                color='white'
              >
                Start Meeting
              </Text>
            )
          }
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default CreateMeeting
