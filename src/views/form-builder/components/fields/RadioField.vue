<template>
    <base-render :field="field">
        <el-radio-group v-model="value">
            <el-radio 
                v-for="option in field.options"
                :key="`${Math.ceil(Math.random() * 100)}-option-${option.value}`">
                {{ option.label }}
                <small v-if="option.hint">{{ option.hint }}</small>
            </el-radio>
        </el-radio-group>
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