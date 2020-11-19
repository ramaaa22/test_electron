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

            <el-row 
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        label="Mínimo de caracteres"
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
                        :max="field.rules.max.enabled ? field.rules.max.value : 10000"
                        @change="checkMinAndMax('min')"></el-input-number>
                </el-col>
            </el-row>

            <el-row 
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        label="Máximo de caracteres"
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
                        :max="10000"
                        @change="checkMinAndMax('max')"></el-input-number>
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
       },
    },

    components: {
        BaseRender
    }
}
</script>