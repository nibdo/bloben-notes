export const setPgpKeys = (pgpKeys: any) => {
    return {
        type: 'SET_PGP_KEYS',
        payload: pgpKeys
    }
}
export const setPassword = (password: any) => {
    return {
        type: 'SET_PASSWORD',
        payload: password
    }
}
export const setCryptoPassword = (password: any) => {
    return {
        type: 'SET_PASSWORD',
        payload: password
    }
}
export const setNotes = (data: any) => {
    return {
        type: 'SET_NOTES',
        payload: data,
    }
}
export const setSortedNotes = (data: any) => {
    return {
        type: 'SET_SORTED_NOTES',
        payload: data,
    }
}
export const setSessionId = (data: any) => {
    return {
        type: 'SET_SESSION_ID',
        payload: data,
    }
}
export const setTags = (data: any) => {
    return {
        type: 'SET_TAGS',
        payload: data,
    }
}
export const addTag = (data: any) => {
    return {
        type: 'ADD_TAG',
        payload: data,
    }
}

export const updateTag = (data: any) => {
    return {
        type: 'UPDATE_TAG',
        payload: data,
    }
}
export const softDeleteTag = (data: any) => {
    return {
        type: 'SOFT_DELETE_TAG',
        payload: data,
    }
}
export const deleteTag = (data: any) => {
    return {
        type: 'DELETE_TAG',
        payload: data,
    }
}
export const setTagsLastSynced = (data: any) => {
    return {
        type: 'SET_TAGS_LAST_SYNCED',
        payload: data,
    }
}
export const setMappedTags = (data: any) => {
    return {
        type: 'SET_MAPPED_TAGS',
        payload: data,
    }
}
export const selectTag = (data: any) => {
    return {
        type: 'SELECT_TAG',
        payload: data,
    }
}
export const addNote = (data: any) => {
    return {
        type: 'ADD_NOTE',
        payload: data,
    }
}
export const updateNote = (data: any) => {
    return {
        type: 'UPDATE_NOTE',
        payload: data,
    }
}
export const softDeleteNote = (data: any) => {
    return {
        type: 'SOFT_DELETE_NOTE',
        payload: data,
    }
}
export const deleteNote = (data: any) => {
    return {
        type: 'DELETE_NOTE',
        payload: data,
    }
}
export const setNotesLastSync = (data: any) => {
    return {
        type: 'SET_NOTES_LAST_SYNC',
        payload: data,
    }
}
export const setIsFirstLogin = (data: any) => {
    return {
        type: 'SET_IS_FIRST_LOGIN',
        payload: data,
    }
}
export const setIsDark = (data: any) => {
    return {
        type: 'SET_IS_DARK',
        payload: data,
    }
}

export const setIsMobile = (data: any) => {
    return {
        type: 'SET_IS_MOBILE',
        payload: data,
    }
}

export const setIsLogged = (data: any) => {
    return {
        type: 'SET_IS_LOGGED',
        payload: data,
    }
}
export const setUsername = (data: any) => {
    return {
        type: 'SET_USERNAME',
        payload: data,
    }
}
export const setIsLoading = (data: any) => {
    return {
        type: 'SET_IS_LOADING',
        payload: data,
    }
}
export const setIsAppStarting = (data: any) => {
    return {
        type: 'SET_IS_APP_STARTING',
        payload: data,
    }
}

export const setNotifications = (data: any) => {
    return {
        type: 'SET_NOTIFICATIONS',
        payload: data,
    }
}
export const addNotification = (data: any) => {
    return {
        type: 'ADD_NOTIFICATION',
        payload: data,
    }
}
export const setNotesAreFetching = (data: any) => {
    return {
        type: 'SET_NOTES_ARE_FETCHING',
        payload: data,
    }
}
