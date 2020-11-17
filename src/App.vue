<template>
    <div id="app">
        <h1>test</h1>
        <router-view />
    </div>
</template>

<script>
export default {
    created() {
        this.change_title();
    },

    watch: {
        $route: 'change_title',
    },

    methods: {
        change_title() {
           if(this.$route.params.title){
                let title_dinamyc = this.$route.params.title;
                document.title = `${title_dinamyc} - FNA`;
            }

        },
    },
};
</script>
