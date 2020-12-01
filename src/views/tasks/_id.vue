<template >
    <el-main>
        <el-row type="flex" justify="center">
            <el-col>
                <el-tabs
                    type="border-card" 
                    v-model="tabs.active"
                    @tab-remove="removeTab">
                    <el-tab-pane
                        name="jurys"
                        label="Jurados"
                        :closable="false">
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
                                size="mini"
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
                            <el-pagination 
                                align='center' 
                                @current-change="changeCurrent" 
                                :current-page="this.current_page"  
                                layout="prev, pager, next" 
                                :page-count="page_size">
                            </el-pagination> 
                    </el-tab-pane>
                    <el-tab-pane
                        v-for="item in tabs.items"
                        :key="`tab-${item.name}`"
                        :label="item.title"
                        :name="item.name"
                        :closable="true">
                            <component 
                                :is="item.component"
                                v-bind="item.props"/>
                    </el-tab-pane>
                    
                </el-tabs>
            </el-col>
        </el-row>
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
    },

    data: () => ({
        list:[],
        task_id: null,
        loading_table:false,
        current_page: 1,
        page_size: null,
        complete_list: [],
        tabs: {
            active: 'jurys',
            items: []
        },
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
    async open(row) {
            const task = this.task_id;
          	try {
                let user_id = row.uuid;

                const res = await axios.get(`/clients/tasks/${task}/submits/${user_id}`, {
                    api: "revision",
                    oauth: true
                })

                let application = res.data.resource.submit;

                let name = `information-${user_id}`;

                const tab = this.tabs.items.find(tab => (tab.name === name));

                if (!tab)
                    this.tabs.items.push({
                        name,
                        title: `${row.user.firstname + ' ' + row.user.lastname}`,
                        component: 'application-render',
                        props: { application }
                    });

                this.tabs.active = name
            } catch (error) {
                console.log(error)
            }
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
        },

        removeTab(targetName) {
            const tabs = this.tabs.items;
            const activeName = this.tabs.active;

            if (activeName === targetName) 
                this.tabs.active = 'jurys';
            
            this.tabs.items = tabs.filter(tab => tab.name !== targetName);
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

 .el-drawer__header {
    margin-top: 20px;
 }
</style>

