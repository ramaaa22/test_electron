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
