<template>
    <div>
        <el-row type="flex" justify="center" class="mt-6">
            <el-col :span="6" v-for="access in user.accesses" :key="`access-${access.service.slug}`">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3_-4JiiNDczxYLobIOM9_oAn2S4z5w-cU_Q&usqp=CAU" class="image">
                    <div style="padding: 14px;">
                        <span>{{access.service.slug}}</span>
                        <div class="bottom clearfix">
                        <el-button  
                            @click="open(access.service)"
                            type="text"
                            class="button">Abrir servicio</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>

    


</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['user'])
    },
    methods:{
        open(service){
            console.log(service);
            const props={
                name:service.slug,
                title:this.capitalize(service.slug),
                component:service.slug,
                row:service.slug
            }
            this.$emit('open-tab',props);
        },
        capitalize(word){
            return word[0].toUpperCase() + word.slice(1);
        }
    }
}
</script>

<style>
  .image{
      width: 100%;
      display: block;
  }
</style>