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
        <el-divider content-position="left">投保信息</el-divider>
        <table v-if="productPlan" border="1" cellspacing="0" width="100%">
          <tr>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>保险公司</span></td>
            <td colspan="5">
              <el-radio-group v-model="partner" size="mini" @change="changePartner">
                <template v-for="p in partners">
                  <el-radio-button :key="p" :label="p">{{ p }}</el-radio-button>
                </template>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>产品选择</span></td>
            <td colspan="5">
              <el-select v-model="temp.productPlanId" size="mini" placeholder="请选择产品" style="width: 300px;" class="filter-item" @change="changeProductPlan">
                <el-option
                  v-for="item in productPlans"
                  :key="item.productPlanId"
                  :label="'[' + item.productName+ ']-' + item.productPlanName + '-' + item.primaryCoverage"
                  :value="item.productPlanId"
                />
              </el-select>
            </td>
          </tr>
          <tr>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>保险期限</span></td>
            <td>
              <el-form-item prop="days" size="mini" style="margin-bottom: 0;">
                <el-select v-model="temp.days" size="mini" placeholder="请选择保障天数" @change="setEndTime">
                  <el-option
                    v-for="item in productPlan.goodsRateTable"
                    :key="item.dayEnd"
                    :label="item.remark"
                    :value="item.dayEnd"
                  />
                </el-select>
              </el-form-item>
            </td>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>起保时间</span></td>
            <td>
              <el-date-picker
                v-model="temp.startTime"
                size="mini"
                type="datetime"
                placeholder="请选择起保时间"
                default-time="00:00:00"
                :clearable="false"
                :editable="false"
                :picker-options="pickerStartOptions"
                @change="changeStartTime"
              />
            </td>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>终止时间</span></td>
            <td>
              <el-date-picker
                v-model="temp.endTime"
                size="mini"
                type="datetime"
                placeholder="请选择终止时间"
                default-time="23:59:59"
                :editable="false"
                :picker-options="pickerEndOptions"
                @change="changeEndTime"
              />
            </td>
          </tr>
          <tr>
            <td><span style="padding-left: 17px">旅行目的地</span></td>
            <td colspan="2">
              <el-input v-model="temp.address" size="mini" placeholder="请输入内容" />
            </td>
            <td><span style="padding-left: 17px">团号/备注</span></td>
            <td colspan="2">
              <el-input v-model="temp.remark" size="mini" placeholder="请输入内容" />
            </td>
          </tr>
          <tr>
            <td><span style="padding-left: 17px">投保提示</span></td>
            <td colspan="5">
              <span>1.投保范围：被保险人为0天至85周岁、身体健康、能正常工作或正常生活的自然人，若多份保单保险期间重叠，我司对的总赔偿额度以其中一份保单保额最高的保额为限。</span><br>
              <span>2.本保险产品计划承保自由行、自驾、高原地区和高风险运动。</span><br>
              <span>3.承包地域不包括战争恐怖地区。具体除外承包地域以<a class="link-type" href="http://baoxian.pingan.com/dangerous_zone/war.shtml">http://baoxian.pingan.com/dangerous_zone/war.shtml</a>所列国家为准。</span><br>
              <span style="color: red;">4.务必下载右上方详细条款交于客户，并仔细阅读保单上的保障内容、特别约定及责任免除条款。</span><br>
              <span>5.支持当天投保，投保2小时后生效。</span><br>
            </td>
          </tr>
        </table>
        <div v-if="productPlan === undefined"><span style="padding-left: 50px;font-size: 18px">请先选择产品</span><br></div>
        <el-divider content-position="left">被保人列表</el-divider>
        <div class="filter-container" style="padding-bottom: 0px;height: 35px;">
          <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-upload">
            上传被保人
          </el-button>
          <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-edit-outline" @click="dialogSmartPasteFormVisible = true">
            智能粘贴
          </el-button>
        </div>
        <el-table
          :data="temp.insuredList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :header-row-style="rowStyle"
          :row-style="rowStyle"
        >
          <el-table-column type="index" label="序" align="center" />
          <el-table-column label="姓名" align="center" style="font-size: 12px">
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
              <el-button type="danger" size="mini" style="margin-left: 5px;" @click.native.prevent="deleteRow(scope.$index, temp.insuredList)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">投保人信息</el-divider>
        <table border="1" cellspacing="0" width="100%">
          <tr>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>公司名称</span></td>
            <td>
              <el-form-item prop="policyHolderName" size="mini" style="margin-bottom: 0;">
                <el-input v-model="temp.policyHolderName" size="mini" style="width: 75%" placeholder="请输入投保公司名称" />
              </el-form-item>
            </td>
            <td><span style="padding: 5px;color: red;"><b>*</b></span><span>证件号码</span></td>
            <td>
              <el-form-item prop="policyHolderCerti" size="mini" style="margin-bottom: 0;">
                <el-input v-model="temp.policyHolderCerti" size="mini" style="width: 75%" placeholder="请输入投保公司证件号" />
              </el-form-item>
            </td>
          </tr>
        </table>
        <br>
        <table border="1" cellspacing="0" width="100%">
          <tr>
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
          <tr>
            <td width="200px"><span style="padding-left: 10px">选择支付方式：</span></td>
            <td>
              <template>
                <div style="padding-left: 10px">
                  <el-radio-group v-model="temp.payMethod" size="mini">
                    <el-radio label="MONTHLY"><span>月结</span></el-radio>
                    <el-radio disabled label="WECHAT"><span>微信</span></el-radio>
                  </el-radio-group>
                </div>
              </template>
            </td>
          </tr>
          <tr>
            <td><span style="padding-left: 10px">支付方式说明：</span></td>
            <td><span style="padding-left: 10px">默认支持月结</span></td>
          </tr>
        </table>
        <br>
        <div v-if="productPlan">
          <div style="text-align:center">
            <!-- `checked` 为 true 或 false -->
            <el-checkbox v-model="temp.checked">我已详细阅读并理解投保注意事项</el-checkbox>
          </div>
          <br>
          <div style="text-align:center">
            <el-button type="primary" size="mini" @click="issuePolicy">确定投保</el-button>
            <el-button size="mini">存草稿</el-button>
          </div>
        </div>
        <br>
        <div v-if="productPlan">
          <el-table
            :data="productPlan.goodsLiabilities"
            :span-method="spanMethod"
            style="width: 100%;font-size: 12px"
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
            style="width: 100%;font-size: 12px"
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
      uploading: undefined,
      isCollapse: false,
      text: '',
      dialogSmartPasteFormVisible: false,
      smartPasteText: undefined,
      rowStyle: {
        height: 12
      },
      temp: {
        productPlanId: undefined,
        days: 1,
        startTime: undefined,
        endTime: undefined,
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
      pickerStartOptions: {
        disabledDate(date) {
          const oneDay = 24 * 60 * 60 * 1000
          return date.getTime() < Date.now() - oneDay
        }
      },
      pickerEndOptions: {
        disabledDate: (date) => {
          return this.beforeStartTime(date)
        }
      },
      rules: {
        days: [{ required: true, message: '请选择保障期限', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择起保时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择终止时间', trigger: 'change' }],
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
    this.setStartAndEndTime(1)
  },
  methods: {
    beforeStartTime(date) {
      const oneDay = 1000 * 60 * 60 * 24
      const days = this.productPlan.goodsRateTable[this.productPlan.goodsRateTable.length - 1].dayEnd
      const limitStartTime = new Date(this.temp.startTime.getTime() + (oneDay))
      const limitEndTime = new Date(this.temp.startTime.getTime() + (oneDay * days))
      return date.getTime() < limitStartTime || date.getTime() > limitEndTime
    },
    setStartAndEndTime(n) {
      if (n === 0) {
        this.temp.startTime = new Date()
        this.setEndTime()
      } else {
        this.temp.startTime = new Date(new Date(new Date(new Date().setDate(new Date().getDate() + n)).toLocaleDateString()).getTime())
        this.setEndTime()
      }
    },
    setEndTime() {
      const startTime = this.temp.startTime
      this.temp.endTime = new Date(new Date(new Date(new Date().setDate(startTime.getDate() + this.temp.days)).toLocaleDateString()).getTime())
      this.changeDateScope()
    },
    changeStartTime() {
      this.setEndTime()
    },
    changeEndTime() {
      const number = Math.ceil((this.temp.endTime - this.temp.startTime) / 86400000)
      let dayEnd = 0
      this.productPlan.goodsRateTable.forEach(function(item, index) {
        if (number >= item.dayStart && number <= item.dayEnd) {
          dayEnd = item.dayEnd
        }
      })
      this.temp.days = dayEnd
      this.changeDateScope()
    },
    getGoodsCategories() {
      fetchGoodsCategories().then(response => {
        this.categories = response.data
      })
    },
    getGoodsPlan(categoryId) {
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
      this.getUnitPremium()
    },
    changePartner() {
      const currentPartner = this.partner
      this.productPlans = this.list.filter(function(v) {
        return v.partnerName === currentPartner
      })
      this.temp.productPlanId = this.productPlans[0].productPlanId
      this.changeProductPlan()
    },
    changeDateScope() {
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
          this.uploading = this.$loading({
            lock: true,
            text: '正在出单中, 请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          issuePolicy(this.temp).then(response => {
            this.uploading.close()
            this.$router.push({ name: 'Policy', params: { policyNo: response.data.policyNo }})
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
