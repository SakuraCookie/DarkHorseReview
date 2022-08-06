<template>
  <div class="container">
    <div class="content">
      <div class="header">
        <span class="text-color">说明：目前支持学科和关键字条件筛选</span>
        <el-button
          type="success"
          icon="el-icon-edit"
          size="medium"
          @click="$router.push('new')"
          >新增试题</el-button
        >
      </div>
      <div class="select">
        <div class="subject">
          <span>学科</span
          ><el-select
            v-model="value"
            placeholder="请选择"
            @visible-change="getSubjects"
          >
            <el-option
              v-for="item in subjects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="direction">
          <span>二级目录</span
          ><el-select
            v-model="valueD"
            placeholder="请选择"
            @visible-change="getDirectory"
          >
            <el-option
              v-for="item in directorys"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="lebal">
          <span>标签</span
          ><el-select
            v-model="valueT"
            placeholder="请选择"
            @visible-change="getTags"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="keys">
          <span>关键字</span
          ><el-input
            v-model="inputK"
            placeholder="请输入内容"
            class="input"
          ></el-input>
        </div>
        <div class="testType">
          <span>试题类型</span
          ><el-select
            v-model="valueTY"
            placeholder="请选择"
            @visible-change="listType"
          >
            <el-option
              v-for="item in questionType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="difficult">
          <span>难度</span
          ><el-select
            v-model="valueDI"
            placeholder="请选择"
            @visible-change="getDifficult"
          >
            <el-option
              v-for="item in difficulty"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="forward">
          <span>方向</span
          ><el-select
            v-model="valueF"
            placeholder="请选择"
            @visible-change="getDirection"
          >
            <el-option
              v-for="(item, index) in direction"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </div>
        <div class="enter">
          <span>录入人</span
          ><el-select
            v-model="valueE"
            placeholder="请选择"
            @visible-change="getEnter"
          >
            <el-option
              v-for="item in enter"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="notes">
          <span>题目备注</span
          ><el-input
            v-model="inputN"
            placeholder="请输入内容"
            class="input"
          ></el-input>
        </div>
        <div class="company">
          <span>企业简称</span
          ><el-input
            v-model="inputC"
            placeholder="请输入内容"
            class="input"
          ></el-input>
        </div>
        <div class="city">
          <span>城市</span>
          <el-select
            class="province"
            v-model="valueP"
            placeholder="请选择"
            @visible-change="handleChangeP"
          >
            <el-option
              v-for="(item, index) in city"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="valueC"
            placeholder="请选择"
            class="area"
            @visible-change="handleChangeC"
          >
            <el-option
              v-for="(item, index) in area"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="button">
          <el-button plain size="medium" @click="clear">清除</el-button>
          <el-button type="primary" plain size="medium" @click="getSearch"
            >搜索</el-button
          >
        </div>
      </div>
      <el-alert
        :title="'数据一共' + counts + '条'"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="number" label="试题编号" width="180">
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="180">
        </el-table-column>
        <el-table-column prop="catalog" label="目录"> </el-table-column>
        <el-table-column prop="address" label="题型">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.questionType === '1'">单选</span>
              <span v-else-if="scope.row.questionType === '2'">多选</span>
              <span v-else>简答</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="题干">
          <template slot-scope="scope">
            <div v-html="scope.row.question"></div>
          </template>
        </el-table-column>
        <el-table-column prop="addDate" label="录入时间">
          <template slot-scope="scope">
            <!-- 时间格式化 filter/index.js -->
            {{ scope.row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="难度">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.difficulty === '1'">简单</span>
              <span v-else-if="scope.row.difficulty === '2'">一般</span>
              <span v-else>困难</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="录入人"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <div>
              <el-button
                @click="isDialogVisibleShow(scope.row.id)"
                plain
                size="small"
                type="primary"
                icon="el-icon-view"
                circle
              ></el-button>
              <!-- isDialogVisibleShow -->
              <el-button
                @click="toEdit(scope.row)"
                plain
                size="small"
                type="success"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                @click="removeQuestion(scope.row, scope.$index)"
                plain
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
              <el-button
                @click="choiceAddstore(scope.row)"
                plain
                size="small"
                type="warning"
                icon="el-icon-check"
                circle
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right; margin-top: 20px; margin-bottom: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageSize="5"
        layout="prev, pager, next, sizes, jumper"
        background
        :total="counts"
      >
      </el-pagination>
 <!-- <QuestionPreview
        :dialogVisible="dialogVisible"
        @close="dialogVisible = false"
        :questionItem="questionItem"
      ></QuestionPreview> - -->
      <!-- 8月6日----修改后的 -->
          <el-dialog
  title="题目预览"
  :visible.sync="dialogVisible"
  width="45%"
  :before-close="handleClose">
  <QuestionsTopicPreview  v-if="dialogVisible" :ListId="currentId"></QuestionsTopicPreview>
  <span slot="footer" class="dialog-footer" >
    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
  </span>
</el-dialog>
    </div>
  </div>
</template>

<script>
import { simple } from '@/api/hmmm/subjects'
import { simple as simpleD } from '@/api/hmmm/directorys'
import { simple as simpleT } from '@/api/hmmm/tags'
import { questionType, difficulty, direction } from '@/api/hmmm/constants'
import { simple as simpleE } from '@/api/base/users'
import { provinces, citys } from '@/api/hmmm/citys'
import { list as getQuestions, choiceAdd, remove, detail } from '@/api/hmmm/questions'
// import QuestionPreview from './preview/question-preview.vue'
import QuestionsTopicPreview from '../components/questions-topicPreview.vue'

export default {
  components: {
    QuestionsTopicPreview
    // QuestionPreview
  },
  data () {
    return {
      currentId: '', // 保存当前id
      subjects: [],
      directorys: [],
      tags: [],
      questionType: [],
      difficulty: [],
      direction: [],
      enter: [],
      city: [],
      area: [],
      value: '',
      valueD: '',
      valueT: '',
      valueQ: '',
      valueTY: '',
      valueDI: '',
      valueF: '',
      valueE: '',
      valueP: '',
      valueC: '',
      tableData: [],
      inputK: '',
      inputN: '',
      inputC: '',
      counts: 0,
      dialogVisible: false,
      questionItem: {},
      query: {
        page: 1, // 当前页数
        pageSize: 5, // 每页显示多少  /** */
        subjectID: null, // 学科
        difficulty: null, // 难度
        questionType: null, // 试题难度
        tags: null, // 标签名称
        province: null, // 企业所在地省份
        city: null, // 企业所在城市
        keyword: null, // 关键字
        remarks: null, // 题目备注
        shortName: null, // 企业简称
        direction: null, // 方向
        creatorID: null, // 录入人
        catalogID: null // 目录
      }
    }
  },
  created () {
    this.getDate()
  },
  methods: {
    isDialogVisibleShow (id) {
      this.dialogVisible = true

      // 保存当前点击的那条数据的id
      this.currentId = id
      console.log(this.currentId, '111')
    },
    // 弹层方法
    handleClose (done) {
      this.dialogVisible = false
    },
    // 获取学科
    async getSubjects () {
      try {
        const { data } = await simple()
        this.subjects = data
      } catch (err) {
        console.log(err)
      }
    },
    // 获取目录
    async getDirectory () {
      try {
        const { data } = await simpleD()
        this.directorys = data
      } catch (err) {
        console.log(err)
      }
    },
    // 获取标签
    async getTags () {
      try {
        const { data } = await simpleT()
        this.tags = data
      } catch (err) {
        console.log(err)
      }
    },
    // 获取试题类型
    listType () {
      try {
        this.questionType = questionType
        // console.log(this.questionType);
      } catch (err) {
        console.log(err)
      }
    },
    // 获取难度
    getDifficult () {
      try {
        this.difficulty = difficulty
        console.log(this.difficulty)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取方向
    getDirection () {
      try {
        this.direction = direction
        console.log(this.direction)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取录入人
    async getEnter () {
      try {
        const { data } = await simpleE()
        console.log(data)
        this.enter = data
      } catch (err) {
        console.log(err)
      }
    },
    // 获取城市
    async handleChangeP () {
      try {
        const data = await provinces()
        this.city = ''
        this.city = data
      } catch (err) {
        console.log(err)
      }
    },
    // 获取地区
    async handleChangeC () {
      try {
        const res = await citys(this.valueP)
        this.area = ''
        this.area = res
      } catch (err) {
        console.log(err)
      }
    },
    // 清除全部
    clear () {
      this.value = ''
      this.valueD = ''
      this.valueT = ''
      this.valueQ = ''
      this.valueTY = ''
      this.valueDI = ''
      this.valueF = ''
      this.valueE = ''
      this.valueP = ''
      this.valueC = ''
      this.inputK = ''
      this.inputN = ''
      this.inputC = ''
    },
    // 获取题库
    async getDate () {
      try {
        const res = await getQuestions()
        console.log(res)
        this.tableData = res.data.items
        this.counts = res.data.counts
      } catch (err) {
        console.log(err)
      }
    },
    // 预览功能
    async preview (item) {
      // 显示对话框
      const { data } = await detail({ id: item.id })
      data.questionType = item.questionType
      data.subject = item.subject
      this.dialogVisible = true
      // 传入试题
      this.questionItem = data
    },
    // 加入精选
    async choiceAddstore (item) {
      const result = await this.$confirm(
        '此操作将该题目加入精选, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }
      ).catch((err) => err)
      // 如果确认就加入精选 否则什么都不做
      if (result === 'confirm') {
        const res = await choiceAdd({
          id: item.id,
          choiceState: 1
        })
        if (res.status === 200) {
          this.$message.success('加入精选成功')
        }
        // 更新题库列表
        this.getDate()
      }
    },
    // 删除功能
    async removeQuestion (item, index) {
      // 提示框
      const result = await this.$confirm(
        '此操作将永久删除该题目, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 如果确认删除执行删除逻辑
      if (result === 'confirm') {
        const data = await remove({ id: item.id })
        // 如果状态码是200表示删除成功
        if (data.status === 200) {
          console.log(index)
          this.tableData.splice(index, 1)
          return this.$message.success('删除成功')
        }
        this.getDate()
      }
    },
    // 编辑功能
    toEdit (row) {
      this.$router.push({
        path: 'new',
        query: {
          id: row.id
        }
      })
    },
    // 当页码发生变化
    handleSizeChange (val) {
      this.pageSize = val
      this.getDate()
    },
    // 当前页发生变化
    handleCurrentChange (val) {
      this.page = val
      this.getDate()
    },
    // 获取筛选
    async getSearch () {
      try {
        const data = await getQuestions({
          page: 1, // 否 1 当前页数
          pageSize: 5, // 每页显示多少  /** */
          subjectID: this.value, // 学科
          difficulty: this.valueDI, // 难度
          questionType: this.valueTY, // 试题难度
          tags: this.valueT, // 标签名称
          province: this.valueP, // 企业所在地省份
          city: this.valueC, // 企业所在城市
          keyword: this.inputK, // 关键字
          remarks: this.inputN, // 题目备注
          shortName: this.inputC, // 企业简称
          direction: this.valueF, // 方向
          creatorID: this.valueE, // 录入人
          catalogID: this.valueD // 目录
        })
        console.log(data)
        console.log(this.value)
        console.log(this.inputK)
        this.tableData = data.data.items
        this.counts = data.data.counts
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang='less'>
/deep/.text-color {
  color: pink !important;
  font-size: 12px !important;
}
.container {
  padding: 20px;
  .content {
    padding: 20px;
    width: 100%;
    background-color: #fff;
    .header {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 14px;
        color: red;
      }
    }
    .select {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      justify-content: space-between;
      align-content: space-between;
      div {
        margin-top: 10px;
      }
      .subject {
        padding-left: 32px;
      }
      .keys {
        display: flex;
        span {
          line-height: 54px;
        }
        .input {
          width: 220px;
        }
      }
      .difficult {
        padding-left: 32px;
      }
      .notes {
        margin-right: -90px;
        .input {
          width: 218px;
        }
      }
      .company {
        display: flex;
        flex-shrink: 0;
        width: 288px;
        margin-left: 100px;
        span {
          margin-right: 8px;
          line-height: 54px;
        }
        .input {
          width: 216px;
        }
      }
      .city {
        display: flex;
        margin-right: 88px;
        flex-shrink: 0;
        width: 300px;
        span {
          line-height: 54px;
        }
        .province {
          width: 100px;
          margin-right: 20px;
        }
        .area {
          width: 100px;
        }
      }
      span {
        font-weight: 700;
        color: #666;
        margin-right: 10px;
      }
      .button {
        margin-top: 20px;
      }
    }
  }
}
</style>
