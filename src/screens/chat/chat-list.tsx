import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet, InteractionManager } from 'react-native';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import useSignalr from 'src/hooks/useSignalr';
import { ListFooter } from '@components/molecules/list-item';
import { NewEditIcon } from '@components/atoms/icon';
import {
  setMessages,
  addToMessages,
  setSelectedMessage,
  setPendingMessageError,
  removePendingMessage,
  addMessages,
  setSelectedChannel,
  addChannel
} from 'src/reducers/channel/actions';
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import ChatList from '@components/organisms/chat/list';
import { outline, text, button } from '@styles/color';
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import { RFValue } from 'react-native-responsive-fontsize';
import { Regular, Regular500 } from '@styles/font';
import IMessages from 'src/interfaces/IMessages';
import IParticipants from 'src/interfaces/IParticipants';
import NoConversationIcon from "@assets/svg/noConversations";

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  },
  bar: {
    marginTop: 5,
    height: 4,
    width: 35,
    alignSelf: 'center',
    borderRadius: 4,
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: button.info,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cancelText: {
    fontSize: RFValue(16),
    color: text.info,
    fontFamily: Regular500,
  },
  confirmText: {
    fontSize: RFValue(16),
    color: text.error,
    fontFamily: Regular500,
  },
  title: {
    color: '#14142B',
    textAlign: 'center',
    fontSize: RFValue(16),
    fontFamily: Regular500,
  },
  message: {
    color: '#4E4B66',
    textAlign: 'center',
    fontSize:RFValue(14),
    marginHorizontal: 15,
    marginBottom: 15,
    fontFamily: Regular,
  },
  content: {
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  }
})

const List = () => {
  const dispatch = useDispatch();
  const modalRef = useRef<BottomModalRef>(null);
  const user = useSelector((state:RootStateOrAny) => state.user);
  const messages = useSelector((state:RootStateOrAny) => {
    const { selectedChannel, channelMessages, pendingMessages } = state.channel;
    const normalizedMessages = channelMessages[selectedChannel._id]?.messages || {};
    const channelPendingMessages = pendingMessages[selectedChannel._id || 'temp'] || {};
    const messagesList = lodash.keys(normalizedMessages).map((m:string) => {
      return normalizedMessages[m];
    });
    const pendingMessageList = lodash.keys(channelPendingMessages).map((m:string) => {
      return channelPendingMessages[m];
    });
    let delivered = false;
    let seen:any = [];
    const messageArray = lodash.orderBy(messagesList, 'createdAt', 'desc')
    .map((msg:IMessages) => {
      if (!delivered && msg.delivered) {
        delivered = true;
      }
      if (delivered) msg.delivered = true;

      seen = lodash.unionBy(seen, msg.seen, 'id');
      msg.seen = seen;
      
      return msg;
    });

    const pendingMessagesArray = lodash.orderBy(pendingMessageList, 'createdAt', 'desc');

    return lodash.concat(pendingMessagesArray, messageArray);
  });
  const { _id, isGroup, lastMessage, otherParticipants } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;

      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, (p:IParticipants) => p._id === user._id);
      return selectedChannel;
    }
  );
  const channelId = _id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage]:any = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [rendered, setRendered] = useState(false);

  const {
    sendMessage,
    sendFile,
    getMessages,
    unSendMessage,
    deleteMessage,
    seenMessage,
    createChannel,
  } = useSignalr();

  const fetchMoreMessages = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    getMessages(channelId, pageIndex, false, (err, res) => {
      setLoading(false);
      if (res) {
        if (res.list) dispatch(addToMessages(channelId, res.list));
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
      setFetching(false);
    })
  }

  const _sendMessage = (data:any, messageId:string, config: any, createNew = false) => {
    if (createNew) {
      createChannel(data, (err:any, res:any) => {
        if (res) {
          const { lastMessage } = res;
          res.otherParticipants = lodash.reject(res.participants, (p:IParticipants) => p._id === user._id);
          dispatch(removePendingMessage(channelId, messageId, lastMessage));
          dispatch(setSelectedChannel(res));
          dispatch(addChannel(res));
        }
        if (err) {
          console.log('ERROR', err, messageId);
          if (err?.message !== 'canceled') {
            dispatch(setPendingMessageError(channelId, messageId));
          }
        }
      }, config);
    } else {
      sendMessage(data, (err:any, result:IMessages) => {
        if (err) {

          if (err?.message !== 'canceled') {
            dispatch(setPendingMessageError(channelId, messageId)); 
          }
        } else {
          dispatch(removePendingMessage(channelId, messageId, result));
        }
      }, config);
    }
  }

  const _sendFile = (channelId:string, messageId:string, data:any, config:any) => {
    sendFile(channelId, data, (err:any, result:any) => {

      if (err) {

        if (err?.message !== 'canceled') {
          dispatch(setPendingMessageError(channelId, messageId));
        }
      } else {
        dispatch(removePendingMessage(channelId, messageId, result));
      }
    }, config);
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    let unmount = false;
    if (rendered) {
      getMessages(channelId, 1, false, (err, res) => {
        if (!unmount) {
          setLoading(false);
          if (res) {
            dispatch(setMessages(channelId, res.list));
            setPageIndex(current => current + 1);
            setHasMore(res.hasMore);
          }
          if (err) {
            console.log('ERR', err);
            setHasError(true);
          }
        }
      })
    }

    return () => {
      unmount = true;
    }
  }, [rendered, channelId]);

  useEffect(() => {
    if (lastMessage && rendered) {
      const hasSeen = lodash.find(lastMessage?.seen, s => s._id === user._id);
      if (!hasSeen) {
        seenMessage(lastMessage._id);
      }
    }
  }, [lastMessage, rendered]);

  const showOption = (item) => {
    setMessage(item);
    modalRef.current?.open();
  }

  const options = () => {
    return (
      <>
        {
          !lodash.size(message?.attachment) && (
            <TouchableOpacity
              onPress={() => {
                dispatch(setSelectedMessage(channelId, message));
                modalRef.current?.close();
              }}
            >
              <View style={styles.button}>
                <NewEditIcon
                  height={RFValue(22)}
                  width={RFValue(22)}
                  color={text.default}
                />
                <Text
                  style={{ marginLeft: 15 }}
                  color={text.default}
                  size={18}
                >
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
        <TouchableOpacity
          onPress={() => {
            if (message?.messageType === 'file') {
              dispatch(removePendingMessage(channelId, message._id, null));
            } else {
              setShowDeleteOption(true)
            }
          }}
        >
          <View style={[styles.button, { borderBottomWidth: 0 }]}>
            <NewDeleteIcon
              height={RFValue(22)}
              width={RFValue(22)}
              color={text.error}
            />
            <Text
              style={{ marginLeft: 15 }}
              color={text.error}
              size={18}
            >
              Delete
            </Text>
          </View>
        </TouchableOpacity>
      </>
    )
  }

  const deletOptions = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            modalRef.current?.close();
            setTimeout(() => setShowAlert(true), 500);
          }}
        >
          <View style={[styles.button, { justifyContent: 'center' }]}>
            <Text
              style={{ marginLeft: 15 }}
              color={text.info}
              size={18}
            >
              Unsend for myself
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            modalRef.current?.close();
            setTimeout(() => unSendMessageEveryone(), 500);
          }}
        >
          <View style={[styles.button, { borderBottomWidth: 0, justifyContent: 'center' }]}>
            <Text
              style={{ marginLeft: 15 }}
              color={text.error}
              size={18}
            >
              Unsend for everyone
            </Text>
          </View>
        </TouchableOpacity>
        <Button
          style={[styles.cancelButton]}
          onPress={modalRef.current?.close}
        >
          <Text color="white" size={18}>Cancel</Text>
        </Button>
      </>
    )
  }

  const ListFooterComponent = () => {
    return (
      <ListFooter
        hasError={hasError}
        fetching={fetching}
        loadingText="Loading more chat..."
        errorText="Unable to load chats"
        refreshText="Refresh"
        onRefresh={() => fetchMoreMessages(true)}
      />
    );
  }

  const unSendMessageEveryone = useCallback(
    () => {
      deleteMessage(message._id)
    },
    [message, channelId]
  );

  const unSendMessageForYou = useCallback(
    () => {
      setShowAlert(false)
      setTimeout(() => unSendMessage(message._id), 500);
    },
    [message]
  );

  return (
    <>
      {!messages.length ? <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                          <View >
                            <NoConversationIcon />
                          </View>

                          <Text style={{color: "#A0A3BD", paddingVertical: 30, fontSize: 24, fontFamily: Regular, fontWeight: "400"}}>No conversations yet</Text>
      </View> :
      <>
        <ChatList
            user={user}
            messages={messages}
            participants={otherParticipants}
            lastMessage={lastMessage}
            isGroup={isGroup}
            loading={loading}
            error={error}
            showOption={showOption}
            ListFooterComponent={ListFooterComponent}
            onEndReached={() => fetchMoreMessages()}
            onEndReachedThreshold={0.5}
            onSendMessage={_sendMessage}
            onSendFile={_sendFile}
        />
        <BottomModal
            ref={modalRef}
            onModalHide={() => setShowDeleteOption(false)}
            header={
              <View style={styles.bar} />
            }
        >
          <View style={{ paddingBottom: 20 }}>
            {showDeleteOption ? deletOptions() : options()}
          </View>
        </BottomModal>
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            contentContainerStyle={{ borderRadius: 15 }}
            title={'Unsend for You?'}
            titleStyle={styles.title}
            message={'This message will be unsend for you. Other chat members will still able to see it.'}
            messageStyle={styles.message}
            contentStyle={styles.content}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelButtonColor={'white'}
            confirmButtonColor={'white'}
            cancelButtonTextStyle={styles.cancelText}
            confirmButtonTextStyle={styles.confirmText}
            actionContainerStyle={{ justifyContent: 'space-around' }}
            cancelText="Cancel"
            confirmText="Unsend"
            onCancelPressed={() => setShowAlert(false)}
            onConfirmPressed={unSendMessageForYou}
        />

      </> }


    </>
  )
}

export default List
