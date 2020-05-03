import { List } from 'immutable'

let listReducer = (state = new List(), payload) => {
    switch (payload.type) {
        case "INIT_DATA":
            let newData = state.concat(payload.initData);
            return newData;
        default:
            return state;
    }
}

export default listReducer;