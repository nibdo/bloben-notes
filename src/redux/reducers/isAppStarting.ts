const isAppStarting = (state: boolean = false, action: any) => {
    switch (action.type) {
        case 'SET_IS_APP_STARTING':
            return action.payload;
        default:
            return state;
    }
}

export default isAppStarting;
