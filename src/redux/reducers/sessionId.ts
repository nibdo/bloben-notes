
const sessionId = (state: any = null, action: any) => {
    switch (action.type) {
        case 'SET_SESSION_ID':
            return action.payload;
        default:
            return state;
    }
}

export default sessionId;
