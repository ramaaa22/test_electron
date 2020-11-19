<template>

        <el-table 
            :data="submits"
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


</template>
<script>
import axios from '@/utils/request';

export default {
    data: () => ({
        submits: [],
        loading: true
    }),

    props:{
        idnumber: String,
    },
    
    computed: {
        announcement_uuid() {
            return this.$route.params.uuid;
        }
    },

    async mounted(){
        try {
            const endpoint = `/clients/users/${this.idnumber}/announcements/${this.announcement_uuid}/tasks/submits`;
            const  { data } = await axios.get(endpoint, {   api: "revision",
                oauth: true });
            
            this.submits = data.resources
        } 
        catch (error) {
            console.log(error)
        }
        finally {
            this.loading = false  
        }
    },

    methods: {
        openSubmit(submit) {
            this.$emit('open-submit', submit, this.idnumber);
        }
    }
}
</script>