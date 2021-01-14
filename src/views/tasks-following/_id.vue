<template>
<el-main>
    <div class="app-container">
        <div class="text-right mb-2 pt-2 pr-5 actions">
               <el-button
                    size="mini"
                    type="success"
                    icon="las la-filter" 
                    plain
                    circle></el-button>

                <el-button
                    size="mini"
                    type="success"
                    icon="las la-filter" 
                    plain
                    circle></el-button>
        </div>

       <el-table
            size="mini"
            v-loading="loading"
            :data="inscriptions"
            border
            fit
            highlight-current-row>
            <el-table-column
                prop="name"
                label="Nombre">
            </el-table-column>

            <el-table-column
                prop="lastname"
                label="Apellido">
            </el-table-column>

            <el-table-column 
                align="center"
                label="Operaciones"
                width="170" 
                fixed="right">
                <template slot-scope="{ row: inscription }">
                    <el-button-group>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="Abrir inscripción"
                            placement="top">
                            <el-button
                                round
                                plain
                                size="mini"
                                icon="las la-edit"
                              ></el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="Abrir tareas"
                            placement="top">
                            <el-button
                                round
                                plain
                                size="mini"
                                icon="las la-tasks">
                                </el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="Abrir evaluaciones"
                            placement="top">
                            <el-button
                                round
                                plain
                                size="mini"
                                icon="las la-gavel"
                                ></el-button>
                        </el-tooltip>
                    </el-button-group>
                </template>
            </el-table-column>
       </el-table>
        
    </div>
</el-main>
</template>

<script>
export default {
    data: () => ({
        inscriptions: [
            {
                name: 'Marcela',
                lastname: 'Dominguez'
            },
            {
                name: 'Mariana',
                lastname: 'Martinez'
            },
            {
                name: 'Diego',
                lastname: 'Aguero'
            },
            {
                name: 'Cristian',
                lastname: 'Dominguez'
            },
        ]
    })
}
</script>

<style lang="scss" scoped>
    .actions {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            .el-button {
                width: 34px;
                height: 34px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
            }
    }
</style>

