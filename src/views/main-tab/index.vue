<template>
    <div>
        <h1 v-for="access in user.accesses" :key="`access-${access.service.slug}`">{{access.service.slug}}</h1>
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
