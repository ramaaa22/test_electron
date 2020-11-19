<template>
    
    

    <el-card 
        v-loading="loading"
        shadow="never"
        class="info-container mb-2">
        <div>
            <h4>
                Datos del usuario
                <el-tooltip 
                    v-if="!edit"
                    content="Editar"
                    placement="top">
                    <el-button
                        type="primary"
                        plain
                        circle
                        size="mini"
                        @click="edit = !edit"
                    >
                        <i class="las la-edit"></i>
                    </el-button>
                </el-tooltip>
                <el-tooltip 
                    v-else content="Guardar cambios"
                    placement="top">
                    <el-button
                        type="success"
                        plain
                        circle
                        size="mini"
                        @click="editUserInformation">
                        <i class="las la-check"></i>
                    </el-button>
                </el-tooltip>
                <el-tooltip 
                    v-if="!edit"
                    content="Reiniciar contraseña" 
                    placement="top">
                    <el-button
                        type="warning"
                        plain
                        circle
                        size="mini"
                        @click="edit = !edit"
                    >
                        <i class="las la-sync"></i>
                    </el-button>
                </el-tooltip>
                <el-tooltip 
                    v-else content="Cancelar"
                    placement="top">
                    <el-button
                        type="danger"
                        plain
                        circle
                        size="mini"
                        @click="cancelEdit"
                    >
                        <i class="las la-window-close"></i>
                    </el-button>
                </el-tooltip>
            </h4>

            <el-divider></el-divider>
        </div>

        

        


        <div>
            <h6>Nombre</h6>
            <el-input
                size="small"
                v-model="user.firstname"
                v-if="edit"> 
            </el-input>
            <span
                v-else
                v-text="row.firstname">
            </span>
            <el-divider></el-divider>
        </div>
        <div>
            <h6>Apellido</h6>
            <el-input
                size="small"
                v-model="user.lastname"
                v-if="edit">
            </el-input>
            <span
                v-else
                v-text="row.lastname">
            </span>
            <el-divider></el-divider>
        </div>
        <div>
            <h6>Documento</h6>
            <el-input 
                size="small"
                v-model="user.idnumber"
                v-if="edit"> 
            </el-input>
            <span
                v-else
                v-text="row.idnumber">
            </span>
            <el-divider></el-divider>
        </div>
        <div>
            <h6>Email</h6>
            <el-input
                size="small"
                v-model="user.email"
                v-if="edit"> 
            </el-input>
            <span
                v-else
                v-text="row.email">
            </span>
        </div>
    </el-card>
</template>

<script>
    import axios from "@/utils/request";

    export default {
        data: () => ({
            loading: false,
            edit: false,
            user:{
                firstname:'',
                lastname:'',
                idnumber:'',
                email:''
            },

            user_data: {},
        }),

        mounted() {
            let { firstname, lastname, idnumber, email } = this.row;
            this.user = { firstname, lastname, idnumber, email };
        
        },

        props: {
            row: Object,
        },
        
        methods: {
            userEdited(){
                if (this.user.idnumber !== this.row.idnumber) {
                    this.user_data["idnumber"] = this.user.idnumber;
                } 
                else {
                    delete this.user_data["idnumber"];
                }
                if (this.user.email !== this.row.email) {
                    this.user_data["email"] = this.user.email;
                } 
                else{
                    delete this.user_data["email"];
                }
                this.user_data["firstname"] = this.user.firstname;
                this.user_data["lastname"] = this.user.lastname;
            },
            cancelEdit() {
                this.edit = false;
                let { firstname, lastname, idnumber, email } = this.row;
                this.user = { firstname, lastname, idnumber, email };
            },
            
            async editUserInformation() {
                this.loading = true;
                this.userEdited();

                try {
                    const { data } = await axios.put(`/users/${this.row.uuid}`, this.user_data, {
                        api: "users",
                        oauth: true,
                    });

                    this.$emit("actualize-user-edit", this.row.uuid);
                } 
                catch (error) {
                    console.log(error);
                } 
                finally {
                    this.loading = false;
                    this.edit = false;
                }
            },
        },
    };
</script>

<style scoped>
    .el-divider--horizontal {
        margin: 10px 0;
    }

    .info-container {
        background: #f5f7fa;
        border: 1px solid #ebeef5;
        color: #303133;
    }
</style>
