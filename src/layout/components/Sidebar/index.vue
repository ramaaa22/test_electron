<template>
	<div :class="{'has-logo':showLogo}">
		<logo v-if="showLogo" :collapse="isCollapse" />	

		<el-scrollbar>
		

			<el-menu
				v-if="user"
				:default-active="activeMenu"
				:collapse="isCollapse"
				:collapse-transition="false"
				mode="vertical">
			
					<el-submenu index="1">
						<template slot="title">
							<i class="las la-user-circle"></i>
							<span slot="title">
								{{this.user.firstname + ' ' + this.user.lastname}}
							</span>
						</template>

						<app-link :to="'/profile-user'">
							<el-menu-item index="1-1">
								Perfil
							</el-menu-item>
						</app-link>

						<el-menu-item 
							@click="logout" 
							index="1-2">
							Salir
							<i class="las la-sign-out-alt"></i>
						</el-menu-item>
					</el-submenu>

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
import AppLink from "./Link";


export default {
	data: ()=>({
		accesses: [],
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
				}else if (access.service.name === 'Revisión'){
					icon = 'las la-tasks';
					final_access.push({
					path: `/${access.service.slug}`,
					meta: {
						icon: icon,
						title: access.service.name
					}})
				}
				
				
			})
		
			return final_access;
		}
		
	},


  	methods: {
		changeCollapse(){
			this.$store.dispatch("app/toggleSideBar")

			console.log(this.sidebar)
		},

		async logout() {
            await this.$store.dispatch("user/logout");

		},
	},
	  
	components: { SidebarItem, Logo, AppLink},
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
