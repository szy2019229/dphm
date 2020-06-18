<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderlist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="totalPrice" label="订单总价"></el-table-column>
        <el-table-column label="订单状态">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.orderStatus===1">已完成</el-tag>
            <el-tag size="mini" v-else-if="scope.row.payStatus===1" type="success">正在配送</el-tag>
            <el-tag size="mini" v-else type="danger">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="是否注销">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.isDeleted===0">未注销</el-tag>
            <el-tag size="mini" v-else type="danger">已注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-s-flag" @click="successOrder(scope.row.orderId,scope.row.orderStatus)" size="mini">完成</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteOrder(scope.row.orderId)" size="mini">删除</el-button>
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

  </div>
</template>

<script>
  export default {
    data() {
      return{
        orderlist: [],
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
      }
    },
    methods: {
      async getOrderList() {
        const { data:res } = await this.$http.get("orders/list", {
          params:{
            'page':this.queryInfo.pagenum,
            'limit':this.queryInfo.pagesize
          }
        });
        if(res.resultCode !== 200) return this.$message('获取订单列表失败')
        this.orderlist = res.data.list
        this.total = res.data.totalCount
        console.log(res)
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      successOrder(id,orderStatus) {
        if(orderStatus===1){
          this.$message({
            type: "info",
            message: "订单已完成!"
          });
        }
        else{
          this.$confirm("此操作将确认订单完成, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              const { data:res } = await this.$http.put(`order/${id}/finish`);
              console.log(res)
              if (res.resultCode !== 200) {
                this.$message.error(res.message);
              } else {
                this.$message({
                  type: "success",
                  message: "确认成功!"
                });
                this.getOrderList();
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消确认"
              });
            });
        }
      },

      deleteOrder(id) {
        this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const { data:res } = await this.$http.delete(`order/${id}`);
            console.log(res)
            if (res.resultCode !== 200) {
              this.$message.error(res.message);
            } else {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getOrderList();
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
      this.getOrderList();
    }
  };
</script>

<style lang="less" scoped></style>
