<template>
    <base-render :field="field">
        <el-input 
            type="textarea"
            v-model="value"
            :rows="2"></el-input>
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