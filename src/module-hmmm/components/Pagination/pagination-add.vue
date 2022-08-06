<template>
  <div class="pagination-container">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pagesize"
      layout="prev, pager, next, sizes, jumper"
      :total="counts"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'PaginationAdd',
  props: {
    page: {
      type: Number,
      required: true
    },
    pagesize: {
      type: Number,
      required: true
    },
    counts: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 一页多少条
    handleSizeChange (newSize) {
      this.$emit('handleSizeChange', newSize)
    },

    // 多少页
    handleCurrentChange (newPage) {
      this.$emit('handleCurrentChange', newPage)
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  float: right;
  margin: 20px;
}
.pagination-container {
  margin: 0;
}
</style>
