<template>
<div>
    <el-collapse 
        class="component-application"
        @change="$setHeights"
        v-model="active" 
        v-loading="loading"
        accordion>
        <slot name="top"></slot>
        <el-collapse-item 
            v-for="step in steps"
            :key="`step-${step.name}`"
            :name="step.name">
            <template slot="title">
                <strong>{{ step.title }}</strong>
            </template>
            <el-divider class="mt-0 mb-1"></el-divider>
            <div
                v-for="(field, index) in Object.values(step.values)"
                :key="`step-${step.name}-${index}`">
                <div 
                    v-if="field.value"
                    class="mb-2 px-5">
                    <div><strong>{{ field.label }}</strong></div>

                    <el-row v-if="field.type === 'file'">
                        <el-col
                            v-for="(file,index) in field.value"
                            :key="`${field.name}-${file.name}-${index}`"
                            :span="12"
                            :sm="24"
                            :xs="24">
                            <el-image
                                v-if="file.mime.indexOf('image') > -1"
                                :src="file.url"
                                :preview-src-list="[file.url]"
                                fit="fit"></el-image>
                            <el-alert
                                v-if="file.mime.indexOf('pdf') > -1"
                                type="info"
                                :closable="false"
                                show-icon>
                                Puede visualizar el archivo PDF haciendo <a :href="file.url" class="link" target="_blank">click aquí</a>. Tené en cuenta que el link estará disponible durante solo 5 minutos por cuestiones de seguridad. Si refrescas la pantalla podrás regenerar el link durante otros 5 minutos más
                            </el-alert>
                            <pdf-viewer
                                v-if="file.mime.indexOf('pdf') > -1"
                                :src="file.url">
                            </pdf-viewer>
                            <audio 
                                v-if="file.mime.indexOf('audio') > -1"
                                controls>
                                <source 
                                    :src="file.url" 
                                    :type="file.mime">
                                Tu navegador no soporta la reproducción de audio
                            </audio>
                            <video 
                                class="auto-height"
                                v-if="file.mime.indexOf('video') > -1"
                                controls>
                                <source 
                                    :src="file.url" 
                                    :type="file.mime">
                                Tu navegador no soporta la reproducción de video
                            </video>
                        </el-col> 
                        <el-col
                            v-if="field.value.length === 0"
                            :span="12"
                            :sm="24"
                            :xs="24">
                            <el-alert
                                type="info"
                                title="No se seleccionaron archivos"
                                show-icon
                                :closable="false">
                            </el-alert>
                        </el-col>
                    </el-row>

                    <div
                        v-else 
                        class="application-value"
                        v-html="renderValue(field)">
                    </div>
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>

</div>
</template>

<script>
import PdfViewer from '@/views/form-viewer/components/PdfViewer';
import moment from 'moment';



export default {

    data: () => ({
        active: ''
    }),

    props:{
        steps: Array
    },

    watch: {
        active() {
            this.$emit('change', this.active);
        }
    },

    mounted() {
        this.$setHeights();
    },
    
    methods: {
        renderValue(field) {
            if (field.type === 'date') {
                const date = moment(field.value);

                return date.format('DD/MM/YYYY');
            }

            return field.value;
        },

        $setHeights(){
            window.dispatchEvent(new Event('resize'));
        },

    },

    components: {
        PdfViewer
    }
}
</script>

<style lang="scss">
@import '@/styles/_variables';

.component-application {
    border-top: 0;

    .pdf-viewer,
    .el-alert,
    video,
    img {
        width: 100%;
        max-width: 600px;
    }

    .link {
        color: $text-secondary;
    }
    
    a,
    a * {
        font-size: 12px;
    }

    .el-collapse-item__header {
        padding: 0 20px;
        line-height: 14px;
        height: auto;
        min-height: 48px;
        background-color: transparent;
    }

    .application-value {
        white-space: pre-line;
    }
}
</style>