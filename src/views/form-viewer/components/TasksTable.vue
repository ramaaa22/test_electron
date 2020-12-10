<template>
<div>
        <el-table 
            :data="tasks"
            border
            fit
            size="mini">
            
             <el-table-column
                label="Tarea">
                <template slot-scope="{ row: submit}">
                   <span>{{submit.task.title}}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="Estado"
                align="center"
                width="150">
                <template slot-scope="{ row: submit}">
                    <el-tooltip
                        v-if="submit.sent_at"
                        class="item"
                        effect="dark"
                        content="Ver tarea"
                        placement="left-start">
                        <el-button 
                            @click="openSubmit(submit)"
                            round
                            plain
                            size="mini">
                                <i class="las la-eye"></i>
                        </el-button>
                    </el-tooltip>
                    <span v-else>No enviada</span>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog  
            :visible="visible">
            <application-render
                :steps="complete_task"/>
        </el-dialog>    
</div>
</template>
<script>
import axios from '@/utils/request';
import ApplicationRender from '@/views/form-viewer/components/ApplicationRender';

export default {
    data: () => ({
        loading: true,
        complete_task: [],
        visible: false
    }),

    props:{
        tasks: Array,
        idnumber: String
    },

    methods: {
           async openSubmit(submit, idnumber){
            try {
                const endpoint = `/clients/tasks/${submit.task.uuid}/submits/${submit.uuid}`;
                const  {data}  = await axios.get(endpoint, {   api: "revision",
                oauth: true });

                this.complete_task = data.resource.submit;

                this.visible = true;
            } 
            catch (error) {
                console.log(error)
            }
        },
    },

    components: {
        ApplicationRender
    }
}
</script>