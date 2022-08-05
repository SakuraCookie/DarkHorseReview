<template>
  <div style="display: flex;height: 70px; align-items:center">
    <el-input v-model="item.title" placeholder="" size="medium" style="width:240px"></el-input>
    <el-upload
      class="upload"
      :class="{'has-picture': fileList.length>0}"
      action
      :multiple="false"
      list-type="picture-card"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      :http-request="handleUpload"
      :on-remove="handleRemove"
    >
      <img v-if="fileList.length>0" class="el-upload-list__item-thumbnail" :src="imgUrl" style="object-fit:contain" />
      <i class="upload-text" v-else>上传图片</i>
    </el-upload>
  </div>
</template>

<script>
const COS = require('cos-js-sdk-v5')
const cos = new COS({
  SecretId: 'AKID0tgWElnoAMNC3l8bkPwJ4HgwNyoo7R5f',
  SecretKey: 'fBtTsAMeqrV9e7TeoBTdx8OlyscAbqpe'
})

export default {
  data () {
    return {
      // 要上传的文件列表
      fileList: [],
      // 是否正在上传
      isUploading: false,
      // 图片地址
      imgUrl: undefined
    }
  },
  props: {
    item: {
      require: true,
      type: Object
    }
  },
  methods: {
    // 图片上传之前
    handleBeforeUpload (file) {
      // 检查图片类型
      const type = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/webp']
      if (!type.includes(file.type)) {
        this.$message({
          message: '图片格式不正确',
          type: 'error',
          showClose: true,
          duration: 3000
        })
        this.handleRemove(file)
        return false
      }
      // 检查图片大小
      if (file.size > 1 << 20) {
        this.$message({
          message: `图片过大，不能超过${1}M字节`,
          type: 'error',
          showClose: true,
          duration: 3000
        })
        this.handleRemove(file)
        return false
      }
      return true
    },
    // 图片上传
    handleUpload ({ file }) {
      this.showProgress = true
      this.isUploading = true
      cos.putObject({
        Bucket: 'rzzt-1255651667',
        Region: 'ap-nanjing',
        Key: Date.now() + file.name,
        StorageClass: 'STANDARD',
        Body: file
      }, (err, data) => {
        if (err) {
          this.isUploading = false
          this.item.img = undefined
          this.handleRemove(file)
        }
        this.imgUrl = 'http://' + data.Location
        this.item.img = this.imgUrl
        this.isUploading = false
      })
    },
    // 选中图片
    handleChange (file) {
      this.fileList.push(file)
    },
    // 删除图片
    handleRemove () {
      this.item.img = this.imgUrl = undefined
      this.fileList.splice(0)
    }
  }
}
</script>

<style>

</style>
