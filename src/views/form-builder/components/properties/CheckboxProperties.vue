<template>
    <base-render
        :loading="loading"
        :step="step"
        :field="field">
        <el-form-item 
            label="Validaciones">
            <el-checkbox 
                label="Obligatorio"
                v-model="field.rules.required"
                @click.native="$forceUpdate()">
            </el-checkbox>

            <el-row 
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        label="Cantidad mínima"
                        v-model="field.rules.min.enabled"
                        @click.native="checkMinAndMax('min')">
                    </el-checkbox>
                </el-col>
                <el-col :span="12">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.min.value" 
                        controls-position="right" 
                        :disabled="!field.rules.min.enabled"
                        :min="1"
                        :max="field.rules.max.enabled ? field.rules.max.value : field.options.length"
                        @change="checkMinAndMax('min')"></el-input-number>
                </el-col>
            </el-row>

            <el-row 
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        label="Cantidad máxima"
                        v-model="field.rules.max.enabled"
                        @click.native="checkMinAndMax('max')">
                    </el-checkbox>
                </el-col>
                <el-col :span="12">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.max.value" 
                        controls-position="right" 
                        :disabled="!field.rules.max.enabled"
                        :min="field.rules.min.enabled ? field.rules.min.value : 1"
                        :max="field.options.length"
                        @change="checkMinAndMax('max')"></el-input-number>
                </el-col>
            </el-row>
        </el-form-item>

        <el-form-item 
            label="Opciones">
            <el-table
                v-if="!loading"
                :data="field.options"
                size="mini"
                style="width: 100%">
                <el-table-column
                    width="20"
                    type="expand">
                    <template slot-scope="{ row: option }">
                        <el-form-item 
                            label="Texto de ayuda">
                            <el-input
                                size="mini"
                                type="textarea"
                                v-model="option.hint" />
                        </el-form-item>
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
                            @click="addOption" />
                    </template>
                    <template slot-scope="{ row: option }">
                        <el-button
                            plain
                            circle
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            :disabled="field.options.length < 3 || option.has_dependants"
                            @click="deleteOption(option)" />
                    </template>
                </el-table-column>

                <el-table-column
                    prop="label"
                    label="Etiqueta">
                    <template slot-scope="{ row: option }">
                        <el-input 
                            v-model="option.label"
                            :disabled="option.has_dependants"
                            @input="changeOptionLabel(option)"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="value"
                    label="Valor">
                </el-table-column>
            </el-table>
        </el-form-item>
    </base-render>
</template>

<script>
import BaseRender from './BaseRender';
import functions from '../../functions';

export default {
    props: [ 'step', 'field' ],

    data: () => ({
        loading: true
    }),

    watch: {
        field: function() {
            this.init();
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        async init() {
            this.loading = true;

            for(let option of this.field.options)
                option.has_dependants = await this.optionHasDependants(option);

            this.loading = false;

            this.$forceUpdate();
        },

       optionHasDependants(option) {
           return new Promise(resolve => {
                const local_dependants = this.step.fields.filter(field => (
                    field.id !== this.field.id &&
                    field.dependencies.filter(dependency => {
                        const is_field = dependency.field_id === this.field.id;

                        return is_field && dependency.values.indexOf(option.value) > -1;
                    }).length > 0
                ));

                if (local_dependants.length > 0)
                    resolve(true);
                else
                    this.$emit('option-change', this.field, option, dependants => resolve(dependants.length > 0));
            });
       },

        deleteOption(option) {
            const options = this.field.options.filter(o => (option.value !== o.value));

            this.field.options = options;

            this.checkMinAndMax('max');
        },
        
        checkMinAndMax(checking) {
                const min = this.field.rules.min.value;
                const options_count = this.field.options.length;
                
                if (this.field.rules.max.value > options_count)
                    this.field.rules.max.value = options_count;

                const max = this.field.rules.max.value;
                
                if (checking === 'min' && max < min)
                    this.field.rules.max.value = min;
                else if (checking === 'max' && min > max)
                    this.field.rules.min.value = max;

            this.$forceUpdate();
        },

       changeOptionLabel(option) {
            const label = this.satinizeTitle(option.label);
            const satinized = this.satinizeSlug(label);

            option.value = satinized;
            option.label = label;

            this.$forceUpdate();
        },

        addOption() {
            const option = {
                value: '',
                label: '',
                hint: ''
            };

            this.field.options.push(option);
        }
    },

    mixins: [
        functions
    ],

    components: {
        BaseRender
    }
}
</script>