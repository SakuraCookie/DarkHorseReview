<template>
  <div>
        <el-table
        :key="tableKey"
          :data="list"
          fit
        >
         <el-table-column align="center" label="试题编号" >
            <template slot-scope="scope">
              <span>{{scope.row.number}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="学科" >
            <template slot-scope="scope">
              <span>{{scope.row.subject}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="目录" >
            <template slot-scope="scope">
              <span>{{scope.row.catalog}}</span>
            </template>
         </el-table-column>
         <el-table-column  align="center" label="题型" >
            <template slot-scope="scope">
                <div v-if="scope.row.questionType === '1'">单选</div>
                <div v-else-if="scope.row.questionType === '2'">多选</div>
                <div v-else>简单</div>
            </template>
         </el-table-column>
         <el-table-column align="center" label="题干" >
            <template slot-scope="scope">
              <span>{{scope.row.question | delHtmlTag}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="录入时间" >
            <template slot-scope="scope">
              <span>{{scope.row.addDate | parseTime}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="难度" >
            <template slot-scope="scope">
                <div v-if="scope.row.difficulty === '1'">简单</div>
                <div v-else-if="scope.row.difficulty === '2'">一般</div>
               <div v-else>困难</div>
            </template>
         </el-table-column>
         <el-table-column align="center" label="录入人" >
            <template slot-scope="scope">
              <span>{{scope.row.creator}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="审核状态" >
            <template slot-scope="scope">
              <div v-if="scope.row.chkState == '0'">待审核</div>
              <div v-else-if="scope.row.chkState === '1'">通过</div>
               <div v-else>拒绝</div>
            </template>
         </el-table-column>
         <el-table-column align="center" label="审核意见" >
            <template slot-scope="scope">
              <span>{{scope.row.chkRemarks}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="审核人" >
            <template slot-scope="scope">
              <span>{{scope.row.chkUser}}</span>
            </template>
         </el-table-column>
         <el-table-column align="center" label="发布状态" >
            <template slot-scope="scope">
              <div v-if="scope.row.publishState == '0'">下架</div>
               <div v-else>已上架</div>
            </template>
         </el-table-column>
         <el-table-column align="center" label="操作"  fixed="right" width="280">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="previewId(scope.row.id)">预览</el-button>
                <el-button type="text" size="small" :disabled="scope.row.chkState != '0' ?true:false" @click="QuestionsCheck(scope.row)">审核</el-button>
                <el-button type="text" size="small" :disabled="scope.row.publishState == '1'? true:false " @click="onClick(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="grounding(scope.row)">{{scope.row.publishState == '0'? '上架':'下架'}}</el-button>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
            </template>
         </el-table-column>
        </el-table>

        <!-- 审核弹窗 -->
        <el-dialog :visible="QuestionDialog" v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
          <el-row :gutter="15">
            <el-form ref="formRef" :model="form" :rules="rules" size="medium" label-width="100px">
              <el-col :span="24">
                <el-form-item label="" prop="chkState">
                  <el-radio-group v-model="form.chkState" size="medium">
                    <el-radio v-for="(item, index) in chkStateOptions" :key="index" :label="item.chkState"
                      :disabled="item.disabled">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="" prop="chkRemarks">
                  <el-input v-model="form.chkRemarks" type="textarea" placeholder="请输入审核意见"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div slot="footer">
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="handelConfirm">确定</el-button>
          </div>
        </el-dialog>

        <!-- 预览弹框 -->
        <!-- 修改---8月6日 -->
                <el-dialog
  title="题目预览"
  :visible.sync="dialogVisible"
  width="45%"

  :before-close="handleClose">
  <QuestionsTopicPreview  v-if="dialogVisible" :ListId="currentId"></QuestionsTopicPreview>
  <span slot="footer" class="dialog-footer" >
    <!-- <el-button @click="dialogVisible = false">关闭</el-button> -->
    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
  </span>
</el-dialog>
        <!-- <el-dialog :visible="previewDialog" title="" @close="onCloseTwo">
 <el-row :gutter="20">
  <el-col :span="6"><div class="grid-content bg-purple">【题型】 ：
      <span v-if="List.questionType == '1'">
                单选
              </span>
              <span v-else-if="List.questionType == '2'">
                多选
              </span>
              <span v-else>
                简答
              </span>
  </div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【编号】：{{List.id}}</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【难度】：
     <span v-if="List.difficulty == '1'">
                简单
              </span>
              <span v-else-if="List.difficulty == '2'">
                一般
              </span>
              <span v-else>
                困难
              </span>
  </div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【标签】：{{List.tags}}</div></el-col>
   <el-col :span="6"><div class="grid-content bg-purple">【学科】：{{List.subjectName}}</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【目录】：{{List.directoryName}}</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【方向】：{{List.direction}}</div></el-col>
</el-row>
    <hr>
   <div >【题干】 ：</div>
   <div class="topic" ><a href="javascript:;"  v-html="List.question"></a> </div>
          <div v-show="List.questionType !== '3'">
      <div>
            <span v-if="List.questionType == '1'">
                单选
              </span>
              <span v-else-if="List.questionType == '2'">
                多选
              </span>
              <span v-else>
                简答
              </span>
          选项：（以下选中的选项为正确答案
          </div>
              <el-radio-group v-model="radio">
              <el-radio v-for="(item,index) in List.options" :key="index" :label="item.isRight">{{item.title}} </el-radio>
            </el-radio-group>
          </div>
     <hr>
     <div >【参考答案】 ：
        <el-button type="danger" size="small" @click="isVideoShow = true">视频答案预览</el-button>
     </div>
    <video v-if="isVideoShow" width="401" height="301" controls>
    <source :src="List.videoURL" type="video/mp4">
    <source :src="List.videoURL" type="video/ogg">
    您的浏览器不支持 video 标签。
</video>
<hr>
<div  class="topic">【答案解析】：<a href="javascript:;" v-html="List.remarks"></a></div>
 <hr>
 <div>【题目备注】：<span v-html="List.remarks"></span></div>
 <div slot="footer" type="flex" justify="end">
            <el-button @click="onCloseTwo" >关闭</el-button>
          </div>
 </el-dialog> -->

  </div>
</template>

<script>
import { parseTime } from '@/filters/index.js'
import { choiceCheck, choicePublish, remove } from '../../api/hmmm/questions'
// import QuestionsCheck from './questions-check.vue'
// import QuestionsTopicPreview from './questions-topicPreview.vue'
// import { choice } from '@/api/hmmm/questions.js'
import QuestionsTopicPreview from './questions-topicPreview.vue'
export default {
  name: 'questionChoiceList',
  inheritAttrs: false,
  props: {
    list: {
      type: Array,
      require: true
    }
  },
  filters: {
    parseTime,
    delHtmlTag (str) {
      return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/ig, '')
    }
  },
  data () {
    return {
      currentIdL: '',
      ListId: undefined,
      previewDialog: false,
      radio: 1,
      List: {},
      newObj: {},
      dialogVisible: false, // 控制 预览弹窗 8月6日修改
      isVideoShow: false,
      QuestionDialog: false,
      tableKey: 0,
      form: {
        chkState: undefined,
        chkRemarks: undefined
      },
      rules: {
        chkState: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }],
        chkRemarks: [{
          required: true,
          message: '请输入审核意见',
          trigger: 'blur'
        }]
      },
      chkStateOptions: [{
        label: '通过',
        chkState: 1
      }, {
        label: '拒绝',
        chkState: 2
      }],
      // 当前目标
      curItem: undefined
    }
  },
  components: { QuestionsTopicPreview },
  created () {
  },
  watch: {
  },
  // 挂载结束
  mounted: function () {},
  methods: {

    // 弹层方法
    handleClose (done) {
      this.dialogVisible = false
    },
    // 预览
    previewId (id) {
      this.dialogVisible = true
      // 保存当前点击的那条数据的id
      this.currentId = id
    },
    onCloseTwo () {
      this.previewDialog = false
    },
    // 题库列表详情
    /* async detailList () {
      try {
        const { data: res } = await detail({ ...this.ListId })
        console.log(res.items)
        this.List = res.items
        // this.List =
        console.log(this.List)
      } catch (error) {
        console.dir(error)
      }
    }, */
    // 审核弹框
    onOpen () {},
    onClose () {
      this.QuestionDialog = false
      this.$refs.formRef.resetFields()
    },
    handelConfirm () {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.chkStateOptions.chkState = await choiceCheck({ ...this.curItem, ...this.form })
        console.log(this.form)
        this.onClose()
      })
    },
    QuestionsCheck (row) {
      this.QuestionDialog = true
      this.curItem = row
      this.$parent.onSubmit()
    },
    // 上下架
    grounding (row) {
      this.$confirm('您确认上架这道题目吗?, 提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        console.log(row)
        row.publishState = row.publishState === 1 ? 0 : 1
        const res = await choicePublish(row)
        console.log(res)
        this.$message({
          message: '操作成功',
          type: 'success',
          showClose: true,
          duration: 3000
        })
        this.$parent.onSubmit()
      }).catch(() => {

      })
    },
    // 修改
    onClick (id) {
      this.$router.push({ path: 'new', query: { id: id } })
    },
    // 删除操作
    onDelete (row) {
      console.log(row)
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async action => {
        // 发请求
        await remove({ ...row })
        this.$message({
          message: '操作成功',
          type: 'info',
          showClose: true,
          duration: 3000
        })
        this.$parent.onSubmit()
      }).catch(() => {
      })
    }
  },
  // 组件更新
  updated: function () {}
}

</script>

<style lang="scss" scoped>

</style>
