<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <router-view
                :visible="visible"
				:loading_drawer="loading_drawer"
				@open="drawerOpen" 
				@close="drawerClose"
				@row="redirect" 
				:key="key"
				:application="application"/>
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
    
   
	methods: {
		async redirect(row){
				this.$router.push({ name: 'task-id' , params: { id: row.uuid, task: row, title: row.name}})
		},

		async	drawerOpen(row, task){
				this.visible = true;
				this.loading_drawer = true;

				try {
					const user_id = row.uuid;

					const res = await axios.get(`/clients/tasks/${task}/submits/${user_id}`, {
                        api: "revision",
                        oauth: true
				    })

					this.application = res.data.resource.submit;
				} catch (error) {
					console.log(error)
				}
				finally{
					this.loading_drawer = false;
				}
		},

		drawerClose(){
			this.visible = false
			this.application = []
		}
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
