const username = (state: string = '', action: any) => {
    switch (action.type) {
        case 'SET_USERNAME':
            return action.payload;
        default:
            return state;
    }
}

export default username;
