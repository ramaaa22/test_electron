<template>
    <section class="app-main">
 
        <transition name="fade-transform" mode="out-in">
            <el-tabs               
                v-model="tabs.active">
                    <el-tab-pane name="hola">
                        <indexmaintab @open-tab="openTab"/>
                    </el-tab-pane>
            </el-tabs>
        </transition>
        
    </section>
</template>

<script>
import axios from "@/utils/request";
import indexmaintab from '@/views/main-tab/index';
import { mapGetters } from 'vuex';

export default {
    name: 'AppMain',
    
	data: () =>({	
		visible: false,
		loading_drawer: false,	
        application: [],
        tabs:{
            active:'hola',
            items:[]
        }
    }),
    methods:{
        openTab(props){
            console.log('recibo el emit');
            const tab = this.tabs.items.find((tab) => tab.name === props.name);
            const {name,title,component,row} = props;
            if (!tab){
                
                this.tabs.items.push({
                    name,
                    title,
                    component,
                    row,
                });
            }
            this.tabs.active = name;
        }
    },
    
	computed: {
        key(){return this.$route.path},
    },
    
    components:{
        indexmaintab
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
