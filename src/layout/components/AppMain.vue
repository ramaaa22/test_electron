<template>
    <section class="app-main">
        
        <transition name="fade-transform" mode="out-in">
            <router-view
                @open-tab="openTab"
				:key="key"/>
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
            active:'',
            items:[]
        }
    }),
    methods:{
        openTab(props){
            const tab = this.tabs.items.find((tab) => tab.name === props.name);
            if (!tab){
                const {name,title,component,row} = props;
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
