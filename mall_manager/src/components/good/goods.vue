<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodlist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="originalPrice" label="原始价格"></el-table-column>
        <el-table-column prop="sellingPrice" label="现在价格"></el-table-column>
        <el-table-column prop="goodsIntro" label="商品说明"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column prop="tag" label="标签"></el-table-column>
        <el-table-column label="操作">
          <!-- 编辑商品 -->
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.goodsId)" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGood(scope.row.goodsId)" size="mini"></el-button>
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


    <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="addGoodForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="原始价格">
          <el-input v-model="addGoodForm.originalPrice"></el-input>
        </el-form-item>
        <el-form-item label="现在价格">
          <el-input v-model="addGoodForm.sellingPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品说明">
          <el-input v-model="addGoodForm.goodsIntro"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="addGoodForm.tag"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGood">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      title="修改商品"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editGoodForm"
        :rules="editGoodFormRules"
        ref="editGoodFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称">
          <el-input v-model="editGoodForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="原始价格">
          <el-input type="number" v-model.number="editGoodForm.originalPrice"  ></el-input>
        </el-form-item>
        <el-form-item label="现在价格">
          <el-input type="number" v-model.number="editGoodForm.sellingPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品说明">
          <el-input v-model="editGoodForm.goodsIntro"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="editGoodForm.tag"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        goodlist: [],
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        total:0,
        addDialogVisible:false,
        addGoodForm: {
          goodsName: "",
          originalPrice: "",
          sellingPrice: "",
          goodsIntro: "",
          tag: "",
        },
        addGoodFormRules: {
          goodsName:[]
        },
        editGoodForm: {},
        editDialogVisible:false,
        editGoodFormRules: {
          goodsName:[]
        }
      }
    },
    methods: {
      async getGoodList() {
        const { data:res } = await this.$http.get('good/list',{
          params:{
            'page':this.queryInfo.pagenum,
            'limit':this.queryInfo.pagesize
          }
        });
        console.log(res.data)
        if(res.resultCode !== 200) return this.$message('获取商品列表失败')
        this.goodlist = res.data.list
        this.total = res.data.totalCount
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodList();
      },
      addDialogClosed() {
        this.$refs.addGoodFormRef.resetFields();
      },
      addGood() {
        this.$refs.addGoodFormRef.validate(async valid => {
          if (!valid) return;
          const { data:res } = await this.$http.post("good",{
            "goodsName":this.addGoodForm.goodsName,
            "originalPrice":Number(this.addGoodForm.originalPrice),
            "sellingPrice":Number(this.addGoodForm.sellingPrice),
            "goodsIntro":this.addGoodForm.goodsIntro,
            "tag":this.addGoodForm.tag
          });
          if (res.resultCode === 200) {
            this.$message.success("添加商品成功！");
          }
          else{
            this.$message.error("添加商品失败！");
          }
          console.log({
            "goodsName":this.addGoodForm.goodsName,
            "originalPrice":Number(this.addGoodForm.originalPrice),
            "sellingPrice":Number(this.addGoodForm.sellingPrice),
            "goodsIntro":this.addGoodForm.goodsIntro,
            "tag":this.addGoodForm.tag
          })
          this.dialogVisible = false;
          this.getGoodList();
        });
      },
      async showEditDialog(id) {
        const { data:res } = await this.$http.get(`good/${id}`);
        console.log(res)
        if (res.resultCode !== 200) {
          this.$message.error("查询用户失败！");
        }
        this.editGoodForm = res.data;
        this.editDialogVisible = true;
      },
      editDialogClosed() {
        this.$refs.editGoodFormRef.resetFields();
      },
      editGood() {
        this.$refs.editGoodFormRef.validate(async valid => {
          if (!valid) return;
          const { data } = await this.$http.put('good', this.editGoodForm);
          if (data.resultCode === 200) {
            this.$message.success("修改商品信息成功！");
          }
          else{
            this.$message.error("修改失败！");
          }
          this.editDialogVisible = false;
          this.getGoodList();
        });
      },
      deleteGood(id) {
        this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const { data:res } = await this.$http.delete(`good/${id}`);
            console.log(res)
            if (res.resultCode !== 200) {
              this.$message.error(res.message);
            } else {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getGoodList();
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
      this.getGoodList();
    }

  };


</script>

<style lang="less" scoped></style>
