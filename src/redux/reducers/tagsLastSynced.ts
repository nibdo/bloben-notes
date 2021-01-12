const tagsLastSynced = (state: Date | null = null, action: any) => {
    switch (action.type) {
        case 'SET_TAGS_LAST_SYNCED':
            return action.payload;
        default:
            return state;
    }
}

export default tagsLastSynced;
