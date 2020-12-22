<template>
    <div>
        <el-row
            type="flex"
            justify="center">
                <el-col class="mt-2" :span="6">
                    <user-information 
                        @actualize="emit"
                        :row="row"/>
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
                                align="center">
                                    <template slot-scope="scope">
                                        <span><h6>{{scope.row.service.name}}</h6></span>

                                        <el-select  
                                            @change="modifyAccess(scope.row, scope.row.uuid)" 
                                            v-model="scope.row.scopes_choose" 
                                            multiple 
                                            placeholder="Select">
                                                <el-option
                                                    v-for="(elem, index) in scope.row.scopes"
                                                    :key="index"
                                                    :value="elem">
                                                    {{elem}}
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
            services_availables:[],
            accesses_availables:[],
            services:[],
            accesses:[],
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

                    const res = response.data.resource.accesses;

                    for(let access of res) {
                        access.scopes_choose = this.splitAccesses(access.scopes);

                        const { data } = await axios.get(`/services/${access.service.name}`, {
                            api: "users",
                            oauth: true,
                        });
                    
                        if(data.resource.url !== null){
                            const url = await axios.get(`${data.resource.url}/oauth/scopes`);
                            let scopes = [];

                            for(let scope of url.data){
                                scopes.push(scope.description)
                            }
                            access.scopes = scopes;
                        }else{
                            access.scopes = this.splitAccesses(access.scopes);
                        }
                    }

                    this.accesses = res;

                } catch (error) {
                    console.log(error)
                }
                finally{
                    this.loading = false;
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
                
            },
            
            async addNewAccess(service) {
                try{
                    const { data } = await axios.get(`/services/${service.name}`, {
                        api: "users",
                        oauth: true,
                    });
                    
                    if(data.resource.url !== null){
 
                        const res = await axios.get(`${data.resource.url}/oauth/scopes`);

                        let scopes = []
                        for(let scope of res.data){
                           scopes.push(scope.description)
                        }
                    
                        if(scopes.length > 1){
                            this.accesses.push({
                                service:{
                                    name: service.name,
                                },
                                slug: service.slug,
                                scopes: scopes,
                                not_saved : true
                            })
                            this.actualizeServicesAvailables;
                        }else{
                           await this.sendAccess(service, scopes)
                        }
                    }else{
                        await this.sendAccess(service, null);
                        await this.retrieveAccesses();
                    }

                }catch(error){
                    console.log(error)
                }
                finally{
                    this.actualizeServicesAvailables();
                }
            },
         
            splitAccesses(accesses) {
                let accesess_array = accesses.split(",");
                return accesess_array;
            },

            actualizeServicesAvailables() {
                let arr_accesses = this.accesses.map(access => access.service.name);
                let new_array = this.services.filter(service => arr_accesses.indexOf(service.name)==-1);
                this.services_availables = new_array;
            },

            async modifyAccess(row){
                let scope = row.scopes_choose;
                let uuid = row.uuid;
                let waiting_for_save = row.not_saved;

                if(scope.length === 0){
                    try {
                        const { data } = await axios.delete(`/accesses/${uuid}`, {
                            api: "users",
                            oauth: true,
                        });

                        await this.retrieveAccesses();
                    } catch (error) {
                        console.log(error)
                    }finally{
                        this.actualizeServicesAvailables();
                    }

                }else{
                    if(waiting_for_save === true){
                        let scopes = scope.join();
                        await this.sendAccess(row, scopes);
                        await this.retrieveAccesses();
                        this.actualizeServicesAvailables();                  
                    }else{
                        let scopes = scope.join();
                        const { data } = await axios.put(`/accesses/${uuid}`, {scopes: scopes}, {
                            api: "users",
                            oauth: true,
                        });
                        await this.retrieveAccesses();
                        this.actualizeServicesAvailables(); 
                    }
                } 
                
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
