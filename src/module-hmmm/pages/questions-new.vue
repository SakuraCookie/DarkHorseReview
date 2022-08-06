<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>试题录入</span>
    </div>
    <div class="text item">
      <el-form ref="formRef" :model="form" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="学科:" prop="subjectID">
          <el-select v-model="form.subjectID" placeholder="请选择学科" clearable :style="{width: '400px'}">
            <el-option v-for="(item, index) in subjectIDOptions" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录:" prop="catalogID">
          <el-select v-model="form.catalogID" placeholder="请选择目录" clearable :style="{width: '400px'}">
            <el-option v-for="(item, index) in catalogIDOptions" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="enterpriseID">
          <el-select v-model="form.enterpriseID" placeholder="请选择企业" clearable :style="{width: '400px'}">
            <el-option v-for="(item, index) in enterpriseIDOptions" :key="index" :label="item.shortName"
              :value="item.id" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex" justify="start" align="top">
          <el-form-item label="城市:" prop="province">
            <el-select v-model="form.province" placeholder="请选择城市" clearable :style="{width: '198px'}">
              <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item"
                :value="item" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="-1px" label="" prop="city" style="margin-left: 4px;">
            <el-select v-model="form.city" placeholder="请选择地区" clearable :style="{width: '198px'}">
              <el-option v-for="(item, index) in cityOptions" :key="index" :label="item"
                :value="item" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="方向:" prop="direction">
          <el-select v-model="form.direction" placeholder="请选择方向" clearable :style="{width: '400px'}">
            <el-option v-for="(item, index) in directionOptions" :key="index" :label="item"
              :value="item" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="questionType">
          <el-radio-group v-model="form.questionType" size="medium">
            <el-radio v-for="(item, index) in questionTypeOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="difficulty">
          <el-radio-group v-model="form.difficulty" size="medium">
            <el-radio v-for="(item, index) in difficultyOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" prop="question">
          <quill-editor
            ref="mwQuillEditor"
            v-model="form.question"
            :options="editorOption"
            @blur="verifyQuill('question')"
          />
        </el-form-item>
        <!-- 单选或者多选选项 -->
        <QuestionOptions :question-type="form.questionType" :changeOptions.sync ="form.options"></QuestionOptions>
        <el-form-item label="解析视频:" prop="videoURL">
          <el-input v-model="form.videoURL" placeholder="请输入解析视频" clearable :style="{width: '400px'}"></el-input>
        </el-form-item>
          <el-form-item label="答案解析:" prop="answer">
          <quill-editor
            ref="mwQuillEditor"
            v-model="form.answer"
            :options="editorOption"
            @blur="verifyQuill('answer')"
          />
        </el-form-item>
        <el-form-item label="题目备注:" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入题目备注"
            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '400px'}"></el-input>
        </el-form-item>
        <el-form-item label="试题标签:" prop="tags">
          <el-select v-model="form.tags" placeholder="请选择试题标签" clearable :style="{width: '400px'}">
            <el-option v-for="(item, index) in tagsOptions" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="success" @click="updateForm " v-if="questionId">确认修改</el-button>
          <el-button type="primary" @click="submitForm" v-else>提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import QuestionOptions from '../components/questions-options.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { validateURL as url } from '@/utils/validate'
import { questionType, difficulty, direction } from '@/api/hmmm/constants.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { simple } from '@/api/hmmm/subjects.js'
import { list as companyList } from '@/api/hmmm/companys.js'
import { simple as categorySimple } from '@/api/hmmm/directorys.js'
import { simple as tagsSimple } from '@/api/hmmm/tags.js'
import { add, detail, update } from '@/api/hmmm/questions.js'

// 工具栏
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['image', 'link']
]

export default {
  name: 'QuestionNew',
  components: { quillEditor, QuestionOptions },
  props: [],
  data () {
    // 校验视频地址
    const validateURL = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) { return callback() }
      url(value) ? callback() : callback(new Error('请输入正确的视频地址'))
    }
    return {
      // 表单项
      form: {
        subjectID: undefined,
        catalogID: undefined,
        enterpriseID: undefined,
        province: undefined,
        city: undefined,
        direction: undefined,
        questionType: '1',
        difficulty: '1',
        videoURL: undefined,
        remarks: undefined,
        tags: undefined,
        question: undefined,
        answer: undefined,
        options: undefined
      },
      // 校验规则
      rules: {
        subjectID: [{
          required: true,
          message: '请选择学科',
          trigger: 'change'
        }],
        catalogID: [{
          required: true,
          message: '请选择目录',
          trigger: 'change'
        }],
        enterpriseID: [{
          required: true,
          message: '请选择企业',
          trigger: 'change'
        }],
        province: [{
          required: true,
          message: '请选择省份',
          trigger: 'change'
        }],
        city: [{
          required: true,
          message: '请选择城市',
          trigger: 'change'
        }],
        direction: [{
          required: true,
          message: '请选择方向',
          trigger: 'change'
        }],
        questionType: [{
          required: true,
          message: '题型不能为空',
          trigger: 'change'
        }],
        difficulty: [{
          required: true,
          message: '难度不能为空',
          trigger: 'change'
        }],
        question: [{
          required: true,
          message: '题干不能为空'
        }],
        videoURL: [{
          validator: validateURL,
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '答案解析不能为空'
        }],
        remarks: [],
        tags: []
      },
      // 学科选择项
      subjectIDOptions: [],
      // 目录选择项
      catalogIDOptions: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      // 企业选择项
      enterpriseIDOptions: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      // 城市选择项
      provinceOptions: provinces(),
      // 城区选择项
      cityOptions: [],
      // 方向选择项
      directionOptions: direction,
      // 问题类型选择项
      questionTypeOptions: this.changeToString(questionType),
      // 问题难度选择项
      difficultyOptions: this.changeToString(difficulty),
      // 标签选择项
      tagsOptions: [],
      // quill editor配置
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      }
    }
  },
  computed: {
    questionId () {
      return this.$route.query?.id || undefined
    }
  },
  watch: {
    'form.province' (val) {
      this.cityOptions = this.getArea(val)
    }
  },
  methods: {
    // 转换字符串
    changeToString (arr) {
      arr.forEach(e => { e.value = e.value + '' })
      return arr
    },
    // 获取选中城市的区域
    getArea (city) {
      return citys(city)
    },
    // 校验富文本编辑器
    verifyQuill (field) {
      this.$refs.formRef.validateField(field)
    },
    // 提交表单
    submitForm () {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        await add(this.form)
        this.$message.success('添加成功')
        this.$router.push('/questions/list')
      })
    },
    // 修改表单
    updateForm () {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        // !哪个dog写的后台，新增时某些项不要必须，修改时要必须
        for (const key in this.form) {
          if ([null, ''].includes(this.form[key])) {
            this.form[key] = '略'
          }
        }
        await update(this.form)
        this.$message.success('修改成功')
        this.$router.push('/questions/list')
      })
    },

    // 初始化表单选项
    async init () {
      // 学科列表
      let res = await simple()
      this.subjectIDOptions = res.data
      // 目录列表
      res = await categorySimple()
      this.catalogIDOptions = res.data
      // 公司列表
      res = await companyList({ params: { pageSize: 1000 } })
      this.enterpriseIDOptions = res.data.items
      // 标签列表
      res = await tagsSimple()
      this.tagsOptions = this.changeToString(res.data)
    },

    // 获取修改表单时的原始数据
    async updateInit () {
      const res = await detail({ id: this.questionId })
      this.form = res.data
    }
  },
  created () {
    this.init()
    if (this.questionId) {
      this.updateInit()
    }
  }
}

</script>

<style lang='scss' scoped>
.text {
    font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 100%;
}
// quill-editor
::v-deep .quill-editor {
  .ql-container {
    height: 200px;
  }
}

</style>
