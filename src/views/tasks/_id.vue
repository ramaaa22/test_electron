<template >
    <el-main>
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <el-row>
                    <el-col class="is-flex is-justify-flex-end">
                        <download :list="complete_list"/>
                    </el-col>   
                </el-row> 

                <el-table
                    class="pointer"
                    v-loading="loading_table"
                    :data="list"
                    border
                    :stripe="true"
                    fit
                    highlight-current-row
                    @row-click="open">
                        <el-table-column 
                            align="center" 
                            label="Nombre">
                            <template slot-scope="scope">
                                {{scope.row.user.firstname | capitalize}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center" 
                            label="Apellido">
                            <template slot-scope="scope">
                                {{scope.row.user.lastname | capitalize}}
                            </template>
                        </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-pagination 
            align='center' 
            @current-change="changeCurrent" 
            :current-page="this.current_page"  
            layout="prev, pager, next" 
            :page-count="page_size">
        </el-pagination> 

        <el-drawer 
            class="drawer"
            v-loading="loading_drawer"
            :visible.sync="visible"
            @close="close"
            size="50%">
                <application-render
                    :name="name"
                    :title="title" 
                    :application="application"/>   
        </el-drawer>
    </el-main>
</template>

<script>
import app from '@/store/modules/app'
import ApplicationRender from '@/views/tasks/components/ApplicationRender'
import Download from '@/views/tasks/components/Download'
import axios from "@/utils/request";



export default {
    filters:{
		capitalize(value){            
            return value.toLowerCase()
            .trim()
            .split(' ')
            .map( v => v[0].toUpperCase() + v.substr(1) )
            .join(' '); 
		}
	},
    props: {
        visible: Boolean,
        loading_drawer: Boolean,
        application: Array
    },

    data: () => ({
        list:[],
        task_id: null,
        loading_table:false,
        current_page: 1,
        page_size: null,
        complete_list: []
    }),
   

    async mounted() {
        this.loading_table = true
        try {
            this.task_id = this.$route.params.id;
          
            const res  = await axios.get(`/clients/tasks/${this.task_id}/submits`, {
                api: "revision",
				oauth: true
			});
            this.list = res.data.resources;

            this.page_size = res.data.last_page;
            
          
            const title_task = this.$route.params.task.title;
            window.document.title = `${title_task}`;

        } catch (error) {
            console.log(error)
        }
        finally {
            this.loading_table = false;
              for(let n = 1; n <= this.page_size; n++){
                const total = await axios.get(`/clients/tasks/${this.task_id}/submits?page=${n}`, {
                api: "revision",
				oauth: true
			});

              this.complete_list =  this.complete_list.concat(total.data.resources)
            }

        }    
    },

    computed:{
        title(){
            return this.$route.params.task.title;
        },

        name(){
            return this.$route.params.task.name;
        }
    },

    methods: {
        open(row) {
            const task = this.task_id;
            this.$emit('open', row, task);
        },

        close() {
            this.$emit('close');
        },

        async   changeCurrent(val) {
            this.loading_table = true;
        
            try {
                this.task_id = this.$route.params.id;
            
            
                const res = await axios.get(`/clients/tasks/${this.task_id}/submits?page=${val}`, {
                    api: "revision",
				    oauth: true
                })
                
                this.list = res.data.resources;

            } catch (error) {
                console.log(error)
            }
            finally {
                this.loading_table = false;
            }    
        }

    },

    components:{
        Download,
        ApplicationRender
    }
}
</script>

<style>
 .el-drawer__body {
   overflow: auto
 }
</style>

