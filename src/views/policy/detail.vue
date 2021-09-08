<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="225px" style="background-color: rgb(238, 241, 246);padding-left: 12px;padding-right: 12px;">
      <el-menu class="el-menu-vertical-demo" :collapse="false" :default-openeds="defaultMenu" />
    </el-aside>

    <el-main>
      <el-form ref="dataForm" :model="policy" :inline-message="true" style="width: 1080px">
        <el-link :href="(policy.goodsPlan && policy.goodsPlan.clauseUrl)" target="_blank" style="float:right;padding-bottom: 5px;"><svg-icon icon-class="pdf" /> 详细条款下载</el-link>
        <table border="1" cellspacing="0" width="100%">
          <tr style="height:25pt;">
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>保险公司</span></td>
            <td colspan="5"><span>{{ (policy.goodsPlan && policy.goodsPlan.partnerName) || '加载中' }}</span></td>
          </tr>
          <tr style="height:25pt;">
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>保险产品</span></td>
            <td colspan="5"><span>{{ goodsName }}</span></td>
          </tr>
          <tr style="height:25pt;">
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>保险期限</span></td>
            <td><span> {{ policy.days }}天</span></td>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>起保时间</span></td>
            <td><span>{{ policy.startTime }}</span></td>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>终止时间</span></td>
            <td><span>{{ policy.endTime }}</span></td>
          </tr>
          <tr style="height:25pt;">
            <td><span style="padding-left: 17px">旅行目的地</span></td>
            <td colspan="2"><span>{{ policy.address }}</span></td>
            <td><span style="padding-left: 17px">团号/备注</span></td>
            <td colspan="2"><span>{{ policy.groupNo }}</span></td>
          </tr>
          <tr style="height:25pt;">
            <td><span style="padding-left: 17px">投保提示</span></td>
            <td colspan="5">
              <div v-html="( policy.goodsPlan && policy.goodsPlan.insuranceNotice)" />
            </td>
          </tr>
        </table>
        <el-table :data="policy.insuredList" border fit highlight-current-row style="width: 100%;margin-top: 8px" :header-row-style="rowStyle" :row-style="rowStyle">
          <el-table-column type="index" label="序" align="center" />
          <el-table-column label="姓名" align="center" width="100px" style="font-size: 12px">
            <template slot-scope="{row}"><span>{{ row.name }}</span></template>
          </el-table-column>
          <el-table-column label="性别" width="95px" align="center">
            <template slot-scope="{row}"><span>{{ row.gender }}</span></template>
          </el-table-column>
          <el-table-column label="证件类型" width="110px" align="center">
            <template slot-scope="{row}"><span>{{ row.certiType }}</span></template>
          </el-table-column>
          <el-table-column label="证件号码" align="center">
            <template slot-scope="{row}"><span>{{ row.certiNo }}</span></template>
          </el-table-column>
          <el-table-column label="出生日期" width="155px" align="center">
            <template slot-scope="{row}"><span>{{ row.dateOfBirth | parseTime('{y}-{m}-{d}') }}</span></template>
          </el-table-column>
          <el-table-column label="手机号" width="125px" align="center">
            <template slot-scope="{row}"><span>{{ row.mobile }}</span></template>
          </el-table-column>
          <el-table-column label="原价" width="75px" align="center">
            <span>￥{{ policy.unitPremium }}</span>
          </el-table-column>
          <el-table-column label="结算价" width="75px" align="center">
            <span>￥{{ policy.unitPremium * (100 - policy.comsRatio) / 100 }}</span>
          </el-table-column>
        </el-table>
        <table border="1" cellspacing="0" width="100%" style="margin-top: 8px;">
          <tr style="height:25pt;">
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>公司名称</span></td>
            <td>
              <el-form-item prop="policyHolderName" size="mini" style="margin-bottom: 0;">
                <span>{{ policy.policyHolderName }}</span>
              </el-form-item>
            </td>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>证件号码</span></td>
            <td>
              <el-form-item prop="policyHolderCerti" size="mini" style="margin-bottom: 0;">
                <span>{{ policy.policyHolderCerti }}</span>
              </el-form-item>
            </td>
          </tr>
        </table>
        <table border="1" cellspacing="0" width="100%" style="margin-top: 8px;">
          <tr style="height:25pt;">
            <td><span style="padding-left: 17px">人数合计：</span></td>
            <td><span style="padding-left: 10px"><b>{{ policy.insuredList.length }}</b> 人</span></td>
            <td><span style="padding-left: 17px">原价合计：</span></td>
            <td><span style="padding-left: 17px"><b>{{ policy.totalPremium }}</b> 元</span></td>
            <td><span style="padding-left: 17px">结算合计：</span></td>
            <td><span style="padding-left: 17px"><b>{{ policy.actualPremium }}</b> 元</span></td>
          </tr>
        </table>
        <div style="text-align:center;margin-top: 8px;">
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="checked" disabled>我已详细阅读并理解</el-checkbox>
          <el-button type="text" @click="centerDialogVisible = true">投保注意事项</el-button> |
          <el-link icon="el-icon-document" :href="(policy.goodsPlan && policy.goodsPlan.clauseUrl)" target="_blank">保险条款</el-link>
        </div>
        <div style="text-align:center">
          <el-button type="primary" size="mini" @click="goToList()">返回列表</el-button>
        </div>
        <br>
        <el-table :data="(policy.goodsPlan && policy.goodsPlan.liabilities)" style="width: 100%;font-size: 12px">
          <el-table-column align="center" :label="goodsName">
            <el-table-column align="center" prop="liabilityName" label="保障内容" />
            <el-table-column align="center" prop="amount" label="保障金额（人民币：元）" />
          </el-table-column>
        </el-table>
        <el-table :data="(policy.goodsPlan && policy.goodsPlan.rateTable)" style="width: 100%;font-size: 12px">
          <el-table-column align="center" label="保障金额/人 （人民币：元）">
            <el-table-column align="center" prop="remark" label="旅行天数" />
            <el-table-column align="center" prop="premium" label="价格" />
          </el-table-column>
        </el-table>
        <br>
        <div v-html="(policy.goodsPlan && policy.goodsPlan.productExternal)" />
      </el-form>

      <el-dialog title="投保注意事项" :visible.sync="centerDialogVisible" width="30%" center>
        <span style="font-size:16px;"><b>一、投保须知</b></span><br>
        <br>
        <span style="font-size:14px;">1. 注意事项</span><br>
        <span>您的保险合同是您和保险公司之间订立的具有法律效力的合同文件，请仔细阅读保险合同，若其中包含任何不正确的信息请立即告知本公司，否则您可能在索赔时无法获得保险金，并且或者您的保险合同可能会被宣布无效，而只能获得您保险期间所支付的无息保险费。为避免您不能从保险合同项下获得保险金的风险，您和所有被保险人应在投保单中如实披露所有您知道的（或应该知道的），关乎于本公司承保决定的重要事实。</span><br>
        <span style="font-size:14px;">2. 电子保单</span><br>
        <span>为客户提供快捷投保和售后服务，投保、理赔一站式全流程体验。网上投保为您提供电子保单，根据《中华人民共和国合同法》第十一条规定，数据电文是合法的合同表现形式，电子保单具有法律效力。</span><br>
        <br>
        <span style="font-size:16px;"><b>二、投保人/被保险人声明</b></span><br>
        <br>
        <span>本人已经如实填报一切重要的有关资料，绝无隐瞒或保留任何重大事实以影响贵公司评估风险或接受本投保申请，并同意将本投保单及声明作为和本人所定合约的根据，并以保险条款为准。</span><br>
        <span>本人已经理解并完整阅读以上须知及投保险种的保险条款，尤其是其中免除保险人责任的条款或者约定。</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="centerDialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { getOneGoodsPlan } from '@/api/goods-plans'
import { loadDraft } from '@/api/orders'
import jschardet from 'jschardet'

export default {
  name: 'PolicyDetailIndex',
  data() {
    return {
      checked: true,
      centerDialogVisible: false,
      defaultMenu: [],
      goodsName: '加载中',
      policy: {
        insuredList: [],
        goodsPlan: {
          clauseUrl: '',
          liabilities: [],
          rateTable: []
        }
      },
      rowStyle: {
        height: 12
      }
    }
  },
  created() {
    loadDraft(this.$route.params.orderNo).then(response => {
      if (response.success === true) {
        this.policy = response.data
        getOneGoodsPlan(response.data.goodsPlanId).then(response => {
          this.policy.goodsPlan = response.data
          this.goodsName = '[' + response.data.productName + '] - ' + response.data.productPlanName + ' - ' + response.data.primaryCoverage
        }).catch(err => {
          console.error(err)
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },
  methods: {
    goToList() {
      this.$router.push({ name: 'Policy' })
    },
    checkEncoding(base64Str) {
      // 这种方式得到的是一种二进制串
      const str = atob(base64Str.split(';base64,')[1])
      // 要用二进制格式
      let encoding = jschardet.detect(str)
      encoding = encoding.encoding
      if (encoding === 'windows-1252') {
        encoding = 'ANSI'
      }
      return encoding
    }
  }
}
</script>

<style>
span {
  font-size: 12px;
}

table {
  line-height: 14px;
}

div .el-tabs__content {
  padding-top: 5px;
}
</style>

<style lang="scss">
.date_picker .el-picker__footer .el-button--text {
  display: none;
}
</style>
