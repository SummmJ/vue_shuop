<template>
<!-- eslint-disable -->
<div class="login_container" >
  <div class="login_box">  
      <!-- 登录头像 -->
      <div class="avatar_box">
          <img src="../assets/image/avatar.jpg">
      </div>   
      <!-- 登录表单 --> 
      <el-form ref="loginRef" label-width="0px"  :model="Form" :rules="rules"  class="login_form">
        <el-form-item prop="username">
            <el-input v-model="Form.username" prefix-icon="el-icon-user-solid">
            </el-input>
        </el-form-item>  

        <el-form-item prop="password">
            <el-input  v-model="Form.password"  prefix-icon="el-icon-lock" type="password">
            </el-input>  
        </el-form-item>
        <el-form-item class="btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="formFresh">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</div>
</template>
<script >
/* eslint-disable */
export default {
  data () {   
    return {
      Form: {
        username: 'admin',
        password: '123456'
      },
      //   表单验证规则的对象
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formFresh () {
    //   console.log(this)
      this.$refs.loginRef.resetFields()
    },
    login () {
      this.$refs.loginRef.validate(async (valid) => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return 
        const { data: res } = await this.$http.post('login', this.Form)
        console.log(res) 
        if (res.meta.status !== 200) return this.$message.error('登录失败')       
         this.$message.success('登录成功')    
       // 将登录之后的token保存到客户端的sessionstorage中
       window.sessionStorage.setItem("token", res.data.token);
          this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container{
 background-color: rgb(33, 118, 167);
 height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color:#fff;
    position: absolute;
    border-radius: 3px;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
}
.avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    // 居中处理
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff ;
 img{
     width:100%;
     height: 100%;
     border-radius: 50%;
     background: #eee;
 }
}
.btn{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
