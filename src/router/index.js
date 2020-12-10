import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

export const routes = [
	{
		path: '/login',
		name: 'auth.login',
		component: () => import('@/views/login/index'),
		hidden: true,
		meta: {
			require_not_auth: true
		}
	},

	{
		path: '/',
		component: Layout,
		redirect: { name: 'form-builder' },
		children: [
			{
				path: '/crear-formulario',
				name: 'form-builder',
				component: () => import('@/views/form-builder/index'),
				meta: { 
					title: 'Crear Formulario', 
					icon: 'las la-folder-plus',
					require_auth: true
				}
			}
		]

		
	},

	{
		path: '',
		component: Layout,
		redirect: {name: 'revision.announcements.list'},
		children:[
			{
				path: '/convocatorias',
				name: 'revision.announcements.list',
				component: () => import('@/views/review/index'),
				meta: { 
					require_auth: true,
					title: 'Revision',
					icon: 'las la-tasks'
				},
			},
			{
				path: '/convocatorias/:uuid', 
				name: 'revision.announcements.single',
				hidden:true,
				component: () => import('@/views/review/_uuid'),
				meta: {
					require_auth: true,
					title: null 
				}
            }

		]
	},

	{
		path: '/tasks',
		component: Layout,
		children: [
			{
				path: '/tasks',
				name: 'tasks',
				component: () => import('@/views/tasks/index'),
				meta: { 
					title: 'Tareas', 
					icon: 'las la-sticky-note',
					require_auth: true
				}
			},
			{
				path: '/task/:id', 
				name: 'task-id',
				hidden:true,
				component: () => import('@/views/tasks/_id'),
				meta: {title: null, require_auth: true}
            }

		]
	},

	{
		path: '/rbac',
		name: 'rbac',
		component: Layout,
		hidden: true,
		meta: {
			title: 'RBAC',
			require_auth: true
		},
		children:[
			{
				path:'/usuarios',
				name: 'usuarios',
				component: () => import('@/views/rbac/usuarios/index'),
				meta:{
					title: 'Usuarios'
				}
			},
			{
				path:'/servicios',
				name: 'servicios',
				component: () => import('@/views/rbac/servicios/index'),
				meta:{
					title: 'Servicios'
				}
			},
			
		]
	},

	{
		path: '/profile',
		name: 'profile',
		component: Layout,
		hidden: true,
		meta: {
			require_auth: true,
			title: 'Perfil'
		},
		children:[
			{
				path:'/profile-user',
				name: 'profile-user',
				component: () => import('@/views/profile/index'),
				meta:{
					title: 'Perfil de Usuario',
				}
			},
		]
	},
	/*
	{
		path: '/preselection',
		name: 'preselection',
		component: Layout,
		children: [
			{
				path: '/preselections',
				name: 'preselections',
				component: () => import('@/views/preselection/index'),
				meta:{
					require_auth: true,
					title: 'Preselección',
				}
			},
			{
				path: '/:id', 
				name: 'preselection-id',
				hidden:true,
				component: () => import('@/views/tasks/_id'),
				meta: {title: null, require_auth: true}
            }
		]

	},*/

	
	{
		path: '/form-viewer',
		name: 'form-viewer',
		component: Layout,
		hidden:true,
		children: [
			{
				path: '/form-viewer/:id',
				name: 'form-viewer-index',
				hidden: true,
				component: () => import('@/views/form-viewer/index'),
				meta:{
					require_auth: true,

				}
			},
			
		]

	},

	{
		path: '/404',
		name: '404',
		component: () => import('@/views/404'),
		hidden: true
	},
	{ 
		path: '*', 
		component: () => import('@/views/404'),
		hidden: true 
	}
]

const createRouter = () => new Router({
	mode:'hash',
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
	routes
})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher 
}

export default router
