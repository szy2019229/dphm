<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页配置</el-breadcrumb-item>
      <el-breadcrumb-item>热销商品配置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getHotgoodsList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="hotgoodslist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="configName" label="商品名"></el-table-column>
        <el-table-column prop="configRank" label="显示优先级"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="是否注销">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.isDeleted===0">未注销</el-tag>
            <el-tag size="mini" v-else type="danger">已注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 编辑商品 -->
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.configId)" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleted(scope.row.configId)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

    </el-card>

    <el-dialog
      title="修改热销商品"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editHotgoodsForm"
        :rules="editHotgoodsFormRules"
        ref="editHotgoodsFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名">
          <el-input v-model="editHotgoodsForm.configName"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input v-model="editHotgoodsForm.configRank"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editHotgoods">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return{
      hotgoodslist:[],
      total:0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      editDialogVisible:false,
      editHotgoodsForm:{},
      editHotgoodsFormRules:{},

    }
  },
  methods:{
    async getHotgoodsList() {
      const { data:res } = await this.$http.get('indexConfigs/configType/3',{});
      console.log(res.data)
      if(res.resultCode !== 200) return this.$message('获取商品列表失败')
      this.hotgoodslist = res.data
      this.total = this.hotgoodslist.length
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getHotgoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getHotgoodsList();
    },
    async showEditDialog(id) {
      const { data:res } = await this.$http.get(`indexConfig/${id}`);
      console.log(res)
      if (res.resultCode !== 200) {
        this.$message.error("查询失败！");
      }
      this.editHotgoodsForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editHotgoodsFormRef.resetFields();
    },
    editHotgoods() {
      this.$refs.editHotgoodsFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$http.put(`indexConfig`, this.editHotgoodsForm);
        if (data.resultCode === 200) {
          this.$message.success("修改信息成功！");
        }
        else{
          this.$message.error("修改失败！");
        }
        this.editDialogVisible = false;
        this.getHotgoodsList();
      });
    },
    deleted(id) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data:res } = await this.$http.delete(`indexConfig/${id}`);
          console.log(data)
          if (res.resultCode !== 200) {
            this.$message.error(res.message);
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getHotgoodsList();
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
    this.getHotgoodsList();
  }

}
</script>
