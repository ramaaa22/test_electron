<template>
<div>
    <el-dialog
        center
        :title="title"
        :visible="open"
        @close="$emit('close-dialog')"
        width="400px"
        :close-on-press-escape="!loading"
        :close-on-click-modal="!loading"
        :show-close="!loading">
        <el-tag 
            class="mb-4 max-width text-center">
            <h6 v-if="selected_applications">{{ selected_applications.length }} {{ selected_applications.length > 1 ? 'inscripciones seleccionadas' : 'inscripción seleccionada' }}</h6>
        </el-tag>

        <el-form 
            v-if="step === 1"
            ref="form" 
            label-position="top"
            label-width="100%">
            <el-form-item label="Mesa evaluatoria">
                <el-select
                    placeholder=""
                    v-model="evaluation_table">
                    <el-option
                        v-for="_evaluation_table in evaluation_tables"
                        :key="`evaluation-table-option-${_evaluation_table.uuid}`"
                        class="text-center"
                        :label="renderEvaluationTableLabel(_evaluation_table)"
                        :value="_evaluation_table">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Documento del jurado">
                <el-input 
                    v-model="jury_idnumber"/>
            </el-form-item>
        </el-form>

        <div v-if="step === 2">
            <h6 class="mb-1 c-text-primary">Mesa evaluatoria</h6>
            <div>{{ renderEvaluationTableLabel(evaluation_table) }}</div>

            <el-divider class="my-4"></el-divider>

            <h6 class="mb-1 c-text-primary">Jurado</h6>

            <table class="text-left">
                <tbody>
                    <tr>
                        <th>Documento: </th>
                        <td>{{jury.idnumber}}</td>
                    </tr>
                    <tr>
                        <th>Nombre: </th>
                        <td>{{jury.firstname}}</td>
                    </tr>
                    <tr>
                        <th>Apellido: </th>
                        <td>{{jury.lastname}}</td>
                    </tr>
                    <tr>
                        <th>Email: </th>
                        <td>{{jury.email}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <el-row 
            class="mt-3" 
            type="flex" 
            justify="space-between">
            <el-col :span="12">
                <el-button 
                    v-if="step > 1"
                    :disabled="loading" 
                    circle 
                    plain
                    @click="step--">
                    <i class="las la-arrow-left"></i>
                </el-button>
            </el-col>
            <el-col 
                class="text-right"
                :span="12" >
                <el-button 
                    circle
                    plain
                    :loading="loading"
                    :type="last_step ? 'success' : 'primary'"
                    @click="last_step ? send() : nextStep()">
                    <i
                        v-if="!loading"
                        class="las"
                        :class="{
                            'la-arrow-right': !last_step,
                            'la-check': last_step
                        }"></i>
                </el-button>
            </el-col>
        </el-row>

    </el-dialog>
</div>
</template>
<script>
import axios from '@/utils/request';
import moment from 'moment';

export default {

    data: () => ({
        loading: false,
        evaluation_table: '',
        jury_idnumber: '',
        step: 1,

        jury: false,

        current_index: 0,
    }),

    props:{
        open: Boolean,
        announcement_uuid: String,
        evaluation_tables: Array,
        selected_applications: Array,
        type: String
    },

    computed:{
        title() {
            switch(this.type) {
                case 'juries': return 'Asignar jurados';
                case 'tasks': return 'Asignar tareas';
            }
        },

        loading_text(){
            return `${this.current_index} de ${this.selected_applications.length}`;
        },

        last_step() {
            switch(this.type) {
                case 'juries': return this.step === 2;
                case 'tasks': return this.step === 2;
            }
        }
    },
   
    methods:{
        renderEvaluationTableLabel(evaluation_table) {
            const start = moment(evaluation_table.starts_at).format('DD/MM/YYYY HH:mm');
            const ends = moment(evaluation_table.ends_at).format('DD/MM/YYYY HH:mm');

            return `${start} - ${ends}`;
        },

        async nextStep(){
            try {
                if (!this.jury_idnumber || !this.evaluation_table)
                    return;

                this.loading = true;
                
                /*const { data } = await axios.get(`/clients/users/${this.jury_idnumber}`, { 
                      api: "revision",
                oauth: true});*/
                
                //API SEBA
                const { data } = await axios.get(`/users/${this.jury_idnumber}`, { 
                      api: "revision",
                oauth: true 
                });

                this.jury = data.resource;
                
                this.step = 2;
                this.loading = false;
            } 
            catch (error) {
                const { response } = error
                if(response.status === 404){
                    this.$message.error({
                        message: 'Jurado no encontrado',
                        center: true
                    });   
                    this.loading = false;
                }else{
                   console.log(error)
                }
            }
        },
        
        async send() {
            if (!this.jury || !this.evaluation_table)
                return;

            this.loading = true;

            const keys = Object.keys(this.selected_applications);
            const jury_uuid = this.jury.uuid;
            const evaluation_table_uuid = this.evaluation_table.uuid;
            //const url = `/clients/evaluation-tables/${evaluation_table_uuid}/evaluations`;

            //API SEBA
            const url = `/evaluation-tables/${evaluation_table_uuid}/evaluations`;

            for (let i=0; i < keys.length; i++) {
                const application_uuid = this.selected_applications[i];

                this.current_index = i + 1;

                try{
                    const { data } = await axios.post(url, {
                        jury_uuid, 
                        application_uuid
                    }, { 
                          api: "revision",
                oauth: true 
                    });  
                }         
                catch(error) {
                    if (!error.response) {
                        console.error(error);
                        continue;
                    }

                    const { response } = error
                    const title = `Inscripción ${application_uuid}`;
                    
                    try {
                        if(response.status === 409) {
                            const message = `${response.data.error.message}. ¿Desea hacerlo de todas formas?`;
                                const confirmation = await this.$confirm(message, title, {
                                    distinguishCancelAndClose: true,
                                    confirmButtonText: 'Confirmar',
                                    cancelButtonText: 'Cancelar',
                                    type: 'warning'
                                });

                                const { data } = await axios.post(url, {
                                    jury_uuid, 
                                    application_uuid,
                                    force: true
                                }, { 
                                      api: "revision",
                oauth: true 
                                });
                        }
                        else
                            await this.$confirm(response.data.error.message, title, {
                                confirmButtonText: 'Aceptar',
                                showCancelButton: false,
                                type: 'warning'
                            });
                    }
                    catch(error) {}
                }  
            }
            
            this.resetValues();

            this.$message({
                message: 'Jurado y mesa asignados exitosamente',
                type: 'success'
            });

            this.$emit('close-dialog', true);
        },

        resetValues() {
            this.step = 1;
            this.loading = false;
            this.jury_idnumber = '';
            this.evaluation_table = '';
            this.jury = '';
        }

    }

}
</script>
