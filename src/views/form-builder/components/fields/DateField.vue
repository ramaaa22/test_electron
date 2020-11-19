<template>
    <base-render :field="field">
        <el-date-picker
            v-model="field"
            type="date">
        </el-date-picker>
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