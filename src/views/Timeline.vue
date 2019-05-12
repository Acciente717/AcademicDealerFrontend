<template>
  <div class="timeline">
    <h1>This is an timeline page</h1>
    <summary-card-lab/>
    <summary-card-seminar/>
    <summary-card-project :id="1"/>
  </div>
</template>

<script>
import SummaryCardLab from '@/components/SummaryCardLab.vue'
import SummaryCardProject from '@/components/SummaryCardProject.vue'
import SummaryCardSeminar from '@/components/SummaryCardSeminar.vue'

export default {
  components: {
    SummaryCardLab,
    SummaryCardProject,
    SummaryCardSeminar
  }
}
</script>

<style>
</style>
