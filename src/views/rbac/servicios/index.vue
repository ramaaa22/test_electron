<template>
    <el-main>
        <div class="text-right mb-2 pt-2 pr-5 actions">
            <el-tooltip effect="dark" content="Agregar servicio" placement="top">
                <el-button
                    size="mini"
                    type="success"
                    @click="services_dialog_visible = true"
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
            v-loading="loading_dialog"
            title="Agregar servicio"
            :visible.sync="services_dialog_visible">
            <el-form
                @submit.native.prevent="addService">
                <el-form-item label="Nombre (Requerido)">
                    <el-input
                        size="small"
                        :required="true"
                        v-model="new_service.name"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="URL">
                    <el-input
                        size="small"
                        v-model="new_service.url"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Client id">
                    <el-input
                        size="small"
                        v-model="new_service.client_id"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Client secret">
                    <el-input
                        size="small"
                        v-model="new_service.client_secret"> 
                    </el-input>
                </el-form-item>

                <el-button
                    type="primary"
                    native-type="submit">
                    Agregar
                </el-button>
            </el-form>
        </el-dialog>

        <el-dialog
            top="5vh"
            :title="title"
            width="30%"
            :visible.sync="edit_services_visible">
            <el-form>
                <el-form-item
                    label="URL">
                    <el-input
                        size="small"
                        v-model="edit_service.url" > 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Client ID">
                    <el-input
                        size="small"
                        v-model="edit_service.client_id"> 
                    </el-input>
                </el-form-item>

                <el-form-item
                    label="Client secret">
                        <el-input
                            size="small"
                            v-model="edit_service.client_secret"> 
                        </el-input>
                </el-form-item>

                <el-button
                    type="info"
                    plain 
                    @click="editService"
                    v-loading="loading_dialog"> Editar 
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
            service: null,
            services_dialog_visible: false,
            edit_services_visible: false,
            loading_dialog: false,
            new_service:{
                name:null,
                url:null,
                client_id:null,
                client_secret:null
            },
            edit_service:{
                url:null,
                client_id:null,
                client_secret:null
            },
            title: null,
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
            },

            async addService() {
                let { name, url, client_id, client_secret } = this.new_service;
                const service_data ={ name, url, client_id, client_secret }
               

                try {
                    this.loading_dialog = true;
                    const { data } = await axios.post("/services", service_data, {
                        api: "users",
                        oauth: true,
                        });
                    this.$message({
                        offset: 80,
                        showClose: true,
                        message: "Servicio añadido",
                        type: "success",
                    });
                    this.retrieveServices();
                    this.services_dialog_visible = false;
                } 
                catch (error) {
                    const { response } = error;
                    if (response.status === 422) {
                        const menssage_error = response.data.error.message.name[0];
                        this.$message({
                            offset: 80,
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
                    this.loading_dialog = false;
                    for (let prop in this.new_service){
                        this.service[prop]=null
                    }
                }
            },
            async chooseRow(row) {
                try {
                    const { data } = await axios.get(`/services/${row.name}`, {
                        api: "users",
                        oauth: true,
                    });
                    this.service = data.resource;
                    let {url,client_id,client_secret} = this.service;
                    this.edit_service = {url,client_id,client_secret}
                    this.edit_services_visible = true;
                } 
                catch (error) {
                    console.log(error);
                }
            },

            async editService() {
                try {
                    this.loading_dialog = true;
                    const { data } = await axios.put(
                        `/services/${this.service.name}`,
                        this.edit_service,
                    {
                        api: "users",
                        oauth: true,
                    }
                    );

                    this.retrieveServices();
                     
                    this.$message({
                        offset: 80,
                        showClose: true,
                        message: "Servicio editado",
                        type: "success",
                    });

                    this.edit_services_visible = false;
                }
                catch (error) {
                    console.log(error);
                }
                finally{
                    this.loading_dialog=false;
                }
                
            },
        },
    };
</script>
