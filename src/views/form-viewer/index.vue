<template>
    <div>
        <download-pdf
            :steps="steps"
            :idnumber="idnumber"
            :type="type"/>
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


        <el-dialog
            title="Evaluación"
            :visible.sync="dialog_visible"
            width="50%">
            <evaluation-table
                :application_uuid="application_uuid">
            </evaluation-table>
        </el-dialog>

        <application-render :steps="steps"/>
    </div>
</template>

<script>
import ApplicationRender from '@/views/form-viewer/components/ApplicationRender';
import DownloadPdf from '@/views/form-viewer/components/DownloadPdf';
import EvaluationTable from '../review/components/EvaluationTable.vue';

export default {
    data:()=>({
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
        application_uuid(){
            return this.$route.params.id
        }
    },

    components: {
        ApplicationRender,
        DownloadPdf,
        EvaluationTable
    },
}
</script>

