<template>
    <el-form 
        class="fields"
        :class="{ empty: step.fields.length == 0 }"
        label-position="top">
        <div 
            v-if="step.fields.length == 0" 
            class="empty-state">
            <h3>Arrastre un campo</h3>
        </div>

        <draggable 
            :list="step.fields"
            class="drag-area" 
            group="fields">
            <div 
                v-for="(field, index) in step.fields" 
                :key="`field-${index}`"
                class="field-container">     
                <component 
                    :is="`${field.type}-field`"
                    :field="field" 
                    class="field-component">
                </component>

                <el-button-group class="field-actions">
                    <el-button 
                        plain
                        size="mini" 
                        type="primary" 
                        icon="el-icon-rank">
                    </el-button>

                    <el-button 
                        plain
                        size="mini" 
                        type="warning" 
                        @click="$emit('edit-field', field)"
                        icon="el-icon-edit">
                    </el-button>

                    <el-button 
                        plain 
                        size="mini" 
                        type="danger" 
                        icon="el-icon-delete" 
                        @click="deleteField(index)">
                    </el-button>
                </el-button-group>
            </div>
        </draggable>
    </el-form>
</template>

<script>
import draggable from 'vuedraggable';
import fields from './fields/all';

export default {
    props: [ 'step' ],

    watch: {
        'step.title': function() {
            this.step.title = this.step.title.toUpperCase();
        }
    },

    methods: {
        deleteField(index_to_delete) {
            const field = this.step.fields.find((field, index) => (index === index_to_delete));
            const local_dependants = this.step.fields.filter(current_field => (
                current_field.id !== field.id &&
                current_field.dependencies.filter(dependency => (
                    dependency.field_id === field.id
                )).length > 0
            ));

            if (local_dependants > 0) {
                const dependants_labels = [];

                for(let dependant of local_dependants)
                    dependants_labels.push(dependant.label);

                return this.$message({
                    showClose: true,
                    type: 'warning',
                    message: `El campo no puede ser eliminado debido a que ${dependants_labels.join(', ')} ${dependants_labels.length > 1 ? 'dependen' : 'depende'} de él`,
                    duration: 5000
                });
            }

            this.$emit('field-change', field, dependants => {
                if (dependants.length > 0) {
                    const dependants_titles = [];

                    for(let dependant of dependants)
                        dependants_titles.push(dependant.title);

                    return this.$message({
                        showClose: true,
                        type: 'warning',
                        message: `El campo no puede ser eliminado debido a que ${dependants_titles.join(', ')} ${dependants_titles.length > 1 ? 'dependen' : 'depende'} de él`,
                        duration: 5000
                    });
                }

                const fields = this.step.fields.filter((field, index) => (index !== index_to_delete));

                this.step.fields = fields;
            });
        }
    },

    components: {
        draggable,
        ...fields
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~@/styles/_variables.scss";

.fields {
    position: relative;

    &.empty {
        height: 100px;
    }

    .drag-area {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 2;
        margin: -5px;

        .sortable-ghots {
            width: 100%;
        }

        .field-container {
            position: relative;
            padding: 5px;
            border: 1px dashed transparent;

            .field-component {
                margin-bottom: 0;
            }

            .field-actions {
                display: none;
                position: absolute;
                top: -1px;
                right: -1px;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;

                .el-button {
                    opacity: 0.75;
                }
            }

            &:hover {
                border-color: $text-secondary;

                .field-actions {
                    display: flex;
                }
            }

        }
    } 

    .empty-state {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $text-secondary;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
}
</style>