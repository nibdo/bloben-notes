const isMobile = (state: boolean = false, action: any) => {
    switch (action.type) {
        case 'SET_IS_MOBILE':
            return action.payload;
        default:
            return state;
    }
}

export default isMobile;
