const SET_USER_INFO = 'setUserInfo'
const SET_PAY_STATE = 'setPayState'
export default {
    [SET_USER_INFO](state, payload){
        state.userInfo = payload
    },
    [SET_PAY_STATE](state, payState){
        state.payState = payState
    }
}