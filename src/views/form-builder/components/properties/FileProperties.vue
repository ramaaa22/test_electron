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
                    <label class="el-checkbox"><span class="el-checkbox__label">Mínimo</span></label>
                </el-col>
                <el-col :span="12">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.uploads.min" 
                        controls-position="right"
                        :min="0"
                        :max="field.rules.uploads.limit ? field.rules.uploads.max : 10"
                        @change="checkMinAndMax('min')"></el-input-number>
                </el-col>
            </el-row>

            <el-row 
                type="flex"
                align="middle"
                :gutter="5">
                <el-col :span="12">
                    <el-checkbox 
                        label="Máximo"
                        v-model="field.rules.uploads.limit"
                        @click.native="checkMinAndMax('max')">
                    </el-checkbox>
                </el-col>
                <el-col :span="12">
                    <el-input-number 
                        size="mini"
                        v-model="field.rules.uploads.max" 
                        controls-position="right" 
                        :disabled="!field.rules.uploads.limit"
                        :min="field.rules.uploads.min > 0 ? field.rules.uploads.min : 1"
                        :max="10"
                        @change="checkMinAndMax('max')"></el-input-number>
                </el-col>
            </el-row>
        </el-form-item>

        <el-form-item 
            label="Tipos de archivo">
            <el-radio-group 
                v-model="field.accept">
                <el-radio 
                    label="">Todos</el-radio>
                <el-radio 
                    label="image">Imagen</el-radio>
                <el-radio 
                    label="pdf">PDF</el-radio>
                <el-radio 
                    label="image|pdf">Imagen y PDF</el-radio>
                <el-radio 
                    label="audio">Audio</el-radio>
                <el-radio 
                    label="video">Video</el-radio>
            </el-radio-group>
        </el-form-item>
    </base-render>
</template>

<script>
import BaseRender from './BaseRender';

export default {
    props: [ 'step', 'field' ],

    methods: {
        checkMinAndMax(checking) {
                const min = this.field.rules.uploads.min;
                const max = this.field.rules.uploads.max;
                
                if (checking === 'min' && max < min)
                    this.field.rules.uploads.max = min;
                else if (checking === 'max' && min > max)
                    this.field.rules.uploads.min = max;

            this.$forceUpdate();
        },
    },

    components: {
        BaseRender
    }
}
</script>