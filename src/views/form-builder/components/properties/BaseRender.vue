<template>
    <el-form
        v-loading="loading"
        label-position="top">
        <el-form-item 
            label="Nombre único"
            prop="field.name">
            <el-input
                v-model="field.name"
                :readonly="true" />
        </el-form-item>

        <el-form-item 
            label="Etiqueta del campo"
            prop="field.label">
            <el-input
                v-model="field.label"
                @input="changeFieldLabel" />
        </el-form-item>

        <el-form-item 
            label="Texto de ayuda"
            prop="field.hint">
            <el-input
                type="textarea"
                v-model="field.hint" />
        </el-form-item>

        <slot></slot>

        <dependencies
            :step="step"
            :field="field" />
    </el-form>
</template>

<script>
import functions from '../../functions';
import Dependencies from './Dependencies';

export default {
    props: { 
        step: Object,
        field: Object,
        loading: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        changeFieldLabel() {
            const label = this.satinizeTitle(this.field.label);
            const satinized = this.satinizeSlug(label);

            this.field.label = label;
            this.field.name = satinized;

            this.$forceUpdate();
        }
    },

    mixins: [
        functions
    ],

    components: {
        Dependencies
    }
}
</script>