<template>
    <div>
        <el-row
            type="flex"
            justify="center">

            <el-col class="mt-2" :span="6">
                <user-information 
                    @actualize="emit"
                    :row="row" />
            </el-col>


            <el-col
                class="mt-2 px-3"
                :span="18">

                <el-dropdown>
                    <el-button type="primary" plain size="small">
                        Añadir servicios
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item 
                            v-for="(service, index) in services_availables"
                            :key="`service-${index}`"
                            @click.native="addNewAccess(service)">
                            {{service.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <el-table
                    v-loading="loading"
                    :data="accesses"
                    border
                    fit
                    size="mini">
                    
                    
                    <el-table-column
                        label="Permisos"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span><h6>{{scope.row.service.name}}</h6></span>
                        

                              <el-select  v-model="scope.row.scopes_choose" multiple placeholder="Select">
                                <el-option
                                        v-for="(elem, index) in scope.row.scopes"
                                        :key="index"
                                        :value="elem"
                                        @change="h(scope.row.scope_choose)">
                                </el-option>
                                </el-select>

                
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from "@/utils/request";
    import UserInformation from "./UserInformation";

    export default {
        data: () => ({
            loading: false,
            dialog_visible: false,
            choose_service: null,
            choose_url: null,
            not_url: false,
            services_availables:[],
            accesses_availables:[],
            services:[],
            accesses:[],
            value1: []
        }),

        props: {
            row: Object,
        },

        async mounted() {
            this.loading = true;
            await this.retrieveServices();
            await this.retrieveAccesses();
            await this.actualizeServicesAvailables();
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

            async retrieveAccesses() {   
                this.loading = true;
                try {
                    const response = await axios.get(`/users/${this.row.uuid}`, {
                        api: "users",
                        oauth: true,
                    });

                    this.accesses = response.data.resource.accesses;
                    this.accesses.map( access => {
                        access.scopes = this.splitAccesses(access.scopes);
                        access.scopes_choose = access.scopes;
                    })

                } catch (error) {
                    console.log(error)
                }
                finally{
                    this.loading = false;
                }
            },
            
            async addNewAccess(service) {
                try{
                    // obtenemos los datos del servicio
                    const { data } = await axios.get(`/services/${service.name}`, {
                        api: "users",
                        oauth: true,
                    });
                    
                    if(data.resource.url !== null){
                        console.log('falta el endpoint')
                        // pendiente endpoint de obtener los scopes de los servicios con url
                       /* if(scope > 1){
                            service.not_saved = true;
                            this.accesses.push(service)
                            this.actualizeServicesAvailables;
                        }else{
                            await sendAccess(service, scope)
                        }*/

                    }else{
                        await sendAccess(service, null);
                    }

                }catch(error){
                    console.log(error)
                }            
            },

            async sendAccess(service, scope){
                try {
                    const { data } = await axios.post(`/users/${this.row.uuid}/accesses`,{service_slug: service.slug, scopes: scope}, {
                        api: "users",
                        oauth: true,
                    }); 
                }
                catch (error) {
                   console.log(error)
                }
                finally{
                    await this.retrieveAccesses;
                    this.actualizeServicesAvailables;
                }
            },
            
            splitAccesses(accesses) {
                let accesess_array = accesses.split(",");
                return accesess_array;
            },

            emit(uuid) {
                this.$emit("actualize-user-edit", uuid);
            },

            actualizeServicesAvailables() {
                let arr_accesses = this.accesses.map(access => access.service.name);
                let new_array = this.services.filter(service => arr_accesses.indexOf(service.name)==-1);
 
                this.services_availables = new_array;
            },

            h(scope){
                console.log(scope)
            },
           
        },
        components: { UserInformation },
    };
</script>
<style  scoped>
.select-header{
    width: 20%
}
</style>
