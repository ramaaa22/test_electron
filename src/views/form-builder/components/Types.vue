<template>
    <div class="field-types">
        <draggable 
            :list="fields"
            :clone="clone"
            :group="{ name: 'fields', pull: 'clone', put: false }"
            :sort="false">
            <el-button
                v-for="field in fields"
                :key="`field-type-${field.type}`"
                plain
                class="field-type">{{ field.text }}</el-button>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import types from './fieldTypes.js';
import fields from './fields/all';

export default {
    data: () => ({
        fields: types
    }),

    methods: {
        clone(field) {
            const clone = Object.assign({
                id: (new Date()).getTime(),
                dependencies: []
            }, field);
            
            return JSON.parse(JSON.stringify(clone));
        },

        checkStopDragCondition(field) {
            const form = this.forms,
            formArray = [];

            for (var key in form) {
                formArray.push(form[key]['fieldType'])
            }
        }
    },

    components: { 
        draggable,
        ...fields
    },
}
</script>

<style lang="scss">
.field-types {
    .field-type {
        display: block;
        width: 100%;
        
        & + .field-type {
            margin-top: 10px;
            margin-left: 0;
        }
    }
}
</style>