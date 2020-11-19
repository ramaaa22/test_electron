<template>
    <base-render :field="field">
        <el-input v-model="value"></el-input>
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