const notesLastSynced = (state: Date | null = null, action: any) => {
    switch (action.type) {
        case 'SET_NOTES_LAST_SYNC':
            return action.payload;
        default:
            return state;
    }
}

export default notesLastSynced;
