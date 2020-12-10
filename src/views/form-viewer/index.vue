<template>
    <div>
        <download-pdf
            :steps="steps"
            :idnumber="idnumber"
            :type="type"/>
        <application-render :steps="steps"/>
    </div>
</template>

<script>
import ApplicationRender from '@/views/form-viewer/components/ApplicationRender';
import DownloadPdf from '@/views/form-viewer/components/DownloadPdf';

export default {
    computed:{
        steps (){
            return this.$route.params.application
        },
        idnumber (){
            return this.$route.params.title
        },
        type (){
            return this.$route.params.type
        }
    },

    components: {
        ApplicationRender,
        DownloadPdf
    },
}
</script>

