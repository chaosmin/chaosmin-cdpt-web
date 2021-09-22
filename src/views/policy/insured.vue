<template>
  <el-container style="border: 1px solid #eee">
    <!-- <el-aside width="225px" style="background-color: rgb(238, 241, 246);padding-left: 12px;padding-right: 12px;">
      <el-menu class="el-menu-vertical-demo" :collapse="false" :default-openeds="defaultMenu">
        <template v-for="category in categories">
          <el-submenu :key="category.id" :index="category.id">
            <template slot="title">
              <i class="el-icon-location" />
              <span>{{ category.name }}</span>
            </template>
            <el-menu-item-group>
              <template v-for="child in category.children">
                <el-menu-item :key="child.id" :index="child.id" @click="getGoodsPlan(category.id, child.id)">{{ child.name }}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside> -->

    <div ref="imageTofile">
      <el-main v-if="goodsPlan">
        <el-form ref="dataForm" :rules="rules" :model="temp" :inline-message="true" style="width: 1080px">
          <ul style="border-bottom:1px solid #ddd;list-style:none;height:30px;padding-left:0;">
            <li style="float:left;margin-bottom:-1px;">
              <span style="border-top:3px solid #1890ff;color:#5a5e66;cursor:pointer;border:1px solid #ddd;background:#fff;display:block;border-radius:4px 4px 0 0;padding:8px 15px;border-bottom-color:transparent">投保信息</span>
            </li>
            <li style="float:right;padding-bottom: 5px;">
              <el-link :href="goodsPlan.clauseUrl" target="_blank"><svg-icon icon-class="pdf" /> 详细条款下载</el-link>
            </li>
          </ul>

          <table cellspacing="0" width="100%">
            <tr style="height:25pt;">
              <td width="180px"><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">保险公司</span></td>
              <td colspan="5">
                <el-radio-group v-model="partner" size="mini" @change="changePartner">
                  <template v-for="p in partners">
                    <el-radio-button :key="p" :label="p">{{ p }}</el-radio-button>
                  </template>
                </el-radio-group>
              </td>
            </tr>
            <tr style="height:25pt;">
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">产品选择</span></td>
              <td colspan="5">
                <el-select v-model="temp.goodsPlanId" size="mini" placeholder="请选择产品" style="width: 100%" class="filter-item" @change="changeGoodsPlan">
                  <el-option
                    v-for="item in goodsPlanList"
                    :key="item.id"
                    :label="'[' + item.productName+ ']-' + item.productPlanName + '-' + item.primaryCoverage"
                    :value="item.id"
                  />
                </el-select>
              </td>
            </tr>
            <tr style="height:25pt;">
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">保险期限</span></td>
              <td>
                <el-form-item prop="days" size="mini" style="margin-bottom: 0;">
                  <el-select v-model="temp.days" size="mini" style="width: 100%" placeholder="请选择保障天数" @change="setEndTime">
                    <el-option
                      v-for="item in dateSelectionOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </td>
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">起保时间</span></td>
              <td>
                <el-date-picker
                  v-model="temp.startTime"
                  class="date_picker"
                  size="mini"
                  value-format="timestamp"
                  type="datetime"
                  style="width: 100%"
                  placeholder="请选择起保时间"
                  default-time="00:00:00"
                  :clearable="false"
                  :editable="false"
                  :picker-options="pickerStartOptions"
                  @change="setEndTime"
                />
              </td>
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">终止时间</span></td>
              <td>
                <el-date-picker
                  v-model="temp.endTime"
                  class="date_picker"
                  size="mini"
                  value-format="timestamp"
                  type="datetime"
                  style="width: 100%"
                  placeholder="请选择终止时间"
                  default-time="23:59:59"
                  :editable="false"
                  :picker-options="pickerEndOptions"
                  @change="changeEndTime"
                />
              </td>
            </tr>
            <tr style="height:25pt;">
              <td><span style="padding-left: 17px">旅行目的地</span></td>
              <td colspan="2">
                <el-input v-model="temp.address" size="mini" placeholder="请输入内容" />
              </td>
              <td><span style="padding-left: 17px">团号/备注</span></td>
              <td colspan="2">
                <el-input v-model="temp.groupNo" size="mini" placeholder="请输入内容" />
              </td>
            </tr>
            <tr style="height:25pt;">
              <td><span style="padding-left: 17px">投保提示</span></td>
              <td colspan="5">
                <div style="line-height:1.8em;font-size:13px" v-html="goodsPlan.insuranceNotice" />
              </td>
            </tr>
          </table>
          <div class="filter-container" style="display: flex;align-items: center;margin-top: 10px;margin-bottom:8px">
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
            <el-button v-waves style="margin-left: 10px;" class="filter-item" size="mini" type="warning" icon="el-icon-delete" @click="clearInsured">
              清空被保人列表
            </el-button>
            <el-button v-waves class="filter-item" size="mini" type="success" icon="el-icon-edit-outline" @click="dialogSmartPasteFormVisible = true">
              智能粘贴
            </el-button>
          </div>
          <el-table
            :key="insuredTable"
            :data="temp.insuredList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :header-row-style="rowStyle"
            :row-style="rowStyle"
            :header-cell-style="rowThStyle"
          >
            <el-table-column type="index" label="序" align="center" />
            <el-table-column label="姓名" align="center" width="100px" style="font-size: 12px">
              <template slot-scope="{row}">
                <el-input v-model="row.name" class="edit-input" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="性别" width="80px" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.gender" class="edit-input" size="mini">
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="证件类型" width="110px" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.certiType" class="edit-input" size="mini">
                  <el-option
                    v-for="item in certiTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="证件号码" align="center">
              <template slot-scope="{row}">
                <el-input v-model="row.certiNo" class="edit-input" size="mini" @blur="confirmEdit(row)" />
              </template>
            </el-table-column>
            <el-table-column label="出生日期" width="155px" align="center">
              <template slot-scope="{row}">
                <el-date-picker v-model="row.dateOfBirth" size="mini" value-format="timestamp" style="width: 100%" :clearable="false" type="date" placeholder="选择生日" />
              </template>
            </el-table-column>
            <el-table-column label="手机号" width="140px" align="center">
              <template slot-scope="{row}">
                <el-input v-model="row.mobile" class="edit-input" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="原价" width="70px" align="center">
              <template slot-scope="{row}">
                <span>￥{{ row.premium }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结算价" width="70px" align="center">
              <template slot-scope="{row}">
                <span>￥{{ row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" width="80px" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-left: 5px;" @click.native.prevent="deleteRow(row,$index)" />
              </template>
            </el-table-column>
          </el-table>
          <table cellspacing="0" width="100%" style="margin-top: 16px">
            <tr style="height:25pt;">
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">公司名称</span></td>
              <td>
                <el-form-item prop="policyHolderName" size="mini" style="margin-bottom: 0;">
                  <el-select v-model="temp.policyHolderName" filterable allow-create default-first-option value-key="id" size="mini" style="width: 100%" placeholder="请选择投保机构" @change="changeDepartment">
                    <el-option
                      v-for="item in department.letterHead"
                      :key="item.certiNo"
                      :label="item.title"
                      :value="item.title"
                    />
                  </el-select>
                </el-form-item>
              </td>
              <td><span style="padding: 5px;color: red;"><b>*</b></span><span class="fontWeight">证件号码</span></td>
              <td>
                <el-form-item prop="policyHolderCerti" size="mini" style="margin-bottom: 0;">
                  <el-input v-model="temp.policyHolderCerti" size="mini" style="width: 100%" placeholder="请输入投保公司证件号" />
                </el-form-item>
              </td>
            </tr>
          </table>
          <br>
          <table cellspacing="0" width="100%">
            <tr style="height:25pt;">
              <td><span style="padding-left: 17px">人数合计：</span></td>
              <td><span style="padding-left: 10px"><b>{{ (temp.insuredList && temp.insuredList.length) || 0 }}</b> 人</span></td>
              <td><span style="padding-left: 17px">原价合计：</span></td>
              <td><span style="padding-left: 17px"><b>{{ temp.totalPremium }}</b> 元</span></td>
              <td><span style="padding-left: 17px">结算合计：</span></td>
              <td><span style="padding-left: 17px"><b>{{ temp.actualPremium }}</b> 元</span></td>
            </tr>
          </table>
          <br>
          <table cellspacing="0" width="100%">
            <tr style="height:25pt;">
              <td width="200px"><span style="padding-left: 10px">选择支付方式：</span></td>
              <td>
                <template>
                  <div style="padding-left: 10px">
                    <el-radio-group v-model="temp.payType" size="mini">
                      <el-radio label="OFFLINE"><span>月结</span></el-radio>
                      <el-radio label="ONLINE"><span>微信</span></el-radio>
                    </el-radio-group>
                  </div>
                </template>
              </td>
            </tr>
            <tr style="height:25pt;">
              <td><span style="padding-left: 10px">支付方式说明：</span></td>
              <td><span style="padding-left: 10px">默认支持月结</span></td>
            </tr>
          </table>
          <br>
          <div v-if="goodsPlan">
            <div style="text-align:center">
              <!-- `checked` 为 true 或 false -->
              <el-checkbox v-model="checked">我已详细阅读并理解
                <el-button type="text" @click="centerDialogVisible = true"> 投保注意事项</el-button> |
                <el-button icon="el-icon-document" type="text" @click="pdfDialogVisible = true">保险条款</el-button>
              </el-checkbox>
            </div>
            <br>
            <!-- 只有出单员有权限出单 -->
            <div v-if="this.$store.getters.roles.includes('officer')" style="text-align:center">
              <el-button type="primary" size="mini" @click="issuePolicy">确定投保</el-button>
              <el-button size="mini" @click="saveToDraftBox">存草稿</el-button>
            </div>
          </div>
          <br>
          <div v-if="goodsPlan">
            <el-table :data="goodsPlan.liabilities" style="width: 100%;font-size: 12px">
              <el-table-column align="center" :label="'[' + goodsPlan.productName+ ']-' + goodsPlan.productPlanName + '-' + goodsPlan.primaryCoverage">
                <el-table-column align="center" prop="liabilityName" label="保障内容" />
                <el-table-column align="center" prop="amount" label="保障金额（人民币：元）" />
              </el-table-column>
            </el-table>
            <el-table :data="goodsPlan.rateTable" style="width: 100%;font-size: 12px">
              <el-table-column align="center" label="保障金额/人 （人民币：元）">
                <el-table-column align="center" prop="remark" label="旅行天数" />
                <el-table-column align="center" prop="premium" label="价格" />
              </el-table-column>
            </el-table>
            <br>
            <div style="font-size:14px;line-height:1.8em" v-html="goodsPlan.productExternal" />
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
          <el-button size="mini" type="primary" @click="confirmNotice">我已阅读并确认</el-button>
        </span>
      </el-dialog>

      <el-dialog title="保险条款" :visible.sync="pdfDialogVisible" width="58%" center>
        <div class="showPdf">
          <iframe :src="goodsPlan.clauseUrl" width="100%" height="550px" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="pdfDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmPdf">我已阅读并确认</el-button>
        </span>
      </el-dialog>

      <el-dialog title="请支付" :visible.sync="qrCodeVisible" width="380px" center>
        <div style="padding-bottom: 10px;">
          <span style="font-size: 15px"><b>订单号：</b>{{ paymentOrderNo }}，</span>
          <span style="font-size: 15px"><b>金额：</b>{{ paymentAmount }} <b>元</b></span>
        </div>
        <div style="padding-bottom: 10px;">
          <span style="font-size: 15px"><b>微信支付</b></span>
        </div>
        <div style="padding-bottom: 10px;">
          <img :src="payQrCode" alt="qrCode">
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import { createPayment, saveDraft, saveOrderTrace } from '@/api/orders'
import { getOneDepartment } from '@/api/departments'
import { getBizNo, issuePolicy } from '@/api/insure'
import { fetchUserCategories, fetchUserGoods } from '@/api/goods-plans'
import { getOneTrans } from '@/api/payment-trans'
import { getFileNameUUID, put, signatureUrl } from '@/utils/oss'
import { validGender, validNumber, validPhoneNumber } from '@/utils/validate'
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
import jschardet from 'jschardet'
import html2canvas from 'html2canvas'
import { mapState } from 'vuex'

export default {
  name: 'PolicyIndex',
  directives: { waves },
  props: {
    selfId: String,
    parentId: String
  },
  data() {
    return {
      uuid: getFileNameUUID(),
      uploading: undefined,
      insuredTable: undefined,
      text: '',
      payQrCode: undefined,
      qrCodeVisible: false,
      paymentOrderNo: '',
      paymentAmount: '',
      dialogSmartPasteFormVisible: false,
      centerDialogVisible: false,
      pdfDialogVisible: false,
      smartPasteText: '',
      check_1: false,
      check_2: false,
      checked: false,
      specialDateFormat: 'yyyy-mm-dd',
      rowStyle: {
        height: 12
      },
      rowThStyle: {
        color: '#444',
        background: '#f8f8f8'
      },
      defaultMenu: [],
      dateSelectionOption: [],
      temp: {
        orderId: undefined,
        orderNo: undefined,
        goodsPlanId: undefined,
        days: 1,
        startTime: undefined,
        endTime: undefined,
        address: undefined,
        groupNo: undefined,
        insuredList: [{ // 需要默认一条显示数据
          name: '',
          gender: '男',
          certiType: '身份证',
          certiNo: '',
          dateOfBirth: '',
          mobile: ''
        }],
        policyHolderName: undefined,
        policyHolderCerti: undefined,
        comsRatio: 0.0,
        unitPremium: 0.00,
        totalPremium: 0.00,
        actualPremium: 0.00,
        payType: 'MONTHLY'
      },
      listQuery: {
        O_id: 1,
        EQ_categoryName: undefined,
        EQ_categorySubName: undefined
      },
      fileList: [],
      department: {
        letterHead: []
      },
      categories: [],
      goodsPlan: {
        insuranceNotice: null,
        productExternal: null
      },
      goodsPlanList: [],
      currentGoodsPlanList: [],
      partner: undefined,
      partners: [],
      genderOptions: [
        { label: '男', value: '男' },
        { label: '女', value: '女' },
        { label: '未知', value: '未知' }
      ],
      certiTypeOptions: [
        { label: '身份证', value: '身份证' },
        { label: '护照', value: '护照' },
        { label: '军官证', value: '军官证' },
        { label: '台湾居民来往大陆通行证', value: '台湾居民来往大陆通行证' },
        { label: '大陆居民往来台湾通行证', value: '大陆居民往来台湾通行证' },
        { label: '往来港澳通行证', value: '往来港澳通行证' },
        { label: '前往港澳通行证', value: '前往港澳通行证' },
        { label: '其他', value: '未知个人证件' }
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
        policyHolderCerti: [
          { required: true, message: '请选择投保机构证件号', trigger: 'change' },
          { min: 18, max: 18, message: '投保机构证件号必须为18位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  created() {
    this.getGoodsCategories()
    this.getDepartment()
    if (this.$route.params.temp !== undefined) {
      this.temp = this.$route.params.temp
      console.log(this.temp.insuredList)
      if (this.temp.insuredList === undefined || this.temp.insuredList === null) {
        this.temp.insuredList = []
      }
      this.temp.insuredList.forEach(u => {
        const position = this.temp.insuredList.indexOf(u)
        u.dateOfBirth = Date.parse(u.dateOfBirth)
        this.$set(this.temp.insuredList, position, u)
      })
      this.temp.startTime = Date.parse(this.temp.startTime)
      this.setEndTime()
      // this.temp.endTime = Date.parse(this.temp.endTime)
    } else {
      // 左侧常开
      // this.sidebar.opened = false
      this.getBizNo()
    }
  },
  methods: {
    /**
     * 可回溯页面截图上传oss并返回下载链接
     */
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
              saveOrderTrace(this.temp.orderNo, { 'type': step, 'time': date, 'url': res.split('?')[0] })
            })
          })
        }, 'image/jpeg')
      })
    },
    setStartAndEndTime(n) {
      if (this.temp.startTime === undefined) {
        if (n === 0) {
          this.temp.startTime = new Date().getTime()
          this.setEndTime()
        } else {
          this.temp.startTime = new Date(new Date(new Date().setDate(new Date().getDate() + n)).toLocaleDateString()).getTime()
          this.setEndTime()
        }
      }
    },
    setEndTime() {
      const startTime = this.temp.startTime
      this.temp.endTime = startTime + (this.temp.days * 24 * 3600 * 1000) - 1000
      this.recalculatePremium()
    },
    limitStartTime(date) {
      const oneDay = 1000 * 60 * 60 * 24
      return date < new Date().getTime() + oneDay * (this.goodsPlan.waitingDays - 1)
    },
    limitEndTime(date) {
      const oneDay = 1000 * 60 * 60 * 24
      // 获取最大天数
      const maxDays = this.goodsPlan.rateTable[this.goodsPlan.rateTable.length - 1].dayEnd
      const limitStartTime = new Date(this.temp.startTime)
      const limitEndTime = new Date(this.temp.startTime + (oneDay * maxDays))
      return date < limitStartTime || date > limitEndTime
    },
    changeEndTime() {
      this.temp.days = Math.ceil(((this.temp.endTime + 1000) - this.temp.startTime)) / 1000 / 3600 / 24
      this.recalculatePremium()
    },
    /**
     * 生成后端唯一保单号
     */
    getBizNo() {
      if (this.$store.getters.roles.includes('officer')) {
        if (this.temp.orderNo === undefined || this.temp.orderNo === null) {
          getBizNo().then(response => {
            this.temp.orderNo = response.data
          })
        }
      }
    },
    /**
     * 获取当前用户可用的产品的分类信息
     */
    getGoodsCategories() {
      fetchUserCategories(this.$store.getters.userId).then(response => {
        this.categories = response.data
        console.log(this.categories)
        if (this.categories.length > 0) {
          const openMenu = []
          this.categories.forEach(function(item, index) {
            openMenu.push(item.id)
          })
          this.defaultMenu = openMenu
          // 默认获取第一大类下第一分类的产品列表
          this.getGoodsPlan(this.parentId, this.selfId)
          // this.getGoodsPlan(this.categories[0].id, this.categories[0].children[0].id)
        }
      })
    },
    /**
     * 获取用户的机构信息
     */
    getDepartment() {
      getOneDepartment(this.$store.getters.department).then(response => {
        this.department = response.data
        // 设置支付方式
        this.temp.payType = this.department.payType
        this.temp.policyHolderName = this.department.letterHead[0].title
        this.temp.policyHolderCerti = this.department.letterHead[0].certiNo
      })
    },
    /**
     * 根据产品大类及产品分类获取该项目下的所有保险产品
     */
    getGoodsPlan(category, subCategory) {
      this.listQuery.EQ_categoryName = category
      this.listQuery.EQ_categorySubName = subCategory
      // 先清空当前产品列表
      this.goodsPlanList = []
      fetchUserGoods(this.$store.getters.userId, this.listQuery).then(response => {
        this.goodsPlanList = response.data
        // 填充该分类下的保司列表
        this.partners = Array.from(new Set(this.goodsPlanList.map((v, i) => {
          return v.partnerName
        })))
        // 默认第一个为当前选中保司
        this.partner = this.partners[0]
        this.changePartner()
      })
    },
    /**
     * 更换保险公司
     */
    changePartner() {
      this.currentGoodsPlanList = this.goodsPlanList.filter(v => {
        return v.partnerName === this.partner
      })
      this.temp.goodsPlanId = this.currentGoodsPlanList[0].id
      this.changeGoodsPlan()
    },
    /**
     * 更换产品后更新当前页面产品信息
     */
    changeGoodsPlan() {
      // 获取当前产品
      this.goodsPlan = this.goodsPlanList.filter(v => {
        return v.id === this.temp.goodsPlanId
      })[0]
      this.temp.comsRatio = this.goodsPlan.comsRatio
      // 更换产品刷新时间内范围
      this.dateSelectionOption = []
      let max = 1
      let min = 99999
      this.goodsPlan.rateTable.forEach(function(item, index) {
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
      // 根据产品的等待期重设起止时间
      this.setStartAndEndTime(this.goodsPlan.waitingDays)
      // 每次切换产品时都记录一下进入页面时间
      // saveKhsImg(this.temp.orderNo, { 'type': '进入页面', 'time': new Date(), 'url': '' })
    },
    /**
     * 更新单位保费及结算保费
     * 更新被保人列表+保费总计栏
     */
    recalculatePremium() {
      const days = this.temp.days
      const ratio = (100 - this.temp.comsRatio) / 100
      if (this.goodsPlan !== undefined && this.goodsPlan.rateTable !== undefined) {
        this.goodsPlan.rateTable.forEach(item => {
          if (days >= item.dayStart && days <= item.dayEnd) {
            this.temp.unitPremium = item.premium
          }
        })
      }
      this.temp.totalPremium = (this.temp.insuredList.length * this.temp.unitPremium).toFixed(2)
      this.temp.actualPremium = (this.temp.totalPremium * ratio).toFixed(2)
      this.temp.insuredList.forEach(item => {
        item.premium = this.temp.unitPremium.toFixed(2)
        item.price = (this.temp.unitPremium * ratio).toFixed(2)
      })
      this.insuredTable = !this.insuredTable
    },
    /**
     * 出单逻辑
     * 出单完成后跳转至保单列表页面
     */
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
          let skip = false
          this.temp.insuredList.forEach((item, index) => {
            if (item.name === undefined || item.name === '') {
              this.$notify.error({
                title: '错误',
                message: '被保人[' + (index + 1) + ']的姓名不能为空'
              })
              skip = true
              return
            }
            if (item.gender === undefined || item.gender === '') {
              this.$notify.error({
                title: '错误',
                message: '被保人[' + (index + 1) + ']的性别不能为空'
              })
              skip = true
              return
            }
            if (item.certiType === undefined || item.certiType === '') {
              this.$notify.error({
                title: '错误',
                message: '被保人[' + (index + 1) + ']的证件类型不能为空'
              })
              skip = true
              return
            }
            if (item.certiNo === undefined || item.certiNo === '') {
              this.$notify.error({
                title: '错误',
                message: '被保人[' + (index + 1) + ']的证件号不能为空'
              })
              skip = true
              return
            }
            if (item.dateOfBirth === undefined || item.dateOfBirth === '') {
              this.$notify.error({
                title: '错误',
                message: '被保人[' + (index + 1) + ']的生日不能为空'
              })
              skip = true
            }
          })
          if (skip) {
            return
          }
          if (this.checked === false) {
            this.$notify.error({
              title: '错误',
              message: '请先阅读投保须知及保险条款并确认!'
            })
            return
          }
          this.setImage('INSU_CONFIRM')
          this.uploading = this.$loading({
            lock: true,
            text: '正在出单中, 请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          saveDraft(this.temp.orderNo, this.temp).then(_ => {
            issuePolicy(this.temp).then(response => {
              if (response.success === true) {
                console.log('出单成功, 保单号: ' + response.data.policyNo)
                if (this.temp.payType === 'ONLINE') {
                  this.$confirm('是否需要现在支付保单费用?', '支付确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    createPayment(this.temp.orderNo).then(response => {
                      const result = response.data
                      this.paymentOrderNo = result.orderNo
                      this.paymentAmount = result.amount
                      this.payQrCode = result.payUrl
                      this.qrCodeVisible = true
                      this.listenPayStatus(this.paymentOrderNo)
                    })
                  }).catch(() => {
                    this.$router.push({ name: 'Order' })
                  })
                } else {
                  this.$router.push({ name: 'Policy' })
                }
              }
            }).finally(() => {
              this.uploading.close()
            })
          })
        }
      })
    },
    /**
     * 手动添加新被保人
     */
    addNewInsured() {
      const insured = {
        name: '',
        gender: '男',
        certiType: '身份证',
        certiNo: '',
        dateOfBirth: '',
        mobile: ''
      }
      this.temp.insuredList.push(insured)
      this.recalculatePremium()
    },
    /**
     * 删除被保人
     */
    deleteRow(row, index) {
      // if(this.temp.insuredList.length)
      this.temp.insuredList.splice(index, 1)
      this.recalculatePremium()
    },
    /**
     * 清空被保人列表
     */
    clearInsured() {
      this.temp.insuredList = []
      this.recalculatePremium()
    },
    /**
     * 被保人列表确认修改
     */
    confirmEdit(row) {
      // 2021-07-04 16:30:47 15或18位的证件号尝试解析为【身份证】
      if (row.certiNo.length === 15 || row.certiNo.length === 18) {
        row.certiType = '身份证'
      }
      if (row.certiType === '身份证') {
        this.loadInfoFromCertiNo(row)
      }
    },
    /**
     * 智能粘贴确认解析处理逻辑
     */
    smartPaste() {
      this.dialogSmartPasteFormVisible = false
      // 清空被保人列表
      this.temp.insuredList = []
      if (this.smartPasteText === '') {
        return
      }
      // 解析文本
      this.smartPasteText.split(/[\n]/).forEach(v => {
        // v 为切割后的每一行
        if (v !== undefined && v !== '') {
          const insured = {
            name: '',
            gender: '未知',
            certiType: '未知个人证件',
            certiNo: '',
            dateOfBirth: '',
            mobile: ''
          }
          v.split(/[\s]/).forEach(s => {
            if (s !== undefined && s !== '') {
              // 优先判断是否包含数字, 若包含数字则初步定义为【证件号】【生日】【手机号】
              if (validNumber(s)) {
                // 包含'日'或'月'或'年'或'-', 则定义为【生日】
                if (/[/\u65e5\u6708\u5e74-]+/.test(s)) {
                  s = s.replace(/([\u6708\u5e74])/g, '-')
                  s = s.replace(/\u65e5/g, '')
                  s = s.replace(/\//g, '-')
                  insured.dateOfBirth = Date.parse(s)
                  // 11位数字且1开头, 则定义为【手机号】
                } else if (validPhoneNumber(s)) {
                  insured.mobile = s
                  // 定义为【证件号】
                } else {
                  insured.certiNo = s
                }
                // 如果不包含数字, 则初步定义为【姓名】【性别】【证件类型】
              } else {
                // 如果在证件类型列表里面, 则定义为【证件类型】
                if (this.certiTypeOptions.map((v, i) => { return v.value }).indexOf(s) !== -1) {
                  insured.certiType = s
                  // 如果包含性别关键字, 则定义为【性别】
                } else if (validGender(s)) {
                  const lc = s.toLowerCase()
                  if (lc.indexOf('男') !== -1 || lc === 'male' || lc === 'm') {
                    insured.gender = '男'
                  } else if (lc.indexOf('女') !== -1 || lc === 'female' || lc === 'f') {
                    insured.gender = '女'
                  } else {
                    insured.gender = '未知'
                  }
                  // 定义为【姓名】
                } else {
                  insured.name = s
                }
              }
            }
          })
          // 2021-07-04 16:30:47 15或18位的证件号尝试解析为【身份证】
          if (insured.certiNo.length === 15 || insured.certiNo.length === 18) {
            insured.certiType = '身份证'
          }
          if (insured.certiType === '身份证') {
            this.loadInfoFromCertiNo(insured)
          }
          this.temp.insuredList.push(insured)
        }
      })
      // 重新计算保费
      this.recalculatePremium()
    },
    changeDepartment(data) {
      const dep = this.department.letterHead.find(item => {
        return item.title === data
      })
      if (dep !== undefined) {
        this.temp.policyHolderCerti = dep.certiNo
      }
    },
    /**
     * 从证件号加载性别及出生日期, 回写给被保人
     * @param insured 被保人信息
     */
    loadInfoFromCertiNo(insured) {
      const s = insured.certiNo
      if (s.length === 15) {
        if (parseInt(s.charAt(14)) % 2 === 0) {
          insured.gender = '女'
        } else {
          insured.gender = '男'
        }
        if (parseInt(s.charAt(6) + s.charAt(7)) < 10) {
          const date = '20' + s.substring(6, 8) + '-' + s.substr(8, 10) + '-' + s.substr(10, 12)
          insured.dateOfBirth = Date.parse(date)
        } else {
          const date = '19' + s.substring(6, 8) + '-' + s.substr(8, 10) + '-' + s.substr(10, 12)
          insured.dateOfBirth = Date.parse(date)
        }
      } else if (s.length === 18) {
        if (parseInt(s.charAt(16)) % 2 === 0) {
          insured.gender = '女'
        } else {
          insured.gender = '男'
        }
        const date = s.substring(6, 10) + '-' + s.substring(10, 12) + '-' + s.substring(12, 14)
        insured.dateOfBirth = Date.parse(date)
      }
    },
    // 下载导入模板
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
    // 读取模板内容
    handleChange(file, fileList) {
      const fReader = new FileReader()
      fReader.readAsDataURL(file.raw)
      fReader.onload = evt => {
        const encoding = this.checkEncoding(evt.target.result)
        // 清空被保人列表
        this.temp.insuredList = []
        // 将csv转换成二维数组
        this.$papa.parse(file.raw, {
          encoding,
          complete: res => {
            const data = res.data
            if (data[data.length - 1] === '') {
              data.pop()
            }
            const line = []
            for (let num = 1; num < data.length; num++) {
              if (data[num][0] !== '' && data[num][0] !== 'undefined') {
                const r = []
                r.push(data[num][0])
                r.push(data[num][1])
                r.push(data[num][2])
                r.push(data[num][3])
                r.push(data[num][4])
                r.push(data[num][5])
                line.push(r.join(' '))
              }
            }
            this.smartPasteText = line.join('\n')
            this.smartPaste()
            this.recalculatePremium()
          }
        })
      }
    },
    listenPayStatus(orderNo) {
      let timer
      getOneTrans(orderNo).then(res => {
        if (res.success === true) {
          if (res.data.status === 'SUCCESS') {
            clearTimeout(timer) // 清理定时任务
            this.$router.push({ name: 'Policy' })
          } else {
            timer = setTimeout(() => {
              this.listenPayStatus(orderNo)
            }, 2000) // 每个两秒重试
          }
        }
      }).catch(e => {
        console.log(e)
        this.$router.push({ name: 'Order' })
      })
    },
    saveToDraftBox() {
      saveDraft(this.temp.orderNo, this.temp).then(response => {
        if (response.success === true) {
          this.$confirm('保存草稿箱成功, 是否退出当前页面?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$router.push({ name: 'Order', params: { orderNo: this.temp.orderNo }})
          })
        } else {
          this.$notify.error({ title: '错误', message: '保存草稿箱失败!' })
        }
      })
    },
    confirmNotice() {
      this.setImage('POLICY_NOTICE')
      this.centerDialogVisible = false
      this.check_1 = true
      this.checked = this.check_1 && this.check_2
    },
    confirmPdf() {
      this.setImage('INSU_CLAUSES')
      this.pdfDialogVisible = false
      this.check_2 = true
      this.checked = this.check_1 && this.check_2
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

<style scoped>
span {
  font-size: 12px;
}

table {
  line-height: 14px;
  border-radius:6px;
  border:1px solid #ddd;
}

table tr th, table tr td {
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

table tr th:first-child, table tr td:first-child {
  border-left: 1px solid #ddd;
}

table tr:first-child th:first-child {
    border-top-left-radius: 4px;
}

table tr:first-child th:last-child {
    border-top-right-radius: 4px;
}

table tr:last-child td:first-child {
    border-bottom-left-radius: 4px;
}

table tr:last-child td:last-child {
    border-bottom-right-radius: 4px;
}

div .el-tabs__content {
  padding-top: 5px;
}
.el-table__header-wrapper .el-table th{
  background:#f8f8f8;
  font-weight:normal;
  border-bottom:none;
  border-right:none;
}
.el-table__header-wrapper table,.el-table__body-wrapper table{
  border:none;
}
.el-picker-panel__footer .el-button--text.el-picker-panel__link-btn {
  display: none;
}

.fontWeight{
  font-weight:bold;
  color:#333;
}
</style>
