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
                            v-for="service in services_availables"
                            :key="`service-${service}`"
                            @click.native="getPermissions(service)">
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
                            <el-tag
                                v-for="elem in scope.row.scopes"
                                size="medium"
                                :key="elem"
                                effect="plain"
                                type="info"
                                class="mx-1"
                                @close="handleClose(elem,scope.row)"
                                closable>
                                {{ elem }}
                            </el-tag>
                            <el-dropdown>
                                <el-button 
                                    plain
                                    size="mini"
                                    type="primary">
                                    Agregar acceso<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="elem in scope.row.scopes"
                                        :key="elem"
                                        @click.native="addAccessToService(elem,scope.row)"> 
                                        {{elem}}   
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
        }),

        props: {
            row: Object,
        },

        async mounted(){
            this.loading=true;
            await this.retrieveServices();
            await this.retrieveAccesses();
            await this.actualizeServicesAvailables();
        },

        methods: {
            async retrieveServices(){
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


            async retrieveAccesses(){   
                this.loading = true;
                try {
                    const response = await axios.get(`/users/${this.row.uuid}`, {
                        api: "users",
                        oauth: true,
                    });
                    console.log(response);
                    this.accesses=response.data.resource.accesses;

                } catch (error) {
                    console.log(error)
                }
                finally{
                    this.loading = false;
                }
                console.log(this.services);
                console.log(this.accesses);
            },


            addAccessToService(access,array){
                const pos = this.accesses.indexOf(array);
                this.accesses[pos].scopes.push(access);
                this.actualizeServicesAvailables();
                //this.services_availables.pop(access);
            },

            emit(uuid) {
                this.$emit("actualize-user-edit", uuid);
            },

            actualizeServicesAvailables(){
                let arr_accesses = this.accesses.map(access =>access.service.name);
                let new_array = this.services.filter(service => arr_accesses.indexOf(service.name)==-1);
                console.log(new_array);
                this.services_availables=new_array;
                /*this.services.forEach(service =>{
                    let ok=true;
                    for (let i=0;i<arr.length;i++){
                        if (service.name==arr[i]){
                            ok=false;
                        }
                    }
                    if (ok){
                        this.services_availables.push(service);
                    }
                })*/

                
            },

            
            async getPermissions(service) {
                //Saco el elemento de services_availables
                let pos=this.services_availables.map(service=>service).indexOf(service);
                this.services_availables.splice(pos, 1);
                //Y lo agrego a accesses
                let pos2=this.services.map(service=>service).indexOf(service);
                console.log(this.services[pos2].name);
                let object ={
                    name:this.services[pos2].name,
                    scopes:[],
                    service:this.services[pos2]
                }
                this.accesses.push(object);
                
                
                /*
                    si el servicio tiene 0 o 1 acceso, guardarlo automaticamente en 
                    la base de datos

                    si tiene mayor a 1, esperar hasta que por lo menos se agregue
                    un acceso y recién ahi guardar en la bd
                */
                
                /*if(service.scopes<=1){
                    console.log(``);
                }
                this.accesses.push(service);*/
                
                /*try {
                    const { data } = await axios.get(`/services/${service.name}`, {
                        api: "users",
                        oauth: true,
                    }); 

                    
                    this.choose_url = data.resource.url;

                    if(this.choose_url !== null) {
                        //  TODO:
                        // llamada a la url para ir a buscar los roles
                        // if -> si tiene un solo rol llamada a la api + retrieveAccesses
                        // else -> se pushea a access con los roles para elegirlos
                        // + saved: false
                      
                        console.log('nohay')
                    }
                    else {
                      await this.sendAccess(service);
                        this.retrieveAccesses();
                    }
                } catch (error) {
                    console.log(error)
                }*/ 
            },


            async sendAccess(service){
                try {
                    const { data } = await axios.post(`/users/${this.row.uuid}/accesses`,{service_slug: service.slug}, {
                        api: "users",
                        oauth: true,
                    }); 

                    console.log(data)
                }
                catch (error) {
                   console.log(error)
                }
            },

            handleClose(tag,scope) {

                //NO FUNCIONA. VER
                console.log('entro aca');
                //console.log(tag);
                //console.log(scope);
                const pos = this.accesses.indexOf(scope);
                //this.accesses[pos].scopes.splice(this.accesses[pos].scopes.indexOf(tag),1);
            }
           
        },
        components: { UserInformation },
    };
</script>
<style  scoped>
.select-header{
    width: 20%
}
</style>
