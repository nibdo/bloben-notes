import { cloneDeep } from '../../utils/common';

const notes = (state: any = [], action: any) => {
    switch (action.type) {
        case 'SET_NOTES':
            return action.payload;
        case 'ADD_NOTE':
            return [
                ...state,
                action.payload,
            ];
        case 'UPDATE_NOTE':
            let stateClone: any = cloneDeep(state);

            stateClone = stateClone.map((item: any) => {
                if (item.id === action.payload.id) {
                    return action.payload
                }

                return item
            })

            return stateClone;
        case 'SOFT_DELETE_NOTE':
            let stateCloneSoftDeleteNote: any = cloneDeep(state);

            const softDeletedNote: any = action.payload;
            softDeletedNote.deletedAt = new Date();
            softDeletedNote.isSynced = false;

            stateCloneSoftDeleteNote = stateCloneSoftDeleteNote.map((item: any) => {
                if (item.id === action.payload.id) {
                    return softDeletedNote
                }

                return item
            })

            return stateCloneSoftDeleteNote;
        case 'DELETE_NOTE':
            let stateCloneDeleteNote: any = cloneDeep(state);

            stateCloneDeleteNote = stateCloneDeleteNote.filter((item: any) => {
                return item.id !== action.payload.id
            })

            return stateCloneDeleteNote;
        default:
            return state;
    }
}

export default notes;
