<template>
    <div>
        <el-row type="flex" justify="end">
            <el-col :span="4">
                <profile-container/>
            </el-col>
        </el-row>
        <el-row  type="flex" justify="space-around" class="mt-6">  
            <el-col 
                :span="4" 
                v-for="access in user.accesses" 
                :key="`access-${access.service.slug}`">
                    <el-card shadow="hover" :body-style="{ padding: '0px'}"> 
                        <div 
                            @click="open(access.service)" 
                            class="is-flex is-flex-center pointer">                  
                                <el-button
                                    type="text"
                                    class="button">
                                    <i :class='`las la-${icons[`${access.service.slug}`]}`'></i>
                                </el-button>
                                
                        </div>
                        <h4 class="text-center">{{access.service.name}}</h4>
                    </el-card>
            </el-col>
        </el-row>
    </div>

    


</template>

<script>
import { mapGetters } from 'vuex';
import profileContainer from '@/views/main-tab/components/profile-container';

export default {
    data: () =>({
        icons: {
            tareas: 'tasks fs-12',
            revision: 'clipboard-list fs-12',
            rbac: 'users fs-12'
        }
    }),

    computed: {
        ...mapGetters(['user'])
    },

    methods: {
        open(service){
            console.log(service);
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
        }
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