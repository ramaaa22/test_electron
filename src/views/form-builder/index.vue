<template>
    <el-main v-loading="loading">
        <el-row 
            id="tabs-container"
            class="app-container"
            :gutter="10">
            <el-col :span="16">
            <el-tabs 
                type="border-card" 
                v-model="step_active"
                @tab-remove="removeStep">
                <el-tab-pane disabled>
                    <el-button-group slot="label">
                        <el-button
                            plain
                            circle
                            type="primary"
                            size="mini"
                            @click="addStep()">
                            <el-tooltip content="Agregar paso" placement="bottom">  
                                <i class="las la-plus"></i>
                            </el-tooltip>
                        </el-button>
                        <el-button
                            plain
                            circle
                            type="primary"
                            size="mini"
                            @click="download">
                            <el-tooltip content="Descargar formulario" placement="bottom">  
                                <i class="las la-cloud-download-alt"></i>
                            </el-tooltip>
                        </el-button>

                        <el-button
                            plain
                            circle
                            type="primary"
                            size="mini"
                            @click="upload.visible = true">
                            <el-tooltip content="Cargar formulario" placement="bottom">  
                                <i class="las la-cloud-upload-alt"></i>
                            </el-tooltip>
                        </el-button>
                    </el-button-group>
                </el-tab-pane>
                <el-tab-pane
                    v-for="(step, index) in steps"
                    :key="`tab-${index + 1}`"
                    :label="step.title ? step.title : `PASO ${index + 1}`"
                    :name="`step-${index + 1}`"
                    :closable="steps.length > 1"
                    @tab-remove="removeStep">
                    <fields 
                        :step="step"
                        @edit-field="editField"
                        @field-change="fieldChange"/>
                </el-tab-pane>
            </el-tabs>
            </el-col>
            <el-col :span="8">
                <el-tabs
                    v-if="step"
                    v-model="side_active" 
                    type="border-card"
                    @tab-remove="editing_field = false">
                    <el-tab-pane
                        v-if="editing_field"
                        label="Edición del campo"
                        name="properties"
                        :closable="true">
                        <component
                            :is="`${editing_field.type}-properties`"
                            :step="step"
                            :field="editing_field"
                            @option-change="optionChange"/>
                    </el-tab-pane>
                    <el-tab-pane
                        label="Propiedades"
                        name="step">
                        <el-form
                            label-position="top">
                            <el-form-item label="Nombre único">
                                <el-input 
                                    v-model="step.name"
                                    :readonly="true">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="Título">
                                <el-input 
                                    v-model="step.title"
                                    @input="changeStepTitle">
                                </el-input>
                            </el-form-item>

                            <el-form-item 
                                label="Dependencias">
                                <el-table
                                    :data="step.dependencies"
                                    size="mini"
                                    style="width: 100%">
                                    <el-table-column
                                        width="20"
                                        type="expand">
                                        <template slot-scope="{ row: dependency }">
                                            <strong v-if="dependency.mode === 'all'">Todos</strong>
                                            <strong v-else>Alguno</strong>
                                            <span>: {{ getFieldValuesLabels(dependency.step_id, dependency.field_id, dependency.values).join(', ') }}</span>
                                        </template>
                                    </el-table-column>
                                    
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
                                        label="Paso">
                                        <template slot-scope="{ row: dependency }">
                                            {{ getStep(dependency.step_id).title }}
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        label="Campo">
                                        <template slot-scope="{ row: dependency }">
                                            {{ getField(dependency.step_id, dependency.field_id).label }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane
                        label="Campos"
                        name="fields">
                        <types />
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <el-dialog 
            v-if="step"
            :title="`Agregar dependencia a ${step.title}`" 
            :visible.sync="new_dependency.visible">
            <el-form 
                label-position="top">
                <el-form-item
                    label="Paso">
                    <el-select 
                        v-model="new_dependency.step" >
                        <el-option 
                            v-for="step in prev_steps"
                            :key="`step-option-${step.id}`"
                            :label="step.title" 
                            :value="step"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    v-if="new_dependency.step"
                    label="Campo">
                    <el-select 
                        v-model="new_dependency.field" >
                        <el-option 
                            v-for="field in getFieldsWithOptions(new_dependency.step)"
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

        <el-dialog 
            v-loading="loading"
            title="Cargar Formulario" 
            :visible.sync="upload.visible">
            <el-form 
                label-position="top">
                <el-form-item
                    label="Formulario">
                    <el-input 
                        type="textarea"
                        :rows="20"
                        v-model="upload.json" >
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button 
                    plain
                    class="mr-2"
                    @click="upload.visible = false">Cancelar</el-button>

                <el-button-group>
                    <el-button 
                        plain
                        type="primary" 
                        @click="uploadForm('first')">Adelante</el-button>
                    <el-button 
                        plain
                        type="primary" 
                        @click="uploadForm('last')">Atrás</el-button>
                    <el-button 
                        plain
                        type="primary" 
                        @click="uploadForm('override')">Reemplazar</el-button>
                </el-button-group>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
import axios from '@/utils/request';

import Fields from './components/Fields';
import Types from './components/Types';

import properties from './components/properties/all';

import functions from './functions';
import field_types from './components/fieldTypes';
import download from 'downloadjs';

export default {
    data: () => ({
        step_active: '',
        steps: [],
        loading: false,
        upload: {
            visible: false,
            json: ''
        },

        new_dependency: {
            visible: false,
            step: null,
            field: null,
            mode: null,
            values: []
        },

        side_active: 'step',

        editing_field: false
    }),

    computed: {
        step() {
            return this.steps.find((step, index) => (this.step_active === `step-${index + 1}`));
        },

        prev_steps() {
            const active_index = parseInt(this.step_active.replace('step-', ''));
            const prev_steps = this.steps.filter((step, index) => ((index + 1) < active_index && step.title));
            
            return prev_steps.filter(step => (this.getFieldsWithOptions(step).length > 0));
        },

        can_add_dependency() {
            return this.prev_steps.length > 0 && this.step.title !== '';
        },
    },

    watch: {
        'new_dependency.visible': function() {
            if (!this.new_dependency.visible) {
                this.new_dependency.step = null;
                this.new_dependency.field = null;
                this.new_dependency.mode = null;
                this.new_dependency.values = [];
            }
        },

        step: function() {
            this.side_active = 'step';
            this.editing_field = false;
        },

        side_active: function() {
            if (!this.side_active) {
                this.side_active = 'step';
                this.editing_field = false;
            }
        }
    },

    mounted() {
        this.addStep('index');
    },

    methods: {
        addStep(name) {
            this.steps.push({
                id: (new Date()).getTime(),
                name: name ? name : '',
                title: '',
                fields: [],
                dependencies: []
            });

            this.step_active = `step-${this.steps.length}`;
        },
        
        async removeStep(step_name) {
            try {
                const dependants = this.getDependants(step_name);

                if (dependants.length > 0) {
                    const dependants_titles = [];

                    for(let dependant of dependants)
                        dependants_titles.push(dependant.title);

                    return this.$message({
                        offset: 40,
                        showClose: true,
                        type: 'warning',
                        message: `El paso no puede ser eliminado debido a que ${dependants_titles.join(', ')} ${dependants_titles.length > 1 ? 'dependen' : 'depende'} de él`,
                        duration: 5000
                    });
                }

                await this.$confirm(`Al cerrar la pestaña estará eliminando el paso del formulario ¿desea continuar?`, 'Alerta', {
                    confirmButtonText: 'Si',
                    cancelButtonText: 'Cancelar',
                    type: 'warning'
                });

                const steps = this.steps.filter((step, index) => (`step-${index + 1}` !== step_name));
                
                if (this.step_active === step_name)
                    this.step_active = 'step-1';
                    
                if (step_name === 'step-1')
                    steps[0].name = 'index';

                this.steps = steps;
            }
            catch(error) {}
        },
        
        changeStepTitle() {
            const title = this.satinizeTitle(this.step.title);

            this.step.title = title;

            if (this.step_active !== 'step-1') {
                const satinized = this.satinizeSlug(title);
                this.step.name = satinized;
            }

            this.$forceUpdate();
        },

        editField(field) {
            this.editing_field = field;
            this.side_active = 'properties';
        },

        fieldChange(field, callback) {
            const dependants = this.getDependants(this.step_active)
                .filter(dependant => (
                    dependant.dependencies.find(dependency => (dependency.field_id === field.id))
                ));
            
            callback(dependants); 
        },

        optionChange(field, option, callback) {
            const dependants = this.getDependants(this.step_active)
                .filter(dependant => (
                    dependant.dependencies.filter(dependency => {
                        const is_field = dependency.field_id === field.id;

                        return is_field && dependency.values.indexOf(option.value) > -1;
                    }).length > 0
                ));
            
            callback(dependants); 
        },

        getFieldsWithOptions(step) {
            const types_with_options = [ 'checkbox', 'radio' ];

            return step.fields.filter(field => (
                field.label &&
                types_with_options.indexOf(field.type) > -1 && 
                field.options.filter(option => (option.value)).length > 0
            ));
        },

        openAddDependencyDialog() {
            if (this.can_add_dependency)
                this.new_dependency.visible = true;
            else
                this.$message({
                    offset: 40,
                    showClose: true,
                    message: 'Para agregar una dependencia al paso, asegúrese de que el paso tenga definido un título y que existan pasos anteriores con título definido y campos de selección (o selección múltiple) con una etiqueta definida y opciones declaradas',
                    duration: 5000
                });
        },

        addDependency() {
            if (!this.new_dependency.step || !this.new_dependency.field ||
                !this.new_dependency.mode || this.new_dependency.values.length === 0)
                return;

            this.step.dependencies.push({
                id: (new Date()).getTime(),
                step_id: this.new_dependency.step.id,
                field_id: this.new_dependency.field.id,
                mode: this.new_dependency.mode,
                values: this.new_dependency.values
            });

            this.new_dependency.visible = false;
        },
        
        removeDependency(dependency_to_remove) {
            const dependencies = this.step.dependencies.filter(dependency => (dependency.id !== dependency_to_remove.id));

            this.step.dependencies = dependencies;
        },

        getDependants(step_name) {
            const step_index = parseInt(step_name.replace('step-', ''));
            const step = this.steps.find((step, index) => ((index + 1) === step_index));
            const next_steps = this.steps.filter((step, index) => ((index + 1) > step_index));
            const dependants = next_steps.filter(next_step => (
                next_step.dependencies.filter(dependency => (dependency.step_id === step.id)).length > 0
            ));

            return dependants;
        },

        getStep(step_id) {
            const step = this.steps.find(step => (step.id === step_id));
            return step;
        },

        getField(step_id, field_id) {
            const step = this.getStep(step_id);
            const field = step.fields.find(field => (field.id === field_id));
            return field;
        },

        getFieldValuesLabels(step_id, field_id, values) {
            const field = this.getField(step_id, field_id);
            const labels = [];

            for(let option of field.options) {
                if (values.indexOf(option.value) > -1)
                    labels.push(option.label);
            }

            return labels;
        },

        download() {
            const selectables_types = [ 'checkbox', 'radio' ];

            const steps = {};
            const step_index = {};
            const step_field_index = {};

            let previous = false;

            this.steps[0].name = 'index';

            for(let step of this.steps) {
                // Chequeo que tenga nombre
                if (!step.name || !step.title)
                    return this.$message({
                        offset: 40,
                        showClose: true,
                        type: 'warning',
                        message: 'Hay pasos sin nombre o título. Por favor soluciónelo e intente nuevamente',
                        duration: 5000
                    });
                // Chequeo que no exista
                else if (steps[step.name])
                    return this.$message({
                        offset: 40,
                        showClose: true,
                        type: 'warning',
                        message: `El paso ${step.title} se encuentra repetido bajo el nombre único ${step.name}. Por favor soluciónelo e intente nuevamente`,
                        duration: 5000
                    });

                step_index[step.id] = step.name;

                const fields = [];
                const field_index = {};

                // Recorro los campos
                for(let current_field of step.fields) {
                    const is_text = current_field.type === 'text';
                    if (!is_text && !current_field.name)
                        return this.$message({
                            offset: 40,
                            showClose: true,
                            type: 'warning',
                            message: `Hay campos sin nombre en el paso ${step.title}. Por favor soluciónelo e intente nuevamente`,
                            duration: 5000
                        });
                    // Chequeo que no este repetido
                    if (!is_text && fields[current_field.name])
                        return this.$message({
                            offset: 40,
                            showClose: true,
                            type: 'warning',
                            message: `El campo ${current_field.label} en el paso ${step.title} se encuentra repetido bajo el nombre único ${current_field.name}. Por favor soluciónelo e intente nuevamente`,
                            duration: 5000
                        });

                    field_index[current_field.id] = current_field.name;
                    step_field_index[current_field.id] = `${step.name}.${current_field.name}`;

                    const field = {
                        type: current_field.type
                    };

                    if (is_text) {
                        field.title = current_field.title;
                        field.description = current_field.description;
                        field.view = current_field.view;
                    }
                    else {
                        const rules = Object.assign({}, current_field.rules);

                        field.name = current_field.name;

                        if (field.type !== 'district') {
                            field.label = current_field.label;
                            field.hint = current_field.hint;
                        }

                        if (selectables_types.indexOf(field.type) > -1) {
                            rules.in = [];
                            field.options = [];

                            if (field.type === 'checkbox' && current_field.rules.max.enabled)
                                field.max = current_field.rules.max.value;

                            for(let option of current_field.options) {
                                const satinized_value = option.value.replace(/_/g, '');

                                if (satinized_value === '')
                                    return this.$message({
                                        offset: 40,
                                        showClose: true,
                                        type: 'warning',
                                        message: `El campo ${field.label} en el paso ${step.title} contiene opciones vacías. Por favor soluciónelo e intente nuevamente`,
                                        duration: 5000
                                    });
                                else if (rules.in.indexOf(option.value) > -1)
                                    return this.$message({
                                        offset: 40,
                                        showClose: true,
                                        type: 'warning',
                                        message: `El campo ${field.label} en el paso ${step.title} contiene opciones repetidas. Por favor soluciónelo e intente nuevamente`,
                                        duration: 5000
                                    });

                                rules.in.push(option.value);

                                field.options.push({
                                    label: option.label,
                                    value: option.value,
                                    hint: option.hint
                                });
                            }
                        }
                        else if (field.type === 'file') {
                            if (current_field.accept)
                                field.accept = current_field.accept;

                            if (current_field.rules.uploads.limit)
                                field.limit = current_field.rules.uploads.max;
                        }

                        field.rules = this.processRules(rules);

                        if (current_field.dependencies.length > 0) {
                            field.depends = { all: {} };

                            for(let dependency of current_field.dependencies) {
                                const field_name = field_index[dependency.field_id];

                                if (!field_name)
                                    return this.$message({
                                        offset: 40,
                                        showClose: true,
                                        type: 'warning',
                                        message: `El campo ${field.label} en el paso ${step.title} tiene dependencias no válidas. Recuerde que un campo anterior no puede depender de un campo posterior. Por favor soluciónelo e intente nuevamente`,
                                        duration: 5000
                                    });

                                field.depends.all[field_name] = `${dependency.mode}:${dependency.values.join(',')}`;
                            }    
                                
                        }
                    }

                    fields.push(field);
                }

                steps[step.name] = {
                    title: step.title,
                    fields
                };

                if (step.dependencies.length > 0) {
                    steps[step.name].depends = { all: {} };

                    for(let dependency of step.dependencies) {
                        const step_field_name = step_field_index[dependency.field_id];

                        if (!step_field_name)
                            return this.$message({
                                offset: 40,
                                showClose: true,
                                type: 'warning',
                                message: `El paso ${step.title} tiene dependencias no válidas. Por favor soluciónelo e intente nuevamente`,
                                duration: 5000
                            });

                        steps[step.name].depends.all[step_field_name] = `${dependency.mode}:${dependency.values.join(',')}`;
                    }
                }

                if (previous) {
                    steps[previous].next = step.name;
                    steps[step.name].previous = previous;
                }

                previous = step.name;
            }

            // Chequear que el último paso no tenga dependencias
            if (previous && steps[previous].depends)
                return this.$message({
                    offset: 40,
                    showClose: true,
                    type: 'warning',
                    message: `El paso ${steps[previous].title} no puede tener dependencias por tratarse del último paso. Por favor soluciónelo e intente nuevamente`,
                    duration: 5000
                });

            const form = JSON.stringify(steps);
            const utf_8 = new TextEncoder().encode(form);

            download(new Blob([utf_8]), 'formulario.json', 'text/json');
        },

        processRules(rules) {
            const result = [];

            for(let rule in rules) {
                const data = rules[rule];
                const plain = [ 'required', 'district', 'email', 'integer', 'date' ];
                const min_max = [ 'min', 'max' ];
                
                if (plain.indexOf(rule) > -1 && data)
                    result.push(rule);
                else if (min_max.indexOf(rule) > -1 && data.enabled)
                    result.push(`${rule}:${data.value}`);
                else if (rule === 'in')
                    result.push(`in:${data.join(',')}`);
                else if (rule === 'digits_between' && data.enabled) {
                    if (data.min === data.max)
                        result.push(`digits:${data.min}`);
                    else
                        result.push(`digits_between:${data.min},${data.max}`);
                }
                else if (rule === 'adult' && data)
                    result.push('before:18 years ago');
                else if (rule === 'uploads') {
                    if (data.limit)
                        result.push(`uploaded_file:${data.min},${data.max}`);
                    else if (data.min > 0)
                        result.push(`uploaded_file:${data.min}`);
                }
            }

            return result.join('|');
        },

        uploadForm(place) {
            try {
                this.loading = true;

                const selectables_types = [ 'checkbox', 'radio' ];
                const plain_rules = [ 'required', 'email', 'integer' ];
                const min_max_rules = [ 'min', 'max' ];
                const form = JSON.parse(this.upload.json);
                const step_index = {};
                const step_field_index = {};
                const steps = [];

                for (let step_name in form) {
                    const field_index = {};
                    const current_step = form[step_name];

                    const step = {
                        id: Math.round(Math.random() * 10000000000),
                        name: step_name,
                        title: current_step.title,
                        fields: [],
                        dependencies: []
                    };

                    step_index[step_name] = step.id;

                    for(let current_field of current_step.fields) {
                        const field = JSON.parse(JSON.stringify(
                            field_types.find(field_type => (field_type.type === current_field.type))
                        ));
                        const is_text = field.type === 'text';

                        field.id = Math.round(Math.random() * 10000000000);
                        field.dependencies = [];

                        if (is_text) {
                            field.view = current_field.view;
                            field.title = current_field.title;
                            field.description = current_field.description;
                        }
                        else {
                            field_index[current_field.name] = field.id;
                            step_field_index[`${step_name}.${current_field.name}`] = field.id;
                            
                            field.name = current_field.name;

                            if (field.type !== 'district') {
                                field.label = current_field.label;
                                field.hint = current_field.hint;
                            }

                            if (selectables_types.indexOf(field.type) > -1)
                                field.options = current_field.options;
                            else if (field.type === 'file')
                                field.accept = current_field.accept
                                    ? current_field.accept
                                    : '';

                            const rules = current_field.rules.split('|');

                            for(let raw_rule of rules) {
                                const rule_parts = raw_rule.split(':');
                                const rule = rule_parts[0];

                                if (plain_rules.indexOf(rule) > -1)
                                    field.rules[rule] = true;
                                else if (min_max_rules.indexOf(rule) > -1) {
                                    field.rules[rule].enabled = true;
                                    field.rules[rule].value = parseInt(rule_parts[1]);
                                }
                                else if (rule === 'digits' || rule === 'digits_between') {
                                    let min_max;

                                    if (rule === 'digits_between')
                                        min_max = rule_parts[1].split(',');
                                    else
                                        min_max = [ rule_parts[1], rule_parts[1]];

                                    field.rules.email = false;
                                    field.rules.integer = true;
                                    field.rules.digits_between.enabled = true;
                                    field.rules.digits_between.min = parseInt(min_max[0]);
                                    field.rules.digits_between.max = parseInt(min_max[1]);
                                }
                                else if (rule === 'before')
                                    field.rules.adult = true;
                                else if (rule === 'uploaded_file') {
                                    const limits = rule_parts[1].split(',');

                                    field.rules.uploads.min = parseInt(limits[0]);

                                    if (limits.length > 1) {
                                        field.rules.uploads.limit = true;
                                        field.rules.uploads.max = parseInt(limits[1]);
                                    }
                                }
                            }

                            if (current_field.depends) {
                                for(let dependency_field in current_field.depends.all) {
                                    const dependency = current_field.depends.all[dependency_field];
                                    const dependency_parts = dependency.split(':');

                                    field.dependencies.push({
                                        field_id: field_index[dependency_field],
                                        mode: dependency_parts[0],
                                        values: dependency_parts[1].split(',')
                                    });
                                }
                            }
                        }

                        step.fields.push(field);
                    }
                    
                    if (current_step.depends) {
                        for(let dependency_step_field in current_step.depends.all) {
                            const dependency = current_step.depends.all[dependency_step_field];
                            const dependency_parts = dependency.split(':');
                            const step_field = dependency_step_field.split('.');

                            step.dependencies.push({
                                step_id: step_index[step_field[0]],
                                field_id: step_field_index[dependency_step_field],
                                mode: dependency_parts[0],
                                values: dependency_parts[1].split(',')
                            });
                        }
                    }

                    steps.push(step);
                }

                if (place === 'override')
                    this.steps = steps;
                else if (place === 'first')
                    this.steps = steps.concat(this.steps);
                else
                    this.steps = this.steps.concat(steps);

                this.upload.visible = false;
                this.upload.json = '';
            }
            catch(error) {
                return this.$message({
                    offset: 40,
                    showClose: true,
                    type: 'warning',
                    message: `El formulario ingresado tiene un formato no válido`,
                    duration: 5000
                });
            }
            finally {
                this.loading = false;
            }
        }
    },
    
    mixins: [
        functions
    ],
    
    components: {
        Fields,
        Types,
        ...properties
    }
}
</script>
<style lang="scss" scoped>
label {
   &.el-checkbox,
   &.el-radio {
      position: relative;
      padding: 5px;
      padding-left: 14px;
      white-space: pre-line;
      margin-right: 0;
      display: flex;
      flex-direction: column;

      .el-checkbox__input,
      .el-radio__input {
         font-size: 14px;
         line-height: 14px;
      }

      .el-checkbox__input,
      .el-radio__input {
         position: absolute;
         top: 6px;
         left: 0;
      }
   }
}

.el-tabs--border-card{
   border: 1px solid #DCDFE6;
   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}

</style>
