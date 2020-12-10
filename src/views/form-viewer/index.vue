<template>
    <el-main>
        <el-row>
            <el-col class="is-flex is-justify-flex-end">
                <download-pdf
                    :steps="steps"
                    :idnumber="idnumber"
                    :type="type"/>
            </el-col>

            <div class="text-right mb-2 pt-2 pr-5 actions">
                <el-tooltip
                    effect="dark"
                    content="Evaluaciones"
                    placement="top">
                    <el-badge 
                        :value=1>
                            <el-button
                                size="mini"
                                type="primary"
                                icon="las la-gavel"
                                class="el-dropdown-link"
                                plain
                                @click="openEvaluation"
                                circle>
                            </el-button>
                    </el-badge>
                </el-tooltip>
            </div>

        </el-row>
        <application-render :steps="steps"/>
        <tasks-table
            v-if="total_tasks.length !== 0"
            :tasks="total_tasks"
            :idnumber="idnumber"/>

        <el-dialog
            title="Evaluación"
            :visible.sync="dialog_visible"
            width="50%">
            <evaluation-table
                :application_uuid="uuid">
            </evaluation-table>
        </el-dialog>    
    </el-main>
</template>

<script>
import ApplicationRender from '@/views/form-viewer/components/ApplicationRender';
import DownloadPdf from '@/views/form-viewer/components/DownloadPdf';
import TasksTable from '@/views/form-viewer/components/TasksTable';
import axios from '@/utils/request';
import EvaluationTable from '@/views/review/components/EvaluationTable';

export default {
    data: () =>({
        total_tasks: [],
        dialog_visible:false,
    }),
    methods:{
        openEvaluation(){
            console.log('entro aca');
            this.dialog_visible=true;
        }
    },

    computed:{
        steps (){
            return this.$route.params.application
        },
        idnumber (){
            return this.$route.params.title
        },
        type (){
            return this.$route.params.type
        },
        uuid (){
            return this.$route.params.id
        }
    },

    async mounted(){
        if(this.type === 'review'){
           try {
            const endpoint = `/clients/users/${this.idnumber}/announcements/${this.uuid}/tasks/submits`;
            const  { data } = await axios.get(endpoint, {   api: "revision",
                oauth: true });
            
            this.total_tasks = data.resources;
            } 
            catch (error) {
                console.log(error)
            }
            finally {
                this.loading = false  
            } 
        }
    },

    components: {
        ApplicationRender,
        DownloadPdf,
        TasksTable,
        EvaluationTable
    },
}
</script>

