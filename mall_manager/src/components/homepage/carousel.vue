<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页配置</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图配置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getCarouselList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加轮播图</el-button>
        </el-col>
      </el-row>

      <el-table :data="carousellist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column  label="图片">
          <template v-slot="scope">
            <img :src="scope.row.carouselUrl" width="40" height="40" class="head_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="redirectUrl" label="跳转地址"></el-table-column>
        <el-table-column prop="carouselRank" label="优先级"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column style="width: 80%" label="是否注销">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.isDeleted===0">未注销</el-tag>
            <el-tag size="mini" v-else type="danger">已注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 编辑商品 -->
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.carouselId)" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleted(scope.row.carouselId)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

    </el-card>

    <el-dialog title="添加轮播图" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addCarouselForm" :rules="addCarouselFormRules" ref="addCarouselFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="图片url">
          <el-input v-model="editCarouselForm.carouselUrl"></el-input>
        </el-form-item>
        <el-form-item label="跳转url">
          <el-input v-model="editCarouselForm.redirectUrl"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input v-model="editCarouselForm.carouselRank"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCarousel">确 定</el-button>
      </span>
    </el-dialog>



    <el-dialog
      title="修改轮播图"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editCarouselForm"
        :rules="editCarouselFormRules"
        ref="editCarouselFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="图片url">
          <el-input v-model="editCarouselForm.carouselUrl"></el-input>
        </el-form-item>
        <el-form-item label="跳转url">
          <el-input v-model="editCarouselForm.redirectUrl"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input v-model="editCarouselForm.carouselRank"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCarousel">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      return{
        carousellist:[],
        total:0,
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        editDialogVisible:false,
        editCarouselForm:{},
        editCarouselFormRules:{},
        addDialogVisible: false,
        addCarouselForm: {
          carouselUrl: "",
          redirectUrl: "",
          carouselRank: ""
        },
        addCarouselFormRules: {
          carouselUrl: [
            { required: true, message: "请输入轮播图地址", trigger: "blur" },
          ],
          redirectUrl: [
            { required: true, message: "请输入点击跳转地址", trigger: "blur" },
          ],
          carouselRank: [
            { required: true, message: "请输入优先级", trigger: "blur" },
          ]
        },
      }
    },
    methods:{
      async getCarouselList() {
        const { data:res } = await this.$http.get('carousels',{});
        console.log(res.data)
        if(res.resultCode !== 200) return this.$message('获取商品列表失败')
        this.carousellist = res.data
        this.total = this.carousellist.length
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCarouselList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getCarouselList();
      },
      async showEditDialog(id) {
        const { data:res } = await this.$http.get(`carousel/${id}`);
        console.log(res)
        if (res.resultCode !== 200) {
          this.$message.error("查询失败！");
        }
        this.editCarouselForm = res.data;
        this.editDialogVisible = true;
      },
      editDialogClosed() {
        this.$refs.editCarouselFormRef.resetFields();
      },
      editCarousel() {
        this.$refs.editCarouselFormRef.validate(async valid => {
          if (!valid) return;
          const { data } = await this.$http.put(`carousel/${this.editCarouselForm.carouselId}`, this.editCarouselForm);
          if (data.resultCode === 200) {
            this.$message.success("修改信息成功！");
          }
          else{
            this.$message.error("修改失败！");
          }
          this.editDialogVisible = false;
          this.getCarouselList();
        });
      },
      deleted(id) {
        this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const { data:res } = await this.$http.delete(`carousel/${id}`);

            if (res.resultCode !== 200) {
              this.$message.error(res.message);
            } else {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCarouselList();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      addDialogClosed() {
        this.$refs.addCarouselFormRef.resetFields();
      },
      addCarousel() {
        this.$refs.addCarouselFormRef.validate(async valid => {
          if (!valid) return;
          const { data:res } = await this.$http.post("carousel", this.addCarouselForm);
          console.log(this.addCarouselForm)
          if (res.resultCode === 200) {
            this.$message.success("添加轮播图成功！");
          }
          else{
            this.$message.error("添加轮播图失败！");
          }
          this.addDialogVisible = false;
          this.getCarouselList();
        });
      },
    },
    created() {
      this.getCarouselList();
    }

  }
</script>
