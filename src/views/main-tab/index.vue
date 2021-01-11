<template>
    <transition-group appear name="fade" mode="out-in">
        <el-main key="main">
            <el-row type="flex" justify="end">
                <profile-container :user="user"/>
                <el-tooltip content="Salir">
                    <el-button
                        class="ml-3"
                        size="small"
                        type="danger"
                        plain
                        circle
                        @click="logout"
                        icon="las la-sign-out-alt">
                    </el-button>
                </el-tooltip>
            </el-row>

            <el-row class="mt-6">  
                <el-col 
                    :span="8"
                    class="is-flex is-flex-center mb-6"
                    v-for="access in user.accesses" 
                    :key="`access-${access.service.slug}`">
                        <div>
                            <div class="is-flex is-flex-center">
                                <el-button  
                                    @click="open(access.service)" 
                                    type="primary" 
                                    plain 
                                    circle>
                                        <i :class='`las la-${icons[`${access.service.slug}`]} fs-11`'></i>
                                </el-button>   
                            </div>
                            <h4 class="text-center">{{access.service.name}}</h4>   
                        </div>   
                         
                </el-col>
            </el-row>
        </el-main>
    </transition-group>
</template>

<script>
import { mapGetters } from 'vuex';
import profileContainer from '@/views/main-tab/components/profile-container';

export default {
    data: () =>({
        icons: {
            tareas: 'tasks',
            revision: 'clipboard-list',
            rbac: 'users',
            servicios: 'toolbox',
            seguimiento: 'search'
        }
    }),

    computed: {
        ...mapGetters(['user'])
    },

    methods: {
        open(service){
            const props={
                name:service.slug,
                title:this.capitalize(service.slug),
                component:service.slug,
                prop:service.slug
            }
            this.$emit('open-tab',props);
        },
        
        capitalize(word){
            return word[0].toUpperCase() + word.slice(1);
        },
        
        async logout() {
            await this.$store.dispatch("user/logout");
		},
    },

    components: {
        profileContainer
    }
}
</script>

<style>
  .image{
      width: 100%;
      display: block;
  }
</style>