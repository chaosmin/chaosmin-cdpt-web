<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-button type="text">
        <span class="right-menu-item" style="font-size: 15px;"><i class="el-icon-user-solid" /> {{ this.$store.getters.name }}</span>
      </el-button>
      <router-link to="/profile/index">
        <el-button type="text">
          <span class="right-menu-item" style="font-size: 15px;"><svg-icon icon-class="edit-password" /> {{ $t('navbar.editPassword') }}</span>
        </el-button>
      </router-link>
      <el-button type="text">
        <span class="right-menu-item" style="font-size: 15px;">余额: <svg-icon icon-class="money" /> 0.00</span>
      </el-button>
      <el-button type="text">
        <span class="right-menu-item" style="font-size: 15px;"><svg-icon icon-class="alipay" /> {{ $t('navbar.reCharge') }}</span>
      </el-button>
      <el-button type="text">
        <span class="right-menu-item" style="font-size: 15px;"><svg-icon icon-class="list" /> {{ $t('navbar.reChargeRecord') }}</span>
      </el-button>
      <el-button type="text">
        <span class="right-menu-item" style="font-size: 15px;"><i class="el-icon-s-data" /> {{ $t('navbar.consumptionDetails') }}</span>
      </el-button>
      <el-button type="text" style="margin-right: 10px;" @click.native="logout">
        <span class="right-menu-item" style="font-size: 15px;"><svg-icon icon-class="logout" /> {{ $t('navbar.logOut') }}</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
