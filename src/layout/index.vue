<template>
  
            <div 
                key="app" 
                class="app-wrapper"> 
                    <app-main />
            </div>

</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        },
        device() {
            return this.$store.state.app.device;
        },
        fixedHeader() {
            return this.$store.state.settings.fixedHeader;
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile",
            };
        },
    },

    async created() {
        await this.$store.dispatch('user/retrieveUser');
    },

    mixins: [
        ResizeMixin
    ],

    components: {
        Navbar,
        Sidebar,
        AppMain,
    }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/_mixin.scss";
@import "~@/styles/_variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sidebar-width});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

</style>
