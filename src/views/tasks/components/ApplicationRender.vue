<template>
<div>

    <el-row type="flex" justify="end">
    <el-col class="mr-2" :span="2">
        <el-tooltip placement="top-start" content="Descargar en PDF">
            <el-button 
                icon="el-icon-download" 
                plain 
                circle 
                type="success" 
                @click="downloadPdf">
            </el-button>
        </el-tooltip>
    </el-col>
    </el-row>

    <el-collapse 
        id="component-application"
        @change="$setHeights"
        v-model="active" 
        accordion>
        <slot name="top"></slot>
        <el-collapse-item 
            v-for="step in application"
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
                                Puede visualizar el archivo PDF haciendo <a :href="file.url" class="link" target="_blank">click aquí</a>. Tené en cuenta que el link estará disponible durante solo 5 minutos por cuestiones de seguridad. Si refrescas la pantalla (<a href="#" class="link" @click.prevent="$refresh()"><i>refrescar ahora</i></a>) podrás regenerar el link durante otros 5 minutos más
                            </el-alert>
                            <pdf-viewer
                                v-if="file.mime.indexOf('pdf') > -1"
                                :src="file.url"></pdf-viewer>
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
                        v-html="renderValue(field)"></div>
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>
</div>
</template>

<script>
import PdfViewer from '@/views/tasks/components/PdfViewer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default {
    props: {
        application: Array,
        title: String,
        name: String
    },

    data: () => ({
        active: ''
    }),

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
                const date = this.$moment(field.value);

                return date.format('DD/MM/YYYY');
            }

            return field.value;
        },
         $setHeights() {
            window.dispatchEvent(new Event('resize'));
        },
        downloadPdf() {
            const doc = new jsPDF('p', 'pt', 'A4');
            const pageWidth = doc.internal.pageSize.getWidth() / 2 ;
         
            doc.text(`${this.name}`, pageWidth, 80,  {align: "center"});
            let large_name = doc.splitTextToSize(this.title, 250)
            doc.text(large_name, pageWidth, 100, {align: "center"});
          


            const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAABQCAMAAAAtID4BAAABhlBMVEUAAAD/zgwAAAAAAAAAAAACpFAAAAAEpFAMcboAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/srIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACpE8AAAACo1AAAAAAAAADpFAAAAAAAAAAAAAOqlUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADXHyYNc7wAAAAAAAAAAAALdLwAAAAAAAALcroAAADXHyYLcboLcroAAAALcrrXHycMcrrXHybXICYNcrsMcrraIyngJTAMcboAAAANdL33MjLXHybXHyfXICbXHybXHybYISjaISrYHyYPdLraJSsAAADXHybYICfZISjYHyb/zArXICfYICfZICbYICfbJCwDpFACpFAMcrwNcroDpU//zQ4Sdr8RqlUCo08LcbkAAAD/ywnWHybjWtYGAAAAfXRSTlMAPydqXfm+hqlFr6L7BJjFgMlmAf65Lyy1IoyECt1KBxmDcPimnD7x0Nh7b1PuqjIdFRKsWDUSzMKVkHP16od2OuROQd+mN30O0ivn1tFh6eHe2oqEfPjSjYEhDddQJQbxsGzLv0YtnTMa4d6POpSSeltPZRWmeVdOSiQcD2PTzEgAAAtQSURBVHja7NQxkQNADMDAI/iFx/NtajNIJ+yBoUYLYl8S0/dFM58XyfH/Iln+XiQDvSM56B3LQu9YBnpHctA7loXesQz0juSgdywLvWMZ6B3JQe9YFnrHMtA7koPesSz0zo8ce/1NGgrDAP6mzBoola6jOGgZd1FkEQIMEERgqHgjZp+8xA8mJiZGE6OfzfOv+55zSkWqpiZTiT7J0vV2Br8zntL+rXDr/N7e6TUaV+i8ojWbU/rFZBuNJkXJxV/IdTqH3GXyaL0z0TdiUuSUgRL9MHNdv0d+urq+Rz9PA0jQLyYe9ZwLn6Pn2jm1TsTeOcRGCueFHwPQJJXbgPVf4XPrhHrnT+PXtcj4Vyyr+8/gc+tE7R3Gn5vr0Hni474XDV/ln8Hn1onaO4x/tP22ho5Tax6QSNGyVqTddKojj1SKZcMZ9jbwM5OEXrW9MD6Mb/AP4iWjczPWIj+eXdUTkxtyCMs68kcfdfTObf+YPctqFeyOk5uSjHk0qXZydnu38bl1Qr0TFb+YgMwgS5wbQCpeAedMrlP3GJx0eY1fyKUhkj/dwt/n7fYG/uWHkBmPSGaah4zhsTJwiURWdXVMjEQcIO6Ak7wtz7gFmePVLuNz64R6Jyp+S7zDel0IZBT+wzGS4BwS5yU4M959pvDNPoCKcE3vfYufa/COG1/xC2JMOVFzOVDSHwi5r/g3xSEzcVDNx8+zvNgoXsuJ/E389HYYn1sncu8wfiOucuq/4X6G0Rn1qinx8WhqFg0AWaLlDNB5efQQCt8CHh6Z1KoC9da3+GLo/Mkan5cxzTMzDnAmIHkAo01mt95fBvinaVTKHi0bSTVDDjs3TgrzY39uJrZWKEz3gcEO43PrbOdBhG87x7zaBBaerJMzICbx05fF6kJ+QsrsWZB1lJT42SSSGol0gOoW/skCONy+4Hq3AObOrem0NgX4Z8BqffrsQOIbapW5g7QrGO8uPrdOuHci4lcBm2S6gC7xF0TBjoScER+7JFlqJJMF6gff4lOvAjS+4mdW1j27x6JcRnkgQyoB/mUgTzIHvLsn8btEGzt6dqlhZ64CxZ3F59aJ3juMb9xTGfFqn2kCzYW64JJfx7bcPQ3ui0pya4xUbjHJFr5YJE99/LaDda6QyQVjbuM3gQ6pVCW7Iw7ltBV+NoV1tJ3F59YJ50GUC+4mfkviZ36OP/yKPwvhcwzg4U2Jb7JcvTqs3pf4Bfwc30AY33sE3OIRznYZn1snau+E8TtB7cwBfQs/XDsj2coKKFw7DMbWSYnfAx6dSFcpOgMub+PfEMYqfFpvG38OpDziODuMz60TtXfC+Mzw1pO122fnEH6ZGbyNC66WRlIhDsMXXBGtDkh8G5iQSEqKXlr/l5+0AnyarWe+KS642/gWUCaRxQ7jP2HqSL0Txlft0NeIirz9qhnCX87U3VeclyipzbM4kZdLh79qynR9/DkwEEWzghQtHgO1JVEv/zYb4L8EKmWTzL06MKdtfNvXvr3DtaNaJ5xnkfBJG4M98+omK4TPPpy3LHdf4XuigY8fJQHsUQhfnqjw2wx6tTQZIK1E2RvpRwsAtQCfDDD//bHcGMLPVoCUlesjvbv4T3+A/zgaPmUHkElpFMZnJ/V4wVo/XljWILOI0/fxzZTEp6MxRG4eKlF1nyaYC1/xD0YViIzLFManVRKcdGP/z+G/eP/p3Z1Xr1/defPh4/OorRO9d/ZcV6Nv0zUGA6PrP1hzXZuklev21JZRVR/eoKnr+txXhvp+J7akzfRcN5jSluueqqESeu1U/MGsavtRYt/JqQdrrjv3p77k7B9a2eC1ySrzXHckd+YO9UtTsl23zSuu2/29+F/aN9fepKEwAL/CQoR1RSiTwdjAQTeyiDJFLnJxjhlHJJqYxSWgYZNdMqfzbrwlr/xzOZdyygqz3eKYrs+XJRucD0+75/S0p7vr7WcdHQd7H1pWqyO6czE5mfzWx3bHyJPXDSvVETyHi8lJ5LdeHnQG82yvYak6ojsXkhPIf7PRGc7mu9bw6tjdOaV8Zb1zPO39odWxu2NG/pdbg/gJAM2t/hN9Y/vBVvtJf/rfDKuO3R0z8ofu0Nlv6yTvfWgCQ9ld39CV//3g6tjdOZX8XXGOb+8o0EdjfbOj8W5gdezunEb+p4MOZ2MHjOzvdTQM577SrY7dnVPIb21rXXmpDPnP2NA+8cZYnRN3J+T3V2EYK35/Fv5RrMjfO35GBf18/GTfUJ0Td+c64jgMw4cYBNMse70JODdYkP9SS04DhiKuRNstU9UR3TkT+R5EvANG8oHAVTDBqOR/2uTum3Asmv2XpqojunMW8kMSIibAiBfxXMs/5Ff2DTgeZYuHp2mmOqI7ZyE/jBhAKfbPyW/we5g78CeafNZdN1THanei1yvj14I6+cuVhDoXGyg/cv1KIezvJWXlmlx0T0A/kRSWK4jTwHA4nfMQ9RfSQecMYsXpdPM702piehk4s1fk4mwUGKOS/0AYPRZxnDb3DdWx1p2bdSTc0+RHVCTEiwPkT5eQcjtG/eWQ8Mpp2KF8LSZhOSoejqe72oNOZCTobxeQ4FmDLks+JNyfU4AyGvm7vZaY4HWHcqivjvXuBOPEtISYY/KjSUQp+QgRnUb5D5Hjgi4uxJSvxDdxCuokOeOIj3vy1RoekX8FEVfrAb4TbZIMtIA4CYzRyD/UZlEz8Ll5s6WrjvXueBFn3NHoyiNk8he7ZmMAmTim1gzyHZ7M1SXHQwnxBX24l1BAmc0HQc8s4m26UyTZk19G9BaW1hw5xBWHIwbgkLBcBQjV6Psr2e43JshAfEIYjfwWu69w0AJTvOPrXFEdC90RqkppmuY4lZ8tYTkL7CRfHDbhXkGsUL8JMMKf0frIDy4fUyv9E66HSO8SlMghukkOl56RyN8RJ74Zmqz6W6I61rsT7j3pLlD5GURZ2y04ZZQ/sTw2NzZfpc+uo2Q3wVgW+nEEMMmde3rynaCTT79ZVrRxI3Qg32PdQCORzy/eG2CSbTZDKKI6lrtzu7fl4zGRT6pzP0lBfGqQ/2IGCRKLPo14/HZ/dQqIhWoXdwmlkJadCSGfH9hSkpKiv/GzgUR1RiG/zdZXYAqxGt4V1bHSHREASobKf4iChaPy5yXEGY8nx+WD20sPxRgI1hZQEOby89Av34E6ZulA9J0HPzBGIV9hGVkHs+wz+R9FdSx3p9B7tapC5NPz38EJHZXv4fOAg8inpOdyiJKuGEXUkYow+eNH5K8FsOzQiLCBnDkUC7MRyG+IBZZJDsTRotWx3p0M8gl2qUwlhbS3H0AxXuffxwBVVWXyWUxUdvKKjfWLc4yuaieTLwv5N7W90PMgYAPJ5BqKMBL5O6IilqK/xatjuTv8BZR8uivdh0Q+dZkght2rGYP8GtsgHs1T+dnVa+SDi/qbaC/IXzhuxDqXLxr3UImE6DXWqgMAYq7xrvjszPQa24O5DJyzl/+eyW+CKcSCeFtUx3p3qqTayZqEM0Q+e1nqUUKtBVAyZOcuYqrir7xCqngcccF1d1KsZdm6awU0niLO9smvkBTFVaDflaYKrhJiEUDlA5FMEUYhn8+fz8A8r9kMzatjvTti8yV62IQr9mqmrhvO/EgOCeUi27rvQ0q8ChpXEVcn9P2f6pMfo7MxkR8NS0gIFMhOaC8fyA1/g883BvHtaHYeEA7BPB/oN14DwI/L5vkKfaSnJ+tTGbipqtoNgan6U9e9JdCxKMsxEmfnVN0XTqdVtQhd5sP52mQlBqI6sqw7ZFlZliNwR5bHgBOSvXk5CIQ7anLVV+DBWg67apPhNNjY2Nj8D1w6V3yHC8Wvc8VbuFD8OlfY8s1jy7fl29jY2NjYnDd+A/OE4Hk6NECSAAAAAElFTkSuQmCC';
            
            doc.addImage(img, 'PNG', pageWidth - 75, 30, 160, 30,);

            this.application.map(step => {
                let body = [];

                for(let field in step.values) {
                    if(step.values[field].type !== 'file') {
                        body.push([step.values[field].label], [step.values[field].value]);
                    }
               } 
                let finalY = doc.lastAutoTable.finalY || 100;
                doc.autoTable({ 
                    head:[[step.title]] ,
                    startY: finalY + 50,
                    body,
                    styles: { overflow: 'linebreak'},
                    pageBreak: 'avoid',
                    alternateRowStyles:{fontStyle: "bold"}
                });
            });
           

            doc.save(`${this.title + '-' + this.name}.pdf`);
        }
    },

    components: {
        PdfViewer
    }
}
</script>

<style lang="scss">

#component-application {
    border-top: 0;
    margin-left: 5%;

    .pdf-viewer,
    .el-alert,
    video,
    img {
        width: 100%;
        max-width: 600px;
    }

    .link {
        color:red
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