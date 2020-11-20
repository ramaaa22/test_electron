<template>
    <el-main>

        <div class="text-right mb-2 pt-2 pr-5 actions">
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

        </div>




        <el-form :label-position="label_position" label-width="100px">
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
        </el-form>
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
            edit:false,
            label_position:'top'
        }
    ),
    methods:{

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