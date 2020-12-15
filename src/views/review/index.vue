<template>
<el-main>
    <div class="app-container">
        <el-row type="flex" justify="center">
            <el-col :span="22">
                <el-table
                    size="small"
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
                                    v-if="announcement.title"
                                >: {{ announcement.title }}</span>
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

            const { data } = await axios.get("/revisions", {
                api: "revision",
                oauth: true
            });

            this.announcements = data.resources;
            //this.announcements = data.resources.announcements?;
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        openAnnouncement(announcement) {
            this.$router.push({
				name: 'revision.announcements.single',
				params: {
                    uuid: announcement.uuid,
                    title: announcement.name,
                    name: announcement.title
				}
			})
        },
    },
};
</script>
