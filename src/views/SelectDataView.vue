<template>
    <div class="container">
        <div class="selector">
            <div class="title">
                {{ selectors[currentSelector].name }}
            </div>

            <select v-model="selectedColumn">
                <option v-for="(column, columnNumber) in fileTable[0]" :key="column" :value="columnNumber">
                    {{ column }}
                </option>
            </select>

            <button @click="SelectColumn">Próximo</button>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';

    const router = useRouter();
    const store = useStore();
    const fileTable = computed(() => store.state.fileTable);
    const selectors = ref([
        {
            name: "Qual coluna representa o nome do Aluno",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota da Prova 1",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota da Prova 2",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota do Minigame 1.1",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota do Minigame 1.2",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota do Minigame 2.1",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota do Minigame 2.2",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota do Minigame 2.3",
            column: 0,
        },
        {
            name: "Qual coluna representa a nota do Minigame 2.4",
            column: 0,
        },
    ]);
    const currentSelector = ref(0);
    const selectedColumn = ref(0);

    const SelectColumn = () => {
        selectors.value[currentSelector.value].column = selectedColumn.value;
        if (currentSelector.value < selectors.value.length - 1) currentSelector.value++;
        else CreateGradeTable();
    }

    const CreateGradeTable = () => {
        const gradeTable = [];

        fileTable.value.forEach(line => {
            const newLine = []
            line.forEach((data, column) => {
                if (selectors.value.filter(s => s.column == column).length > 0)
                    newLine.push(data);
            });
            gradeTable.push(newLine);
        });

        store.commit("SetGradeTable", gradeTable);
        router.push({name: 'grade'});
    }
</script>

<style scoped>
    .container {
        width: 600px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* align-items: center; */
        margin: auto;
    }

    .selector {
        width: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        background-color: white;
        padding-bottom: 20px;
        gap: 10px;

        .title {
            background-color: #6c7ae0;
            color: white;
            padding: 10px;
            font-size: 16pt;
        }

        select {
            padding: 10px;
            border: none;
            font-size: 14pt;
            background-color: whitesmoke;
            color: rgb(66, 66, 66);
        }

        button {
            background: #6c7ae0;
            color: white;
            width: max-content;
            padding: 10px;
            font-size: 12pt;
            border-radius: 5px;
            align-self: flex-end;
            margin-right: 10px;
            border: none;
            outline: none;

            &:hover {
                background: #616fda;
                cursor: pointer;
            }
        }
    }

    table {
        width: 90vw;
        border-collapse: collapse;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 20px;

        th {
            background-color: #6c7ae0;
            color: white;
            font-size: 14pt;
            font-weight: 400;
        }

        th,
        td {
            padding: 10px;
            text-align: center;
        }

        td {
            background-color: white;
            color: rgb(56, 56, 56);
            font-size: 12pt;
        }

        tr {
            &:not(:last-child) {
                border-bottom: 1px solid rgb(240, 240, 240);
            }
        }
    }
</style>