<template>
    <el-main>
        <div
            id="tabs-container"
            class="app-container">
                <total-users-table
                    v-if="users"
                    :users="users"
                    @actualize-users="retrieveUsers"
                    @open-user="userOpenPermissions"
                />
        </div>
    </el-main>
</template>
<script>
    import TotalUsersTable from "@/views/rbac/usuarios/components/TotalUsersTable";
    import UserPermissions from "@/views/rbac/usuarios/components/UserPermissions"; 
    import axios from "@/utils/request";

    export default {
        data: () => ({
            users: [],
        }),

        async mounted() {
            try {
                const { data } = await axios.get("/users", {
                    api: "users",
                    oauth: true,
                });
                this.users = data.resources;
            }
            catch (error) {
                console.log(error);
            }
        },
        methods: {
            userOpenPermissions(row) {
                const tab_title =`Permisos de ${row.firstname} ${row.lastname}`;
                const name = `user-${row.uuid}`;
                const props={
                    name,
                    title:tab_title,
                    prop:row,
                    component:"user_permissions"
                };
                this.$emit('open-tab', props);
            
            },
            async retrieveUsers() {
                try {
                    this.loading = true;
                    const { data } = await axios.get("/users", {
                        api: "users",
                        oauth: true,
                    });
                    this.users = data.resources;
                }
                catch (error) {
                    console.log(error);
                }
            },

            async actualizeEdit(uuid) {
                const name = `user-${uuid}`;
                const tab = this.tabs.items.find((tab) => tab.name === name);
                await this.retrieveUsers();
                const row = this.users.find((user) => user.uuid === uuid);
                tab.props = { row };
                const row_title = `Permisos de ${row.firstname} ${row.lastname}`;
                if (row_title !== tab.title) {
                    tab.title = row_title;
                }
            },
            
        },

        components: {
            TotalUsersTable,
            UserPermissions,
        },
    };
</script>

