<template>
    <transition-group appear name="fade" mode="out-in">
        <el-main key="main">
            <el-row type="flex" justify="end">
                <profile-container :user="user"/>
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
                                    circle
                                    @click="open(access.service)">
                                    <el-image
                                        style="width: 150px; height: 150px"
                                        :src="urls[`${access.service.slug}`]">
                                    </el-image>
                                </el-button>    
                                    
                               
                                <!-- <el-button  
                                    @click="open(access.service)" 
                                    type="primary" 
                                    plain 
                                    circle>
                                        <i :class='`las la-${icons[`${access.service.slug}`]} fs-11`'></i>
                                </el-button>    -->
                            </div>
                            <h4 class="text-center" @click="open(access.service)">{{access.service.name}}</h4>   
                        </div>   
                         
                </el-col>
            </el-row>
        </el-main>
    </transition-group>
</template>

<script>
import { mapGetters } from 'vuex';
import profileContainer from '@/views/main-tab/components/profile-container';
const path = require('path');
import revision from '@/assets/revision.png';
import rbac from '@/assets/rbac.png';
import servicios from '@/assets/servicios.png';
import seguimiento from '@/assets/seguimiento.png';
import formularios from '@/assets/formularios.png';




export default {
    data: () =>({
        icons: {
            tareas: 'tasks',
            revision: 'clipboard-list',
            rbac: 'users',
            servicios: 'toolbox',
            seguimiento: 'search',
            formularios: 'poll-h'
        },
        urls:{
            revision,
            rbac,
            servicios,
            seguimiento,
            formularios
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