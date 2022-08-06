<template>
  <div class="articles-container">
    <el-card class="articles-card">
      <el-row>
        <el-col :span="18">
          <el-form ref="formRef" :model="form" label-width="80px" :inline="true">
            <el-form-item label="关键字" >
              <el-input v-model="form.keyword" placeholder="根据文章标题搜索" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="form.state" placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="plain" size="small" @click="reset">清除</el-button>
              <el-button type="primary" size="small" @click="searchFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="success" icon="el-icon-edit" @click="updateOrAddShow=true">新增技巧</el-button>
        </el-col>
      </el-row>

      <el-alert :title="`数据一共${list.length}条`" type="info" show-icon :closable="false" style="margin-bottom:15px">
      </el-alert>

      <el-table :data="list" style="width:100%">
        <el-table-column label="序号" type="index" width="80" :index="pageNo" />
        <el-table-column label="文章标题" prop="title" width="428">
          <template slot-scope="{row}">
            <span>{{row.title}}</span>
            <span
              v-if="row.videoURL"
              class="el-icon-film"
              style="margin-left:5px;color:#08f;font-size:18px;cursor: pointer;"
              @click="previewVideo(row)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="阅读数" prop="visits" width="302" />
        <el-table-column label="录入人" prop="username" width="300" />
        <el-table-column label="录入时间" prop="createTime" :formatter="formatterTime" width="300" />
        <el-table-column label="状态" prop="state" :formatter="formatterState" width="100" />
        <el-table-column label="操作" width="188">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="preview(row)">预览</el-button>
            <el-button type="text" size="small" @click="changeState(row)">{{row.state===1?'禁用':'启用'}}</el-button>
            <el-button type="text" size="small" @click="update(row)" :disabled="row.state===1">修改</el-button>
            <el-button type="text" size="small" @click="deleteArticle(row)" :disabled="row.state===1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 预览弹窗 -->
      <el-dialog title="预览文章" :visible.sync="previewShow" width="800px">
        <section class="title">
          <h2 style="margin:0">{{curItem.title}}</h2>
          <div style="padding-top:5px;padding-left:12px">
            <span>{{formatterTime('','',curItem.createTime)}}</span>
            <span>{{curItem.creator}}</span>
            <span class="el-icon-view"></span>
            <span>{{curItem.visits}}</span>
          </div>
        </section>
        <section class="content" v-html="curItem.articleBody"></section>
      </el-dialog>

      <!-- 修改文章/新增文章 -->
      <el-dialog :title="updateForm.id?'修改文章':'新增文章'" :visible.sync="updateOrAddShow" width="820px">
        <el-form ref="updateFormRef" :model="updateForm" :rules="rules" label-width="88px">
          <el-form-item label="文章标题:" prop="title">
            <el-input v-model="updateForm.title"></el-input>
          </el-form-item>
          <el-form-item label="文章内容:" prop="articleBody">
            <quill-editor
              v-model="updateForm.articleBody"
              :options="editorOptions"
              @blur= "verifyQuill"
            />
          </el-form-item>
          <el-form-item label="视频地址:" prop="videoURL">
            <el-input v-model="updateForm.videoURL"></el-input>
          </el-form-item>
          <el-form-item style="text-align:right">
            <el-button type="plain" @click="cancelDialog">取消</el-button>
            <el-button type="primary" @click="changeArticle">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 分页器 -->
      <el-row style="text-align:right;padding-top:12px">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="form.pagesize"
          layout="prev, pager, next,  sizes, jumper "
          :total="count">
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 视频 -->
    <div class="video-preview" v-if="showVideo">
      <div class="close-box">
        <span class="el-icon-close" @click="showVideo=false"></span>
      </div>
      <div class="video-box">
        <video :src="curVideo" muted autoplay controls></video>
      </div>
    </div>
  </div>
</template>

<script>
import { status } from '@/api/hmmm/constants.js'
import { list, changeState, remove, detail, update, add } from '@/api/hmmm/articles.js'
import { parseTime } from '@/utils'
import { validateURL } from '@/utils/validate.js'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 工具栏
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link']
]

export default {
  data () {
    // 视频地址验证
    const urlValidate = (rule, value, callback) => {
      if ([null, undefined, ''].includes(value)) {
        return callback()
      }
      validateURL(value) ? callback() : callback(new Error('请输入正确的视频地址'))
    }

    return {
      // quill-editor配置
      editorOptions: {
        placeholder: '请输入文章内容',
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      },
      // 搜索项
      form: {
        keyword: undefined,
        state: undefined,
        page: 1,
        pagesize: 10
      },
      // 文章更新项
      updateForm: {
        id: undefined,
        title: undefined,
        articleBody: undefined,
        videoURL: undefined
      },
      // 文章更新表单验证
      rules: {
        title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
        articleBody: [{ required: true, message: '文章内容不能为空' }],
        videoURL: [{ validator: urlValidate, trigger: 'change' }]
      },
      // 文章状态下拉选项
      stateOptions: status,
      // 文章列表
      list: [],
      // 控制预览弹层弹出
      previewShow: false,
      // 控制文章修改、增加的弹出
      updateOrAddShow: false,
      // 当前预览的文章
      curItem: {},
      // 控制视频显示
      showVideo: false,
      // 视频地址
      curVideo: undefined,
      // 数据条数
      count: 0
    }
  },
  computed: {
    // 每页表格开始的序号
    pageNo () {
      return (this.form.page - 1) * this.form.pagesize + 1
    }
  },
  watch: {
    // 无内容时清空quill editor样式
    'updateForm.articleBody' (val) {
      if (/^<p\s*\S*>\s*\S*<\/p>$/.test(val)) { this.updateForm.articleBody = undefined }
    }
  },
  components: { quillEditor },
  methods: {
    // 格式化时间
    formatterTime (row, column, cellValue) {
      return parseTime(cellValue)
    },
    // 格式化状态
    formatterState (row, column, cellValue) {
      return cellValue === 1 ? '已启用' : '已禁用'
    },

    // 校验富文本编辑器
    verifyQuill () {
      this.$refs.updateFormRef.validateField('articleBody')
    },

    // 切换文章状态
    async changeState (row) {
      row.state = row.state === 1 ? 0 : 1
      await changeState(row)
      this.$message.success('修改文章状态成功')
      this.search()
    },
    // 删除选中的文章
    async deleteArticle (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.search()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文章预览
    async preview (row) {
      this.previewShow = true
      const res = await detail(row)
      this.curItem = res.data
      this.curItem.creator = row.username
    },
    // 获取修改文章信息
    async update (row) {
      this.updateOrAddShow = true
      const res = await detail(row)
      this.updateForm = {
        id: res.data.id,
        title: res.data.title,
        articleBody: res.data.articleBody,
        videoURL: res.data.videoURL
      }
    },
    // 将文章操作分类
    async changeArticle () {
      this.updateForm.id ? await this.updateArticle() : await this.addArticle()
      this.cancelDialog()
    },
    // 更新文章
    async updateArticle () {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (!valid) return
        await update(this.updateForm)
        this.$message.success('修改文章内容成功')
      })
    },
    // 新增文章
    async addArticle () {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (!valid) return
        await add(this.updateForm)
        this.$message.success('修改文章内容成功')
      })
    },
    // 关闭文章弹层
    cancelDialog () {
      this.updateForm = {
        id: undefined,
        title: undefined,
        articleBody: undefined,
        videoURL: undefined
      }
      this.search()
      this.updateOrAddShow = false
    },

    // 观看视频
    previewVideo (row) {
      this.showVideo = true
      this.curVideo = row.videoURL
    },

    // 改变每页显示的条数
    handleSizeChange (val) {
      this.form.pagesize = val
      this.search()
    },
    // 点击分页器页码
    handleCurrentChange (val) {
      this.form.page = val
      this.search()
    },

    // 清空搜索框
    reset () {
      this.$refs.formRef.resetFields()
      this.form.keyword = undefined
      this.form.state = undefined
    },
    // 根据条件搜索
    searchFilter () {
      const [keyword] = this.form
      if (keyword !== undefined && keyword.trim() !== '') {
        this.form.keyword = this.form.keyword.trim()
        this.search()
      }
    },
    // 搜索文章
    async search () {
      const res = await list(this.form)
      this.list = res.data.items
      this.count = res.data.counts
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang='scss' scoped>
.articles-card {
  .title {
    padding-bottom: 10px;
    span {
      margin-right: 8px;
    }
  }
  .content {
    padding: 10px;
    background-color: #f5f5f5;
  }
  ::v-deep .ql-editor {
    height: 200px;
  }
}
// 视频展示
.video-preview {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 1001;
  .close-box {
    position: relative;
    span {
      position: absolute;
      top: 60px;
      left:50%;
      transform: translateX(-50%);
      background-color: rgba(0,0,0,.6);
      padding: 15px;
      border-radius: 50%;
      font-size: 32px;
      color:#fff;
      cursor: pointer;
    }
  }
  .video-box {
    width: 1000px;
    margin-top: 8%;
    margin-left: 50%;
    border-radius: 15px;
    box-shadow:  10px 10px 60px #bebebe,
                -10px -10px 60px #b9b9b9;
    transform: translateX(-50%);
    video {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }
}
</style>
