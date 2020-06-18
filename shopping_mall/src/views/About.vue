<template>
  <div class="about">
    <s-header :name="'关于我们'"></s-header>
    <div class="about-body">
      Simple_Mall
    </div>
  </div>
</template>

<script>
import sHeader from '@/components/SimpleHeader'
export default {
  components: {
    sHeader
  },
}
</script>

<style lang="less" scoped>
  .about {
    .about-body {
      margin-top: 44px;
    }
  }
</style>
