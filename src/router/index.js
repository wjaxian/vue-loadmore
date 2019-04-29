import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router =  new VueRouter({
	routes: [
		{ 
			path: '/', 
			component: () => import('@/pages/index') 
		},
		{ 
			path: '/mobile', 
			component: () => import('@/pages/mobile') 
		},
		{ 
			path: '/pc', 
			component: () => import('@/pages/pc')
		}
	]
})

export default router
