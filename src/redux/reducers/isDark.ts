const isDarkReducer = (state: boolean = false, action: any) => {
    switch (action.type) {
        case 'SET_IS_DARK':
            return action.payload;
        default:
            return state;
    }
}

export default isDarkReducer;
