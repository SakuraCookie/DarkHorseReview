<template>
  <div class='container'>
    <el-card class="top">
      <!-- <el-col> -->
        <el-row type="flex" justify="space-between" style="margin-bottom:10px">
          <div class="top-right">说明：目前支持学科和关键字条件筛选</div>
          <el-button type="success" size="small" @click="onclick()">新增试题</el-button>
        </el-row>

        <el-form   ref="formRef" :model="form" :rules="rules" size="medium" label-width="100px">
          <el-row  :gutter="15">
            <el-col :span="6">
          <el-form-item label="学科" prop="subjectID"  >
            <el-select v-model="form.subjectID" placeholder="请选择" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in subjectIDOptions" :key="index" :label="item.label"
                :value="item.label" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="二级目录" prop="catalogID">
            <el-select v-model="form.catalogID" placeholder="请选择" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in catalogIDOptions" :key="index" :label="item.label"
                :value="item.subjectName" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="标签" prop="tags">
            <el-select v-model="form.tags" placeholder="请选择" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in tagsOptions" :key="index" :label="item.label" :value="item.tagName"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="关键字" prop="keyword">
            <el-input v-model="form.keyword" placeholder="根据题干搜索" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
          </el-col>
          </el-row>
          <el-row  :gutter="15">
          <el-col :span="6">
          <el-form-item label="试题类型" prop="questionType">
            <el-select v-model="form.questionType" placeholder="请选择" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in questionTypeOptions" :key="index" :label="item.label"
                :value="item.questionType" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="难度" prop="difficulty">
            <el-select v-model="form.difficulty" placeholder="请选择" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in difficultyOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item></el-col>
          <el-col :span="6">
          <el-form-item label="方向" prop="direction">
            <el-select v-model="form.direction" placeholder="请选择方向" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in directionOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item></el-col>
          <el-col :span="6">
          <el-form-item label="录入人" prop="creatorID">
            <el-select v-model="form.creatorID" placeholder="请选择" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in creatorIDOptions" :key="index" :label="item.username"
                :value="item.id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          </el-row>
          <el-row  :gutter="15">
            <el-col :span="6">
          <el-form-item label="题目备注" prop="remarks">
            <el-input v-model="form.remarks" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="企业简称" prop="shortName">
            <el-input v-model="form.shortName" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="城市" prop="city">
            <div class="d-flex flex-grow-1" >
            <el-select
            class="filter-item"
            style="width: 130px;"
            v-model="form.province"
            @keyup.enter="handleFilter"
            @change="handleProvince"
            filterable
          >
            <el-option v-for="item in citySelect.province" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select
            class="filter-item"
            style="width: 130px;"
            v-model="form.city"
            @keyup.enter="handleFilter"
            filterable
          >
            <el-option v-for="item in citySelect.cityDate" :key="item" :label="item" :value="item"></el-option>
          </el-select>
            </div>
          </el-form-item>
          </el-col>
          </el-row>
          <el-form-item>
                <div class="d-flex justify-content-end">
                    <el-button @click="clear">取消</el-button>
                    <el-button size="small"
                    type="primary"
                    icon="el-icon-search"
                    @click="onSubmit">搜索</el-button>
                </div>
            </el-form-item>
        </el-form>

        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 数据记录 -->

          <el-tab-pane label="全部" name="all">
            <!-- 数据记录 -->
            <el-alert
              v-if="alertText !== ''"
              :title="alertText"
              type="info"
              class="alert"
              :closable="false"
              show-icon
            ></el-alert>
            <QusetionChoiceList ref="abc" :list="list"></QusetionChoiceList>
          </el-tab-pane>

          <el-tab-pane label="待审核" name="notReviewed" >
            <!-- 数据记录 -->
            <el-alert
              v-if="alertText !== ''"
              :title="alertText"
              type="info"
              class="alert"
              :closable="false"
              show-icon
            ></el-alert>
            <QusetionChoiceList ref="abc" :list="list"></QusetionChoiceList>
          </el-tab-pane>

          <el-tab-pane label="已审核" name="Reviewed">
            <!-- 数据记录 -->
            <el-alert
              v-if="alertText !== ''"
              :title="alertText"
              type="info"
              class="alert"
              :closable="false"
              show-icon
            ></el-alert>
            <QusetionChoiceList ref="abc" :list="list"></QusetionChoiceList>
          </el-tab-pane>

          <el-tab-pane label="已拒绝" name="Rejected">
            <!-- 数据记录 -->
            <el-alert
              v-if="alertText !== ''"
              :title="alertText"
              type="info"
              class="alert"
              :closable="false"
              show-icon
            ></el-alert>
          <QusetionChoiceList ref="abc" :list="list"></QusetionChoiceList>
          </el-tab-pane>
        </el-tabs>
      <!-- </el-col> -->
      <!-- 分页 -->
      <div class="pagination">
          <div class="pages">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="Number(page.page)"
              :total="Number(page.total)"
              :page-size="Number(page.pagesize)"
              :page-sizes="[5,10,15,20]"
              layout="sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
    </el-card>
  </div>
</template>

<script>
import QusetionChoiceList from '../components/qusetion-choice-list.vue'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { list as enterMan } from '@/api/base/users.js'
import { list as BoutiqueSubjectList, simple } from '@/api/hmmm/subjects.js'
import { choice } from '../../api/hmmm/questions'
import { list as biaoqian } from '../../api/hmmm/tags.js'

export default {
  components: { QusetionChoiceList },
  props: [],
  data () {
    return {
      alertText: '',
      city: '',
      activeName: 'all',
      list: [],
      mulu: [],
      form: {
        subjectID: undefined,
        catalogID: undefined,
        tags: undefined,
        keyword: undefined,
        questionType: undefined,
        difficulty: undefined,
        direction: undefined,
        creatorID: undefined,
        remarks: undefined,
        shortName: undefined,
        chkState: undefined
      },
      page: {
        page: 1,
        pagesize: 5,
        total: null
      },
      rules: {
        subjectID: [{
          message: '请选择',
          trigger: 'change'
        }],
        catalogID: [{
          message: '请选择',
          trigger: 'change'
        }],
        tags: [{
          message: '请选择',
          trigger: 'change'
        }],
        keyword: [{
          message: '根据题干搜索关键字',
          trigger: 'blur'
        }],
        questionType: [{
          message: '请选择',
          trigger: 'change'
        }],
        difficulty: [{
          message: '请选择',
          trigger: 'change'
        }],
        direction: [{
          message: '请选择方向',
          trigger: 'blur'
        }],
        creatorID: [{
          message: '请选择',
          trigger: 'blur'
        }],
        remarks: [{
          message: '',
          trigger: 'blur'
        }],
        shortName: [{
          message: '',
          trigger: 'blur'
        }],
        city: [
          { message: '请选择省份', trigger: 'change' }
        ]

      },
      subjectIDOptions: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      catalogIDOptions: [],
      tagsOptions: [],
      questionTypeOptions: [{
        label: '单选',
        questionType: '1'
      }, {
        label: '多选',
        questionType: '2'
      }, {
        label: '简单',
        questionType: '3'
      }],
      difficultyOptions: [{
        label: '简单',
        value: '1'
      }, {
        label: '一般',
        value: '2'
      }, {
        label: '困难',
        value: '3'
      }],
      directionOptions: [{
        label: 'o2o',
        value: 1
      }, {
        label: '外包服务',
        value: 2
      }, {
        label: '企业服务',
        value: 3
      }, {
        label: '互联网金融',
        value: 4
      }, {
        label: '企业咨询',
        value: 5
      }, {
        label: '互联网',
        value: 6
      }, {
        label: '电子商务',
        value: 7
      }, {
        label: '其他',
        value: 8
      }],
      creatorIDOptions: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      citySelect: {
        province: [],
        cityDate: []
      }
    }
  },
  computed: {},
  watch: {},
  async created (e) {
    this.getCityData()
    // 获取学科列表
    const res = await simple()
    this.subjectIDOptions = res.data
    /* const res = await BoutiqueSubjectList()
    this.subjectIDOptions = res.data.items */
    // console.log(res.data.items)
    // 获取二级目录
    const simpleList = await BoutiqueSubjectList()
    this.catalogIDOptions = simpleList.data.items
    /* this.catalogIDOptions =  */

    const enterman = await enterMan()
    this.creatorIDOptions = enterman.data.list
    // console.log(this.creatorIDOptions)

    // 获取标签
    const biaoQian = await biaoqian()
    this.tagsOptions = biaoQian.data.items

    // this.creatorIDOptions = toString(this.creatorIDOptions)
  },
  mounted () {
    this.onSubmit()
  },
  methods: {
    // 新增
    onclick () {
      this.$router.push('new')
    },
    // 获取全部数据
    handleClick () {
      if (this.activeName === 'all') {
        this.clear()
        this.onSubmit()
      }

      // 获取未审核数据
      if (this.activeName === 'notReviewed') {
        this.form.chkState = '0'
        this.onSubmit()
      }

      // 获取已审核数据
      if (this.activeName === 'Reviewed') {
        this.form.chkState = '1'
        this.onSubmit()
      }

      // 获取已拒绝数据
      if (this.activeName === 'Rejected') {
        this.form.chkState = '2'
        this.onSubmit()
      }
    },
    clear () {
      this.form = {
        subjectID: undefined,
        catalogID: undefined,
        tags: undefined,
        keyword: undefined,
        questionType: undefined,
        difficulty: undefined,
        direction: undefined,
        creatorID: undefined,
        remarks: undefined,
        shortName: undefined,
        chkState: undefined
      }
    },
    /* // 重置
    resetForm () {
      this.$refs.requestParameters.resetFields()
    }, */
    // 按需求搜索
    async onSubmit (params) {
      const obj = {}
      for (const key in this.form) {
        if (this.form[key] || this.form[key] === 0) {
          obj[key] = this.form[key]
        }
      }
      const { data: res } = await choice({ ...obj, ...this.form, ...this.page })
      // this.$refs.abc.form.page = 1
      this.list = res.items
      this.page.total = res.counts
      this.alertText = `共 ${this.page.total} 条记录`
    },
    // 每页显示信息条数
    handleSizeChange (val) {
      // console.log(val)
      this.page.pagesize = val
      if (this.page.page === 1) {
        this.onSubmit(this.page)
      }
    },
    // 进入某一页
    handleCurrentChange (val) {
      this.page.page = val
      this.onSubmit()
    },
    // 获取省
    getCityData: function () {
      this.citySelect.province = provinces()
    },
    // 选省获取到市
    handleProvince: function (e) {
      this.citySelect.cityDate = citys(e)
      this.city = this.citySelect.cityDate[0]
    }
  }
}
</script>

<style  lang="less" scoped>
.top{
  margin:10px;

}
.top-right{
font-size: 10px;
  color: red;
}
/* .elForm{
  display: flex;
  flex-wrap: wrap;
} */
 /deep/ .el-form-item__label{
  width: 80px;
}
/deep/ .el-form-item__content{
  margin-left: 80px
}
.d-flex {
        display: flex;
    }
    .flex-grow-1 {
        flex-grow: 1;
    }
    .justify-content-end{
        justify-content: flex-end;
    }
    .alert {
  margin: 10px 0px;
}
.pages{
    display: flex;
    justify-content: end;
    margin-top: 20px;
}
</style>
