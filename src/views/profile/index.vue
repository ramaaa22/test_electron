<template>
    <el-main>
        <!--OPCION 1 -->
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



        <!--OPCION 2 -->

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
        </el-row>
        <el-row type="flex" justify="center" :gutter="20" class="mt-5">
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
        </el-row>
        <el-row type="flex" justify="center" :gutter="20" class="mt-5">
            <el-col :span="6">
                <h4 class="text-left">Documento</h4>
                <el-card shadow="always" class="non-selectable">
                    {{user.idnumber}}
                </el-card>
            </el-col>
        </el-row>

        <el-row type="flex" justify="center" :gutter="20" class="mt-5">
            <el-col :span="6">
                <el-button class="full-width" type="danger" plain>
                    Cambiar contraseña
                </el-button>
            </el-col>
        </el-row>
        


        <!--OPCION 3 -->

        <el-row type="flex" class="mt-5">
            <el-col type="flex" :span="6" class="mt-5">
                <div class="container" >
                    <div align="center">
                        <el-avatar
                            shape="circle"
                            :size="200"
                            :fit="contain"
                            :src="user_img">
                        </el-avatar>
                    </div>
                    <div  class="text-center">
                        <span>{{user.lastname}}, {{user.firstname}}</span>
                    </div>
                </div>
            </el-col>
            <el-col type="flex" justify="center" class="mt-5" :span=18>
                <el-row>
                    <el-col type="flex" justify="center" class="mt-5" :span=9>
                        <h4 class="text-left">Nombre</h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.firstname}}
                        </el-card>
                    </el-col>
                    <el-col type="flex" justify="center" class="mt-5" :span=9>
                        <h4 class="text-left">Apellido</h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.lastname}}
                        </el-card>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col type="flex" justify="center" class="mt-5" :span=9>
                        <h4 class="text-left">Email</h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.email}}
                        </el-card>
                    </el-col>
                    <el-col type="flex" justify="center" class="mt-5" :span=9>
                        <h4 class="text-left">Documento</h4>
                        <el-card shadow="always" class="non-selectable">
                            {{user.idnumber}}
                        </el-card>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col type="flex" justify="center" class="mt-2" :span=18>
                        <el-button class="full-width" type="danger" plain>
                            Cambiar contraseña
                        </el-button>
                    </el-col>
                </el-row>
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
            user_img:'https://scontent.faep9-1.fna.fbcdn.net/v/t1.0-9/91175839_10222737247878714_1917986438519980032_o.jpg?_nc_cat=109&ccb=2&_nc_sid=09cbfe&_nc_ohc=8gtVlg9osswAX-sDWTh&_nc_ht=scontent.faep9-1.fna&oh=ff2a841f2a4654678867eeb1e029ed34&oe=5FE47FFA',
            edit:false,
            label_position:'top'
        }
    ),
    methods:{
        showImage(){
            console.log('clic en imagen');
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
