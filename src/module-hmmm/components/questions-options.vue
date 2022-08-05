<template>
  <el-form-item class="options" label='选项:' v-if="questionType!=3">
    <div class="content" v-for="(item,index) in options" :key="index">
      <el-radio v-if="questionType==1" v-model="selectRadio" :label="item.code">{{item.code}}</el-radio>
      <el-checkbox v-else :label="item.code" v-model="checkList"/>
      <QuestionsOptionsItem :item="item" ></QuestionsOptionsItem>
    </div>
    <el-button
      type="danger"
      icon="el-icon-plus"
      size="small"
      :disabled="questionType==1"
      @click="handleAdd"
    >增加选项与答案</el-button>
  </el-form-item>
</template>

<script>
import QuestionsOptionsItem from './questions-options-item.vue'

export default {
  data () {
    return {
      // 表单数据
      options: undefined,
      // 单选框选中的项
      selectRadio: undefined,
      // 复选框选中的项
      checkList: []
    }
  },
  props: {
    questionType: {
      require: true,
      type: String
    },
    changeOptions: {
      type: Array,
      default: () => []
    }
  },
  components: { QuestionsOptionsItem },
  computed: {
    // 单复选列表
    optionsList () {
      const arr = []
      for (let i = 65; i <= 122; i++) {
        arr.push({ code: String.fromCharCode(i), title: undefined, img: undefined, isRight: false })
      }
      return arr
    }
  },
  watch: {
    // 当选中单选框时改变其isRight属性
    selectRadio (val) {
      this.options.forEach(e => { e.isRight = false })
      this.options.some(e => {
        if (e.code === val) {
          e.isRight = true
          return true
        }
      })
    },
    // 当选中多选框选框时改变其isRight属性
    checkList (val) {
      this.options.forEach(e => {
        e.isRight = val.length > 0 && val.includes(e.code)
      })
    },
    // 向外部传递数据
    options: {
      deep: true,
      handler (val) {
        this.$emit('update:changeOptions', val)
      }
    }
  },
  methods: {
    // 点击添加多选框选项
    handleAdd () {
      const len = this.options.length
      this.options.push(this.optionsList[len])
    },
    // 初始化
    init () {
      // 传入单复选数据 修改
      if (this.changeOptions.length > 0) {
        this.options = this.changeOptions
        // 单选框数据
        if (this.questionType === '1') {
          this.options.forEach(e => {
            if (e.isRight === 1) {
              this.selectRadio = e.code
              e.isRight = true
            } else {
              e.isRight = false
            }
          })
        } else if (this.questionType === '2') {
          // 多选框数据
          this.options.forEach(e => {
            if (e.isRight === 1) {
              this.checkList.push(e.code)
              e.isRight = true
            } else {
              e.isRight = false
            }
          })
        }
      } else {
        // 未传入数据 新增
        this.options = this.optionsList.slice(0, 4)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.init()
    }, 500)
  }
}
</script>

<style lang='scss' scoped>
// 上传
::v-deep.options {
  .content {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    label {
      margin-right: 10px;
    }
    .upload {
      // display: inline-block;
      width: 100px;
      height: 60px;
      margin-left: 10px;
      user-select: none;
      .el-upload--picture-card {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #fff;
        i.upload-text {
          position: absolute;
          font-size: 14px;
          font-style: normal;
          top: -43px;
          left: 20px;
          color:  #303133;
        }
      }
      .el-upload-list--picture-card {
        .el-upload-list__item {
          overflow: unset;
          width: 100%;
          height: 100%;
        }
      }
    }

    .has-picture {
      .el-upload--picture-card {
        display: none;
      }
    }
  }

}

</style>
