<template>
    <el-table 
        v-loading="loading"
        border
        fit
        size="mini"
        :data="evaluation">
        <el-table-column
            align="center"
            width="75"
            label="Evaluado">
            <template slot-scope="{ row: evaluation}">
                <i 
                    class="las"
                    :class="{
                    'la-check-circle color-success' : evaluation.evaluated,
                    'la-times-circle' : !evaluation.evaluated
                }">
                </i>
            </template>
        </el-table-column>

        <el-table-column 
            align="center"
            label="Nombre">
            <template slot-scope="{ row: evaluation}">
                <span> {{evaluation.jury.firstname}} </span>
            </template>
        </el-table-column>

        <el-table-column 
            align="center"
            label="Apellido">
            <template slot-scope="{ row: evaluation}">
                <span> {{evaluation.jury.lastname}} </span>
            </template>
        </el-table-column>

        <el-table-column 
            align="center"
            label="Documento">
            <template slot-scope="{ row: evaluation}">
                <span> {{evaluation.jury.idnumber}} </span>
            </template>
        </el-table-column>

        <el-table-column 
            align="center"
            label="Email">
            <template slot-scope="{ row: evaluation}">
                <span> {{evaluation.jury.email}} </span>
            </template>
        </el-table-column>

        <el-table-column
            align="center"
            width="150">
            <template  slot-scope="{ row: evaluation}">
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(evaluation)">
                    Eliminar
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import axios from '@/utils/request';

export default {
    data:() => ({
        evaluation: [],
        loading: true
    }),

    /*props:{
        application_uuid: String
    },*/

    props: ['prop'],

    async mounted(){
        await this.retrieveEvaluations();
    },

    computed:{
        application_uuid(){
            return this.prop.application_uuid;
        }
    },
    methods: {
        async retrieveEvaluations(emit_update) {
            try {
                this.loading = true
                //const endpoint = `/clients/applications/${this.application_uuid}/evaluations`;

                //API SEBA
                const endpoint = `applications/${this.application_uuid}/evaluations`;

                const  { data }  = await axios.get(endpoint, {   api: "revision",
                oauth: true });

                this.evaluation = data.resources;

                if (emit_update)
                    this.$emit('update-applications');
            } 
            catch (error) {
                console.log(error)
            }
            finally{
                this.loading = false
            }
        },

        async handleDelete(evaluation){
                const evaluation_table_uuid = evaluation.evaluation_table.uuid
                const evaluation_uuid = evaluation.uuid
                //const endpoint = `/clients/evaluation-tables/${evaluation_table_uuid}/evaluations/${evaluation_uuid}`;

                //API SEBA
                const endpoint = `/evaluation-tables/${evaluation_table_uuid}/evaluations/${evaluation_uuid}`;

            try {
                await axios.delete(endpoint, {   api: "revision",
                oauth: true });

                await this.retrieveEvaluations(true);
            } 
            catch (error) {
                try {
                    const { response } = error
                    const title = `Evaluación ${evaluation_uuid}`;

                    if(response.status === 409) {
                        const message = `${response.data.error.message}. ¿Desea eliminarla de todas formas?`;

                        const confirmation = await this.$confirm(message, title, {
                            distinguishCancelAndClose: true,
                            confirmButtonText: 'Confirmar',
                            cancelButtonText: 'Cancelar',
                            type: 'warning'
                        });
                        
                        await axios.delete(endpoint, { 
                            api: "revision",
                            oauth: true, 
                            data: {
                                force: true
                            }
                        });

                        await this.retrieveEvaluations(true);
                    }
                    else
                        await this.$confirm(response.data.error.message, title, {
                            confirmButtonText: 'Aceptar',
                            showCancelButton: false,
                            type: 'warning'
                        });
                }
                catch(error) {
                    console.log(error)
                }
            }
        }
    }
}
</script>