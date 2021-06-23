<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="225px" style="background-color: rgb(238, 241, 246);padding-left: 12px;padding-right: 12px;">
      <el-menu class="el-menu-vertical-demo" :collapse="false" :default-openeds="defaultMenu">
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
    <div ref="imageTofile">
      <el-main v-if="productPlan">
        <el-form ref="dataForm" :rules="rules" :model="temp" :inline-message="true">
          <el-divider content-position="left">投保信息</el-divider>
          <table border="1" cellspacing="0" width="100%">
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
                      v-for="item in dateSelectionOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </td>
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span>起保时间</span></td>
              <td>
                <el-date-picker
                  v-model="temp.startTime"
                  size="mini"
                  value-format="timestamp"
                  type="datetime"
                  placeholder="请选择起保时间"
                  default-time="00:00:00"
                  :clearable="false"
                  :editable="false"
                  :picker-options="pickerStartOptions"
                  @change="setEndTime"
                />
              </td>
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span>终止时间</span></td>
              <td>
                <el-date-picker
                  v-model="temp.endTime"
                  size="mini"
                  value-format="timestamp"
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
            <!--            <tr>-->
            <!--              <td><span style="padding-left: 17px">投保提示</span></td>-->
            <!--              <td colspan="5">-->
            <!--                <span>1.投保范围：被保险人为0天至85周岁、身体健康、能正常工作或正常生活的自然人，若多份保单保险期间重叠，我司对的总赔偿额度以其中一份保单保额最高的保额为限。</span><br>-->
            <!--                <span>2.本保险产品计划承保自由行、自驾、高原地区和高风险运动。</span><br>-->
            <!--                <span>3.承包地域不包括战争恐怖地区。具体除外承包地域以<a class="link-type" href="http://baoxian.pingan.com/dangerous_zone/war.shtml">http://baoxian.pingan.com/dangerous_zone/war.shtml</a>所列国家为准。</span><br>-->
            <!--                <span style="color: red;">4.务必下载右上方详细条款交于客户，并仔细阅读保单上的保障内容、特别约定及责任免除条款。</span><br>-->
            <!--                <span>5.支持当天投保，投保2小时后生效。</span><br>-->
            <!--              </td>-->
            <!--            </tr>-->
          </table>
          <el-divider content-position="left">被保人列表</el-divider>
          <div class="filter-container" style="display: flex;align-items: center;">
            <el-button v-waves style="margin-left: 10px;" class="filter-item" size="mini" type="primary" icon="el-icon-download" @click="downloadTemplate">
              下载模板
            </el-button>
            <el-upload ref="upload" v-waves action="" style="margin-left: 10px;" :show-file-list="false" :limit="1" :auto-upload="false" :on-change="handleChange">
              <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-upload">
                上传被保人
              </el-button>
            </el-upload>
            <el-button v-waves style="margin-left: 10px;" class="filter-item" size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="addNewInsured">
              添加被保人
            </el-button>
            <el-button v-waves class="filter-item" size="mini" type="success" icon="el-icon-edit-outline" @click="dialogSmartPasteFormVisible = true">
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
            <el-table-column label="姓名" align="center" width="100px" style="font-size: 12px">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.name" class="edit-input" size="mini" />
                </template>
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别" width="95px" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-select v-model="row.gender" class="edit-input" size="mini">
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <span v-else>{{ row.gender }}</span>
              </template>
            </el-table-column>
            <el-table-column label="证件类型" width="110px" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-select v-model="row.certiType" class="edit-input" size="mini">
                    <el-option
                      v-for="item in certiTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <span v-else>{{ row.certiType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="证件号码" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.certiNo" class="edit-input" size="mini" @change="parseSFZ(row.certiNo, row)" />
                </template>
                <span v-else>{{ row.certiNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="出生日期" width="155px" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-date-picker v-model="row.dateOfBirth" size="mini" style="width: 130px" type="date" placeholder="选择生日" />
                </template>
                <span v-else>{{ row.dateOfBirth | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号" width="125px" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.mobile" class="edit-input" size="mini" />
                </template>
                <span v-else>{{ row.mobile }}</span>
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
            <el-table-column label="操作" align="left" width="140px" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button v-if="row.edit" type="success" size="mini" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">确认</el-button>
                <el-button v-else type="primary" size="mini" icon="el-icon-edit" @click="row.edit=!row.edit">编辑</el-button>
                <el-button type="danger" size="mini" style="margin-left: 5px;" @click.native.prevent="deleteRow(row,$index)">删除</el-button>
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
              <el-checkbox v-model="temp.checked" disabled>我已详细阅读并理解</el-checkbox>
              <el-button type="text" @click="centerDialogVisible = true">投保注意事项</el-button> |
              <el-link icon="el-icon-document" :href="productPlan.clauseUrl" target="_blank">保险条款</el-link>
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
      <el-main v-else style="color: #333; text-align: center; line-height: 200px;">请先选择产品</el-main>

      <el-dialog title="请将名单复制到下面的文本框中" :visible.sync="dialogSmartPasteFormVisible">
        <div>
          <el-button size="mini" @click="smartPasteText = ''">清空已有名单</el-button>
          <el-popover placement="right" style="padding-left: 5px" trigger="click">
            <div>
              <span><b>规则：</b>一个被保人一行, 如：</span><br>
              <span>张强 男 420683199506240355</span><br>
              <span>刘红 女 E23672888 1980-01-10</span><br>
              <span>大海.阳光 女 E23672666 1980-08-08</span><br>
              <span><b>身份证：</b>只需要姓名和证件号即可，网站可以自动识别证件号中的出生日期及性别，如果不能识别，证件类型将设置为其他</span><br>
              <span><b>护照：</b>目前识别大多数国家的护照，如果出现部分国家无法识别，证件类型将设置为其他</span><br>
              <span><b>出生日期：</b>目前可识别格式有: 1980-7-25，1980/7/25，1980年7月25，19800725，25/JUL/1980，25-JUL-1980，25/7/1980，25/JUL/80，25-JUL-80，25/7/80</span><br>
            </div>
            <el-button slot="reference" size="mini" type="warning">有问题，点我!</el-button>
          </el-popover>
          <el-select v-model="specialDateFormat" style="float: right;" size="mini">
            <el-option key="1" label="选择特殊日期格式" value="yyyy-mm-dd" />
            <el-option key="2" label="月日年[01-31-1980]" value="mm-dd-yyyy" />
            <el-option key="3" label="日月年[31-01-1980]" value="dd-mm-yyyy" />
            <el-option key="4" label="日月年[31-JAN-80]" value="dd-MM-yy" />
          </el-select>
        </div>
        <div style="padding-top: 10px">
          <el-input v-model="smartPasteText" :rows="10" type="textarea" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSmartPasteFormVisible = false">
            关闭
          </el-button>
          <el-button type="primary" @click="smartPaste()">
            识别名单
          </el-button>
        </div>
      </el-dialog>

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
          <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="setImage('投保须知');centerDialogVisible = false;temp.checked = true">我已阅读并确认</el-button>
        </span>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import { fetchGoodsCategories, fetchGoods, getBizNo, issuePolicy } from '@/api/insure'
import { put, signatureUrl, getFileNameUUID } from '@/utils/oss'
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
import jschardet from 'jschardet'
import html2canvas from 'html2canvas'

export default {
  name: 'PolicyIndex',
  directives: { waves },
  data() {
    return {
      uuid: getFileNameUUID(),
      uploading: undefined,
      text: '',
      dialogSmartPasteFormVisible: false,
      centerDialogVisible: false,
      smartPasteText: undefined,
      specialDateFormat: 'yyyy-mm-dd',
      rowStyle: {
        height: 12
      },
      defaultMenu: [],
      dateSelectionOption: [],
      temp: {
        orderId: undefined,
        productPlanId: undefined,
        orderNo: undefined,
        khsUrl: [],
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
      fileList: [],
      categories: [],
      productPlan: undefined,
      productPlans: [],
      partner: undefined,
      partners: [],
      genderOptions: [
        { label: '男', value: '男' },
        { label: '女', value: '女' },
        { label: '其他', value: '其他' }
      ],
      certiTypeOptions: [
        { label: '身份证', value: '身份证' },
        { label: '护照', value: '护照' },
        { label: '其他', value: '其他' }
      ],
      pickerStartOptions: {
        disabledDate: (date) => {
          return this.limitStartTime(date)
        }
      },
      pickerEndOptions: {
        disabledDate: (date) => {
          return this.limitEndTime(date)
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
    this.getBizNo()
    this.setImage('定时截图')
  },
  methods: {
    setImage(step) {
      const date = new Date()
      html2canvas(this.$refs.imageTofile, {
        background: '#FFFFFF',
        useCORS: true
      }).then((canvas) => {
        const objName = this.uuid + '_' + step + '.jpeg'
        const dateStr = parseTime(date, '{y}-{m}-{d}')
        canvas.toBlob((blobObj) => {
          put(`${dateStr}/${objName}`, blobObj).then(_ => {
            signatureUrl(`${dateStr}/${objName}`).then(res => {
              const data = {
                'type': step,
                'time': date,
                'url': res
              }
              this.temp.khsUrl.push(data)
            })
          })
        }, 'image/jpeg')
      })
      return true
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
      this.temp.endTime = new Date(new Date(new Date(new Date().setDate(startTime.getDate() + this.temp.days)).toLocaleDateString()).getTime() - 1000)
      this.updatePremiumInTable()
    },
    limitStartTime(date) {
      const oneDay = 1000 * 60 * 60 * 24
      return date.getTime() < Date.now() + oneDay * (this.productPlan.waitingDays - 1)
    },
    limitEndTime(date) {
      const oneDay = 1000 * 60 * 60 * 24
      const days = this.productPlan.goodsRateTable[this.productPlan.goodsRateTable.length - 1].dayEnd
      const limitStartTime = new Date(this.temp.startTime.getTime() + (oneDay))
      const limitEndTime = new Date(this.temp.startTime.getTime() + (oneDay * days))
      return date.getTime() < limitStartTime || date.getTime() > limitEndTime
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
      this.updatePremiumInTable()
    },
    getBizNo() {
      if (this.temp.orderNo === undefined) {
        getBizNo().then(response => {
          this.temp.orderNo = response.data
        })
      }
    },
    getGoodsCategories() {
      fetchGoodsCategories().then(response => {
        this.categories = response.data
        if (this.categories.length > 0) {
          const openMenu = []
          this.categories.forEach(function(item, index) {
            openMenu.push(item.id)
          })
          this.defaultMenu = openMenu
          this.getGoodsPlan(this.categories[0].children[0].id)
        }
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
    changePartner() {
      const currentPartner = this.partner
      this.productPlans = this.list.filter(function(v) {
        return v.partnerName === currentPartner
      })
      this.temp.productPlanId = this.productPlans[0].productPlanId
      this.changeProductPlan()
    },
    changeProductPlan() {
      const productPlanId = this.temp.productPlanId
      this.productPlan = this.productPlans.filter(function(v) {
        return v.productPlanId === productPlanId
      })[0]
      this.temp.comsRatio = this.productPlan.comsRatio
      this.setStartAndEndTime(this.productPlan.waitingDays)
      this.updatePremiumInTable()
      this.updateDateSelectionOption()
    },
    updateDateSelectionOption() {
      let max = 1
      let min = 99999
      this.productPlan.goodsRateTable.forEach(function(item, index) {
        if (item.dayStart < min) {
          min = item.dayStart
        }
        if (item.dayEnd > max) {
          max = item.dayEnd
        }
      })
      for (let i = min; i <= max; i++) {
        const option = { label: i + '天', value: i }
        this.dateSelectionOption.push(option)
      }
    },
    updatePremiumInTable() {
      this.updateUnitPremium()
      const unitPremium = this.temp.unitPremium
      const ratio = (100 - this.temp.comsRatio) / 100
      this.temp.insuredList.forEach(function(item, index) {
        item.premium = unitPremium.toFixed(2)
        item.price = (unitPremium * ratio).toFixed(2)
      })
    },
    updateUnitPremium() {
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
          // 创建确认投保截图
          this.setImage('投保确认').then(response => {
            if (response) {
              issuePolicy(this.temp).then(response => {
                this.uploading.close()
                this.$router.push({ name: 'Policy', params: { policyNo: response.data.policyNo }})
              })
            }
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
    addNewInsured() {
      const unitPremium = this.temp.unitPremium
      const ratio = (100 - this.temp.comsRatio) / 100
      const insured = {
        name: '',
        gender: '其他',
        certiType: '其他',
        certiNo: '',
        dateOfBirth: '',
        mobile: '',
        edit: true
      }
      insured.premium = unitPremium.toFixed(2)
      insured.price = (unitPremium * ratio).toFixed(2)
      this.temp.insuredList.push(insured)
    },
    smartPaste() {
      this.dialogSmartPasteFormVisible = false
      const unitPremium = this.temp.unitPremium
      const ratio = (100 - this.temp.comsRatio) / 100
      this.smartPasteText.split(/[\n]/).forEach(v => {
        if (v !== undefined && v !== '') {
          const insured = {
            name: '',
            gender: '其他',
            certiType: '其他',
            certiNo: '',
            dateOfBirth: '',
            mobile: '',
            edit: false
          }
          v.split(/[\s]/).forEach(s => {
            if (s !== undefined && s !== '') {
              if (this.isCertiType(s)) {
                insured.certiType = s
              } else if (this.isGender(s)) {
                insured.gender = this.formatGender(s)
              } else if (this.isDateOfBirth(s)) {
                insured.dateOfBirth = s
              } else if (this.isPhoneNumber(s)) {
                insured.mobile = s
              } else if (this.isCertiNo(s)) {
                insured.certiNo = s
                this.parseSFZ(s, insured)
              } else {
                insured.name = s
              }
            }
          })
          insured.premium = unitPremium.toFixed(2)
          insured.price = (unitPremium * ratio).toFixed(2)
          this.temp.insuredList.push(insured)
        }
      })
      this.updateUnitPremium()
    },
    deleteRow(row, index) {
      this.temp.insuredList.splice(index, 1)
      this.updateUnitPremium()
    },
    confirmEdit(row) {
      row.edit = false
      this.$message({
        message: '更新成功',
        type: 'success'
      })
    },
    isDateOfBirth(str) {
      return str.indexOf('-') !== -1 || str.indexOf('/') !== -1 || str.indexOf('年') !== -1
    },
    isPhoneNumber(str) {
      const exp = /^[1][3,4,5,7,8,9][0-9]{9}$/
      return exp.test(str)
    },
    isCertiNo(str) {
      if (str.length > 6) {
        for (const c of str) {
          if (c > '0' && c < '9') {
            return true
          }
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
    parseSFZ(s, insured) {
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
    },
    formatGender(str) {
      if (str === '男' || str === 'M' || str === 'm') {
        return '男'
      } else {
        return '女'
      }
    },
    downloadTemplate() {
      const data = '姓名,性别,证件类型,证件号码,生日,手机'
      const filename = 'template.csv'
      const type = ''
      const file = new Blob(['\ufeff' + data], { type: type })
      if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename)
      } else {
        const a = document.createElement('a')
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function() {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 0)
      }
    },
    handleChange(file, fileList) {
      const fReader = new FileReader()
      fReader.readAsDataURL(file.raw)
      fReader.onload = evt => {
        const encoding = this.checkEncoding(evt.target.result)
        // 将csv转换成二维数组
        this.$papa.parse(file.raw, {
          encoding,
          complete: res => {
            const data = res.data
            if (data[data.length - 1] === '') {
              data.pop()
            }
            const unitPremium = this.temp.unitPremium
            const ratio = (100 - this.temp.comsRatio) / 100
            for (let num = 1; num < data.length; num++) {
              const insured = {
                name: data[num][0],
                gender: data[num][1],
                certiType: data[num][2],
                certiNo: data[num][3],
                dateOfBirth: data[num][4],
                mobile: data[num][5],
                edit: false
              }
              this.parseSFZ(data[num][3], insured)
              insured.premium = unitPremium.toFixed(2)
              insured.price = (unitPremium * ratio).toFixed(2)
              this.temp.insuredList.push(insured)
            }
          }
        })
      }
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
