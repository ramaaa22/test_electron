<template>
    <base-render :field="field">
        <el-checkbox-group v-model="value">
            <el-checkbox 
                v-for="option in field.options"
                :key="`${Math.ceil(Math.random() * 100)}-option-${option.value}`">
                {{ option.label }}
                <small v-if="option.hint">{{ option.hint }}</small>
            </el-checkbox>
        </el-checkbox-group>
    </base-render>
</template>


<script>
import BaseRender from './BaseRender';

export default {
    props: [ 'field' ],

    data: () => ({
        value: ''
    }),

    components: {
        BaseRender
    }
}
</script>