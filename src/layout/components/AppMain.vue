<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <router-view
				:key="key"/>
        </transition>
    </section>
</template>

<script>
import axios from "@/utils/request";

export default {
    name: 'AppMain',
    
	data: () =>({	
		visible: false,
		loading_drawer: false,	
		application: []
    }),
    
	computed: {
		key(){return this.$route.path}
    },
    
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
