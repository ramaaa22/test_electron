<template>
    <div>
        <div class="text-right">
           
            <el-tooltip
                effect="dark"
                content="Agregar usuario"
                placement="top">
                <el-button
                    size="mini"
                    type="success"
                    @click="user_dialog_visible = true"
                    icon="las la-user-plus"
                    plain
                    circle>
                </el-button>
            </el-tooltip>
            

            <el-tooltip
                effect="dark"
                content="Eliminar usuario usuario"
                placement="top">
                <el-button
                    disabled
                    size="mini"
                    type="warning"
                    icon="las la-user-slash"
                    plain
                    circle>
                </el-button>
            </el-tooltip>
        </div>

        <el-row type="flex" justify="end">
            <el-col class="mb-4 mt-2" :span="6">
                <el-input
                    clearable
                    prefix-icon="las la-search"
                    v-model="search"
                    size="mini"
                    placeholder="Buscar por documento">
                    
                </el-input>
            </el-col>
        </el-row>

        <el-table
            border
            fit
            size="mini"
            :stripe=true
            :data="users.filter(data => !search || data.idnumber.includes(search))"
            @row-click="open"
            v-loading="loading"
            cell-class-name="pointer">
            <el-table-column
                sortable
                align="center"
                label="Nombre"
                prop="firstname">
            </el-table-column>

            <el-table-column
                sortable
                align="center"
                label="Apellido"
                prop="lastname">
            </el-table-column>

            <el-table-column
                sortable
                align="center"
                label="Documento"
                prop="idnumber">
            </el-table-column>

            <el-table-column
                sortable
                align="center"
                label="Email"
                prop="email">
            </el-table-column>

            
         </el-table>

        <el-dialog
            top="5vh"
            :loading="loading_dialog"
            title="Agregar usuario"
            :visible.sync="user_dialog_visible">
            <el-form
                v-model="new_user"
                @submit.native.prevent="addUser">
                <el-form-item
                    label="Nombre">
                    <el-input
                        size="small"
                        v-model="new_user.firstname"
                        :required="true"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Apellido">
                    <el-input
                        size="small"
                        v-model="new_user.lastname"
                        :required="true">
                    </el-input>
                </el-form-item>

                <el-form-item 
                    label="Documento">
                    <el-input 
                        size="small"
                        type="number"
                        v-model="new_user.idnumber"
                        :required="true">
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Email">
                    <el-input
                        size="small"
                        v-model="new_user.email"
                        :required="true"> 
                    </el-input>
                </el-form-item>

                <el-button
                    type="primary"
                    native-type="submit">
                    Agregar 
                </el-button>
            </el-form>
        </el-dialog>

        


    </div>
</template>

<script>
import axios from "@/utils/request";

export default {
    data: () => ({
        loading: false,
        loading_dialog: false,
        user_index: {},
        user_dialog_visible: false,
        new_user:{
            firstname:'',
            lastname:'',
            idnumber:'',
            email:''
        },
        search:''
    }),
    props: { users: Array },
    methods: {
        open(row) {
            this.$emit("open-user", row);
        },

        async addUser() {
            try {
                this.loading = true;
                let form = new FormData();
                
                for (let item in this.new_user){
                    form.append(item, this.new_user[item]);
                }
                const { data } = await axios.post("/users", form, {
                    api: "users",
                    oauth: true,
                });

                this.$message({
                    offset: 40,
                    showClose: true,
                    message: "Usuario añadido",
                    type: "success",
                });

                for (let prop in this.new_user){
                    this.new_user[prop]=''
                }

                this.user_dialog_visible = false;
            } 
            catch (error) {
                const { response } = error;

                if (response.status === 422) {
                    for (let messages in response.data.error.message) {
                        let menssage_error = response.data.error.message[`${messages}`][0];
                        
                        setTimeout(() => {
                            this.$message({
                                offset: 40,
                                showClose: true,
                                message: menssage_error,
                                type: "error",
                            });
                        }, 300);
                    }
                }
                else {
                    console.log(error);
                }

            } 
            finally {
                this.loading = false;
                this.$emit("actualize-users");
            }
        
        },
    },
};
</script>

<style scoped>

    .el-form-item {
        margin-bottom: 15px;
    }

    .el-form-item__content {
        line-height: 10px;
    }
</style>