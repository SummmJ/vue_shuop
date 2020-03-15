<template>
  <!-- eslint-disable -->

  <el-container class="container">
    <el-header>
      <div>
        <img src="../assets/image/logo.jpg" alt />
        <span>后台管理</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
          <!-- 动态绑定收放的宽度 -->
      <el-aside :width = "isCollapse ? '64px' : '230px' ">
        <div class="buttonS" @click="Collasp" > | | |</div>
        <el-menu background-color="rgb(9, 116, 216)" text-color="#fff" active-text-color="black" :unique-opened="true" 
        :collapse="isCollapse" :collapse-transition="false"  router  :default-active="activepath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconClass[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
              <!-- 二级菜单 -->
             <el-menu-item :index=" '/'+item2.path" v-for="item2 in item.children"  :key="item2.id" 
             @click="keepActive('/'+item2.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      menuList:[],
      iconClass:{
        '125': 'el-icon-user-solid',
        '103': 'el-icon-monitor',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
    },
    isCollapse:false,
    activepath:''
    };
  },
  created(){
    this.getMenuList()
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取菜单列表
    async getMenuList() {
     const {data: res} = await this.$http.get('menus')
     if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.menuList = res.data
     console.log(res)
    },
    //菜单列表隐藏
    Collasp(){
      this.isCollapse = !this.isCollapse
    },
    //保存链接激活状态
    keepActive(a){
         window.sessionStorage.setItem('activepath',a)
         this.activepath = a
    }
  }
};
</script>

    <style lang="less" scoped>
.container {
  height: 100%;
}
.el-header {
  background-color: rgb(9, 103, 190);
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  img {
    height: 60px;
    width: 60px;
  }
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: rgb(9, 116, 216);
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: rgb(216, 232, 236);
}
.buttonS{
  background-color:  rgb(7, 97, 180);
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
