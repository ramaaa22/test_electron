<template>
<el-row>
    <el-col class="is-flex is-flex-center container-login">
    <layout id="form-box">
        <h2 
            class="text-center my-3">Iniciar Sesión</h2>
        <el-form
            :model="form"
            ref="form"
            @submit.native.prevent="submit">
            <el-form-item 
                prop="idnumber">
                <el-input 
                    :readonly="loading"
                    v-model="form.idnumber"
                    placeholder="Documento"
                    required
                    prefix-icon="las la-id-card"></el-input>
            </el-form-item>

            <el-form-item 
                prop="password" 
                class="">
                <el-input
                    :readonly="loading"
                    v-model="form.password"
                    placeholder="Contraseña"
                    required
                    type="password"
                    prefix-icon="las la-key"></el-input>
            </el-form-item>

            <el-form-item class="mb-1">
                <el-button
                    :loading="loading"
                    type="primary"
                    native-type="submit"
                    class="full-width">Ingresar</el-button>
            </el-form-item>
        </el-form>
    </layout>
    </el-col>
</el-row>
</template>

<script>
import Layout from './components/Layout';

export default {
    data: () => ({
        form: {
            idnumber: '',
            password: ''
        },
        loading: false,
        error: null
    }),

    computed: {
        redirect() {
            const redirect = this.$route.params.redirect && this.$route.params.redirect !== 'auth.logout'
                ? this.$route.params.redirect
                : 'index';

            return redirect;
        },

        redirectParams() {
            const params = this.$route.params.redirect_params
                ? this.$route.params.redirect_params
                : {};

            return params;
        }
    },

    async mounted() {
       
    },

    methods: {
        async submit() {
            try {
                if (this.loading) 
                    return;

                this.loading = true;

                await this.$store.dispatch('user/login', this.form);

                this.$router.push({ path: '/', params: this.redirectParams });
            }
            catch (error) {
                const { response } = error;

                if (response.status === 401)
                    this.$message({
                        offset: 40,
                        offset: 40,
                        showClose: true,
                        duration: 5000,
                        message: 'El documento y la contraseña ingresada no coinciden con ningún usuario',
                        type: 'warning'
                    });
                else if (response.status === 412)
                    this.$message({
                        offset: 40,
                        offset: 40,
                        showClose: true,
                        message: 'Antes de ingresar debe verificar su casilla de correo. Por favor revise el correo no deseado, es posible que el código de verificación haya llegado ahí. Si aún no le llegó ningún mensaje a su casilla de correo, puede reenviar el código de vericación haciendo click en "Reenviar código de verificación" ubicado al final del formulario de ingreso',
                        duration: 0,
                        type: 'warning'
                    });
                else
                    this.$handleErrors(error);

                this.loading = false;
            }
        },

        recoverPassword() {
            if (this.loading) return;
            this.$router.push({ name: 'auth.recover' })
        }
    },

    components: {
        Layout
    }
};
</script>

<style lang="scss" >
/*@import "~@/styles/_variables.scss";
@import "~@/styles/_functions.scss";

#auth_login #app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @include linear-gradient($primary, $cool);
}*/

.container-login{
    height: 95vh;
}
</style>