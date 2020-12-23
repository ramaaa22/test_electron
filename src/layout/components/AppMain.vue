<template>
    <section class="app-main">
 
        <transition name="fade-transform" mode="out-in">
            <el-tabs               
                v-model="tabs.active"
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
//import rbac from '@/views/rbac/servicios/index';
import user_permissions from '@/views/rbac/usuarios/components/UserPermissions';
import reviewsingle from '@/views/review/_uuid';
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
                    props:  {prop},
                });
            }
            this.tabs.active = name;
        },
        removeTab(target_name) {
            const tabs = this.tabs.items;
            const active_name = this.tabs.active;
            if (active_name === target_name) this.tabs.active = "principal";
            this.tabs.items = tabs.filter((tab) => tab.name !== target_name);
        },
    },
    
	computed: {
        key(){return this.$route.path},
    },
    
    components:{
        indexmaintab,
        revision,
        reviewsingle,
        rbac,
        user_permissions
    }
}
</script>


<style scoped lang="scss">
.app-main {
    /*50 = navbar  */
    background: white;
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
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
