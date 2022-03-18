import { pendingMessageSchema } from 'src/reducers/schema';
import { normalize, schema } from 'normalizr';
import uuid from 'react-native-uuid';
import IMeetings from "src/interfaces/IMeetings";
import IMessages from "src/interfaces/IMessages";
import IRooms from "src/interfaces/IRooms";

const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  ADD_TO_CHANNEL_LIST,
  ADD_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,

  SET_MESSAGES,
  ADD_TO_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
  ADD_MEETING_CHANNEL,
  UPDATE_MEETING_CHANNEL,
  REMOVE_MEETING_CHANNEL,
  SET_MEETINGS_CHANNEL,

  RESET_CHANNEL,

  RESET_PENDING_MESSAGES,
  ADD_PENDING_MESSAGE,
  REMOVE_PENDING_MESSAGE,
  SET_PENDING_MESSAGE_ERROR,
} = require('./types').default;

export function setSelectedChannel(payload:IRooms | {}, isChannelExist = false) {
  return {
    type: SET_SELECTED_CHANNEL,
    payload,
    isChannelExist,
  };
}

export function setChannelList(payload:Array<IRooms>) {
  return {
    type: SET_CHANNEL_LIST,
    payload,
  };
}

export function addToChannelList(payload:Array<IRooms>) {
  return {
    type: ADD_TO_CHANNEL_LIST,
    payload,
  };
}

export function addChannel(payload:IRooms) {
  return {
    type: ADD_CHANNEL,
    payload,
  }
}

export function updateChannel(payload:IRooms) {
  return {
    type: UPDATE_CHANNEL,
    payload,
  };
}

export function removeChannel(payload:string) {
  return {
    type: REMOVE_CHANNEL,
    payload,
  };
}

export function setMessages(payload:IMessages) {
  return {
    type: SET_MESSAGES,
    payload,
  };
}

export function addToMessages(payload:Array<IMessages>) {
  return {
    type: ADD_TO_MESSAGES,
    payload,
  };
}

export function addMessages(payload:IMessages) {
  return {
    type: ADD_MESSAGES,
    payload,
  };
}

export function updateMessages(payload:Array<IMessages>) {
  return {
    type: UPDATE_MESSAGES,
    payload,
  };
}

export function setSelectedMessage(payload:IMessages) {
  return {
    type: SET_SELECTED_MESSAGES,
    payload,
  };
}

export function removeSelectedMessage() {
  return {
    type: REMOVE_SELECTED_MESSAGES,
  };
}

export function setMeetings(payload:Array<IMeetings>) {
  return {
    type: SET_MEETINGS_CHANNEL,
    payload,
  };
}

export function updateMeeting(payload:IMeetings) {
  return {
    type: UPDATE_MEETING_CHANNEL,
    payload,
  };
}

export function resetChannel() {
  return {
    type: RESET_CHANNEL,
  }
}

export function addPendingMessage (payload:any) {
  payload._id = uuid.v4();
  payload.createdAt = new Date();
  payload.error = false;
  const normalized = normalize([payload], new schema.Array(pendingMessageSchema));
  return {
    payload: normalized?.entities?.pendingMessage,
    type: ADD_PENDING_MESSAGE,
  };
}

export function setPendingMessageError (payload:any) {
  return {
    payload,
    type: SET_PENDING_MESSAGE_ERROR,
  };
}

export function removePendingMessage (messageId:string, message:any) {
  return {
    messageId,
    message,
    type: REMOVE_PENDING_MESSAGE,
  };
}

export function resetPendingMessages () {
  return {
    type: RESET_PENDING_MESSAGES,
  };
}

