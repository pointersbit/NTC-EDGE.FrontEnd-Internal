import lodash from 'lodash';
import IParticipants from 'src/interfaces/IParticipants';
const {
  SET_MEETINGS,
  ADD_TO_MEETINGS,
  ADD_MEETING,
  UPDATE_MEETING,
  SET_MEETING,
  UPDATE_MEETING_PARTICIPANTS,
  SET_ACTIVE_MEETING,
  REMOVE_ACTIVE_MEETING,
  RESET_MEETING,
  CONNECTION_STATUS,
  SET_NOTIFICATION,
  SET_OPTIONS,
  SET_FULLSCREEN,
  RESET_CURRENT_MEETING,
  REMOVE_MEETING_FROM_LIST,
  SET_PINNED_PARTICIPANT,
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function Meeting(state = initialState, action:any = {}) {
  switch (action.type) {
    case CONNECTION_STATUS: {
      return state.setIn(['connectionStatus'], action.payload);
    }
    case SET_NOTIFICATION: {
      let newState = state;
      if (!action.payload) {
        return state.setIn(['meeting', 'notification'], null);
      }
      if (state.meeting?._id) {
        if (state.meeting._id === action.payload.meetingId) {
          newState = state.setIn(['meeting', 'notification'], action.payload.message);
          if (action.payload.status === 'joined' || action.payload.status === 'busy' || action.payload.status === 'leave') {
            newState = newState.setIn(['meeting', 'participants'], action.payload.participants);
          }
  
          return newState;
        } else {
          if (action.payload.meetingId) {
            if (action.payload.status === 'joined' || action.payload.status === 'busy' || action.payload.status === 'leave') {
              if (state.normalizedMeetingList[action.payload.meetingId]) {
                newState = newState.setIn(['normalizedMeetingList', action.payload.meetingId, 'participants'], action.payload.participants);
              }
              if (state.normalizeActiveMeetings[action.payload.meetingId]) {
                newState = newState.setIn(['normalizeActiveMeetings', action.payload.meetingId, 'participants'], action.payload.participants);
              }
            }
          }
        }
      }
      
      return newState;
    }
    case SET_MEETINGS: {
      return state.setIn(['normalizedMeetingList'], action.payload);
    }
    case ADD_TO_MEETINGS: {
      return state.setIn(['normalizedMeetingList'], {...state.normalizedMeetingList, ...action.payload});
    }
    case ADD_MEETING: {
      let newState = state.setIn(['normalizedMeetingList', action.payload._id], action.payload);

      if (!action.payload.ended) {
        newState = newState.setIn(['normalizeActiveMeetings', action.payload._id], action.payload);
      }

      return newState;
    }
    case UPDATE_MEETING: {
      if (!action?.payload?.room?.lastMessage) {
        const meeting = state.normalizedMeetingList[action.payload._id];
        if (!meeting) {
          let newState = state.setIn(['normalizedMeetingList', action.payload._id], action.payload);

          if (!action.payload.ended) {
            newState = newState.setIn(['normalizeActiveMeetings', action.payload._id], action.payload);
          }

          return newState;
        }
        const participants = action.payload.participants;
        const participantsId = action.payload.participantsId;

        let newState = state.setIn(['normalizedMeetingList', action.payload._id, 'participants'], participants)
        .setIn(['normalizedMeetingList', action.payload._id, 'participantsId'], participantsId);

        if (state.meeting?._id === action.payload._id) {
          newState = newState.setIn(['meeting'], action.payload)
            .setIn(['pinnedParticipant'], null);
        }
  
        if (action.payload.ended) {
          newState = newState.removeIn(['normalizeActiveMeetings', action.payload._id]);
        }
  
        return newState;
      } else {
        let newState = state.setIn(['normalizedMeetingList', action.payload._id], action.payload);

        if (state.meeting?._id === action.payload._id) {
          newState = newState.setIn(['meeting'], action.payload)
            .setIn(['pinnedParticipant'], null);
        }
  
        if (action.payload.ended) {
          newState = newState.removeIn(['normalizeActiveMeetings', action.payload._id]);
        } else {
          newState = newState.setIn(['normalizeActiveMeetings', action.payload._id], action.payload);
        }
  
        return newState;
      }
    }
    case SET_MEETING: {
      return state.setIn(['meeting'], action.payload)
        .setIn(['pinnedParticipant'], null);
    }
    case UPDATE_MEETING_PARTICIPANTS: {
      const meeting = state.normalizedMeetingList[action.payload._id];

      if (!meeting) {
        return state;
      }
      
      const participants = action.payload.participants;

      let newState = state.setIn(['normalizedMeetingList', action.payload._id, 'participants'], participants)

      if (!action.payload.ended) {
        newState = state.setIn(['normalizeActiveMeetings', action.payload._id, 'participants'], participants)
      }

      return newState;
    }
    case SET_ACTIVE_MEETING: {
      return state.setIn(['normalizeActiveMeetings'], action.payload);
    }
    case REMOVE_ACTIVE_MEETING: {
      return state.removeIn(['normalizeActiveMeetings', action.payload]);
    }
    case RESET_MEETING: {
      return state.setIn(['normalizedMeetingList'], {})
        .setIn(['activeMeetings'], [])
        .setIn(['meeting'], null)
        .setIn(['pinnedParticipant'], null);
    }
    case SET_OPTIONS: {
      return state.setIn(['options'], action.payload);
    }
    case SET_FULLSCREEN: {
      return state.setIn(['isFullScreen'], action.payload);
    }
    case RESET_CURRENT_MEETING: {
      return state.setIn(['meeting'], null)
        .setIn(['pinnedParticipant'], null)
        .setIn(['isFullScreen'], true)
        .setIn(['options'], {
          isHost: false,
          isVoiceCall: false,
          isMute: false,
          isVideoEnable: true,
        });
    }
    case REMOVE_MEETING_FROM_LIST: {
      let newState = state;
      if (action.payload) {
        newState = newState.removeIn(['normalizeActiveMeetings', action.payload]);
        newState = newState.removeIn(['normalizedMeetingList', action.payload]);
      }
      return newState;
    }
    case SET_PINNED_PARTICIPANT: {
      return state.setIn(['pinnedParticipant'], action.payload);
    }
    default:
      return state;
  }
}
