const { SET_USER, UPDATE_USER, RESET_USER, SET_BIOMETRICS_LOGIN } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER: {
      let biometrics = state.biometrics;

      const newState = {
        ...state,
        ...action.payload,
        image: action?.payload?.profilePicture?.small || '',
      };

      if (biometrics !== newState._id) {
        newState.biometrics = null;
      } else {
        newState.biometrics = biometrics;
      }
      
      return newState;
    }
    case RESET_USER: {
      let biometrics = state.biometrics;
      
      return {
        username: '',
        email: '',
        password: '',
        userType: '',
        permitType: '',
        firstName: '',
        middleName: '',
        lastName: '',
        contactNumber: '',
        address: '',
        profileImage: '',
        image: '',
        name: '',
        profilePicture: {},
        biometrics,
      };
    }
    case UPDATE_USER:{

      let payload = {}

     if(state.email != action.payload?.email){
       payload.email = action.payload?.email
       payload.biometrics = null;
     }
      if(state.contactNumber != action.payload?.contactNumber){
        payload.contactNumber = action.payload?.contactNumber
      }
        if(state.firstName != action.payload?.firstName){
            payload.firstName = action.payload?.firstName
        }
        if(state.middleName != action.payload?.middleName){
            payload.middleName = action.payload?.middleName
        }
        if(state.lastName != action.payload?.lastName){
            payload.lastName = action.payload?.lastName
        }
      return {
        ...state,
        ...payload
      }
    }
    case SET_BIOMETRICS_LOGIN: {
      return {
        ...state,
        biometrics: action.payload,
      }
    }
    default:
      return state;
  }
}
