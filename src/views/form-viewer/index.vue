<template>
    <el-main>
        <el-row>
            <el-col class="is-flex is-justify-flex-end">
                <download-pdf
                    :steps="steps"
                    :idnumber="idnumber"
                    :type="type"/>
            </el-col>
        </el-row>
        <application-render :steps="steps"/>
        <tasks-table
            v-if="total_tasks.length !== 0"
            :tasks="total_tasks"
            :idnumber="idnumber"/>
    </el-main>
</template>

<script>
import ApplicationRender from '@/views/form-viewer/components/ApplicationRender';
import DownloadPdf from '@/views/form-viewer/components/DownloadPdf';
import TasksTable from '@/views/form-viewer/components/TasksTable';
import axios from '@/utils/request';

export default {
    data: () =>({
        total_tasks: [],
    }),

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
            return this.$route.params.uuid
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
        TasksTable
    },
}
</script>

