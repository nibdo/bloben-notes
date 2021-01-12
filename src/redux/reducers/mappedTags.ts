const mappedTags = (state: any = [], action: any) => {
    switch (action.type) {
        case 'SET_MAPPED_TAGS':
            return action.payload;
        default:
            return state;
    }
}

export default mappedTags;
