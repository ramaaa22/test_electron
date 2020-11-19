<template>
    <el-form-item 
        :prop="field.name">
        <template slot="label">
            <span v-html="renderLabel()"></span>
        </template>
        <small 
            v-if="field.hint"
            v-html="$richTextProcessing(field.hint)"></small>
        <slot></slot>
    </el-form-item>
</template>

<script>
import functions from './functions';

export default {
    props: [ 'field' ],

    methods: {
        renderLabel() {
            let label = this.field.label 
                ? this.field.label 
                : `Campo de ${this.field.text.toLowerCase()}`;

            if (this.field.dependencies.length > 0)
                label += '<small class="ml-1 color-danger">CAMPO CONDICIONAL</small>';

            return label;
        }
    },

    mixins: [
        functions
    ]
}
</script>