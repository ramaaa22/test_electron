<template>
    <div>
        <el-tooltip content="Mi Usuario">
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
    ]
}
</script>

<style lang="scss" scoped>

</style>