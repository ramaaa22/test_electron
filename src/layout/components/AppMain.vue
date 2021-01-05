<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <el-tabs               
                v-model="tabs.active"
                type="border-card"
                @tab-remove="removeTab">
                    <el-tab-pane name="principal" label="Principal">
                        <indexmaintab @open-tab="openTab"/>
                    </el-tab-pane>

                    <el-tab-pane
                        v-for="item in tabs.items"
                        :key="`tab-${item.name}`"
                        :label="item.title"
                        :name="item.name"
                        :closable="true">
                            <component 
                                :is="item.component"
                                v-bind="item.props"
                                :name="item.name"
                                @open-tab="openTab"
                                />
                    </el-tab-pane>
            </el-tabs>
        </transition>
        
    </section>
</template>

<script>
import axios from "@/utils/request";
import indexmaintab from '@/views/main-tab/index';
import revision from '@/views/review/index';
import rbac from '@/views/rbac/usuarios/index';
import user_permissions from '@/views/rbac/usuarios/components/UserPermissions';
import reviewsingle from '@/views/review/_uuid';
import evaluation_table from '@/views/form-viewer/components/EvaluationTable';
import tasks_table from '@/views/form-viewer/components/TasksTable';
import form_viewer from '@/views/form-viewer/index';
import tareas from '@/views/tasks/index';
import { mapGetters } from 'vuex';



export default {
    name: 'AppMain',
    
	data: () =>({	
		visible: false,
		loading_drawer: false,	
        application: [],
        tabs:{
            active:'principal',
            items:[]
        }
    }),
    methods:{
        openTab(props){
            const tab = this.tabs.items.find((tab) => tab.name === props.name);
            const { name, title, component, prop} = props;
            if (!tab){
                this.tabs.items.push({
                    name: name,
                    title: title,
                    component: component,
                    props: {prop},
                });
            }
            this.tabs.active = name;
        },

        removeTab(target_name) {
            let tabs = this.tabs.items;
            const active_name = this.tabs.active;
            let tabs_names = tabs.map(tab=>tab.name);
            console.log(tabs_names);
            if (active_name === target_name){
                let pos =tabs_names.indexOf(target_name)-1;
                if (pos>-1) this.tabs.active = tabs[pos].name; 
                else this.tabs.active = 'principal'; 
            }
            this.tabs.items = tabs.filter((tab) => tab.name !== target_name);
        },
    },
    
    components:{
        indexmaintab,
        revision,
        reviewsingle,
        rbac,
        user_permissions,
        evaluation_table,
        tasks_table,
        form_viewer,
        tareas
    }
}
</script>


<style scoped lang="scss">
.app-main {
    /*50 = navbar  */
    background: white;
    width: 100%;
    position: relative;
    overflow: auto;
    height: 100%;
}
.fixed-header + .app-main {
    padding-top: 50px;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
