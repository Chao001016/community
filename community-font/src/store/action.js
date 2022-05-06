export default {
    setUserInfo({ commit }, payload){
        commit('setUserInfo', payload)
    },
    setPayState({ commit }, payState) {
        commit('setPayState', payState)
    }
}