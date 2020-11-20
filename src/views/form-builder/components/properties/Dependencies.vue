<template>
    <div
        :step="step"
        :field="field">
        <el-form-item 
            label="Dependencias">
            <el-table
                :data="field.dependencies"
                size="mini"
                style="width: 100%">
                <el-table-column
                    width="40">
                    <template 
                        slot="header">
                        <el-button
                            plain
                            circle
                            type="success"
                            size="mini"
                            icon="el-icon-plus"
                            @click="openAddDependencyDialog" />
                    </template>
                    <template slot-scope="{ row: dependency }">
                        <el-button
                            plain
                            circle
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="removeDependency(dependency)" />
                    </template>
                </el-table-column>

                <el-table-column
                    label="Campo">
                    <template slot-scope="{ row: dependency }">
                        {{ getField(dependency.field_id).label }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="Valores">
                    <template slot-scope="{ row: dependency }">
                        <strong v-if="dependency.mode === 'all'">Todos</strong>
                        <strong v-else>Alguno</strong>
                        <span>: {{ getFieldValuesLabels(dependency.field_id, dependency.values).join(', ') }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>

        <el-dialog 
            :title="`Agregar dependencia a ${field.label}`" 
            :visible.sync="new_dependency.visible">
            <el-form 
                label-position="top">
                <el-form-item
                    label="Campo">
                    <el-select 
                        v-model="new_dependency.field" >
                        <el-option 
                            v-for="field in fields"
                            :key="`field-option-${field.id}`"
                            :label="field.label" 
                            :value="field"></el-option>
                    </el-select>
                </el-form-item>

                <el-row
                    v-if="new_dependency.field"
                    :gutter="10">
                    <el-col :span="8">
                        <el-form-item
                            label="Modo de chequeo">
                            <el-select 
                                v-model="new_dependency.mode">
                                <el-option 
                                    label="Todos" 
                                    value="all"></el-option>
                                <el-option 
                                    label="Alguno" 
                                    value="any"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item
                            label="Valores">
                            <el-select 
                                multiple
                                v-model="new_dependency.values" >
                                <el-option 
                                    v-for="option in new_dependency.field.options"
                                    :key="`value-option-${option.value}`"
                                    :label="option.label" 
                                    :value="option.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button 
                    plain
                    @click="new_dependency.visible = false">Cancelar</el-button>
                <el-button 
                    plain
                    type="primary" 
                    @click="addDependency">Agregar</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: [ 'step', 'field' ],

    data: () => ({
        new_dependency: {
            visible: false,
            field: null,
            mode: null,
            values: []
        },
    }),

    computed: {
        fields() { 
            const types_with_options = [ 'checkbox', 'radio' ];

            return this.step.fields.filter(field => (field.id !== this.field.id && types_with_options.indexOf(field.type) > -1));
        }
    },

    watch: {
        'new_dependency.visible': function() {
            if (!this.new_dependency.visible) {
                this.new_dependency.field = null;
                this.new_dependency.mode = null;
                this.new_dependency.values = [];
            }
        }
    },
    
    methods: {
        getField(field_id) {
            return this.step.fields.find(field => (field.id === field_id));
        },

        getFieldValuesLabels(field_id, values) {
            const field = this.getField(field_id);
            const labels = [];

            for(let option of field.options) {
                if (values.indexOf(option.value) > -1)
                    labels.push(option.label);
            }

            return labels;
        },

        openAddDependencyDialog() {
            if ((this.field.type === 'text' || this.field.name) && this.fields.length > 0)
                this.new_dependency.visible = true;
            else
                this.$message({
                    offset: 80,
                    showClose: true,
                    message: 'Para agregar una dependencia al campo asegúrese de que tenga definida una etiqueta y que existan campos de selección (o selección múltiple) con una etiqueta definida y opciones declaradas',
                    duration: 5000
                });
        },

        addDependency() {
            if (!this.new_dependency.field || !this.new_dependency.mode || 
                this.new_dependency.values.length === 0)
                return;
                
            this.field.dependencies.push({
                id: (new Date()).getTime(),
                field_id: this.new_dependency.field.id,
                mode: this.new_dependency.mode,
                values: this.new_dependency.values
            });

            this.new_dependency.visible = false;
        },

        removeDependency(dependency_to_remove) {
            const dependencies = this.field.dependencies.filter(dependency => (dependency.id !== dependency_to_remove.id));

            this.field.dependencies = dependencies;
        },
    }
}
</script>