<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">

        <transition-group name="breadcrumb">
            <el-breadcrumb-item 
                v-for="(item,index) in level_list" 
                :key="item.path">

                    <span 
                        v-if="item.redirect==='no_redirect' || index==level_list.length-1" 
                        class="no-redirect color-white">{{ item.meta.title }} 
                    </span>

                    <a class="color-white" v-else @click.prevent="handleLink(item)">
                        {{ item.meta.title }}
                    </a>
            </el-breadcrumb-item>
        </transition-group>
    
    </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
    data: () => ({
        level_list: null
    }),

    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },

    created() {
        this.getBreadcrumb()
    },

    methods: {
        getBreadcrumb() {
            const title_route = this.$route.meta.title;
            const title_in_param = this.$route.params.title;
            const path_route = this.$route.path;
            let title = null;
            let matched = [];
            let parent = this.$route.matched[1].parent;
            let name = this.$route.matched[1].path;
            
            console.log(this.$route)
            
            if(!title_route){
                title = title_in_param;
            }else{
                title = title_route
            };

            if(parent.name && !this.$route.params.parent){
                matched.push(
                    {meta:{ title: parent.meta.title }, path: parent.path, redirect: 'no_redirect'}, 
                    { meta:{ title: title }, path: path_route}
                )
            }else if( name === '/revision/:uuid'){
                 matched.push(
                    {meta:{ title: 'Revision' }, path: '/revision'}, 
                    { meta:{ title: title }, path: path_route}
                )
            }else if( name === '/task/:id'){
                 matched.push(
                    {meta:{ title: 'Tareas' }, path: '/tasks'}, 
                    { meta:{ title: title }, path: path_route}
                )
            } else if(this.$route.params.parent && this.$route.params.parent.child){
                 matched.push(
                    {meta:{ title: this.$route.params.parent.name }, path:  this.$route.params.parent.path}, 
                    {meta:{ title:  this.$route.params.parent.child.name}, path:  this.$route.params.parent.child.path, params: {title: this.$route.params.parent.child.name, uuid: this.$route.params.parent.child.uuid},
                    isAnnouncement: true, route_name: this.$route.params.parent.child.route_name}, 
                    { meta:{ title: title }, path: path_route}
                )
            }
            else{
                matched.push({ meta:{ title: title }, path: path_route});
            }
           
            this.level_list = matched;
            
        },

    
        pathCompile(path, params) {

            let toPath = pathToRegexp.compile(path)
            return toPath(params)
        },

        handleLink(item) {
            const { redirect, path, params, isAnnouncement, route_name } = item
    
            if (redirect) {
                this.$router.push(redirect)
                return
            }else if(isAnnouncement){
                this.$router.push({
                    name: route_name,
				    params: params})
            } 
            this.$router.push(this.pathCompile(path, params ))
        }
    }
    }
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 20px;
 

  .no-redirect {
    color: #303133;
    cursor: text;
  }
}
</style>
