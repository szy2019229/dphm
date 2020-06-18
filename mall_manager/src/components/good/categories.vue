<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :data="Categorieslist"
        show-index
        index-text="#"
        class="TreeTable"
        border
        children-prop="thirdLevelCategoryVOS"
        :expand-type="false"
        :columns="columns"
        :selection-type="false">

        <template slot="isok">
          <i class="el-icon-success" style="color: lightgreen"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.categoryLevel===1">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.categoryLevel===2" type="success">二级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.categoryLevel===3" type="warning">三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.categoryId)" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteCategory(scope.row.categoryId)" size="mini">删除</el-button>
        </template>
      </tree-table>

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

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCategoryForm"
        :rules="addCategoryFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="categoryName">
          <el-input v-model="addCategoryForm.categoryName"></el-input>
        </el-form-item>

        <el-form-item label="父级分类" >
          <el-cascader
            :options="ParentCategoryList"
            :props="childrenProps"
            clearable
            v-model="selectedKeys"
            @change="parentChanged"
            change-on-select
          >
          </el-cascader>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editCategoryForm"
        :rules="editCategoryFormRules"
        ref="editCategoryFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称">
          <el-input v-model="editCategoryForm.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
  export default {
    data() {
      return{
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 10
        },
        Categorieslist: [],
        ParentCategoryList:[],
        total:0,
        columns:[{
          label:'分类名称',
          prop:'categoryName'
        },{
          label: '是否有效',
          type:'template',
          template:'isok'
        },{
          label: '排序',
          type:'template',
          template:'order'
        },{
          label: '操作',
          type:'template',
          template:'opt'
        }],
        addCateDialogVisible: false,
        addCategoryForm:{
          categoryName: "",
          parentId: 0,
          categoryLevel: 1
        },
        addCategoryFormRules:{
          categoryName:[{required:true,message:'请输入分类名称',trigger:'blur'}],
        },
        childrenProps:{
          value:'categoryId',
          label:'categoryName',
          children:'secondLevelCategoryVOS'
        },
        selectedKeys:[],
        editDialogVisible:false,
        editCategoryForm:{},
        editCategoryFormRules:{},
      };
    },
    methods: {
      async getCategoriesList(){
        const { data:res } = await this.$http.get("categories", {
          params:{}
        });
        if(res.resultCode !== 200) return this.$message('获取商品分类列表失败')
        this.Categorieslist = res.data
        this.total = res.data.length
        for (var i=0;i<this.Categorieslist.length;i++){
          this.Categorieslist[i]["thirdLevelCategoryVOS"]=this.Categorieslist[i].secondLevelCategoryVOS
        }
        console.log(this.Categorieslist)
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCategoriesList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getCategoriesList();
      },
      showAddCateDialog() {
        this.getParentCateList();
        this.addCateDialogVisible = true;
      },
      getParentCateList(){
        this.getCategoriesList();
        this.ParentCategoryList=this.Categorieslist
      },
      parentChanged() {
        if (this.selectedKeys.length > 0) {
          this.addCategoryForm.parentId = this.selectedKeys[this.selectedKeys.length-1]
          this.addCategoryForm.categoryLevel = this.selectedKeys.length+1
        }else{
          this.addCategoryForm.parentId = 0
          this.addCategoryForm.categoryLevel = 1
        }
      },
      addCategory(){
        this.$refs.addCateFormRef.validate(async valid => {
            if (!valid) return;
            console.log(this.addCategoryForm)
            const { data:res } = await this.$http.post("category", this.addCategoryForm);
            if (res.resultCode === 200) {
              this.$message.success("添加商品分类成功！");
            }
            else{
              this.$message.error("添加商品分类失败！");
            }
          this.addCateDialogVisible = false;
          this.getCategoriesList();
        });
      },
      addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields();
        this.selectedKeys=[]
        this.addCategoryForm.categoryLevel=1
        this.addCategoryForm.parentId=0
      },
      async showEditDialog(id) {
        const { data:res } = await this.$http.get(`category/${id}`);
        console.log(res)
        if (res.resultCode !== 200) {
          this.$message.error("查询分类失败！");
        }
        this.editCategoryForm = res.data;
        this.editDialogVisible = true;
      },

      editDialogClosed() {
        this.$refs.editCategoryFormRef.resetFields();
      },
      editCategory() {
        this.$refs.editCategoryFormRef.validate(async valid => {
          if (!valid) return;
          console.log(this.editCategoryForm.categoryId)
          var idd=this.editCategoryForm.categoryId
          const { data } = await this.$http.put(`category`, this.editCategoryForm);
          if (data.resultCode === 200) {
            this.$message.success("修改分类信息成功！");
          }
          else{
            this.$message.error("修改失败！");
          }
          this.editDialogVisible = false;
          this.getCategoriesList();
        });
      },

      deleteCategory(id) {
        this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const { data:res } = await this.$http.delete(`category/${id}`);

            if (res.resultCode !== 200) {
              this.$message.error(res.message);
            } else {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCategoriesList();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "你不能删除该分类"
            });
          });
      },
    },
    created() {
      this.getCategoriesList();
    }
  };
</script>

<style lang="less" scoped>
  .TreeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
