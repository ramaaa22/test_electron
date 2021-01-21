<template>
    <el-main>
        <div class="text-right mb-2 pt-2 pr-5 actions">
            <el-tooltip effect="dark" content="Agregar servicio" placement="top">
                <el-button
                    size="mini"
                    type="success"
                    @click="visible_dialog = true"
                    icon="las la-plus"
                    plain
                    circle>
                </el-button>
            </el-tooltip>
        </div>
        <el-row type="flex" justify="center">
            <el-col :span="16">
                <el-table
                    stripe
                    border
                    fit
                    size="mini"
                    v-loading="loading_table"
                    element-loading-text="Cargando"
                    :data="services"
                    @row-click="chooseRow"
                    cell-class-name="pointer">
                    <el-table-column
                        align="center"
                        label="Nombre"
                        prop="name">
                    </el-table-column>
                
                </el-table>
            </el-col>
        </el-row>
        

        <el-dialog
            width="30%"
            top="5vh"
            v-loading="loading"
            :title="!edit? 'Agregar servicio' : 'Editar servicio'"
            @close="closeDialog"
            :visible.sync="visible_dialog">
            <el-form>
                <el-form-item label="Nombre (Requerido)">
                    <el-input
                        size="small"
                        :required="true"
                        :disabled="edit"
                        v-model="service.name"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="URL">
                    <el-input
                        size="small"
                        v-model="service.url"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Client id">
                    <el-input
                        size="small"
                        v-model="service.client_id"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Client secret">
                    <el-input
                        size="small"
                        v-model="service.client_secret"> 
                    </el-input>
                </el-form-item>

                <el-button v-if="edit"
                    type="primary"
                    @click="editService">
                    Editar
                </el-button>

                <el-button v-else
                    type="primary"
                    :disabled="service.name==''"
                    @click="addService">
                    Agregar
                </el-button>
            </el-form>
        </el-dialog>


    </el-main>
</template>

<script>
    import axios from "@/utils/request";

    export default {
        data: () => ({
            services: [],
            title: null,
            loading:false,
            loading_table:false,
            visible_dialog:false,
            edit:false,
            service:{
                name:'',
                url:'',
                client_id:'',
                client_secret:''
            },
        }),

        mounted() {
            this.retrieveServices();
        },

        watch: {
            service: function (val) {
                if (val !== null) {
                    this.title = `Editar ${val.name}`;
                }
            },
        },

        methods: {
            async retrieveServices() {
                this.loading_table=true;
                try {
                    const { data } = await axios.get("/services", {
                        api: "users",
                        oauth: true,
                    });
                    this.services = data.resources;
                } 
                catch (error) {
                    console.log(error);
                }
                finally{
                    this.loading_table=false;
                }
            },

            async addService() {
                let { name, url, client_id, client_secret } = this.service;
                const service_data = { name, url, client_id, client_secret };
                try {
                    this.loading_dialog = true;
                    const { data } = await axios.post("/services", service_data, {
                        api: "users",
                        oauth: true,
                        });
                    this.$message({
                        offset: 40,
                        showClose: true,
                        message: "Servicio añadido",
                        type: "success",
                    });
                    this.retrieveServices();
                    this.visible_dialog = false;
                } 
                catch (error) {
                    const { response } = error;
                    if (response.status === 422) {
                        const menssage_error = response.data.error.message.name[0];
                        this.$message({
                            offset: 40,
                            showClose: true,
                            message: menssage_error,
                            type: "error",
                        });
                    }
                    else {
                        console.log(error);
                    }
                } 
                finally {
                    this.closeDialog();
                }
            },
            async chooseRow(row) {
                try {
                    const { data } = await axios.get(`/services/${row.name}`, {
                        api: "users",
                        oauth: true,
                    });
                    this.service = data.resource;
                    this.edit=true;
                    this.visible_dialog=true;
                } 
                catch (error) {
                    console.log(error);
                }
            },

            async editService() {
                try {
                    this.loading = true;
                    const { data } = await axios.put(`/services/${this.service.name}`,
                        this.service,
                    {
                        api: "users",
                        oauth: true,
                    });

                    this.retrieveServices();
                     
                    this.$message({
                        offset: 40,
                        showClose: true,
                        message: "Servicio editado",
                        type: "success",
                    });

                }
                catch (error) {
                    console.log(error);
                }
                finally{
                    this.loading=false;
                    this.visible_dialog=false;
                }
                
            },
            closeDialog(){
                this.edit=false;
                for (let prop in this.service){
                    this.service[prop]='';
                }
                
            }
        },
    };
</script>
