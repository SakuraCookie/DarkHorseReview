<template>
  <div class='container'>
    <el-card>
      <!-- 头部搜索 -->
      <el-row :gutter="3">
        <el-col :span="18">
          <el-form label-width="80px" inline>
            <el-form-item label="标签名称">
              <el-input v-model="TagInput"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="value" placeholder="请选择">
                <el-option label="启用" value="启用"></el-option>
                <el-option label="禁用" value="禁用"></el-option>
              </el-select>
          </el-form-item>
            <el-button size="small" @click="onClear">清除</el-button>
            <el-button type="primary" size="small" @click="onSearch">搜索</el-button>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <el-button icon="el-icon-edit" size="small" type="success" @click="onTagsAdd">新增标签</el-button>
        </el-col>
      </el-row>
      <!-- 显示总条数 -->
      <el-alert
        style="margin:10px 0px"
        type="info"
        :closable="false"
        show-icon>
        <span slot="title">数据一共{{page.total}}条</span>
      </el-alert>
      <!-- 表格信息部分 -->
       <el-table
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type=index
          label="序号"
          width="100"
          >
        </el-table-column>
        <el-table-column
          prop="subjectName"
          label="所属学科"
          >
        </el-table-column>
        <el-table-column
          prop="tagName"
          label="标签名称"
          >
        </el-table-column>
        <el-table-column
          prop="username"
          label="创建者"
         >
        </el-table-column>
        <el-table-column
          label="创建日期"
         >
         <template v-slot="{row}">{{row.addDate | formatDate}}</template>
        </el-table-column>
        <el-table-column
          label="状态"
          >
          <template v-slot="{row}">{{row.state?'已启用' : '已禁用'}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
            <template v-slot="{row}">
              <el-button type="text" @click="onMachine(row)">{{row.state? '禁用' : '启用'}}</el-button>
              <el-button type="text" :disabled="row.state? false : true" @click="onUpdate(row)">修改</el-button>
              <el-button type="text" :disabled="row.state? false : true" @click="onDelete(row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-row type="flex" justify="end">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          :page-size="page.pagesize"
          :current-page="page.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </el-row>
    </el-card>
    <tags-add :showTagsAdd.sync="showTagsAdd" :list="list" :currentList="currentList" :currentListId="currentListId"></tags-add>
  </div>
</template>

<script>
import tagsAdd from '../components/tags-add.vue'
// import { formatDate } from '../filters/index.js'
import { list, remove, changeState, detail } from '@/api/hmmm/tags.js'
import { detail as details, simple } from '@/api/hmmm/subjects.js'
export default {
  components: { tagsAdd },
  name: 'FeatureTags',
  data () {
    return {
      TagInput: '',
      showTagsAdd: false, // 控制添加修改标签弹层显示
      value: '', // 下拉选择双向绑定
      tableData: [], // 标签列表
      list: [], // 所属学科列表
      page: {
        page: 1, // 当前页
        pagesize: 10, // 每页条数
        total: 0 // 总条数
      },
      currentList: {}, // 当前列所属学科信息
      currentListId: {} // 当前列标签信息
    }
  },
  created () {
    this.detail()
  },
  mounted () {

  },
  methods: {
    // 获取标签数据
    async detail () {
      let state
      // 判断搜索是启用还是禁用
      if (this.value) {
        state = this.value === '启用' ? '1' : '0'
      }
      // 准备入参数据
      const data = {
        page: this.page.page,
        pagesize: this.page.pagesize,
        tagName: this.TagInput,
        state: state
      }
      // 发送请求
      const { data: { counts, items } } = await list(data)
      // console.log(data)
      this.tableData = items
      this.page.total = counts
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.page.pagesize = val
      this.detail()
      // this.detail({ pagesize: val })
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page.page = val
      this.detail()
    },
    // 清除按钮
    onClear () {
      this.TagInput = ''
      this.value = ''
      this.detail()
    },
    // 删除按钮
    onDelete (data) {
      console.log(data)
      this.$confirm('该操作将永久删除该标签,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        // 发送请求
        await remove(data)
        // 若是最后一页最后一条数据，则返回上一页
        if (this.page.page > 1 && (this.page.total - 1) % this.page.pagesize === 0) this.page.page -= 1
        // 提示成功
        this.$message({
          message: '删除成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        // 重新渲染列表
        this.detail()
      }).catch(() => {

      })
    },
    // 启用禁用按钮
    async onMachine (row) {
      console.log(row)
      // this.isLoading = true
      // if (this.isLoading) return
      if (row.state === 0) {
        await changeState({ id: row.id, state: 1 })
      }
      if (row.state === 1) {
        await changeState({ id: row.id, state: 0 })
      }
      this.$message({
        message: '操作成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.detail()
      // this.isLoading = false
    },
    // 搜索功能
    onSearch () {
      try {
        if (this.TagInput || this.value) {
          this.detail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 新增标签
    async onTagsAdd () {
      // 请求数据
      const res = await simple()
      console.log(res)
      this.list = res.data
      // 开启弹层
      this.showTagsAdd = true
    },
    // 修改标签
    async onUpdate (row) {
      // 获取数据
      const res = await detail(row)
      const list = await simple()
      const ress = await details({ id: res.data.subjectID })
      console.log(ress, 'ress')
      console.log(list, 'list')
      console.log(res, 'res')
      this.list = list.data // 学科列表
      this.currentList = ress.data // 当前列所属学科信息
      this.currentListId = res.data // 当前列标签信息
      // console.log(res, 'res')
      // console.log('...ress.data', ress.data)
      // console.log(res.data)
      // console.log('----------------------------')
      // console.log(ress)
      // this.list = [{ ...list.data.items }]
      // this.currentList = { ...res.data, ...ress.data }
      // const item = []
      // console.log(this.currentList)
      // Object.keys(list.data.items).forEach(key => {
      //   console.log(list.data.items[key])
      //   item.push(list.data.items[key])
      // })
      // item.push(ress.data, res.data)
      // this.list = item

      // 开启弹层
      this.showTagsAdd = true
    }
  }
}
</script>

<style scoped lang='scss'>
.el-card{
  margin: 10px;
}
.el-row {
  margin-top: 10px;
}
</style>
