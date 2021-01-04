<template>
    <el-main class="mt-8">
      
        <el-row type="flex" justify="center" class="mt-6">
            <el-col :span="6" >
                <el-avatar
                    shape="circle"
                    :size="150"
                    :fit="contain"
                    :src="user_img">
                </el-avatar>
            </el-col>

            <el-col :span="16">

                <el-row :gutter="20" >
                    <el-col class="mb-4" :span="12">
                        <h4 class="text-left">
                            Nombre
                        </h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.firstname}}
                        </el-card>
                    </el-col>

                    <el-col class="mb-4" :span="12">
                        <h4 class="text-left">
                            Apellido
                        </h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.lastname}}
                        </el-card>
                    </el-col>
              
                    <el-col :span="12">
                        <h4 class="text-left">
                            Email
                        </h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.email}}
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <h4 class="text-left">
                            Documento
                        </h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.idnumber}}
                        </el-card>
                    </el-col>
                </el-row>
              
                <el-button class="full-width mt-3" type="danger" plain>
                    Cambiar contraseña
                </el-button>
            
            </el-col>
        </el-row>

    </el-main>
</template>

<script>

import axios from "@/utils/request";

export default {
    data:()=>(
        {
            user:{
                firstname:'',
                lastname:'',
                idnumber:'',
                email:'',
                uuid:'',
            },
            user_img:'https://scontent.faep9-1.fna.fbcdn.net/v/t1.0-9/91175839_10222737247878714_1917986438519980032_o.jpg?_nc_cat=109&ccb=2&_nc_sid=09cbfe&_nc_ohc=8gtVlg9osswAX-sDWTh&_nc_ht=scontent.faep9-1.fna&oh=ff2a841f2a4654678867eeb1e029ed34&oe=5FE47FFA',
            edit:false,
            label_position:'top'
        }
    ),

    mounted(){
        let { firstname, lastname, idnumber, email, uuid } = this.$store.getters.user;
        this.user = { firstname, lastname, idnumber, email, uuid };
    },

}
</script>

<style>
    .non-selectable {
        -moz-user-select: none; 
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none; 
}
</style>
