<template>
  <!-- eslint-disable -->
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="qureyInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据区 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click=" showEdit(scope.row.id) "
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deluser(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="qureyInfo.pagenum"
        :page-sizes="[1, 2, 4, 5]"
        :page-size="qureyInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户提示框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addClose">
      <el-form :model="addForm" :rules="addrules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户提示框 -->
    <el-dialog title="修改用户" :visible.sync="EditdialogVisible" width="50%" @close="editClose">
      <el-form ref="editformRef" :model="eidtForm" label-width="70px" :rules="editFormRules">
        <el-form-item label="用户名">
          <el-input v-model="eidtForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="eidtForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="eidtForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户信息提示框 -->
    <el-dialog title="是否删除用户信息" :visible.sync="DELdialogVisible" width="50%" >
      <span slot="footer" class="dialog-footer">
        <el-button @click="DELdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="DeleUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    //自定义校验规则
    var checkEmail = (rule, value, cb) => {
      const regemail = /^[\w-]+@([\w-]+\.)+(com|cn|org|net)$/i;
      if (regemail.test(value)) {
        return cb();
      }
      cb(new Error("输入合法邮箱"));
    };

    var checkMobile = (rule, value, cb) => {
      const mo = /^1[3456789]\d{9}$/;
      if (mo.test(value)) {
        return cb();
      }
      cb(new Error("输入合法手机号"));
    };
    return {
      qureyInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      EditdialogVisible: false,
      DELdialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户校验规则
      addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户长度3-10", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "用户长度6-15", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //保存查询到的用户信息
      eidtForm: {},
      delForm:{},
      //修改用户规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.qureyInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("error");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.qureyInfo.pagesize = newSize;
      this.getUsersList();
    },
    //监听pagenum改变事件
    handleCurrentChange(newPage) {
      this.qureyInfo.pagenum = newPage;
      this.getUsersList();
    },
    //监听状态改变
    async stateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("error");
      }
      this.$message.success("success");
      console.log(userinfo);
    },
    //监听添加表单关闭状态
    addClose() {
      this.$refs.addFormRef.resetFields();
    },
    //监听修改关闭状态
    editClose() {
      this.$refs.editformRef.resetFields();
    },
    //添加用户表单预校验
    addUser() {
      //先进行预验证
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        //添加完成后关闭对话框
        this.dialogVisible = false;
        //重新获取用户数据
        this.getUsersList();
      });
    },
    //修改用户信息
    async showEdit(id) {
      this.EditdialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.eidtForm = res.data;
    },
    editFormInfo() {
      this.$refs.editformRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.eidtForm.id,
          { email: this.eidtForm.email, mobile: this.eidtForm.mobile }
        );
        if (res.meta.status !== 201) {
          this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        //添加完成后关闭对话框
        this.EditdialogVisible = false;
        //重新获取用户数据
        this.getUsersList();
      });
    },
    async deluser(id){
       this.DELdialogVisible = true;
       const { data: res } = await this.$http.get("users/" + id);
        if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
        }
      this.delForm = res.data;
    },
    //删除用户的信息
    async DeleUser() {
        const {data: res} = await this.$http.delete('users/'+this.delForm.id)
        if (res.meta.status !== 201) {
          this.$message.error("删除失败");
        }
        this.$message.success(res.meta.msg);
        this.DELdialogVisible = false
        this.getUsersList();
    }
  }
};
</script>
<style lang="less" scoped>
</style>