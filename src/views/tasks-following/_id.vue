<template>
<el-main>
    <div class="app-container">
        <div class="text-right mb-2 pt-2 pr-5 actions">
               <el-button
                    size="mini"
                    type="success"
                    icon="las la-filter" 
                    plain
                    circle></el-button>

                <el-button
                    size="mini"
                    type="success"
                    icon="las la-filter" 
                    plain
                    circle></el-button>
        </div>

       <el-table
            size="mini"
            v-loading="loading"
            :data="applications"
            border
            fit
            highlight-current-row>
       </el-table>
        
    </div>
</el-main>
</template>

<script>
export default {
        
}
</script>

<style lang="scss" scoped>
    .actions {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            .el-button {
                width: 34px;
                height: 34px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
            }
    }
</style>

