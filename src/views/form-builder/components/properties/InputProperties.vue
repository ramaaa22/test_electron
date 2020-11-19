<template>
    <base-render
        :step="step"
        :field="field">
        <el-form-item 
            label="Validaciones">
            <el-checkbox 
                label="Obligatorio"
                v-model="field.rules.required"
                @click.native="$forceUpdate()">
            </el-checkbox>

            <el-checkbox 
                v-if="!field.rules.integer"
                label="Campo email"
                v-model="field.rules.email"
                @click.native="$forceUpdate()">
            </el-checkbox>

            <el-checkbox 
                v-if="!field.rules.email"
                label="Campo numérico"
                v-model="field.rules.integer"
                @click.native="$forceUpdate()">
            </el-checkbox>

            <el-row 
                v-if="!field.rules.email"
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        :label="`Mínimo${!field.rules.integer ? ' de caracteres' : ''}`"
                        v-model="field.rules.min.enabled"
                        @click.native="checkMinAndMax('min')">
                    </el-checkbox>
                </el-col>
                <el-col :span="12">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.min.value" 
                        controls-position="right" 
                        :disabled="!field.rules.min.enabled"
                        :min="1"
                        :max="field.rules.max.enabled ? field.rules.max.value : (field.rules.integer ? Number.MAX_SAFE_INTEGER : 255)"
                        @change="checkMinAndMax('min')"></el-input-number>
                </el-col>
            </el-row>

            <el-row 
                v-if="!field.rules.email"
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        :label="`Máximo${!field.rules.integer ? ' de caracteres' : ''}`"
                        v-model="field.rules.max.enabled"
                        @click.native="checkMinAndMax('max')">
                    </el-checkbox>
                </el-col>
                <el-col :span="12">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.max.value" 
                        controls-position="right" 
                        :disabled="!field.rules.max.enabled"
                        :min="field.rules.min.enabled ? field.rules.min.value : 1"
                        :max="field.rules.integer ? Number.MAX_SAFE_INTEGER : 255"
                        @change="checkMinAndMax('max')"></el-input-number>
                </el-col>
            </el-row>

            <el-row 
                v-if="field.rules.integer && !field.rules.email"
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        label="Cantidad de dígitos"
                        v-model="field.rules.digits_between.enabled">
                    </el-checkbox>
                </el-col>
                <el-col :span="6">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.digits_between.min" 
                        controls-position="right" 
                        :disabled="!field.rules.digits_between.enabled"
                        :min="1"
                        :max="field.rules.digits_between.max"
                        @change="$forceUpdate()"></el-input-number>
                </el-col>
                <el-col :span="6">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.digits_between.max" 
                        controls-position="right" 
                        :disabled="!field.rules.digits_between.enabled"
                        :min="field.rules.digits_between.min"
                        :max="255"
                        @change="$forceUpdate()"></el-input-number>
                </el-col>
            </el-row>
        </el-form-item>
    </base-render>
</template>

<script>
import BaseRender from './BaseRender';

export default {
    props: [ 'step', 'field' ],

    methods: {
       checkMinAndMax(checking) {
            const min = this.field.rules.min.value;
            const max = this.field.rules.max.value;

            if (checking === 'min' && max < min)
                this.field.rules.max.value = min;
            else if (checking === 'max' && min > max)
                this.field.rules.min.value = max;

           this.$forceUpdate();
       }
    },

    components: {
        BaseRender
    }
}
</script>