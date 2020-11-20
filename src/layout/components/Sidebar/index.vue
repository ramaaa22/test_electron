<template>
	<div :class="{'has-logo':showLogo}">
		<logo v-if="showLogo" :collapse="isCollapse" />	
		
		<el-collapse class="in" accordion v-model="user_collapse">
			<el-collapse-item :disabled="isCollapse" name="1">
				<template slot="title">
					<i class="las la-user-circle ml-4"></i>
      				<span v-show="!isCollapse">
						  {{user.firstname + ' ' + user.lastname}}
					</span>
					<i 	v-show="!isCollapse" 
						class="header-icon el-icon-information">
					</i>
    			</template>

				<div class="info-user-sidebar non-selectable">
				
					<!-- <strong>
						Email
					</strong>
					<br>
					<span class="ml-5">
						{{user.email}}
					</span> -->
					<el-tooltip 
                    	content="Editar"
                    	placement="top">
                    	<el-button
                        	type="primary"
                        	plain
                        	circle
                        	size="mini"
							@click.native="test"
                    	>
                        	<i class="las la-edit"></i>
                    	</el-button>
                	</el-tooltip>

					<el-tooltip 
                    	content="Cerrar Sesión"
                    	placement="top">
                    	<el-button
                        	type="primary"
                        	plain
                        	circle
                        	size="mini"
							@click.native="logout"
                    	>
                        	<i class="las la-sign-out-alt"></i>
                    	</el-button>
                	</el-tooltip>

				</div>
				
				<!-- <div class="mt-4 info-user-sidebar non-selectable">
					
					<strong>
						Documento
					</strong>
					<br>
					<span class="ml-5">
						{{user.idnumber}}
					</span>
				</div> -->
				
  			</el-collapse-item>
		</el-collapse>
		
		<el-scrollbar>

			<el-menu
				v-if="user"
				:default-active="activeMenu"
				:collapse="isCollapse"
				:collapse-transition="false"
				mode="vertical">
				
					<sidebar-item  
						v-for="route in routes" 
						:key="route.path" 
						:item="route" 
						:base-path="route.path"/>
					
					<sidebar-item  
						v-for="(access, index) in accesses_route" 
						:key="`${access.path}-${index}`" 
						:item="access" 
						:base-path="access.path"/>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/_variables.scss';
import userContainer from './userContainer';

export default {
	data: ()=>({
		accesses: [],
		user_collapse: null
	}),

	computed: {
		...mapGetters([ 'sidebar', 'user' ]),

		routes() {
			return this.$router.options.routes;
		},

		activeMenu() {
			const route = this.$route;
			const { meta, path } = route;
			// if set path, the sidebar will highlight the path you set
			if (meta.activeMenu) {
				return meta.activeMenu;
			}
			return path;
		},

		showLogo() {
			return this.$store.state.settings.sidebarLogo;
		},

		variables() {
			return variables;
		},

		isCollapse() {
			return !this.sidebar.opened;
		},
		accesses_route(){
			let access_config = this.user.accesses
			let final_access = [];

			access_config.map( access =>{
				let icon = '';

				if (access.service.name === 'RBAC'){
					icon = 'las la-users-cog';
					final_access.push({
					path: `/${access.service.slug}`,
					meta: {
						icon: icon,
						title: access.service.name
					},
					children:[
						{
							path:'/usuarios',
							name: 'usuarios',
							meta: {
								icon: 'las la-users',
								title: 'Usuarios'
							},
						},
						{
							path:'/servicios',
							name: 'servicios',
							meta: {
								icon: 'las la-toolbox',
								title: 'Servicios'
							},
						},
					]
				})
				}else{
					null
				}
				
				
			})
		
			return final_access;
		}
		
	},

	watch: {
		isCollapse: function (val) {
			if(val === true){
				this.user_collapse = null
			}
    	},

	},

  	methods: {
		changeCollapse(){
			this.$store.dispatch("app/toggleSideBar")

			console.log(this.sidebar)
		},

		async logout() {
            await this.$store.dispatch("user/logout");
            this.$router.push(`/login`);
		},
		
		test(){
			//this.$message('Se ha hecho clic aqui');
			this.$router.push(`/profile`)
		}
	},
	  
	components: { SidebarItem, Logo, userContainer},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/_variables.scss";
@import "~@/styles/_functions.scss";

.info-user-sidebar{
	//border-left: 5px solid #0B71B8;
	//border-right: 5px solid #0B71B8;
	align-content: center;
	display: flex;
  	align-items: center;
  	justify-content: center;
	
}

.non-selectable {
   -moz-user-select: none; 
   -webkit-user-select: none;
   -ms-user-select: none;
   user-select: none; 
}

</style>
