import { cloneDeep } from '../../utils/common';

const tags = (state: any = [], action: any) => {
    switch (action.type) {
        case 'SET_TAGS':
            return action.payload;
        case 'ADD_TAG':
            return [
                ...state,
                action.payload,
            ];
        case 'UPDATE_TAG':
            let stateClone: any = cloneDeep(state);

            stateClone = stateClone.map((item: any) => {
                if (item.id === action.payload.id) {
                    return action.payload
                }

                return item
            })

            return stateClone;
        case 'SOFT_DELETE_TAG':
            // TODO DELETE TAG FROM ALL NOTES
            let stateCloneSoftDeleteTag: any = cloneDeep(state);

            const softDeletedTag: any = action.payload;
            softDeletedTag.deletedAt = new Date();
            softDeletedTag.isSynced = false;

            stateCloneSoftDeleteTag = stateCloneSoftDeleteTag.map((item: any) => {
                if (item.id === action.payload.id) {
                    return softDeletedTag
                }

                return item
            })

            return stateCloneSoftDeleteTag;
        case 'DELETE_TAG':
            let stateCloneDeleteTag: any = cloneDeep(state);

            stateCloneDeleteTag = stateCloneDeleteTag.filter((item: any) => {
                return item.id !== action.payload.id
            })

            return stateCloneDeleteTag;
        default:
            return state;
    }
}

export default tags;
