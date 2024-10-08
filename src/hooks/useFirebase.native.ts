import { useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import { checkSeen, getOtherParticipants } from 'src/utils/formatting';
import lodash from 'lodash';
import { writeBatch } from 'firebase/firestore';

const useFirebase = (user:any) => {
  const _getParticipants = (participants:any) => ([
    ...participants,
    user,
  ]);

  const _getInitialChannelName = (participants = []) => {
    let channelName = ''
    participants.map(
      (participant:any, index) => {
        if (index === lodash.size(participants) - 1) {
          channelName += participant.firstName;
          return;
        }
        channelName += `${participant.firstName}, `;
        return;
      });
    return channelName;
  };

  const _getParticipantsId = (participants = []) => {
    let ids = participants.map(
      (participant:any) => {
        return participant._id;
      });
    return ids;
  }

  const channelSubscriber = useCallback((searchText:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('channels')
      .where(
        'deleted',
        '==',
        false
      )
      .where(
        'participantsId',
        'array-contains',
        user._id,
      )
      .orderBy('updatedAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const messagesSubscriber = useCallback((channelId:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('messages')
      .where(
        'channelId',
        '==',
        channelId,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const channelMeetingSubscriber = useCallback((channelId:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('meetings')
      .where(
        'ended',
        '==',
        false,
      )
      .where(
        'channelId',
        '==',
        channelId,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const userActiveMeetingSubscriber = useCallback((callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('meetings')
      .where(
        'participantsId',
        'array-contains',
        user._id,
      )
      .where(
        'ended',
        '==',
        false,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const userMeetingSubscriber = useCallback((callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('meetings')
      .where(
        'participantsId',
        'array-contains',
        user._id,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const meetingSubscriber = useCallback((meetingId:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('meetings')
      .where(
        'meetingId',
        '==',
        meetingId,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const memberMeetingSubscriber = useCallback((meetingId:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('joinMeetings')
      .where(
        'meetingId',
        '==',
        meetingId,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const createChannel = useCallback(async (participants, callback = () => {}) => {
    const participantsWithUser:any = _getParticipants(participants);
    const isGroup = lodash.size(participantsWithUser) > 2;
    await firestore()
      .collection('channels')
      .add({
        channelName: _getInitialChannelName(participantsWithUser),
        participantsId: _getParticipantsId(participantsWithUser),
        participants: participantsWithUser,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastMessage: {
          message: `Created a new ${isGroup ? 'group ' : ' '}chat`,
          sender: user,
        },
        isGroup,
        seen: [user],
        author: user,
        deleted: false,
      })
      .then(data => {
        data
          .get()
          .then((res) => {
            const result:any = res.data();
            result._id = res.id;
            result.channelId = res.id;
            result.otherParticipants = getOtherParticipants(result.participants, user);
            result.hasSeen = checkSeen(result.seen, user);
            return callback(null, result);
          })
          .catch(err => callback(err));
      })
      .catch(err => callback(err));
  }, [user]);

  const createMeeting = useCallback(async ({ participants, channelName }, callback = () => {}) => {
    const participantsWithUser:any = _getParticipants(participants);
    const isGroup = lodash.size(participantsWithUser) > 2;
    const initialChannelName = _getInitialChannelName(participantsWithUser);
    const participantsId = _getParticipantsId(participantsWithUser);
    const serverTimeStamp = firestore.FieldValue.serverTimestamp();
    await firestore()
      .collection('channels')
      .add({
        channelName: channelName || initialChannelName,
        hasChannelName: !!channelName,
        participantsId: participantsId,
        participants: participantsWithUser,
        createdAt: serverTimeStamp,
        updatedAt: serverTimeStamp,
        lastMessage: {
          message: `Created a new meeting.`,
          sender: user,
        },
        isGroup,
        seen: [user],
        author: user,
        deleted: false,
      })
      .then(data => {
        data
          .get()
          .then(async (res) => {
            const result:any = res.data();
            result._id = res.id;
            result.channelId = res.id;
            result.otherParticipants = getOtherParticipants(result.participants, user);
            const channelData = result;
            result.hasSeen = checkSeen(result.seen, user);
            const meetingRef = firestore().collection('meetings').doc();
            await meetingRef.set({
              channelId: result._id,
              channelName: channelName || initialChannelName,
              hasChannelName: !!channelName,
              meetingId: meetingRef.id,
              channel: channelData,
              createdAt: serverTimeStamp,
              updatedAt: serverTimeStamp,
              endedAt: null,
              ended: false,
              host: user,
              participants: participantsWithUser,
              participantsId: participantsId,
              meetingParticipants: [],
            });
            result.meetingId = meetingRef.id;
            return callback(null, result);
          })
          .catch(err => callback(err));
      })
      .catch(err => callback(err));
  }, [user]);

  const initiateMeeting = useCallback(async ({ channelId, isVoiceCall, meetingName }, callback = () => {}) => {
    const serverTimeStamp = firestore.FieldValue.serverTimestamp();
    const channelRef = firestore().collection('channels').doc(channelId);
    await channelRef
      .update({
        updatedAt: serverTimeStamp,
        lastMessage: {
          message: `Created a new meeting.`,
          sender: user,
        },
        seen: [user],
      })
      .then(data => {
        channelRef
        .get()
        .then(async (res) => {
          const result:any = res.data();
          result._id = res.id;
          result.channelId = res.id;
          result.otherParticipants = getOtherParticipants(result.participants, user);
          const channelData = result;
          result.hasSeen = checkSeen(result.seen, user);
          const meetingRef = firestore().collection('meetings').doc();
          await meetingRef.set({
            channelId: result._id,
            channelName: meetingName || result.channelName,
            hasChannelName: !!meetingName,
            meetingId: meetingRef.id,
            channel: channelData,
            createdAt: serverTimeStamp,
            updatedAt: serverTimeStamp,
            endedAt: null,
            ended: false,
            host: user,
            isVoiceCall,
            participants: result.participants,
            participantsId: result.participantsId,
            meetingParticipants: [],
          });
          result.meetingId = meetingRef.id;
          return callback(null, result);
        })
        .catch(err => callback(err));
      })
      .catch(err => callback(err));
  }, [user]);

  const deleteChannel = useCallback(async (channelId) => {
    await firestore()
      .collection('channels')
      .doc(channelId)
      .update({
        deleted: true,
      });
  }, [user]);

  const getChannel = useCallback(async (callback) => {
    await firestore()
      .collection('channels')
      .where(
        'participantsId',
        'array-contains',
        user._id,
      )
      .orderBy('updatedAt', 'desc')
      .get()
      .then((data) => callback(null, data))
      .catch((e) => callback(e));
  }, [user]);

  const getMessages = useCallback(async (channelId:string, callback = () => {}) => {
    await firestore()
      .collection('messages')
      .where(
        'channelId',
        '==',
        channelId,
      )
      .orderBy('createdAt', 'desc')
      .get()
      .then(data => callback(null, data))
      .catch(err => callback(err));
  }, []);

  const sendMessage = useCallback(async (channelId, message) => {
    const messageRef = await firestore()
      .collection('messages')
      .add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        message,
        channelId,
        seen: [user],
        sender: user,
        deleted: false,
        unSend: false,
        edited: false,
      });
    await firestore()
      .collection('channels')
      .doc(channelId)
      .update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastMessage: {
          messageId: messageRef.id,
          message: message,
          sender: user,
        },
        seen: [user],
      });
  }, [user]);

  const seenMessage = useCallback(async (messageId) => {
    await firestore()
      .collection('messages')
      .doc(messageId)
      .update({
        seen: firestore.FieldValue.arrayUnion(user),
      });
  }, [user]);

  const seenChannel = useCallback(async (channelId) => {
    await firestore()
      .collection('channels')
      .doc(channelId)
      .update({
        seen: firestore.FieldValue.arrayUnion(user),
      })
  }, [user]);

  const unSendEveryone = useCallback(async (messageId, channelId) => {
    const batch = firestore().batch();
    const messageRef = firestore().collection('messages').doc(messageId);
    const channelRef = firestore().collection('channels').doc(channelId);
    batch.update(messageRef, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      deleted: true,
      message: '',
    })
    batch.update(channelRef, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      lastMessage: {
        message: `${user.firstName} deleted a message`,
        sender: user,
      },
      seen: [user],
    })
    batch.commit();
  }, [user]);

  const unSendForYou = useCallback(async (messageId) => {
    await firestore()
      .collection('messages')
      .doc(messageId)
      .update({
        unSend: true,
      });
  }, [user]);

  const leaveChannel = useCallback(async (channelId, participants) => {
    const filterParticipants = lodash.reject(participants, p => p._id === user._id);
    await firestore()
      .collection('channels')
      .doc(channelId)
      .update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        // participantsId: _getParticipantsId(filterParticipants),
        // participants: filterParticipants,
        deleted: true,
      });
  }, [user]);

  const editMessage = useCallback(async (messageId, message) => {
    await firestore()
      .collection('messages')
      .doc(messageId)
      .update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        edited: true,
        message,
      });
  }, [user]);

  const joinMeeting = useCallback(async (meetingId, uid, isFocused = false) => {
    const data = {
      isFocused,
      uid,
      ...user,
    }
    await firestore()
      .collection('meetings')
      .doc(meetingId)
      .update({
        meetingParticipants: firestore.FieldValue.arrayUnion(data),
      });
  }, [user]);

  const endMeeting = useCallback(async (meetingId) => {
    await firestore()
      .collection('meetings')
      .doc(meetingId)
      .update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        endedAt: firestore.FieldValue.serverTimestamp(),
        ended: true,
      })
  }, [user]);

  return {
    channelSubscriber,
    messagesSubscriber,
    channelMeetingSubscriber,
    userActiveMeetingSubscriber,
    userMeetingSubscriber,
    meetingSubscriber,
    memberMeetingSubscriber,
    createChannel,
    createMeeting,
    initiateMeeting,
    deleteChannel,
    getChannel,
    getMessages,
    sendMessage,
    seenMessage,
    seenChannel,
    unSendEveryone,
    unSendForYou,
    leaveChannel,
    editMessage,
    joinMeeting,
    endMeeting,
  }
}

export default useFirebase;