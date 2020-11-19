<template>
    <base-render
        :step="step"
        :field="field">
        <el-form-item 
            label="Validaciones">
            <el-checkbox 
                label="Obligatorio"
                v-model="field.rules.required"
                @click.native="$forceUpdate()">
            </el-checkbox>

             <el-checkbox 
                label="Mayor de 18 años"
                v-model="field.rules.adult"
                @click.native="$forceUpdate()">
            </el-checkbox>
        </el-form-item>
    </base-render>
</template>

<script>
import BaseRender from './BaseRender';

export default {
    props: [ 'step', 'field' ],

    components: {
        BaseRender
    }
}
</script>