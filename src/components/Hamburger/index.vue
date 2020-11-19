<template>
  <div style="padding: 5px 15px;" @click="toggleClick">
  
    <i class="las la-indent fs-8 color-white"
          :class="{'is-active':isActive}"
></i>
    
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
 
  width: 20px;
  height: 20px;
}

.is-active {
  transform: rotate(180deg);
}
</style>
