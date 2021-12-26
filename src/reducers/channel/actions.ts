const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  ADD_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,

  SET_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,
  REMOVE_MESSAGES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
  ADD_MEETING_CHANNEL,
  UPDATE_MEETING_CHANNEL,
  REMOVE_MEETING_CHANNEL,
  SET_MEETINGS_CHANNEL,
} = require('./types').default;

interface ChannelProps {
  _id: string;
  createdAt: any;
  updatedAt: any;
  channelId: string;
  channelName: string;
  isGroup: boolean;
  lastMessage: any;
  participants: any;
  otherParticipants: any;
  hasSeen: boolean,
  participantsId: any;
  seen: any
}

interface MessageProps {
  _id: string;
  createdAt: any;
  updatedAt: any;
  channelId: string;
  message: string;
  seen: any;
  sender: any;
  deleted: boolean;
  unSend: boolean;
  edited: boolean;
}

export function setSelectedChannel(payload:ChannelProps) {
  return {
    type: SET_SELECTED_CHANNEL,
    payload,
  };
}

export function setChannelList(payload:[ChannelProps]) {
  return {
    type: SET_CHANNEL_LIST,
    payload,
  };
}

export function addChannel(payload:ChannelProps) {
  return {
    type: ADD_CHANNEL,
    payload,
  }
}

export function updateChannel(payload:ChannelProps) {
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

export function setMessages(payload:MessageProps) {
  return {
    type: SET_MESSAGES,
    payload,
  };
}

export function addMessages(payload:[MessageProps]) {
  return {
    type: ADD_MESSAGES,
    payload,
  };
}

export function updateMessages(payload:[MessageProps]) {
  return {
    type: UPDATE_MESSAGES,
    payload,
  };
}

export function removeMessages(payload:MessageProps) {
  return {
    type: REMOVE_MESSAGES,
    payload,
  };
}

export function setSelectedMessage(payload:MessageProps) {
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

export function setMeetings(payload) {
  return {
    type: SET_MEETINGS_CHANNEL,
    payload,
  };
}

export function addMeeting(payload) {
  return {
    type: ADD_MEETING_CHANNEL,
    payload,
  };
}

export function updateMeeting(payload) {
  return {
    type: UPDATE_MEETING_CHANNEL,
    payload,
  };
}

export function removeMeeting(payload) {
  return {
    type: REMOVE_MEETING_CHANNEL,
    payload,
  };
}

