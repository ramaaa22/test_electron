<template>
    <base-render :field="field">
        <el-upload
            :disabled="true"
            action="/"
            drag>
            <i class="el-icon-upload"></i>
        </el-upload>
    </base-render>
</template>

<script>
import BaseRender from './BaseRender';

export default {
    props: [ 'field' ],

    components: {
        BaseRender
    }
}
</script>