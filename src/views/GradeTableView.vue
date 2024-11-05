<template>
    <div class="options-grade">
        <h3>O que você deseja visualizar?</h3>
        <ul>
            <li v-for="(option, index) in menuOptions" :key="option" @click="SelectMenuOption(index)">
                <p>{{ option }}</p>
            </li>
        </ul>
    </div>

    <div class="charts" v-if="optionSelected != -1 && optionSelected < 13">
        <BarChart :chart-data="chartData" :options="chartOptions" />
    </div>

    <div class="charts" v-else-if="optionSelected >= 13 && optionSelected <= 14">
        <PieChart :chart-data="chartData" :options="chartOptions" />
    </div>

    <div class="charts" v-else-if="optionSelected >= 15 && optionSelected <= 16">
        <ScatterChart :chart-data="chartData" :options="chartOptions" />
    </div>

    <table v-if="optionSelected == 17">
        <tr>
            <th v-for="column in gradeTable[0]" :key="column">{{ column }}</th>
        </tr>

        <tr v-for="(line, numberLine) in gradeTableLines" :key="line">
            <td v-for="(column, numberColumn) in line" :key="`${numberLine}_${numberColumn}${column}`">{{ column }}
            </td>
        </tr>
    </table>
</template>

<script setup>
    import { Chart, registerables } from 'chart.js';
    import { computed, ref } from 'vue';
    import { BarChart, PieChart, ScatterChart } from 'vue-chart-3';
    import { useStore } from 'vuex';

    Chart.register(...registerables);

    const store = useStore();
    const gradeTable = computed(() => store.state.gradeTable);
    const gradeTableLines = computed(() => gradeTable.value.slice(1, gradeTable.value.length));

    const nomenclature = computed(() => store.state.nomenclature);

    const menuOptions = ref([
        "Minigames não jogados",
        "Minigames jogados",
        "Quantos jogaram algum minigame e tiraram nota maior ou igual a 7 na prova",
        "Quantos não jogaram nenhum minigame e tiraram nota maior ou igual a 7 na prova",
        "Quantos não jogaram nenhum minigame e tiraram nota menor que 7 na prova",
        "Quantos jogaram algum minigame e tiraram nota menor que 7 na prova",
        "Quantos jogaram algum minigame e tiraram nota maior ou igual a 5 na prova",
        "Quantos não jogaram nenhum minigame e tiraram nota maior ou igual a 5 na prova",
        "Quantos jogaram algum minigame e tiraram nota menor que 5 na prova",
        "Quantos não jogaram nenhum minigame e tiraram nota menor que 5 na prova",
        "Quantos tiraram média menor que 5 nos minigames e também tiraram nota menor que 5 na prova",
        "Gráfico de Notas da Prova 1",
        "Gráfico de Notas da Prova 2",
        "Acima de 5,00 - Prova 1",
        "Acima de 5,00 - Prova 2",
        "Gráfico de Dispersão Módulo 1",
        "Gráfico de Dispersão Módulo 2",
        "Tabela de Notas",
    ]);

    const optionSelected = ref(-1);

    const chartData = ref({});

    const chartOptions = ref({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                color: '#333',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Alunos",
                }
            },
            y: {
                max: gradeTableLines.value.length,
                title: {
                    display: true,
                    text: "",
                }
            },
        },
    });

    const HasMadeSomeMinigame = (line, module) => {
        if (!module)
            return line[3] != '-' || line[4] != '-' || line[5] != '-' || line[6] != '-' || line[7] != '-' || line[8] != '-';
        else if (module == 1)
            return line[3] != '-' || line[4] != '-';
        else
            return line[5] != '-' || line[6] != '-' || line[7] != '-' || line[8] != '-';
    }

    const GetAverageMinigames = (line, module) => {
        const m_1_1 = isNaN(line[3]) ? 0 : Number(line[3]);
        const m_1_2 = isNaN(line[4]) ? 0 : Number(line[4]);
        const m_2_1 = isNaN(line[5]) ? 0 : Number(line[5]);
        const m_2_2 = isNaN(line[6]) ? 0 : Number(line[6]);
        const m_2_3 = isNaN(line[7]) ? 0 : Number(line[7]);
        const m_2_4 = isNaN(line[8]) ? 0 : Number(line[8]);

        if (!module)
            return (m_1_1 + m_1_2 + m_2_1 + m_2_2 + m_2_3 + m_2_4) / 6;
        else if (module == 1)
            return (m_1_1 + m_1_2) / 2;
        else
            return (m_2_1 + m_2_2 + m_2_3 + m_2_4) / 4;
    }

    const GetHistogram = (module) => {
        const histogram = [];
        for (let i = 0; i < 11; i++) {
            histogram.push(gradeTableLines.value.filter(line => !isNaN(line[module]) && Number(line[module]) >= i && Number(line[module] < i + 1)).length);
        }

        return histogram;
    }

    const GetScatter = (module) => {
        const test = [];
        const minigames = [];

        gradeTableLines.value.forEach(line => {
            const averageMinigames = GetAverageMinigames(line, module);

            test.push(isNaN(line[module]) ? 0 : Number(line[module]));
            minigames.push(averageMinigames / 10);
        });

        for (let i = 0; i < minigames.length; i++) {
            for (let j = 0; j < minigames.length; j++) {
                if (minigames[i] < minigames[j] || (minigames[i] == minigames[j] && test[i] < test[j])) {
                    let aux = minigames[i];
                    minigames[i] = minigames[j];
                    minigames[j] = aux;
                    aux = test[i];
                    test[i] = test[j];
                    test[j] = aux;
                }
            }
        }

        return { test, minigames };
    }

    const SetBarChart = (title, titleX, titleY, labelsX, labelAmount, backgrounds, data, maxY) => {
        chartData.value = {
            labels: labelsX,
            datasets: [
                {
                    label: labelAmount,
                    backgroundColor: backgrounds,
                    borderColor: "#1E88E5",
                    data: data,
                }
            ]
        };

        chartOptions.value.plugins.title.text = title;
        chartOptions.value.scales.x.title.text = titleX;
        chartOptions.value.scales.y.title.text = titleY;
        chartOptions.value.scales.y.max = maxY ? maxY : gradeTableLines.value.length;
        chartOptions.value.scales.x.display = titleX != '';
        chartOptions.value.scales.y.display = titleY != '';
    }

    const SetPieChart = (title, labelsX, labelAmount, backgrounds, data) => {
        chartData.value = {
            labels: labelsX,
            datasets: [
                {
                    label: labelAmount,
                    backgroundColor: backgrounds,
                    borderColor: "#1E88E5",
                    data: data,
                }
            ]
        };

        chartOptions.value.plugins.title.text = title;
        chartOptions.value.scales.x.display = false;
        chartOptions.value.scales.y.display = false;
    }

    const SetScatterChart = (title, titleX, titleY, labelData1, labelData2, data1, data2) => {
        chartData.value = {
            datasets: [
                {
                    label: labelData1,
                    backgroundColor: "#6633aaaa",
                    // borderColor: "#1E88E5",
                    pointRadius: 7,
                    data: data1,
                },
                {
                    label: labelData2,
                    backgroundColor: "#a82d2dcc",
                    pointRadius: 7,
                    // borderColor: "#1E88E5",
                    data: data2,
                }
            ]
        };

        chartOptions.value.plugins.title.text = title;
        chartOptions.value.scales.x.title.text = titleX;
        chartOptions.value.scales.y.title.text = titleY;
        chartOptions.value.scales.y.max = 11;
        chartOptions.value.scales.x.display = true;
        chartOptions.value.scales.y.display = true;
    }

    const SelectMenuOption = (optionIndex) => {
        optionSelected.value = optionIndex;

        switch (optionIndex) {
            case 0: {
                const minigamesNotOpened = [
                    gradeTableLines.value.filter(line => line[3] == '-').length,
                    gradeTableLines.value.filter(line => line[4] == '-').length,
                    gradeTableLines.value.filter(line => line[5] == '-').length,
                    gradeTableLines.value.filter(line => line[6] == '-').length,
                    gradeTableLines.value.filter(line => line[7] == '-').length,
                    gradeTableLines.value.filter(line => line[8] == '-').length,
                ];

                SetBarChart(
                    "Quantidade de alunos que não abriram os minigames",
                    "Minigames",
                    "Quantidade de alunos",
                    [nomenclature.value.m_1_1, nomenclature.value.m_1_2, nomenclature.value.m_2_1, nomenclature.value.m_2_2, nomenclature.value.m_2_3, nomenclature.value.m_2_4],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B", "#FFD93D", "#4CAF50", "#A385E0", "#42A5F5"],
                    minigamesNotOpened
                );

                break;
            }
            case 1: {
                const minigamesOpened = [
                    gradeTableLines.value.filter(line => line[3] != '-').length,
                    gradeTableLines.value.filter(line => line[4] != '-').length,
                    gradeTableLines.value.filter(line => line[5] != '-').length,
                    gradeTableLines.value.filter(line => line[6] != '-').length,
                    gradeTableLines.value.filter(line => line[7] != '-').length,
                    gradeTableLines.value.filter(line => line[8] != '-').length,
                ];

                SetBarChart(
                    "Quantidade de alunos que abriram os minigames",
                    "Minigames",
                    "Quantidade de alunos",
                    [nomenclature.value.m_1_1, nomenclature.value.m_1_2, nomenclature.value.m_2_1, nomenclature.value.m_2_2, nomenclature.value.m_2_3, nomenclature.value.m_2_4],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B", "#FFD93D", "#4CAF50", "#A385E0", "#42A5F5"],
                    minigamesOpened
                );

                break;
            }
            case 2: {
                const countTest1 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 1) && line[1] >= 7).length;
                const countTest2 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 2) && line[2] >= 7).length;

                SetBarChart(
                    "Quantidade de alunos que jogaram algum minigame e obteve nota >= 7,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 3: {
                const countTest1 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 1) && line[1] >= 7).length;
                const countTest2 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 2) && line[2] >= 7).length;
                SetBarChart(
                    "Quantidade de alunos que NÃO jogaram nenhum minigame e obteve nota >= 7,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 4: {
                const countTest1 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 1) && line[1] < 7).length;
                const countTest2 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 2) && line[2] < 7).length;

                SetBarChart(
                    "Quantidade de alunos que NÃO jogaram nenhum minigame e obteve nota < 7,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 5: {
                const countTest1 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 1) && line[1] < 7).length;
                const countTest2 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 2) && line[2] < 7).length;

                SetBarChart(
                    "Quantidade de alunos que jogaram algum minigame e obteve nota < 7,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 6: {
                const countTest1 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 1) && line[1] >= 5).length;
                const countTest2 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 2) && line[2] >= 5).length;

                SetBarChart(
                    "Quantidade de alunos que jogaram algum minigame e obteve nota >= 5,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 7: {
                const countTest1 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 1) && line[1] >= 5).length;
                const countTest2 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 2) && line[2] >= 5).length;

                SetBarChart(
                    "Quantidade de alunos que NÃO jogaram nenhum minigame e obteve nota >= 5,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 8: {
                const countTest1 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 1) && line[1] < 5).length;
                const countTest2 = gradeTableLines.value.filter(line => HasMadeSomeMinigame(line, 2) && line[2] < 5).length;

                SetBarChart(
                    "Quantidade de alunos que jogaram algum minigame e obteve nota < 5,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 9: {
                const countTest1 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 1) && line[1] < 5).length;
                const countTest2 = gradeTableLines.value.filter(line => !HasMadeSomeMinigame(line, 2) && line[2] < 5).length;

                SetBarChart(
                    "Quantidade de alunos que NÃO jogaram nenhum minigame e obteve nota < 5,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 10: {
                const countTest1 = gradeTableLines.value.filter(line => GetAverageMinigames(line, 1) < 50 && line[1] < 5).length;
                const countTest2 = gradeTableLines.value.filter(line => GetAverageMinigames(line, 2) < 50 && line[2] < 5).length;

                SetBarChart(
                    "Quantidade de alunos que obteve média nos minigames < 5,00 e obteve nota de prova < 5,00",
                    "Módulos",
                    "Quantidade de alunos",
                    ["Módulo 1", "Módulo 2"],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B"],
                    [countTest1, countTest2]
                );

                break;
            }
            case 11: {
                const histogram = GetHistogram(1);
                const histogram2 = GetHistogram(2);

                SetBarChart(
                    "Histograma Prova 1",
                    "Intervalo de Nota",
                    "Quantidade de alunos",
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B", "#FFD93D", "#4CAF50", "#A385E0", "#42A5F5", "#5CC8FF", "#FF6B6B", "#FFD93D", "#4CAF50"],
                    histogram,
                    Math.max(...[...histogram, ...histogram2])
                );

                break;
            }
            case 12: {
                const histogram = GetHistogram(1);
                const histogram2 = GetHistogram(2);

                SetBarChart(
                    "Histograma Prova 2",
                    "Intervalo de Nota",
                    "Quantidade de alunos",
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    "Alunos",
                    ["#5CC8FF", "#FF6B6B", "#FFD93D", "#4CAF50", "#A385E0", "#42A5F5", "#5CC8FF", "#FF6B6B", "#FFD93D", "#4CAF50"],
                    histogram2,
                    Math.max(...[...histogram, ...histogram2])
                );

                break;
            }
            case 13: {
                SetPieChart(
                    "Comparativo de Notas da Prova 1",
                    ["Notas abaixo de cinco", "Notas acima de cinco"],
                    "Alunos",
                    ["#FF6B6B", "#5CC8FF"],
                    [gradeTableLines.value.filter(line => line[1] < 5).length, gradeTableLines.value.filter(line => line[1] >= 5).length]
                )

                break;
            }
            case 14: {
                SetPieChart(
                    "Comparativo de Notas da Prova 2",
                    ["Notas abaixo de cinco", "Notas acima de cinco"],
                    "Alunos",
                    ["#FF6B6B", "#5CC8FF"],
                    [gradeTableLines.value.filter(line => line[2] < 5).length, gradeTableLines.value.filter(line => line[2] >= 5).length]
                )
                break;
            }
            case 15: {
                const { test, minigames } = GetScatter(1);
                SetScatterChart(
                    "Gráfico de Dispersão - Módulo 1",
                    "Aluno",
                    "Nota",
                    "Nota da Prova",
                    "Média dos Minigames",
                    test.map((t, i) => ({ x: i, y: t })),
                    minigames.map((t, i) => ({ x: i, y: t }))
                );

                break;
            }
            case 16: {
                const { test, minigames } = GetScatter(2);
                SetScatterChart(
                    "Gráfico de Dispersão - Módulo 2",
                    "Aluno",
                    "Nota",
                    "Nota da Prova",
                    "Média dos Minigames",
                    test.map((t, i) => ({ x: i, y: t })),
                    minigames.map((t, i) => ({ x: i, y: t }))
                );

                break;
            }

            default:
                break;
        }
    }

</script>

<style scoped>
    .options-grade {
        background-color: white;
        width: 50%;
        margin: auto;
        margin-top: 20px;
        border-radius: 10px;
        overflow: hidden;

        h3 {
            background-color: #6c7ae0;
            color: white;
            font-weight: 400;
            text-align: center;

            padding: 10px;
        }

        li {
            padding: 10px;
            border-bottom: 1px solid rgb(219, 219, 219);

            &:hover {
                background-color: whitesmoke;
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
            font-size: 12pt;
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
            font-size: 10pt;
        }

        tr {
            &:not(:last-child) {
                border-bottom: 1px solid rgb(240, 240, 240);
            }
        }
    }

    .charts {
        width: 50%;
        margin: auto;
    }
</style>
