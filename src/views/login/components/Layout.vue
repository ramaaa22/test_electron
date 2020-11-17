<template>
    <el-card>
        <div
            class="text-center mb-2">
            <logo width="70%" />
        </div>
        <slot></slot>
    </el-card>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
    #form-box {
        min-width: 300px;
        width: 100%;
        max-width: 400px;
    }
</style>