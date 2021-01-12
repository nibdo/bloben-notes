const selectedTag = (state: any = { id: null, name: 'All notes' }, action: any) => {
    switch (action.type) {
        case 'SELECT_TAG':
            return action.payload;
        default:
            return state;
    }
}

export default selectedTag;
