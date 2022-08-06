<template>
  <div class='container'>
     <el-dialog :visible="showTagsAdd" v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" :title="currentListId.id?'修改标签':'新增标签'" width="20%">
      <el-form ref="formRef" :model="form" :rules="rules" size="medium" label-width="100px" label-position="left">
        <el-form-item label="所属学科" prop="subjectID">
          <el-select filterable  v-model="form.subjectID" placeholder="请选择所属学科" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in  list" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入目录名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="end">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { add, update } from '@/api/hmmm/tags.js'
export default {
  name: 'TagsAdd',
  props: {
    showTagsAdd: {
      type: Boolean,
      required: true
    },
    currentList: {
      type: [Array, Object, String]
    },
    currentListId: {
      type: [Array, Object]
    },
    list: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('内容不能为空白字符'))
      } else {
        callback()
      }
    }
    return {
      form: {
        subjectID: undefined,
        tagName: undefined
      },
      rules: {
        subjectID: [{
          required: true,
          message: '请选择所属学科',
          trigger: 'change'
        }],
        tagName: [
          {
            required: true,
            message: '目录名称内容不能为空',
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  mounted () {
  },
  methods: {
    onOpen () {
      if (this.currentListId) {
        // this.form.subjectID = isNaN(this.currentListId.subjectID) ? undefined : this.currentListId.subjectID
        if (this.currentList === '') {
          this.form.subjectID = undefined
        } else {
          this.form.subjectID = this.currentListId.subjectID
        }
        this.form.tagName = this.currentListId.tagName
      }
    },
    onClose () {
      this.$refs.formRef.resetFields()
      // 手动清空表单
      this.form = {
        subjectID: undefined,
        tagName: undefined
      }
      // 清空父组件传过来的数据
      this.$parent.currentList = {}
      this.$parent.currentListId = {}
      // 关闭弹层
      this.$emit('update:showTagsAdd', false)
    },
    handelConfirm () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        // 发送请求,判断是新增还是修改
        if (this.currentListId.id) {
          // 修改
          // 准备入参数据
          const data = {
            id: this.currentListId.id,
            ...this.form
            // subjectID: this.form.subjectID,
            // tagName: this.form.tagName
          }
          await update(data)
        } else {
          await add(this.form)
          this.$parent.page.page = 1
        }
        // 通知父组件刷新列表
        this.$parent.detail()
        // 提示成功
        this.$message({
          message: '操作成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        // 关闭弹层
        this.onClose()
      })
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
