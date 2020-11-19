<template>
    <el-main>

        <div class="text-right mb-2 pt-2 pr-5 actions">
            <el-tooltip effect="dark" content="Editar" placement="top">
                <el-button
                    size="mini"
                    type="success"
                    @click="test"
                    icon="las la-edit"
                    plain
                    circle>
                </el-button>
            </el-tooltip>
        </div>




        <el-form :label-position="top" label-width="100px">
            <el-form-item label="Nombre">
                <el-input
                    :disabled=!edit
                    v-model="user.firstname">
                </el-input>
            </el-form-item>
            <el-form-item label="Apellido">
                <el-input
                    v-model="user.lastname"
                    :disabled=!edit>
                </el-input>
            </el-form-item>
            <el-form-item label="E-mail">
                <el-input
                    v-model="user.email"
                    :disabled=!edit></el-input>
            </el-form-item>
            <el-form-item label="Documento">
                <el-input
                    v-model="user.idnumber"
                    :disabled=!edit>
                </el-input>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>



export default {
    data:()=>(
        {
            user:{
                firstname:'Ramiro',
                lastname:'Boza',
                idnumber:'36683157',
                email:'ramiro.boza@hotmail.com'
            },
            edit:false
        }
    ),
    methods:{
        test(){
            //this.$message('Entro a edición');
            this.edit=!this.edit;
        }
    }
}
</script>