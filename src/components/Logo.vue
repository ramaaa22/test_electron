<template>
    <img 
        draggable="false"
        :src="src" 
        :alt="alt">
</template>

<script>
export default {
    props: {
        color: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        src() {
            return this.color
                ? '/images/fna-logo-color.png'
                : '/images/fna-logo-blanco.png';
        },
        alt() {
            return this.color
                ? 'Logo FNA Color'
                : 'Logo FNA Blanco';
        }
    }
}
</script>