<template>
    <el-form
        label-position="top">
        <el-form-item
            label="Título"
            prop="field.title">
            <el-input v-model="field.title" />
        </el-form-item>

        <el-form-item 
            label="Título"
            prop="field.title">
            <el-input
                type="textarea"
                v-model="field.description" />
        </el-form-item>

        <el-form-item 
            label="Tipo">
            <el-radio-group 
                v-model="field.view">
                <el-radio 
                    label="label">Etiqueta</el-radio>
                <el-radio 
                    label="label-title">Título</el-radio>
                <el-radio 
                    label="info">Alerta</el-radio>
            </el-radio-group>
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

    components: {
        Dependencies
    }
}
</script>