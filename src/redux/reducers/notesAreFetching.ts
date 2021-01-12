const notesAreFetching = (state: boolean = false, action: any) => {
    switch (action.type) {
        case 'SET_NOTES_ARE_FETCHING':
            return action.payload;
        default:
            return state;
    }
}

export default notesAreFetching;
