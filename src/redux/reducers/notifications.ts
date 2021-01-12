
const notifications = (state: any = [], action: any) => {
    switch (action.type) {
        case 'SET_NOTIFICATIONS':
            return action.payload;
        case 'ADD_NOTIFICATION':
            return [...state, action.payload];
        default:
            return state;
    }
}

export default notifications;
