<template>
    <el-main>
        <!-- <el-row type="flex" justify="center">
            <el-col class="is-flex is-flex-center text-center">
                <i class="las la-user-circle fs-12"></i>
            </el-col>
        </el-row> -->
        <el-row type="flex" justify="center" class="mt-5">
            <el-col :span="6">
                <div class="container" >
                    <div align="center">
                        <el-avatar
                            shape="circle"
                            :size="100"
                            :fit="contain"
                            :src="user_img">
                        </el-avatar>
                    </div>
                    <div  class="text-center">
                        <span>{{user.lastname}}, {{user.firstname}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-row type="flex" justify="center" :gutter="20" class="mt-5">
            <el-col :span="6">
                <h4 class="text-left">Nombre</h4>
                <el-card shadow="always" class="non-selectable">
                    {{user.firstname}}
                </el-card>
            </el-col>

            <el-col :span="6">
                <h4 class="text-left">Apellido</h4>
                <el-card shadow="always" class="non-selectable">
                    {{user.lastname}}
                </el-card>
            </el-col>
        </el-row>

        <el-row type="flex" justify="center" :gutter="20" class="mt-5">
            <el-col :span="6">
                <h4 class="text-left">Email</h4>
                <el-card shadow="always" class="non-selectable">
                    {{user.email}}
                </el-card>
            </el-col>

            <el-col :span="6">
                <h4 class="text-left">Documento</h4>
                <el-card shadow="always" class="non-selectable">
                    {{user.idnumber}}
                </el-card>
            </el-col>

        </el-row>

        <el-row type="flex" justify="center" :gutter="20" class="mt-5">
            <el-col :span="12">
                <el-button class="full-width" type="danger" plain>
                    Cambiar contraseña
                </el-button>
            </el-col>
        </el-row>
        <!-- <div class="text-right mb-2 pt-2 pr-5 actions">
            <el-tooltip
                effect="dark"
                content="Editar"
                v-if="!edit"
                placement="top">
                <el-button
                    size="mini"
                    type="success"
                    @click="edit = !edit"
                    icon="las la-edit"
                    plain
                    circle>
                </el-button>
            </el-tooltip>

            <el-tooltip
                v-else
                effect="dark"
                content="Guardar cambios"
                placement="top">
                <el-button
                    size="mini"
                    type="success"
                    @click="editUserInformation"
                    icon="las la-save"
                    plain
                    circle>
                </el-button>
            </el-tooltip>

            <el-tooltip
                v-if="edit"
                effect="dark"
                content="Cancelar"
                placement="top">
                <el-button
                    size="mini"
                    type="danger"
                    @click.native="edit=!edit"
                    icon="las la-window-close"
                    plain
                    circle>
                </el-button>
            </el-tooltip>

        </div> -->




        <!-- <el-form :label-position="label_position" label-width="100px">
            <el-form-item label="Nombre">
                <el-input
                    :disabled=!edit
                    v-model="user.firstname">
                </el-input>
            </el-form-item>
            <el-form-item label="Apellido">
                <el-input
                    v-model="user.lastname"
                    :disabled=!edit>
                </el-input>
            </el-form-item>
            <el-form-item label="E-mail">
                <el-input
                    v-model="user.email"
                    :disabled=!edit></el-input>
            </el-form-item>
            <el-form-item label="Documento">
                <el-input
                    v-model="user.idnumber"
                    :disabled=!edit>
                </el-input>
            </el-form-item>
        </el-form> -->
    </el-main>
</template>

<script>

import axios from "@/utils/request";

export default {
    mounted(){

        let { firstname, lastname, idnumber, email,uuid } = this.$store.getters.user;
        this.user = { firstname, lastname, idnumber, email,uuid };
        this.user_edited = { firstname, lastname, idnumber, email,uuid };
        //this.user= this.$store.getters.user
        //console.log(name);
    },
    data:()=>(
        {
            user:{
                firstname:'',
                lastname:'',
                idnumber:'',
                email:'',
                uuid:'',
            },
            user_edited:{
                firstname:'',
                lastname:'',
                idnumber:'',
                email:'',
                uuid:'',
            },
            user_data:{},
            user_img:'https://voxpopulii.in/system/static/dashboard/img/default_user.png',
            edit:false,
            label_position:'top'
        }
    ),
    methods:{
        test(){
            this.$message('Clic aca')
        },
        userEdited(){
            if (this.user.idnumber !== this.user_edited.idnumber) {
                this.user_data["idnumber"] = this.user.idnumber;
            } 
            else {
                delete this.user_data["idnumber"];
            }
            if (this.user.email !== this.user_edited.email) {
                this.user_data["email"] = this.user.email;
            } 
            else{
                delete this.user_data["email"];
            }
            this.user_data["firstname"] = this.user.firstname;
            this.user_data["lastname"] = this.user.lastname;
        },

        async editUserInformation() {
            //this.loading = true;
            this.userEdited();
            try {
                const { data } = await axios.put(`/users/${this.user.uuid}`, this.user_data, {
                    api: "users",
                    oauth: true,
                });

                this.$emit("actualize-user-edit", this.user.uuid);
            } 
            catch (error) {
                console.log(error);
            } 
            finally {
                //this.loading = false;
                console.log('entro aca');
                let {firstname,lastname,email,idnumber,uuid}= this.user
                this.user_edited={firstname,lastname,email,idnumber,uuid};
                this.edit = false;
            }
        }
    },
    computed:{
        
    }
    
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
