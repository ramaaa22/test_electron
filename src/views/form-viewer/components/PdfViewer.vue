<template>
    <div 
        v-if="pdf"
        class="pdf-viewer">
        <pdf 
            v-for="page in pages"
            :key="`pdf-${page}`"
            :src="src"
            :page="page">
            <template slot="loading">
                <div class="text-center">Cargando..</div>
            </template>
        </pdf>
    </div>
</template>

<script>
import pdf from 'vue-pdf';

export default {
    props: [ 'src' ],

    data: () => ({
        pdf: false
    }),

    computed: {
        pages() {
            return this.pdf.numPages;
        }
    },

    async mounted() {
        try {
            this.pdf =  await pdf.createLoadingTask(this.src).promise;
        }
        finally {
            this.$emit('loaded');
        }
    },

    components: {
        pdf
    }
}
</script>