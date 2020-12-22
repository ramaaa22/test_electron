<template>
    <div>
        <div v-for="access in user.accesses" :key="`access-${access.service.slug}`">
            <h1>{{access.service.slug}}</h1>
            <button @click="open(access.service)"
                >Ir a {{access.service.slug}} </button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['user'])
    },
    methods:{
        open(service){
            const props={
                name:service.slug,
                title:service.slug,
                component:service.slug,
                row:service.slug
            }
            this.$emit('open-tab',props);
        }
    }
}
</script>
