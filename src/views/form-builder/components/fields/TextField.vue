<template>
    <div>
        <el-form-item
            v-if="field.view === 'label' || field.view === 'label-title'"
            class="mb-1"
            :class="(field.view === 'label-title') ? 'text-underline mt-2' : ''">
            <template slot="label">
                <span v-html="renderTitle(field.title)"></span>
            </template>
            <small 
                v-if="field.description"
                class="mb-0"
                v-html="$richTextProcessing(field.description)"></small>
            <slot></slot>
        </el-form-item>

        <el-alert
            v-if="field.view === 'info'"
            type="info"
            show-icon
            class="mb-2"
            :closable="false">
            <template slot="title">
                <span v-html="renderTitle(field.title)"></span>
            </template>
            <span v-html="$richTextProcessing(field.description)"></span>
        </el-alert>
    </div>
</template>

<script>
import functions from './functions';

export default {
    props: [ 'field' ],

    methods: {
        renderTitle(title) {
            if (this.field.dependencies.length > 0)
                title += '<small class="ml-1 color-danger">TEXTO CONDICIONAL</small>';

            return title;
        }
    },

    mixins: [
        functions
    ]
}
</script>