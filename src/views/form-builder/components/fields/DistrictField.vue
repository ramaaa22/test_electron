<template>
    <div>
        <el-form-item>
            <template slot="label">
                <span v-html="renderLabel('Provincia')"></span>
            </template>
            <el-input 
                value="Provincia"
                :readonly="true"></el-input>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <span v-html="renderLabel('Localidad')"></span>
            </template>
            <el-input 
                value="Localidad"
                :readonly="true"></el-input>
        </el-form-item>
    </div>
</template>

<script>

export default {
    props: [ 'field' ],

    methods: {
        renderLabel(label) {
            if (this.field.dependencies.length > 0)
                label += '<small class="ml-1 color-danger">CAMPO CONDICIONAL</small>';

            return label;
        }
    }
}
</script>