import { combineReducers } from 'redux';

import notes from './notes';
import tags from './tags';
import selectedTag from './selectedTag';
import notesAreFetching from './notesAreFetching';
import notesLastSynced from './notesLastSynced';
import isDarkReducer from './isDark';
import isMobile from './isMobile';
import isLogged from './isLogged';
import username from './username';
import isLoading from './isLoading';
import isAppStarting from './isAppStarting';
import notifications from './notifications';
import isFirstLogin from './isFirstLogin';
import pgpKeys from './pgpKeys';
import password from './password';
import mappedTags from './mappedTags';
import sortedNotes from './sortedNotes';
import tagsLastSynced from './tagsLastSynced';
import sessionId from './sessionId';

export const allReducers: any = combineReducers({
    pgpKeys,
    password,
    isDark: isDarkReducer,
    isMobile,
    isLogged,
    username,
    isLoading,
    isAppStarting,
    notifications,
    notes,
    sortedNotes,
    tags,
    mappedTags,
    selectedTag,
    notesAreFetching,
    notesLastSynced,
    tagsLastSynced,
    isFirstLogin,
    sessionId
});
const rootReducer = (state: any, action: any) => {
    if (action.type === 'USER_LOGOUT') {
        // tslint:disable-next-line:no-parameter-reassignment
        state = undefined
    }

    return allReducers(state, action)
}
export default rootReducer;
