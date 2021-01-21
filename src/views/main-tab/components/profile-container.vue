<template>
    <div>
        <el-tooltip content="Usuario">
            <el-popover
                width="200"
                placement="left-start"
                trigger="click">
                    <el-row >
                        <el-col>
                            <h5 class="c-text-secondary">Nombre</h5>
                            {{user.firstname}} {{user.lastname}}
                        </el-col>
                        <el-col>
                            <h5 class="c-text-secondary">Email</h5>
                            {{user.email}}
                        </el-col>
                        <el-col>
                            <h5 class="c-text-secondary">Documento</h5>
                            {{user.idnumber}}
                        </el-col>
                        <el-col>
                            <el-button
                                class="ml-3"
                                size="small"
                                type="danger"
                                round
                                @click="logout"
                                icon="las la-sign-out-alt">
                                Cerrar sesión
                            </el-button>
                        </el-col>
                    </el-row>
                
                    <el-button 
                        type="info" 
                        plain 
                        circle 
                        slot="reference"
                        size="small">
                        <i class="las la-user"></i>
                    </el-button>
            </el-popover>

            
        </el-tooltip>
    </div>
</template>

<script>

export default {
    props: [
        'user'
    ],
    methods:{
        async logout() {
            await this.$store.dispatch("user/logout");
		},
    }
}
</script>

<style lang="scss" scoped>

</style>