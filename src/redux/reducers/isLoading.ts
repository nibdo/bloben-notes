const isLoading = (state: boolean = false, action: any) => {
    switch (action.type) {
        case 'SET_IS_LOADING':
            return action.payload;
        default:
            return state;
    }
}

export default isLoading;
