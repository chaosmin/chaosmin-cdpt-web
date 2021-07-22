<template>
  <div class="login-container">
    <div class="login_top">
      <img src="../../assets/login/logo.svg" width="190" height="50" style="margin-top:20px;cursor:pointer;">
    </div>

    <div class="login_main">
      <div class="main_container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

          <div class="title-container">
            <h3 class="title">
              {{ $t('login.title') }}
            </h3>
          </div>

          <el-form-item prop="loginName">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="loginName"
              v-model="loginForm.loginName"
              :placeholder="$t('login.loginName')"
              name="loginName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
            {{ $t('login.logIn') }}
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="login_bottom">
      <div class="panel">
        <div class="panel-heading">
          <div>产品丰富</div>
        </div>
        <div class="panel-body">
          <div class="row">
            <i class="el-icon-connection" />
            <p class="col col-md-9 feature-description">
              险种丰富多样，全面保障<br>
              优选保险公司，紧密合作<br>
            </p>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading">
          <div>操作简单</div>
        </div>
        <div class="panel-body">
          <div class="row">
            <i class="el-icon-edit-outline" />
            <p class="col col-md-9 feature-description">
              团单批量投保，省时省心<br>
              系统接口直连，实时出单<br>
            </p>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading">
          <div>服务专业</div>
        </div>
        <div class="panel-body">
          <div class="row">
            <i class="el-icon-service" />
            <p class="col col-md-9 feature-description">
              专业一对一客服，急您所急<br>
              理赔材料在线传，快速简单<br>
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer" style="font-size:8px;">
      <hr>

      <div id="hizom_footer" class="footer_container content-align-center" hidden="" style="display: block;">
        <p>Copyright © 2018-2021 上海森昊保险代理有限公司 &nbsp;&nbsp;备案号：沪ICP备16005694号-1
          <!--  <br> 客服邮箱：<a href="mailto:xulin@aybao.com">xulin@aybao.com</a>&nbsp;&nbsp;客服电话(工作日9:30-17:30)：<a href="tel:021-52860188">021-52860188</a> -->
        </p>
      </div>
    </footer>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validLoginName } from '@/utils/validate'
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateLoginName = (rule, value, callback) => {
      if (!validLoginName(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: '',
        password: ''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateLoginName }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.loginName === '') {
      this.$refs.loginName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  //background-color: $bg;
  overflow: hidden;
  .login_top{
    max-width:1160px;
    padding-right: 10px;
    padding-left: 10px;
    margin-right: auto;
    margin-left: auto;
    height:90px;//暂定
    //background:#f8f8f8;
  }
  .login_main{
    height:480px;
    background:url('../../assets/login/login_bg.jpg');
    background-size:100% 480px;
    .main_container{
      width:1160px;
      margin:0 auto;
      height:100%;
      .login-form {
        position: relative;
        width: 320px;
        max-width: 100%;
        padding: 0px 16px 0;
        float:right;
        background:#f8f8f8;
        margin-top:75px;
        background:rgba(0,0,0,.6);
        padding-top:20px;
        border-radius:7px;
        //margin: 0 auto;
        overflow: hidden;
      }
    }
  }
  .login_bottom{
    max-width:1160px;
    display:flex;
    margin:24px auto 0;
    justify-content: space-around;
    .panel{
       margin-bottom:20px;
       background-color: #fff;
       border-radius: 4px;
       font-size:14px;
       flex-grow: 1;
       margin-right:22px;
       .panel-heading{
        color:#888;
        padding: 12px 15px;
        border-bottom: 1px solid #ddd;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
       }
       .panel-body{
        color: #888;
        padding: 15px;
         .row{
          margin-right:-10px;
          margin-left:-10px;
          i{
            font-size:72px;
            color:#ddd;
            float:left;
          }
         .feature-description{
          float:right;
         text-align: center;
         line-height: 32px;
         margin-top: 5px;
         width:75%;
         }
         }

       }
    }
  }
  .footer{
    margin-top:30px;
    hr{
      margin-top:20px;
      margin-bottom:20px;
      border:0;
      border-top: 1px solid #e5e5e5;
    }
    .footer_container{
      letter-spacing:0.1em;
      max-width:1160px;
      text-align:center;
      padding-right:10px;
      padding-left:10px;
      margin:0 auto;
      color:#353535;
      font-size:12px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 22px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
