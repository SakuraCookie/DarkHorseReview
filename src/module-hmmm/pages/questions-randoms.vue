<template>
  <div class="randoms">
    <el-card  class="container">
      <div class="head">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-row class="demo-input-suffix" type="flex" justify="space-between">
            <el-form-item label="关键字">
              <el-input
                v-model="formInline.keyword"
                placeholder="根据编号搜索"
                 @change="onSubmit(formInline.keyword)"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="formInline.keyword = ''"
                >清除</el-button
              >
              <el-button

                type="primary"
                @click="onSubmit(formInline.keyword)"
                size="small"
                >搜索</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <!-- 表格数据 -->
      <el-row>
        <el-alert
          :title="`数据一共 ${total} 条`"
          type="info"
          show-icon
          :closable="false"
        >
        </el-alert>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="编号" width="220">
            <span slot-scope="{ row }">
              {{ row.id }}
            </span>
          </el-table-column>
          <el-table-column label="题型" width="80">
            <template slot-scope="{ row }">
              <div v-if="row.questionType == '1'">
                单选
              </div>
              <div v-else-if="row.questionType == '2'">
                多选
              </div>
              <div v-else>
                简答
              </div>
            </template>
          </el-table-column>
          <el-table-column label="题目编号" width="220">
            <template slot-scope="{ row }">
              <div v-for="(item, index) in row.questionIDs" :key="index">
                <div>
                  <a class="a_color" href="javascript:;"
                   @click="isDialogVisibleShow(item.id)"
                  >
                    {{ item.number }}
                  </a>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="录入时间" width="180">
            <span slot-scope="{ row }">
              {{ row.addTime }}
            </span>
          </el-table-column>
          <el-table-column label="答题事件（s）">
            <span slot-scope="{ row }">
              {{ row.totalSeconds }}
            </span>
          </el-table-column>
          <el-table-column label="正确率（%）" prop="accuracyRate">
          </el-table-column>
          <el-table-column label="录入人" prop="userName"> </el-table-column>
          <el-table-column label="操作">
            <el-button
              slot-scope="{ row }"
              type="danger"
              icon="el-icon-delete"
              plain
              circle
              @click="handleDelete(row.id)"
            ></el-button>
          </el-table-column>
        </el-table>
        <div class="block" >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[20, 30, 50, 100]"
            :page-size="20"
            layout=" prev, pager, next,sizes, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <el-dialog
  title="题目预览"
  :visible.sync="dialogVisible"
  width="45%"

  :before-close="handleClose">
  <!-- v-if="dialogVisible" -->
  <QuestionsTopicPreview  v-if="dialogVisible" :ListId="currentId"></QuestionsTopicPreview>
  <span slot="footer" class="dialog-footer" >
    <!-- <el-button @click="dialogVisible = false">关闭</el-button> -->
    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
  </span>
</el-dialog>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { randoms, removeRandoms } from '../../api/hmmm/questions'
import QuestionsTopicPreview from '../components/questions-topicPreview.vue'

// container
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pagesize: 10,
        keyword: '' // 搜索关键字
      },
      dialogVisible: false,
      currentPage4: 4,
      total: 0,
      tableData: [],
      currentId: null
      // page: 1, // 页码数
      // pagesize: 10, // 一页几条数据
      // keyword: '' // 搜索关键字
    }
  },
  components: { QuestionsTopicPreview },
  created () {
    this.randomsList()
  },
  methods: {
    isDialogVisibleShow (id) {
      this.dialogVisible = true
      console.log(id)

      // 保存当前点击的那条数据的id
      this.currentId = id
    },
    // 弹层方法
    handleClose (done) {
      this.dialogVisible = false
    },
    // 获取题组列表方法
    async randomsList () {
      const res = await randoms(this.formInline)
      // console.log(res)
      this.tableData = res.data.items
      this.total = res.data.counts
      this.formInline.keyword = ''
    },
    // 搜索关键字方法
    onSubmit () {
      this.randomsList()
    },
    // 删除方法
    handleDelete (id) {
      this.$confirm('此操作将永久删除该题组, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async (action) => {
          await removeRandoms({
            id: id
          })
          // 删除成功重新渲染页面
          this.randomsList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(() => {
        })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.formInline.pagesize = val
      this.randomsList()
    },
    handleCurrentChange (val) {
      this.formInline.page = val
      // 更新页面
      this.randomsList()
    }
  }

}
</script>

<style scoped lang="less">
.randoms {
  box-sizing: border-box !important;
  width: 100%;
  // margin: 15px 30px 90px 18px;
  // margin-right: 30px;
  // padding: 0 20px 0;
  height: 100%;
  // background-color: #ffffff;
 .container{
  margin: 15px 12px 90px 18px;
 }
  .head {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 20px;

    .demo-input-suffix {
      align-items: center;
    }
  }
}

.demo-form-inline {
  width: 100%;
}

.el-table--enable-row-hover {
  margin-top: 20px;
}

/deep/.a_color {
  color: #0099ff;
  text-overflow: ellipsis;
}
.block{
  display: flex;
  justify-content: end;
}
/deep/.el-dialog__footer{
      display: flex;
    justify-content: end;
}
</style>
