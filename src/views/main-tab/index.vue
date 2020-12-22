<template>
    <div>
        <h1>hola</h1>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['user'])
    },

    mounted(){
        console.log(this.user)
    }
}
</script>
