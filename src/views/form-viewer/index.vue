<template>
    <el-main>
        <el-row>
            <el-col v-if="component === 'application-render'" class="is-flex is-justify-flex-end">
                <download-pdf
                    :steps="steps"
                    :idnumber="idnumber"/>
            </el-col>

        </el-row>

        <component
            :is="component"
            :steps="steps"
            :application_uuid="uuid"/>
        
        
    </el-main>
</template>

<script>
import ApplicationRender from '@/views/form-viewer/components/ApplicationRender';
import DownloadPdf from '@/views/form-viewer/components/DownloadPdf';
import TasksTable from '@/views/form-viewer/components/TasksTable';
import EvaluationTable from '@/views/form-viewer/components/EvaluationTable';
import axios from '@/utils/request';

export default {

    data: () =>({
        total_tasks: [],
        
    }),

    props:['prop'],

    computed:{
        steps(){
            return this.prop.steps;
        },
        name(){
            return this.prop.name;
        },
        idnumber(){
            return this.prop.idnumber;
        },
        component(){
            return this.prop.component_intern;
        },
        uuid(){
            return this.prop.application_uuid;
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

