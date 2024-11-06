<!-- <template>
    <div id="acquisitions">
        <BarChart :chartData="testData" />
    </div>
</template>

<script setup>
    import { BarChart } from 'vue-chart-3';
    import { Chart, registerables } from "chart.js";
    import { ref } from 'vue';

    Chart.register(...registerables);

    const testData = ref({
        labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
        datasets: [
            {
                data: [30, 40, 60, 70, 5],
                backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
            },
        ]
    });
</script> -->

<template>
    <div class="escope">
        <div class="file">
            <ChooseFile :OnChangeFile="ChangeFile" />
        </div>
    </div>
</template>

<script setup>
    import ChooseFile from '@/components/ChooseFile.vue';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';

    const router = useRouter();
    const store = useStore();
    const text = ref("");

    const ChangeFile = ($event) => {
        const file = $event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = (evt) => {
            text.value = evt.target.result;
            text.value = ReplaceCommaSafe(text.value);
            text.value = text.value.replaceAll('"', '');
            GetTableLines();
        }
    }

    const ReplaceCommaSafe = (text) => {
        return text.replace(/"[^"]*"/g, (trecho) => {
            return trecho.replace(/,/g, '.');
        });
    }

    const GetTableLines = () => {
        const tableLines = text.value.split("\n");
        const fileTable = [];

        tableLines.forEach(line => {
            fileTable.push(line.split(','));
        });

        store.commit("SetFileTable", fileTable);
        console.log(fileTable);
        router.push({name: "select"});
    }
</script>

<style scoped lang="scss">
    .escope {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .file {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>