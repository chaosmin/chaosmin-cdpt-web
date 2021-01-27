<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="225px" style="background-color: rgb(238, 241, 246);padding-left: 12px;padding-right: 12px;">
      <el-menu
        class="el-menu-vertical-demo"
        unique-opened
        :collapse="isCollapse"
      >
        <template v-for="category in categories">
          <el-submenu :key="category.id" :index="category.id">
            <template slot="title">
              <i class="el-icon-location" />
              <span>{{ category.name }}</span>
            </template>
            <el-menu-item-group>
              <template v-for="child in category.children">
                <el-menu-item :key="child.id" :index="child.id" @click="getGoodsPlan(child.id)">{{ child.name }}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-main>
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline-message="true">
        <div class="grid-content bg-purple">
          <el-tabs type="border-card">
            <el-tab-pane label="投保信息">
              <table border="1" cellspacing="0" width="100%">
                <tr height="40px">
                  <td width="110px"><span style="padding: 5px;color: red;"><b>*</b></span>保险公司</td>
                  <td colspan="3">
                    <el-radio-group v-model="partner" @change="changePartner">
                      <template v-for="p in partners">
                        <el-radio-button :key="p" :label="p">{{ p }}</el-radio-button>
                      </template>
                    </el-radio-group>
                  </td>
                </tr>
                <tr height="40px">
                  <td><span style="padding: 5px;color: red;"><b>*</b></span>产品选择</td>
                  <td colspan="6">
                    <el-select v-model="temp.productPlanId" placeholder="请选择产品" style="width: 300px;" class="filter-item" @change="changeProductPlan">
                      <el-option
                        v-for="item in productPlans"
                        :key="item.productPlanId"
                        :label="'[' + item.productName+ ']-' + item.productPlanName + '-' + item.primaryCoverage"
                        :value="item.productPlanId"
                      />
                    </el-select>
                  </td>
                </tr>
                <tr height="40px">
                  <td><span style="padding: 5px;color: red;"><b>*</b></span>保障区间</td>
                  <td>
                    <el-form-item prop="dateScope" style="margin-bottom: 0;">
                      <el-date-picker
                        v-model="temp.dateScope"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        range-separator="至"
                        :default-time="['00:00:00', '23:59:59']"
                        :picker-options="expireTimeOption"
                        @change="setDateScope"
                      />
                    </el-form-item>
                  </td>
                  <td><span style="padding: 5px;color: red;"><b>*</b></span>保险期限</td>
                  <td><span style="padding-left: 10px"><b>{{ temp.days }}</b> 天</span></td>
                </tr>
                <tr height="40px">
                  <td><span style="padding-left: 17px">旅行目的地</span></td>
                  <td>
                    <el-input v-model="temp.address" placeholder="请输入内容" />
                  </td>
                  <td><span style="padding-left: 17px">团号/备注</span></td>
                  <td>
                    <el-input v-model="temp.remark" placeholder="请输入内容" />
                  </td>
                </tr>
                <tr>
                  <td><span style="padding-left: 17px">投保提示</span></td>
                  <td colspan="3">
                    1.投保范围：被保险人为0天至85周岁、身体健康、能正常工作或正常生活的自然人，若多份保单保险期间重叠，我司对的总赔偿额度以其中一份保单保额最高的保额为限。<br>
                    2.本保险产品计划承保自由行、自驾、高原地区和高风险运动。<br>
                    3.承包地域不包括战争恐怖地区。具体除外承包地域以http://baoxian.pingan.com/dangerous_zone/war.shtml所列国家为准。<br>
                    <span style="color: red;">4.务必下载右上方详细条款交于客户，并仔细阅读保单上的保障内容、特别约定及责任免除条款。</span><br>
                    5.支持当天投保，投保2小时后生效。<br>
                  </td>
                </tr>
              </table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <br>
        <div v-if="showInsured" class="grid-content bg-purple">
          <el-tabs type="border-card">
            <el-tab-pane label="被保人列表">
              <div class="filter-container">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-upload">
                  上传被保人
                </el-button>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit-outline" @click="dialogSmartPasteFormVisible = true">
                  智能粘贴
                </el-button>
              </div>
              <el-table
                :data="temp.insuredList"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column type="index" label="序" align="center" />
                <el-table-column label="姓名" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="性别" width="70px" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.gender }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="证件类型" width="80px" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.certiType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="证件号码" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.certiNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="出生日期" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.dateOfBirth }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="手机号" width="110px" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.mobile }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="原价" width="75px" align="center">
                  <template slot-scope="{row}">
                    <span>￥{{ row.premium }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="结算价" width="75px" align="center">
                  <template slot-scope="{row}">
                    <span>￥{{ row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="90px" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button type="danger" style="margin-left: 5px;" @click.native.prevent="deleteRow(scope.$index, temp.insuredList)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <br>
        <div class="grid-content bg-purple">
          <el-tabs type="border-card">
            <el-tab-pane label="投保人">
              <table border="1" cellspacing="0" width="100%">
                <tr height="40px">
                  <td><span style="padding: 5px;color: red;"><b>*</b></span>公司名称</td>
                  <td>
                    <el-form-item prop="policyHolderName" style="margin-bottom: 0;">
                      <el-input v-model="temp.policyHolderName" style="width: 75%" placeholder="请输入投保公司名称" />
                    </el-form-item>
                  </td>
                  <td><span style="padding: 5px;color: red;"><b>*</b></span>证件号码</td>
                  <td>
                    <el-form-item prop="policyHolderCerti" style="margin-bottom: 0;">
                      <el-input v-model="temp.policyHolderCerti" style="width: 75%" placeholder="请输入投保公司证件号" />
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </el-tab-pane>
          </el-tabs>
          <br>
          <table border="1" cellspacing="0" width="100%">
            <tr height="40px">
              <td><span style="padding-left: 17px">人数合计：</span></td>
              <td><span style="padding-left: 10px"><b>{{ temp.insuredList.length }}</b> 人</span></td>
              <td><span style="padding-left: 17px">原价合计：</span></td>
              <td><span style="padding-left: 17px"><b>{{ temp.totalPremium }}</b> 元</span></td>
              <td><span style="padding-left: 17px">结算合计：</span></td>
              <td><span style="padding-left: 17px"><b>{{ temp.actualPremium }}</b> 元</span></td>
            </tr>
          </table>
          <br>
          <table border="1" cellspacing="0" width="100%">
            <tr height="40px">
              <td width="200px"><span style="padding-left: 10px">选择支付方式：</span></td>
              <td>
                <template>
                  <div style="padding-left: 10px">
                    <el-radio v-model="temp.payMethod" label="MONTHLY">月结</el-radio>
                    <el-radio v-model="temp.payMethod" disabled label="WECHAT">微信</el-radio>
                  </div>
                </template>
              </td>
            </tr>
            <tr height="40px">
              <td><span style="padding-left: 10px">支付方式说明：</span></td>
              <td><span style="padding-left: 10px">默认支持月结</span></td>
            </tr>
          </table>
          <br>
          <div v-if="showInsured">
            <div style="text-align:center">
              <!-- `checked` 为 true 或 false -->
              <el-checkbox v-model="temp.checked">我已详细阅读并理解投保注意事项</el-checkbox>
            </div>
            <br>
            <div style="text-align:center">
              <el-button type="primary" @click="issuePolicy">确定投保</el-button>
              <el-button>存草稿</el-button>
            </div>
            <br>
          </div>
        </div>
        <div v-if="productPlan">
          <el-table
            :data="productPlan.goodsLiabilities"
            :span-method="spanMethod"
            style="width: 100%"
          >
            <el-table-column align="center" :label="'[' + productPlan.productName+ ']-' + productPlan.productPlanName + '-' + productPlan.primaryCoverage">
              <el-table-column
                align="center"
                prop="liabilityCategory"
                label="责任大类"
              />
              <el-table-column
                align="center"
                prop="liabilityName"
                label="保障内容"
              />
              <el-table-column
                align="center"
                prop="amount"
                label="保障金额（人民币：元）"
              />
            </el-table-column>
          </el-table>
          <el-table
            :data="productPlan.goodsRateTable"
            style="width: 100%"
          >
            <el-table-column align="center" label="保障金额/人 （人民币：元）">
              <el-table-column
                align="center"
                prop="remark"
                label="旅行天数"
              />
              <el-table-column
                align="center"
                prop="premium"
                label="价格"
              />
            </el-table-column>
          </el-table>
          <br>
          <div v-html="productPlan.productExternal" />
        </div>
      </el-form>
    </el-main>

    <el-dialog title="智能粘贴" :visible.sync="dialogSmartPasteFormVisible">
      <el-form ref="smartPasteForm" label-position="right" label-width="100px" style="width: 500px; margin-left:80px;">
        <el-input v-model="smartPasteText" autosize type="textarea" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSmartPasteFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="smartPaste()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { fetchGoodsCategories, fetchGoods, issuePolicy } from '@/api/insure'
import waves from '@/directive/waves'

export default {
  name: 'PolicyIndex',
  directives: { waves },
  data() {
    return {
      isCollapse: false,
      text: '',
      showInsured: false,
      dialogSmartPasteFormVisible: false,
      smartPasteText: undefined,
      temp: {
        productPlanId: undefined,
        dateScope: [],
        days: 0,
        address: undefined,
        remark: undefined,
        insuredList: [],
        policyHolderName: undefined,
        policyHolderCerti: undefined,
        comsRatio: 0.0,
        unitPremium: 0.00,
        totalPremium: 0.00,
        actualPremium: 0.00,
        payMethod: 'MONTHLY',
        checked: false
      },
      listQuery: {
        EQ_productCategory_id: undefined
      },
      list: [],
      categories: [],
      productPlan: undefined,
      productPlans: [],
      partner: undefined,
      partners: [],
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      rules: {
        dateScope: [{ required: true, message: '请选择保障区间', trigger: 'change' }],
        policyHolderName: [{ required: true, message: '请输入投保人名称', trigger: 'change' }],
        policyHolderCerti: [{ required: true, message: '请选择投保人证件号', trigger: 'change' }]
      }
    }
  },
  computed: {
    groupNum() {
      return new Set(this.productPlan.goodsLiabilities.map(o => o.liabilityCategory))
    }
  },
  created() {
    this.getGoodsCategories()
  },
  methods: {
    getGoodsCategories() {
      fetchGoodsCategories().then(response => {
        this.categories = response.data
      })
    },
    getGoodsPlan(categoryId) {
      this.showInsured = true
      this.listQuery.EQ_productCategory_id = categoryId
      fetchGoods(this.listQuery).then(response => {
        this.list = response.data
        this.partners = Array.from(new Set(this.list.map((v, i) => {
          return v.partnerName
        })))
        this.partner = this.partners[0]
        this.changePartner()
      })
    },
    changeProductPlan() {
      const productPlanId = this.temp.productPlanId
      this.productPlan = this.productPlans.filter(function(v) {
        return v.productPlanId === productPlanId
      })[0]
      this.temp.comsRatio = this.productPlan.comsRatio
      console.log('佣金比例: ' + this.temp.comsRatio + '%')
    },
    changePartner() {
      const currentPartner = this.partner
      this.productPlans = this.list.filter(function(v) {
        return v.partnerName === currentPartner
      })
      this.temp.productPlanId = this.productPlans[0].productPlanId
      this.changeProductPlan()
    },
    setDateScope() {
      this.temp.days = Math.ceil((this.temp.dateScope[1] - this.temp.dateScope[0]) / 86400000)
      this.getUnitPremium()
      const unitPremium = this.temp.unitPremium
      const ratio = (100 - this.temp.comsRatio) / 100
      this.temp.insuredList.forEach(function(item, index) {
        item.premium = unitPremium.toFixed(2)
        item.price = (unitPremium * ratio).toFixed(2)
      })
    },
    getUnitPremium() {
      let unitPremium = 0
      const days = this.temp.days
      if (this.productPlan !== undefined && this.productPlan.goodsRateTable !== undefined) {
        this.productPlan.goodsRateTable.forEach(function(item, index) {
          if (days >= item.dayStart && days <= item.dayEnd) {
            unitPremium = item.premium
          }
        })
      }
      this.temp.unitPremium = unitPremium
      this.temp.totalPremium = (this.temp.insuredList.length * unitPremium).toFixed(2)
      this.temp.actualPremium = (this.temp.totalPremium * ((100 - this.temp.comsRatio) / 100)).toFixed(2)
    },
    issuePolicy() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.insuredList.length === 0) {
            this.$notify.error({
              title: '错误',
              message: '请至少录入一个被保人信息'
            })
            return
          }
          if (this.temp.checked === false) {
            this.$notify.error({
              title: '错误',
              message: '请先阅读投保须知并勾选确认'
            })
            return
          }
          issuePolicy(this.temp).then(response => {
            console.log(response)
          })
        }
      })
    },
    classGroup(category) {
      return this.productPlan.goodsLiabilities.filter(o => o.liabilityCategory === category).length
    },
    classNameLen(name) {
      const tmp = Array.from(this.groupNum)
      const index = tmp.indexOf(name)
      let len = 0
      for (let i = 0; i < index; i++) {
        len += this.classGroup(tmp[i])
      }
      return len
    },
    spanMethod(data) {
      const { row, rowIndex, columnIndex } = data
      if (columnIndex < 1) {
        const len = this.classGroup(row.liabilityCategory)
        const lenName = this.classNameLen(row.liabilityCategory)
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    smartPaste() {
      this.dialogSmartPasteFormVisible = false
      const unitPremium = this.temp.unitPremium
      const ratio = (100 - this.temp.comsRatio) / 100
      this.smartPasteText.split(/[\n]/).forEach(v => {
        const insured = {
          name: '',
          gender: '未知',
          certiType: '身份证',
          certiNo: '',
          dateOfBirth: '',
          mobile: ''
        }
        v.split(/[\s]/).forEach(s => {
          if (this.isCertiType(s)) {
            insured.certiType = s
          } else if (this.isGender(s)) {
            insured.gender = this.formatGender(s)
          } else if (this.isPhoneNumber(s)) {
            insured.mobile = s
          } else if (this.isCertiNo(s)) {
            insured.certiNo = s
            if (s.length === 15) {
              insured.certiType = '身份证'
              if (parseInt(s.charAt(14)) % 2 === 0) {
                insured.gender = '女'
              } else {
                insured.gender = '男'
              }
              if (parseInt(s.charAt(6) + s.charAt(7)) < 10) {
                insured.dateOfBirth = '20' + s.substring(6, 8) + '-' + s.substr(8, 10) + '-' + s.substr(10, 12)
              } else {
                insured.dateOfBirth = '19' + s.substring(6, 8) + '-' + s.substr(8, 10) + '-' + s.substr(10, 12)
              }
            } else if (s.length === 18) {
              insured.certiType = '身份证'
              if (parseInt(s.charAt(16)) % 2 === 0) {
                insured.gender = '女'
              } else {
                insured.gender = '男'
              }
              insured.dateOfBirth = s.substring(6, 10) + '-' + s.substring(10, 12) + '-' + s.substring(12, 14)
            }
          } else if (this.isDateOfBirth(s)) {
            insured.dateOfBirth = s
          } else {
            insured.name = s
          }
        })
        insured.premium = unitPremium.toFixed(2)
        insured.price = (unitPremium * ((100 - ratio) / 100)).toFixed(2)
        this.temp.insuredList.push(insured)
        this.getUnitPremium()
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
      this.getUnitPremium()
    },
    isDateOfBirth(str) {
      return false
    },
    isPhoneNumber(str) {
      const exp = /^[1][3,4,5,7,8,9][0-9]{9}$/
      return exp.test(str)
    },
    isCertiNo(str) {
      for (const c of str) {
        if (c > '0' && c < '9') {
          return true
        }
      }
      return false
    },
    isCertiType(str) {
      return str === '身份证' || str === '护照'
    },
    isGender(str) {
      return str === '男' || str === '女' || str === 'M' || str === 'F' || str === 'm' || str === 'f'
    },
    formatGender(str) {
      if (str === '男' || str === '男' || str === '男') {
        return '男'
      } else {
        return '女'
      }
    }
  }
}
</script>
