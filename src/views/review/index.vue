<template>
<el-main>
    <div class="app-container">
        <el-row type="flex" justify="center">
            <el-col>
                <el-table
                    size="mini"
                    v-loading="loading"
                    :data="announcements"
                    element-loading-text="Cargando"
                    border
                    fit
                    :stripe=true
                    highlight-current-row
                    @row-click="openAnnouncement"
                    cell-class-name="pointer"
                >
                    <el-table-column label="Convocatoria"
                        align="center"
                    >
                        <template slot-scope="{ row: announcement }">
                            <div>
                                {{ announcement.name }}
                                <span
                                    v-if="announcement.title"> 
                                    {{ announcement.title }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</el-main>
</template>

<script>
import axios from "@/utils/request";

export default {
    data: () => ({
        announcements: [],
        loading: false,
    }),

    async mounted() {
        try {
            this.loading = true;
            //API SEBA OK!
            const { data } = await axios.get("/revisions", {
                api: "revision",
                oauth: true
            });

            this.announcements = data.resources;
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        openAnnouncement(announcement) {
             const props = {
                title: announcement.title,
                name: announcement.title,
                component: 'reviewsingle',
                prop: announcement.uuid,
            }

            this.$emit('open-tab', props);
           
        },
    },
};
</script>
