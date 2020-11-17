<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <router-view/>
        </transition>
    </section>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
    name: "AppMain",

    data: () => ({

    }),

    methods: {

    },
};
</script>

<style scoped lang="scss">
.app-main {
    /*50 = navbar  */
    background: white;
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}
.fixed-header + .app-main {
    padding-top: 50px;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
