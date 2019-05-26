<template>
  <div class="timeline">
    <el-card shadow="never">
      <search-result-list/>
    </el-card>
  </div>
</template>

<script>
import SearchResultList from '@/components/SearchResultList.vue'

export default {
  components: {
    SearchResultList
  }
}
</script>

<style>
</style>
