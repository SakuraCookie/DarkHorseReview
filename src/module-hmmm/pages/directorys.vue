<template>
  <div class="container">
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="subjects.id && subjects.name">
        <el-breadcrumb-item>学科管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ subjects.id ? subjects.name : '' }}</el-breadcrumb-item>
        <el-breadcrumb-item>目录管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索nav栏 -->
      <el-row>
        <el-col :span="18">
          <!-- 搜索框 -->
          <el-col :span="11">
            <el-form ref="subjectFrom" :model="queryList" label-width="80px">
              <el-form-item label="目录名称">
                <el-input class="inputCol" v-model="queryList.directoryName"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="queryList.state" placeholder="请选择" >
                  <el-option label="已启用" :value="1"> </el-option>
                  <el-option label="已禁用" :value="0"> </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="left-fot">
            <el-button size="small" class="colInput" plain @click="resetInput">清除</el-button>
            <el-button size="small" class="colInput" type="primary" @click="getDirectList">搜索</el-button>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-button class="colright" size="mini" type="success" icon="el-icon-edit" @click="addDialogVisible = true">新增学科</el-button>
          <el-button v-if="subjects.id && subjects.name" type="text" class="colright" icon="el-icon-back" @click="$router.back()">返回学科</el-button>
        </el-col>
      </el-row>
      <!-- 消息文案 -->
      <el-alert :title="`数据一共 ${counts} 条`" :closable="false" type="info" show-icon> </el-alert>

      <!-- 表格区域 -->
      <el-table :data="directoryList" style="width: 100%;">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
        <el-table-column prop="directoryName" label="目录名称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column prop="addDate" label="创建日期"> </el-table-column>
        <el-table-column prop="totals" label="面试数量"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            {{ scope.row.state === 1 ? '已启用' : '已禁用' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editState(scope.row)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
            <el-button type="text" :disabled="scope.row.state === 1" @click="editDirectorys(scope.row)">修改</el-button>
            <el-button type="text" :disabled="scope.row.state === 1" @click="removeDir(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <pagination-add :page="queryList.page" :pagesize="queryList.pagesize" :counts="counts" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
    </el-card>

    <!-- 添加目录弹框 -->
    <el-dialog title="新增目录" :visible.sync="addDialogVisible" width="35%" @close="restDir">
      <!-- 主体区域 -->
      <el-row>
        <el-col>
          <el-form :model="directorysForm" :rules="directorysFormRules" ref="directorysFormRef" label-width="80px" class="demo-ruleForm">
            <el-form-item v-if="!subjects.id && !subjects.name" class="elform" label="所属学科">
              <el-select v-model="directorysForm.value" placeholder="请选择" style="width: 100%;">
                <el-option :label="item.label" :value="item.value" v-for="item in addFrom" :key="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="elform" label="目录名称" prop="directoryName">
              <el-input v-model="directorysForm.directoryName" placeholder="请输入目录名称" style="width: 100%;"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDirForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改目录弹框 -->
    <el-dialog title="修改目录" :visible.sync="editDialogVisible" width="35%" @close="restDir">
      <!-- 主体区域 -->
      <el-row>
        <el-col>
          <el-form :model="editDirectoryList" :rules="directorysFormRules" ref="directorysFormRef" label-width="80px" class="demo-ruleForm">
            <el-form-item v-if="!subjects.id && !subjects.name" class="elform" label="所属学科">
              <el-select v-model="editDirectoryList.value" placeholder="请选择" style="width: 100%;">
                <el-option :label="item.label" :value="item.value" v-for="item in addFrom" :key="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="elform" label="目录名称" prop="directoryName">
              <el-input v-model="editDirectoryList.directoryName" placeholder="请输入目录名称" style="width: 100%;"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDirForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, remove, changeState, simple, update } from '../../api/hmmm/directorys.js'
import PaginationAdd from '../components/Pagination/pagination-add'

export default {
  name: 'Directorys',
  data () {
    return {
      // 数据id'
      infoId: '',
      // 修改请求数据
      editDirectoryList: {
        directoryName: '',
        value: ''
      },
      // 修改的弹框
      editDialogVisible: false,
      // 禁用状态
      isDisabled: false,
      // 验证
      directorysFormRules: {
        directoryName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 添加目录的数据
      directorysForm: {
        directoryName: '',
        // 下拉框的值
        value: ''
      },
      // 请求的参数
      queryList: {
        page: 1,
        pagesize: 10,
        directoryName: '',
        state: null
      },
      // 数据列表
      directoryList: [],
      // 总条数
      counts: 0,
      // 添加目录的弹框
      addDialogVisible: false,
      // 简单数据列表
      addFrom: []
    }
  },

  components: {
    PaginationAdd
  },

  // 调用请求
  created () {
    this.getDirectList()
    this.getAddFrom()
  },

  // 获取地址栏数据
  computed: {
    subjects () {
      return this.$route.query || null
    }
  },

  // 侦听地址栏数据
  watch: {
    '$route.query' () {
      this.getDirectList()
    }
  },
  methods: {
    // 切换状态
    async editState (row) {
      console.log(row)
      try {
        await changeState({
          id: row.id,
          state: row.state === 1 ? 0 : 1
        })
        this.$message.success('操作成功')
        row.state = row.state === 1 ? 0 : 1
      } catch (e) {
        this.$message.error('请求错误!')
      }
    },

    // 删除
    async removeDir (row) {
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
        this.getDirectList()
      } catch (e) {
        this.$message.error('删除失败!')
      }
    },

    // 获取学科简单列表
    async getAddFrom () {
      try {
        const { data } = await simple()
        this.addFrom = data
      } catch (e) {
        console.log(e)
      }
    },

    // 修改
    async editDirForm () {
      try {
        if (this.subjects.id && this.subjects.name) {
          await update({
            id: this.infoId,
            subjectID: +this.subjects.id,
            directoryName: this.editDirectoryList.directoryName
          })
          this.$message.success('修改目录成功')
          this.editDialogVisible = false
          this.getDirectList()
        } else {
          await update({
            id: this.infoId,
            subjectID: this.editDirectoryList.value,
            directoryName: this.editDirectoryList.directoryName
          })
          this.$message.success('修改目录成功')
          this.editDialogVisible = false
          this.getDirectList()
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 点击修改显示弹框
    editDirectorys (row) {
      this.editDirectoryList.value = row.subjectID
      // console.log(row.subjectID)
      // console.log(row)
      this.infoId = row.id
      this.editDirectoryList.directoryName = row.directoryName
      this.editDialogVisible = true
    },

    // 添加
    async addDirForm () {
      try {
        if (this.subjects.id && this.subjects.name) {
          await add({
            subjectID: +this.subjects.id,
            directoryName: this.directorysForm.directoryName
          })
          this.$message.success('新增目录成功')
          this.addDialogVisible = false
          this.getDirectList()
        } else {
          await add({
            subjectID: this.directorysForm.value,
            directoryName: this.directorysForm.directoryName
          })
          this.$message.success('新增目录成功')
          this.addDialogVisible = false
          this.getDirectList()
        }
      } catch (e) {
        this.$message.error('新增目录失败')
        console.log(e)
      }
    },

    // 重置表单
    restDir () {
      this.$refs.directorysFormRef.resetFields()
      this.directorysForm.value = ''
    },
    // 清除数据
    resetInput () {
      this.queryList.directoryName = ''
      this.queryList.state = null
      this.getDirectList()
    },

    // 请求目录列表
    async getDirectList () {
      // const res = await list(this.page)
      // console.log(res)
      // this.directoryList = res.data.items
      // // console.log(res.data.items)z
      // this.counts = res.data.counts
      this.queryList.subjectID = this.subjects.id || null
      const { data } = await list(this.queryList)
      // data.items.forEach(item => {
      //   item.addDate = this.$dayjs(item.addDate).format('YYYY-MM-DD hh:mm:ss')
      // })
      // this.directoryList = res.data.items
      // this.counts = res.data.counts
      this.directoryList = data.items
      this.counts = data.counts
    },

    // 一页多少条
    handleSizeChange (newSize) {
      this.queryList.pagesize = newSize
      this.getDirectList()
    },

    // 多少页
    handleCurrentChange (newPage) {
      this.queryList.page = newPage
      this.getDirectList()
    }
  }
}

</script>

<style scoped lang='less'>
.container{
  box-sizing: border-box;
  margin: 3px 3px 8px 3px;
  background-color: #fafafa;
  border-radius:8px ;
  min-height: 600px;
    .el-form {
          display: flex;
    }

}
</style>
