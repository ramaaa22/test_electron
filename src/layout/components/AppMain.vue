<template>
    <section class="app-main">
        <el-tabs
            type="border-card" 
            v-model="tabs.active"
            >
            <el-tab-pane 
                name="hola"
                label="Inscripciones"
                :closable="false">
                <indexmaintab/>
            </el-tab-pane>
        </el-tabs>
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
        tabs: {
            active: 'hola'
        }
    }),
    
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
