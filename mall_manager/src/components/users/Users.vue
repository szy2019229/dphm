<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <el-table-column prop="loginName" label="登陆账户"></el-table-column>
        <el-table-column prop="passwordMd5" label="密码"></el-table-column>
        <el-table-column prop="introduceSign" label="签名"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="是否注销">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.isDeleted===0">未注销</el-tag>
            <el-tag size="mini" v-else type="danger">已注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 编辑用户 -->
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.userId)" size="mini"></el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.userId)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addUserForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="loginName">
          <el-input v-model="addUserForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>



    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称">
          <el-input v-model="editUserForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="登陆账户">
          <el-input v-model="editUserForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserForm.passwordMd5"></el-input>
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="editUserForm.introduceSign"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    // 自定义手机号校验规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addUserForm: {
        nickname: "",
        password: "",
        loginName: ""
      },
      addUserFormRules: {
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ],
        loginName: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editUserForm: {},
      editDialogVisible:false,
      editUserFormRules: {
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ],
        loginName: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        introduceSign:[],
        lockedFlag:[],
        isDeleted:[]
      },
    }
  },
  methods: {
    async getUserList() {
      const { data:res } = await this.$http.get("users", {
        params:{}
      });
      if(res.resultCode !== 200) return this.$message('获取用户列表失败')
      this.userlist = res.data
      this.total = res.data.length
      console.log(this.userlist)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data:res } = await this.$http.post("user", {
          "loginName":this.addUserForm.loginName,
          "passwordMd5":this.$md5(this.addUserForm.password),
          "nickName":this.addUserForm.nickname
        });
        if (res.resultCode === 200) {
          this.$message.success("添加用户成功！");
        }
        else{
          this.$message.error("添加用户失败！");
        }
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      const { data:res } = await this.$http.get(`user/${id}`);
      console.log(res)
      if (res.resultCode !== 200) {
        this.$message.error("查询用户失败！");
      }
      this.editUserForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editUserForm.userId)
        var idd=this.editUserForm.userId
        const { data } = await this.$http.put(`user/${idd}`, this.editUserForm);
        if (data.resultCode === 200) {
          this.$message.success("修改用户信息成功！");
        }
        else{
          this.$message.error("修改失败！");
        }
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data:res } = await this.$http.delete(`user/${id}`);

          if (res.resultCode !== 200) {
            this.$message.error(res.message);
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="less" scoped></style>
