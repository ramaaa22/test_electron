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
        },

        deleteOption(option) {
            const options = this.field.options.filter(o => (option.value !== o.value));

            this.field.options = options;
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