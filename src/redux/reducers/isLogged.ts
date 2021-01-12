const isLogged = (state: boolean = false, action: any) => {
    switch (action.type) {
        case 'SET_IS_LOGGED':
            return action.payload;
        default:
            return state;
    }
}

export default isLogged;
