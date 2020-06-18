<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
    <el-form
      :model="adminForm"
      ref="adminFormRef"
        label-width="400px"
      class="demo-ruleForm"
    >
      <el-form-item label="昵称">
        <el-input v-model="adminForm.nickName"></el-input>
      </el-form-item>
      <el-form-item label="登陆账户">
        <el-input v-model="adminForm.loginName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="adminForm.passwordMd5"></el-input>
      </el-form-item>
      <el-form-item label="签名">
        <el-input v-model="adminForm.introduceSign"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="margin-left: 330px;" @click="editAdmin">提交</el-button>
      </el-form-item>
    </el-form>
    </div>
    </div>

</template>


<script>
  export default {
    data() {
      return {
        adminForm:{}
      }
    },
    methods: {
      async getUserList () {
        const { data: res } = await this.$http.get("info", {
          params: {}
        });
        if (res.resultCode !== 200) return this.$message('获取用户列表失败')
        this.adminForm = res.data
        this.total = res.data.length
        console.log(this.adminForm)
      },
      editAdmin() {
        this.$refs.adminFormRef.validate(async valid => {
          if (!valid) return;
          console.log(this.adminForm.userId)
          var idd=this.adminForm.userId
          this.adminForm.passwordMd5=this.$md5(this.adminForm.passwordMd5)
          const { data } = await this.$http.put(`info`, this.adminForm);
          if (data.resultCode === 200) {
            this.$message.success("修改管理员信息成功！");
          }
          else{
            this.$message.error("修改失败！");
          }
          this.editDialogVisible = false;
          this.getUserList();
        });
      },

    },
    created() {
      this.getUserList();
    }
  };
</script>

<style lang="less" scoped>
  .el-form-item{
   width: 800px;
  }

</style>

