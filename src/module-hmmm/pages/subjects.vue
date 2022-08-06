<template>
  <div class="container">
    <!-- 卡片主体区域 -->
    <el-card class="box-card">
      <!-- 搜索栏 -->
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 搜索框 -->
          <el-col :span="6">
            <el-form
              ref="subjectFrom"
              :model="queryList"
              label-width="80px"
            >
              <el-form-item label="学科名称">
                <el-input
                  @clear="getSubjectsList"
                  v-model="queryList.subjectName"
                  style="height: 32px;"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="18">
            <el-button
              size="small"
              class="colInput"
              plain
              @click="clearSub"
            >清除</el-button>
            <el-button
              size="small"
              class="colInput"
              type="primary"
              @click="getSubjectsList"
            >搜索</el-button>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-button
            class="colright"
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="addSubjects"
          >新增学科</el-button>
        </el-col>
      </el-row>

      <!-- 消息文案 -->
      <el-alert
        :title="`数据一共 ${counts} 条`"
        :closable="false"
        type="info"
        show-icon
      > </el-alert>

      <!-- 表格区域 -->
      <template>
        <el-table
          :data="list"
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100%"
          > </el-table-column>
          <el-table-column
            prop="subjectName"
            label="学科名称"
            width="140%"
          > </el-table-column>
          <el-table-column
            prop="username"
            label="创建者"
          > </el-table-column>
          <el-table-column
            prop="addDate"
            label="创建日期"
          > </el-table-column>
          <el-table-column
            prop="isFrontDisplay"
            label="前台是否显示"
            width="120%"
          >
            <template slot-scope="scope">
              {{ scope.row.isFrontDisplay === 1 ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="twoLevelDirectory"
            label="二级目录"
            width="120%"
          > </el-table-column>
          <el-table-column
            prop="tags"
            label="标签"
            width="120%"
          > </el-table-column>
          <el-table-column
            prop="totals"
            label="题目数量"
            width="120%"
          > </el-table-column>
          <el-table-column
            label="操作"
            width="280%"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                @click="$router.push(`directorys?id=${scope.row.id}&name=${scope.row.subjectName}`)"
              >学科分类</el-button>
              <el-button
                size="small"
                type="text"
                @click="$router.push(`tags?id=${scope.row.id}&name=${scope.row.subjectName}`)"
              >学科标签</el-button>
              <el-button
                size="small"
                type="text"
                @click="editSubList(scope.row)"
              >修改</el-button>
              <el-button
                size="small"
                type="text"
                @click="deleteSub(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页区域 -->
      <pagination-add
        :page="queryList.page"
        :pagesize="queryList.pagesize"
        :counts="counts"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </el-card>

    <!-- 添加的弹框 -->
    <el-dialog
      title="新增学科"
      :visible.sync="addDialogVisible"
      width="20%"
      @close="resetSub"
    >
      <!-- 主体区域 -->
      <el-row>
        <el-col>
          <el-form
            :model="addSubjectsFrom"
            :rules="addSubjectsFromRules"
            ref="addSubjectsFromRef"
            label-width="80px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="学科名称"
              prop="subjectName"
            >
              <el-input
                v-model="addSubjectsFrom.subjectName"
                placeholder="请输入学科名称"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <span class="subspan">是否显示</span>
        <el-switch
          v-model="SubSwitchValue"
          active-color="#13ce66"
          inactive-color="#ff4949"
        > </el-switch>
      </el-row>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addSubFrom"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的弹框 -->
    <el-dialog
      title="修改学科"
      :visible.sync="editDialogVisible"
      width="20%"
      @close="editResetSub"
    >
      <!-- 主体区域 -->
      <el-row>
        <el-col>
          <el-form
            :model="editSubjectsFrom"
            :rules="editSubjectsFromRules"
            ref="editSubjectsFromRef"
            label-width="80px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="学科名称"
              prop="subjectName"
            >
              <el-input v-model="editSubjectsFrom.subjectName"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <span class="subspan">是否显示</span>
        <el-switch
          v-model="editSubjectsFrom.isFrontDisplay"
          active-color="#13ce66"
          inactive-color="#ff4949"
        > </el-switch>
      </el-row>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editSubFrom"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Subject from '@/api/hmmm/subjects.js'
import { list, remove, update, add } from '@/api/hmmm/subjects.js'
import PaginationAdd from '../components/Pagination/pagination-add'
export default {
  name: 'Subjects',
  data () {
    return {
      // 修改的id
      userId: '',
      // 修改的默认表单值
      editSubjectsFrom: {
        subjectName: '',
        isFrontDisplay: ''
      },
      // 修改的验证
      editSubjectsFromRules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 修改学科的弹框显示
      editDialogVisible: false,
      // 添加学科是否显示的开关
      SubSwitchValue: true,
      // 添加的验证
      addSubjectsFromRules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 添加的输入框数据
      addSubjectsFrom: {
        subjectName: ''
      },
      // 添加的弹框显示与隐藏
      addDialogVisible: false,
      // 获取学科列表的请求参数
      queryList: {
        page: 1, // 当前页
        pagesize: 10, // 页尺寸
        subjectName: ''
      },
      // 学科的数据列表
      list: [],
      // 学科列表总条数
      counts: 0
    }
  },
  components: {
    PaginationAdd
  },
  created () {
    this.getSubjectsList()
  },
  computed: {
    isFrontDisplay () {
      if (this.SubSwitchValue) {
        return 1
      } else {
        return 0
      }
    }
  },
  methods: {
    // 删除学科
    async deleteSub (row) {
      const configRuselt = await this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (configRuselt !== 'confirm') {
        return this.$message('您取消了删除操作!')
      }
      try {
        const { data } = await remove(row)
        console.log(data)
        this.$message.success('删除成功!')
        this.getSubjectsList()
      } catch (e) {
        this.$message.error('删除失败!')
      }
    },
    // 修改学科
    async editSubFrom () {
      if (this.editSubjectsFrom.isFrontDisplay === true) {
        this.editSubjectsFrom.isFrontDisplay = 1
      } else {
        this.editSubjectsFrom.isFrontDisplay = 0
      }
      try {
        await update({
          id: this.userId,
          subjectName: this.editSubjectsFrom.subjectName,
          isFrontDisplay: this.editSubjectsFrom.isFrontDisplay
        })
        this.$message.success('修改学科成功')
        this.editDialogVisible = false
        this.getSubjectsList()
      } catch (e) {
        this.$message.error('修改学科失败')
      }
    },
    // 修改清空
    editResetSub () {
      this.$refs.editSubjectsFromRef.resetFields()
    },
    // 点击修改显示弹框
    editSubList (info) {
      this.editSubjectsFrom.subjectName = info.subjectName
      if (info.isFrontDisplay === 1) {
        this.editSubjectsFrom.isFrontDisplay = true
      } else {
        this.editSubjectsFrom.isFrontDisplay = false
      }
      this.userId = info.id
      this.editDialogVisible = true
    },
    // 添加学科
    async addSubFrom () {
      try {
        await add({
          subjectName: this.addSubjectsFrom.subjectName,
          isFrontDisplay: this.isFrontDisplay
        })
        this.$message.success('新增学科成功')
        this.addDialogVisible = false
        this.getSubjectsList()
      } catch (e) {
        this.$message.error('新增学科失败')
      }
    },
    // 重置输入框
    resetSub () {
      this.$refs.addSubjectsFromRef.resetFields()
    },
    // 点击新增学科显示弹出框
    addSubjects () {
      this.addDialogVisible = true
    },

    // 点击清除按钮清空input输入框
    clearSub () {
      this.queryList.subjectName = ''
      this.getSubjectsList()
    },
    // 获取学科的列表数据
    async getSubjectsList () {
      try {
        const res = await list(this.queryList)
        // data.items.forEach(item => {
        //   item.addDate = this.$dayjs(item.addDate).format('YYYY-MM-DD hh:mm:ss')
        // })
        this.list = res.data.items
        this.counts = res.data.counts
        // this.page.total = res.data.counts
        console.log(res)
      } catch (e) {
        this.$message.error('请求数据失败')
      }
    },
    // 一页多少条
    handleSizeChange (newSize) {
      this.queryList.pagesize = newSize
      this.getSubjectsList()
    },
    // 多少页
    handleCurrentChange (newPage) {
      this.queryList.page = newPage
      this.getSubjectsList()
    }
  }
}
</script>

<style scoped lang='scss'>
.container {
  .colInput {
    height: 35px;
  }
  .colright {
    float: right;
    height: 35px;
  }
  .subspan {
    font-size: 14px;
    font-weight: 700;
    margin-right: 10px;
    margin-left: 10px;
  }
  .el-alert {
    margin-bottom: 20px;
  }
  .el-pagination {
    float: right;
    margin-top: 20px;
  }
}
</style>
