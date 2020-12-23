<template>
    <el-main>
        <div
            id="tabs-container"
            class="app-container">
            <el-tabs
                type="border-card"
                v-model="tabs.active"
                @tab-remove="removeTab">
                <el-tab-pane
                    name="users"
                    label="Usuarios"
                    :closable="false">
                    <total-users-table
                        :users="users"
                        @actualize-users="retrieveUsers"
                        @open-user="userOpenPermissions"
                    />
                </el-tab-pane>
                <el-tab-pane
                    v-for="tab in tabs.items"
                    :key="tab.name"
                    :label="tab.title"
                    :name="tab.name"
                    :closable="true"
                >
                    <component
                        @actualize-user-edit="actualizeEdit"
                        :is="tab.component"
                        v-bind="tab.props"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-main>
</template>
<script>
    import TotalUsersTable from "@/views/rbac/usuarios/components/TotalUsersTable";
    import UserPermissions from "@/views/rbac/usuarios/components/UserPermissions"; 
    import axios from "@/utils/request";

    export default {
        data: () => ({
            tabs: {
                active: "users",
                items: [],
            },
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
                    row,
                    component:"user_permissions"
                };
                this.$emit('open-tab', props);
                /*const tab = this.tabs.items.find((tab) => tab.name === name);
                if (!tab)
                    this.tabs.items.push({
                        name,
                        title: `Permisos de ${row.firstname} ${row.lastname}`,
                        component: "user-permissions",
                        props: { row },
                    });
                this.tabs.active = name;*/
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
            removeTab(target_name) {
                const tabs = this.tabs.items;
                const active_name = this.tabs.active;
                if (active_name === target_name) this.tabs.active = "users";
                this.tabs.items = tabs.filter((tab) => tab.name !== target_name);
            },
        },

        components: {
            TotalUsersTable,
            UserPermissions,
        },
    };
</script>

