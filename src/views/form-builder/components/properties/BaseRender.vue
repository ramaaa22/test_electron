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
        <span>{{field.label.length}}/75</span>

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
            if (this.field.label.length>75){
                this.$message({
                        offset: 40,
                        showClose: true,
                        type: 'warning',
                        message: 'La etiqueta no puede contener más de 75 caracteres. Recuerde que puede usar el texto de ayuda si necesita agregar información',
                        duration: 5000
                });
                this.field.label= this.field.label.slice(0,75);
                this.field.name= this.field.name.slice(0,75);
            }
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