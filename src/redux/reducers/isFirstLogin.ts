const isFirstLogin = (state: boolean = true, action: any) => {
    switch (action.type) {
        case 'SET_IS_FIRST_LOGIN':
            return action.payload;
        default:
            return state;
    }
}

export default isFirstLogin;
