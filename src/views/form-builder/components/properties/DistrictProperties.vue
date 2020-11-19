<template>
    <el-form
        label-position="top">
        <el-form-item 
            label="Nombre único"
            prop="field.name">
            <el-input
                v-model="field.name"
                @input="changeFieldName"/>
        </el-form-item>

        <el-form-item 
            label="Validaciones">
            <el-checkbox 
                label="Obligatorio"
                v-model="field.rules.required"
                @click.native="$forceUpdate()">
            </el-checkbox>
        </el-form-item>

        <dependencies
            :step="step"
            :field="field" />
    </el-form>
</template>

<script>
import Dependencies from './Dependencies';

export default {
    props: [ 'step', 'field' ],

    methods: {
        changeFieldName() {
            const satinized = this.field.name
                .toLowerCase()
                .replace(/ /g, '_')
                .replace(/[^a-z0-9_]+/g, '');

            this.field.name = satinized;

            this.$forceUpdate();
        }
    },

    components: {
        Dependencies
    }
}
</script>