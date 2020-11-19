<template>
    <el-card class="m-1">
        <div class="is-flex is-justify-center">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
        </div>
        <div class="mt-4">
            <h6>Nombre</h6>
            <h6>{{user_info.firstname + ' ' + user_info.lastname}}</h6>
        </div>
        <div class="mt-2">
            <h6 >Documento</h6>
            <h6>{{user_info.idnumber}}</h6>
        </div>
        <div class="mt-2">
            <h6 >Email</h6>
            <h6>{{user_info.email}}</h6>
        </div>
    </el-card>
</template>

<script>

export default {
    data:() =>({

    }),

    props:['user_info']
} 
</script>

<style>

</style>