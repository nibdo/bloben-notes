
const sortedNotes = (state: any = [], action: any) => {
    switch (action.type) {
        case 'SET_SORTED_NOTES':
            return action.payload;
        default:
            return state;
    }
}

export default sortedNotes;
