<template>
  <div>
 <el-row :gutter="20">
  <el-col :span="6"><div class="grid-content bg-purple">【题型】 ：
      <span v-if="list.questionType == '1'">
                单选
              </span>
              <span v-else-if="list.questionType == '2'">
                多选
              </span>
              <span v-else>
                简答
              </span>
  </div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【编号】：{{list.id}}</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【难度】：
     <span v-if="list.difficulty == '1'">
                简单
              </span>
              <span v-else-if="list.difficulty == '2'">
                一般
              </span>
              <span v-else>
                困难
              </span>
  </div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【标签】：{{list.tags}}</div></el-col>
   <el-col :span="6"><div class="grid-content bg-purple">【学科】：{{list.subjectName}}</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【目录】：{{list.directoryName}}</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">【方向】：{{list.direction}}</div></el-col>
</el-row>
    <hr>
   <div >【题干】 ：</div>
   <div class="topic" ><a href="javascript:;"  v-html="list.question"></a> </div>
          <div v-show="list.questionType !== '3'">
      <div>
            <span v-if="list.questionType == '1'">
                单选
              </span>
              <span v-else-if="list.questionType == '2'">
                多选
              </span>
              <span v-else>
                简答
              </span>
          选项：（以下选中的选项为正确答案
          </div>
              <el-radio-group v-model="radio">
              <el-radio v-for="(item,index) in list.options" :key="index" :label="item.isRight">{{item.title}} </el-radio>
            </el-radio-group>
          </div>
     <hr>
     <div >【参考答案】 ：
        <el-button type="danger" size="small" @click="isVideoShow = true">视频答案预览</el-button>
     </div>
    <video v-if="isVideoShow" width="401" height="301" controls>
    <source :src="list.videoURL" type="video/mp4">
    <source :src="list.videoURL" type="video/ogg">
    您的浏览器不支持 video 标签。
</video>
<hr>
<div  class="topic">【答案解析】：<a href="javascript:;" v-html="list.remarks"></a></div>
 <hr>
 <div>【题目备注】：<span v-html="list.remarks"></span></div>
  </div>

</template>

<script>
import { detail } from '../../api/hmmm/questions'

export default {
  name: 'questionsTopicPreview',
  props: {
    ListId: {
      type: Number,
      required: true
    }

  },
  data () {
    return {
      radio: 1,
      list: {},
      isVideoShow: false
    }
  },
  components: {},
  created () {
    this.detailList()
  },
  mounted () {},
  methods: {
    // 题库列表详情
    async detailList () {
      try {
        const res = await detail({ id: this.ListId })
        this.list = res.data
      } catch (error) {
        console.dir(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
    line-height: 35px;
}
.el-divider{
    margin: 10px 0;
}
.el-radio-group{
        display: flex;
  flex-direction: column;
}
.el-radio{
    line-height: 35px;
}
.topic{
     line-height: 40px;
}
hr{
    margin: 10px 0;
}
</style>
