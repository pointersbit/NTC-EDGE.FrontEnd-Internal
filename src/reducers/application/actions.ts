const {
    SET_PINNED_APPLICATION,
    SET_NOT_PINNED_APPLICATION,
    UPDATE_APPLICATION_STATUS,
    SET_APPLICATIONS,
    DELETE_APPLICATIONS,
    HANDLE_LOAD,
    READ_UNREAD_APPLICATIONS,
    SET_TAB_BAR_HEIGHT,
    SET_APPLICATION_ITEM,
    SET_FILTER_RECT,
    SET_RIGHT_LAYOUT_COMPONENT,
    SET_TOPBARNAV,
    SET_ACTIVITY_SIZE,
    SET_SELECTED_YPOS,
    UPDATE_APPLICATIONS,
    SET_HAS_CHANGE,
    SET_EDIT
} = require('./types').default;

export function setPinnedApplication(payload) {
    return {
        type: SET_PINNED_APPLICATION,
        payload,
    };
}
export function setHasChange(payload) {
    return {
        type: SET_HAS_CHANGE,
        payload,
    };
}
export function setEdit(payload) {
    return {
        type: SET_EDIT,
        payload,
    };
}
export function updateApplicationStatus(payload) {
    return {
        type: UPDATE_APPLICATION_STATUS,
        payload,
    };
}

export function setTopBarNav(payload) {
    return {
        type: SET_TOPBARNAV,
        payload,
    };
}

export function setactivitySizeComponent(payload) {
    return {
        type: SET_ACTIVITY_SIZE,
        payload,
    };
}

export function setNotPinnedApplication(payload) {
    return {
        type: SET_NOT_PINNED_APPLICATION,
        payload,
    };
}
export function setTabBarHeight(payload) {
    return {
        type: SET_TAB_BAR_HEIGHT,
        payload,
    };
}
export function setApplications(payload) {
    return {
        type: SET_APPLICATIONS,
        payload,
    };
}

export function deleteApplications(payload) {
    return {
        type: DELETE_APPLICATIONS,
        payload,
    };
}
export function readUnreadApplications(payload) {
    return {
        type: READ_UNREAD_APPLICATIONS,
        payload,
    };
}

export function handleInfiniteLoad(payload) {
    return {
        type: HANDLE_LOAD,
        payload,
    };
}
export function updateApplications(payload) {
    return {
        type: UPDATE_APPLICATIONS,
        payload,
    };
}

export function setFilterRect(payload) {
    return {
        type: SET_FILTER_RECT,
        payload,
    };
}

export function setRightLayoutComponent(payload) {
    return {
        type: SET_RIGHT_LAYOUT_COMPONENT,
        payload,
    };
}

export function setApplicationItem(payload) {
    return {
        type: SET_APPLICATION_ITEM,
        payload,
    };
}

export function setSelectedYPos(payload) {
    return {
        type: SET_SELECTED_YPOS,
        payload,
    };
}
