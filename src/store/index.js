import { createStore } from 'vuex'

export default createStore({
    state: {
        fileTable: [],
        gradeTable: [],

        nomenclature: {
            studentName: "Nome",
            test_1: "Prova 1",
            test_2: "Prova 2",
            m_1_1: "Minigame 1.1",
            m_1_2: "Minigame 1.2",
            m_2_1: "Minigame 2.1",
            m_2_2: "Minigame 2.2",
            m_2_3: "Minigame 2.3",
            m_2_4: "Minigame 2.4",
        },
    },
    getters: {
    },
    mutations: {
        SetFileTable(state, data){
            state.fileTable = data;
        },
        SetGradeTable(state, data){
            state.gradeTable = data;
        },
    },
    actions: {
    },
    modules: {
    }
})
