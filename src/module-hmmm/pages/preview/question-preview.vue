<template>
  <div class="container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="close"
    >
      <el-row class="text">
        <el-col :span="6">
          <span v-if="questionItem.questionType === '1'">【题型】：单选题</span>
          <span v-else-if="questionItem.questionType === '2'"
            >【题型】：多选题</span
          >
          <span v-else>【题型】：简答题</span>
        </el-col>
        <el-col :span="6">
          <span> 【编号】：{{ questionItem.id }}</span>
        </el-col>
        <el-col :span="6">
          <span v-if="questionItem.difficulty === '1'">【题型】：简单</span>
          <span v-else-if="questionItem.difficulty === '2'"
            >【题型】：一般</span
          >
          <span v-else>【题型】：困难</span>
        </el-col>
        <el-col :span="6">
          <span> 【标签】：{{ questionItem.tags }}</span>
        </el-col>
      </el-row>
      <el-row class="text">
        <el-col :span="6">
          <span>【学科】：{{ questionItem.subject }}</span>
        </el-col>
        <el-col :span="6">
          <span>【目录】：{{ questionItem.directoryName }}</span>
        </el-col>
        <el-col :span="6">
          <span>【方向】：{{ questionItem.direction }}</span>
        </el-col>
        <el-col :span="6"> </el-col>
      </el-row>
      <hr />
      <!-- 题干部分 -->
      <el-row>
        <el-col>
          <span>【题干】：</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="color: blue">
          <div v-html="questionItem.question"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span>
            <span v-if="questionItem.questionType === '1'">单选题</span>
            <span v-else-if="questionItem.questionType === '2'">多选题</span>
            <span v-else>简答题</span>选项：（以下选中的选项为正确答案）
          </span>
        </el-col>
      </el-row>
      <!-- 单选框 -->
      <!-- data中的数据 radio: 1  由于单选框只有一个isRight 判断相等 按钮选中-->
      <el-radio-group
        v-model="radio"
        v-if="questionItem.questionType === '1'"
      >
        <el-row
          v-for="(item, index) in questionItem.options"
          :key="index"
          style="margin: 10px 0px"
        >
          <el-radio :label="item.isRight">{{ item.title }}</el-radio>
        </el-row>
      </el-radio-group>
      <!-- 多选框 -->
      <div v-if="questionItem.questionType === '2'">
        <el-row
          v-for="(item, index) in options"
          :key="index"
          style="margin: 10px 0px"
        >
          <el-checkbox
            v-model="item.isRight"
            :disabled="item.isRight === 0"
            @change="testChange(item)"
          >
            {{ item.title }}
          </el-checkbox>
        </el-row>
      </div>
      <hr />
      【参考答案】：<el-button type="danger" @click="isVideoShow = true"
        >视频答案预览</el-button
      >
      <el-row style="margin-top: 20px" v-if="isVideoShow">
        <video
          :src="questionItem.videoURL"
          controls="controls"
          class="video"
        ></video>
      </el-row>
      <hr />
      <el-row class="answer">
        <span>【答案解析】：https://cn.vuejs.org/ 有答案 </span>
      </el-row>

      <hr />
      <el-row class="answer">
        <span> 【题目备注】：https://cn.vuejs.org/ 有答案 </span>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$emit('close')">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: 1,
      isVideoShow: false
    }
  },
  props: {
    dialogVisible: {
      type: Boolean, required: true
    },
    questionItem: {
      type: Object, required: true
    }
  },
  methods: {
    //  多选框的change事件
    testChange (item) {
      if (item.isRight) {
        console.log(item.isRight)
      } else {
        item.isRight = true
      }
    },

    // 单选框点击事件
    change () {
      this.radio = 1
    },
    // 关闭弹框的事件
    close () {
      this.$emit('close')
      this.isVideoShow = false
    }
  },
  computed: {
    options () {
      // 先判断是不是多选题
      if (this.questionItem.questionType === '2') {
        if (!this.questionItem.options) {
          return // 如果没有题目选项停止后续操作
        }
        // 遍历传递过来的题目选项 如果isRight===1 代表该选项是被选中的选项
        this.questionItem.options.forEach((element) => {
          if (element.isRight === 1) {
            // 将这一项的isRight改为true 多选框就会默认选择
            element.isRight = true
          }
        })
        // 修改完成之后
        return this.questionItem.options
      } else {
        // 如果不是单选题 原路返回传递过来的题目项
        return this.questionItem.options
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .video {
    width: 400px;
  }
  .answer {
    padding: 8px 0px;
  }
  .el-row {
    .el-col {
      span {
        font-size: 14px;
        color: #606266;
        line-height: 36px;
      }
    }
  }
}
</style>
