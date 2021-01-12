<template>
<el-main>
    <div class="app-container">
        <el-row type="flex" justify="center">
            <el-col>
                <el-table
                    :stripe=true
                    size="mini"
                    border
                    fit
                    highlight-current-row
                    :data="followings">
                        <el-table-column type="expand">
                        <template slot-scope="props">                    
                            <el-button 
                                v-for="task in props.row.tasks"
                                :key="task.name">
                                {{task.name}}
                            </el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="Nombre"
                            prop="name">
                        </el-table-column>

                </el-table>
            </el-col>
        </el-row>
    </div>
</el-main>
</template>

<script>
export default {
    data: () => ({
        followings: [
            {
                name: 'Sostener cultura',
                tasks: [
                    {name: 'Cargar CBU'},
                    {name: 'Prestamo'},
                    {name: 'Pedir dni'},
                ]
            },
            {
                name: 'Microcreditos',
                tasks: [
                    {name: 'Cargar CBU'},
                    {name: 'Prestamo'},
                    {name: 'Pedir dni'},
                ]
            },
            {
                name: 'Concurso de letras',
                tasks: [
                    {name: 'Cargar CBU'},
                    {name: 'Prestamo'},
                    {name: 'Pedir dni'},
                ]
            }
        ],
    }),

   /* mounted (){
        pedido a la api para traer los seguimientos.
        CASE 1: Las tareas de esos seguimientos vienen con los seguimientos.
    }
    
    methods: {
    ----CASE 2: Las tareas de los seguimientos hay que pedirlas a la api
        cuando el usuario toca el expand
        en el evento expand-change. 
        TODO: Ver si en esa funcion puede ser de ayuda el metodo de la tabla
        toggleRowExpansion.
    
    ----Funcion cuando el usuario toque el button text de la tarea
        Se manda el emit a app-main para abrir en otra tab
        _id de tasks-following.
            ---> componente que muestra la tabla con los inscriptos 
                que tienen asociada esa tarea
    }*/



}
</script>