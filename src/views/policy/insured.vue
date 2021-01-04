<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246);padding-left: 12px;padding-right: 12px;">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message" />导航一</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu" />导航二</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-setting" />导航三</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="3-4">
            <template slot="title">选项4</template>
            <el-menu-item index="3-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="grid-content bg-purple">
        <el-tabs type="border-card">
          <el-tab-pane label="投保信息">
            <table border="1" cellspacing="0">
              <tr>
                <td width="100px">保险公司 <span style="color: red;"><b>*</b></span></td>
                <td colspan="6">
                  <el-radio-group v-model="company" size="mini">
                    <el-radio-button label="平安">平安</el-radio-button>
                    <el-radio-button label="中国人寿">中国人寿</el-radio-button>
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <td>产品选择 <span style="color: red;"><b>*</b></span></td>
                <td colspan="6">
                  <el-select v-model="plan" size="mini" placeholder="请选择" style="width: 300px">
                    <el-option
                      v-for="item in plans"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>保险期限 <span style="color: red;"><b>*</b></span></td>
                <td>
                  <el-select v-model="policyScope" size="mini" placeholder="请选择" style="width: 70px">
                    <el-option
                      v-for="item in policyScopes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  天
                </td>
                <td>起保时间 <span style="color: red;"><b>*</b></span></td>
                <td>
                  <el-date-picker
                    v-model="startDate"
                    size="mini"
                    type="date"
                    placeholder="选择日期"
                    style="width: 120px"
                  />
                  [00:00:00]
                </td>
                <td>终止时间 <span style="color: red;"><b>*</b></span></td>
                <td>
                  <el-date-picker
                    v-model="endDate"
                    size="mini"
                    type="date"
                    placeholder="选择日期"
                    style="width: 120px"
                  />
                  [23:59:59]
                </td>
              </tr>
              <tr>
                <td>旅行目的地</td>
                <td colspan="2">
                  <el-input v-model="address" placeholder="请输入内容" size="mini" />
                </td>
                <td>团号/备注</td>
                <td colspan="2">
                  <el-input v-model="remark" placeholder="请输入内容" size="mini" />
                </td>
              </tr>
              <tr>
                <td>投保提示</td>
                <td colspan="6">
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
      <div class="grid-content bg-purple">
        <el-tabs type="border-card">
          <el-tab-pane label="被保人列表">
            <table border="1" cellspacing="0">
              <thead>
                <tr>
                  <td>序</td>
                  <td width="100px">姓名 <span style="color: red;"><b>*</b></span></td>
                  <td width="70px">性别 <span style="color: red;"><b>*</b></span></td>
                  <td width="100px">证件类型 <span style="color: red;"><b>*</b></span></td>
                  <td>证件号码 <span style="color: red;"><b>*</b></span></td>
                  <td>出生日期 <span style="color: red;"><b>*</b></span></td>
                  <td width="100px">手机</td>
                  <td>原价</td>
                  <td>结算价</td>
                  <td />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><el-input v-model="name" placeholder="" size="mini" /></td>
                  <td><el-select v-model="gender" size="mini" placeholder="">
                    <el-option
                      v-for="item in genders"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select></td>
                  <td><el-select v-model="ceriType" size="mini" placeholder="">
                    <el-option
                      v-for="item in ceriTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select></td>
                  <td><el-input v-model="certiNo" placeholder="" size="mini" /></td>
                  <td><el-input v-model="birthday" placeholder="" size="mini" /></td>
                  <td><el-input v-model="mobile" placeholder="" size="mini" /></td>
                  <td>5.00</td>
                  <td>4.00</td>
                  <td><button>X</button></td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <br>
      <div class="grid-content bg-purple">
        <el-tabs type="border-card">
          <el-tab-pane label="投保人">
            <table border="1" cellspacing="0" width="100%">
              <tr>
                <td>公司选择 <span style="color: red;"><b>*</b></span></td>
                <td colspan="3"><el-select v-model="cpCode" size="mini" placeholder="请选择" /></td>
              </tr>
              <tr>
                <td>公司名称 <span style="color: red;"><b>*</b></span></td>
                <td><el-input v-model="cpName" placeholder="" size="mini" /></td>
                <td>证件号码 <span style="color: red;"><b>*</b></span></td>
                <td><el-input v-model="cpNumber" placeholder="" size="mini" /></td>
              </tr>
            </table>
          </el-tab-pane>
        </el-tabs>
        <br>
        <table border="1" cellspacing="0" width="100%">
          <tr>
            <td>账户余额：</td>
            <td>0.00元</td>
            <td>可用额度：</td>
            <td colspan="3">0.00元</td>
          </tr>
          <tr>
            <td>人数合计：</td>
            <td>1 人</td>
            <td>原价合计：</td>
            <td>5.00元</td>
            <td>结算合计：</td>
            <td>4.00元</td>
          </tr>
        </table>
        <br>
        <table border="1" cellspacing="0" width="100%">
          <tr>
            <td>选择支付方式：</td>
            <td>
              <template>
                <el-radio v-model="paymethod" label="1">支付宝或微信支付</el-radio>
                <el-radio v-model="paymethod" label="2">余额支付 <span style="color: red;">(余额不足)</span></el-radio>
              </template>
            </td>
          </tr>
          <tr>
            <td>支付方式说明：</td>
            <td>余额足够时会默认使用余额支付</td>
          </tr>
        </table>
        <br>
        <div style="text-align:center">
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="checked">我已详细阅读并理解投保注意事项</el-checkbox>
        </div>
        <br>
        <div style="text-align:center">
          <el-button type="primary" size="mini" @click="onSubmit">确定投保</el-button>
          <el-button size="mini">存草稿</el-button>
        </div>
        <br>
        <br>
        <table border="1" cellspacing="0" width="100%">
          <tr>
            <td colspan="2" style="text-align: center">[出境销售型] - 计划一[8万]</td>
          </tr>
          <tr>
            <td width="50%">保障内容</td>
            <td width="50%" style="text-align: center">保障金额（人民币：元）</td>
          </tr>
          <tr>
            <td colspan="2"><span style="color: red;"><b>个人意外伤害及医疗保障</b></span></td>
          </tr>
          <tr>
            <td>意外身故及残疾</td>
            <td style="text-align: center">80,000</td>
          </tr>
          <tr>
            <td>意外伤害医疗（无免赔额）</td>
            <td style="text-align: center">10,000</td>
          </tr>
          <tr>
            <td>每日住院津贴总额（100元/天，最多赔偿30天）</td>
            <td style="text-align: center">3,000</td>
          </tr>
          <tr>
            <td>丧葬费用</td>
            <td style="text-align: center">5,000</td>
          </tr>
          <tr>
            <td colspan="2"><span style="color: red;"><b>突发急性病保障</b></span></td>
          </tr>
          <tr>
            <td>突发急性病身故（含猝死）</td>
            <td style="text-align: center">50,000</td>
          </tr>
          <tr>
            <td>突发急性病医疗（无免赔额，高原反应属于突发急性病）</td>
            <td style="text-align: center">10,000</td>
          </tr>
          <tr>
            <td colspan="2"><span style="color: red;"><b>高风险运动意外伤害保障</b></span></td>
          </tr>
          <tr>
            <td>高风险运动意外身故及残疾</td>
            <td style="text-align: center">80,000</td>
          </tr>
          <tr>
            <td>高风险运动意外伤害医疗（无免赔额）</td>
            <td style="text-align: center">10,000</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center">保障金额/人 （人民币：元）</td>
          </tr>
          <tr>
            <td>旅行天数</td>
            <td style="text-align: center">价格</td>
          </tr>
          <tr>
            <td>1-5天</td>
            <td style="text-align: center">5.00</td>
          </tr>
          <tr>
            <td>6-10天</td>
            <td style="text-align: center">8.00</td>
          </tr>
          <tr>
            <td>11-20天</td>
            <td style="text-align: center">12.00</td>
          </tr>
          <tr>
            <td>21-30天</td>
            <td style="text-align: center">15.00</td>
          </tr>
          <tr>
            <td>31-60天</td>
            <td style="text-align: center">25.00</td>
          </tr>
        </table>
        <br>
        <div><span style="color: red;"><b>特别约定:</b></span></div>
        <div style="margin-bottom: 10px">
          1、所有的保险责任及条款均以中国太平洋财产保险股份有限公司签发的正式保险合同之相应条款为准。<br>
          2、本计划的承保年龄为1至80周岁,以保单生效时的周岁年龄为准。71至80周岁的被保险人,其涉及“意外身故、残疾保障”的保险金额为上表所载金额的一半,保险费维持不变。<br>
          3、按中国保监会规定,10周岁以下的未成年人累计身故保险金额不得超过人民币20万元;10至17周岁的未成年人累计身故保险金额不得超过人民币50万元。若未成年被保险人的保险金额超过上述规定,则以上述规定的保险金额为限。<br>
          4、在同一保险期间，每位被保险人投保同一产品（包括同一产品的同一计划或不同计划）限投保一份，如果投保了多份同一计划，以最先投保之保单为有效，其余部分视为无效，保险费将无息退还；如果投保了多份不同计划，以意外伤害保额最高之保单为有效，其余部分视为无效，保险费将无息退还。<br>
          5、若被保险人在任意渠道投保由本公司承保的多份“意外身故、残疾保险”、“疾病身故”、“急性病身故”、“猝死”、 “意外医疗费用”、“医疗费用(包含意外及突发急性病医疗费用)”、“意外每日住院津贴”、“每日住院津贴”,则本公司仅按其中保险金额最高者做出赔偿。<br>
          6、外籍人士购买本产品只要符合投保规则即可,无其它特殊要求。<br>
          7、本保险产品承保区域仅为中国大陆境内地区（不包含香港、澳门及台湾）。<br>
          8、本产品指定医院为符合条款要求的医院,除了北京平谷区所有医院。请注意:北京市平谷区所有医院的就医均不给予理赔。<br>
          9、被保险人故意做出的危险性行为而导致的意外伤害事故，保险公司不承担保险责任，危险性行为包括但不限于：不听从导游、领队、教练或现场安全人员的要求及劝阻；违反景区或当地的警示/禁令标示；违规进入国家或当地政府明令禁止的线路或地区等。<br>
          10、本产品可扩展承保本市旅游，理赔时需提供相关证明，包括但不限于景点门票、过路费票据、公共交通票据等。<br>
          11、本保单意外医疗按每次事故免赔100元后80%赔付，限医保范围。<br>
          12、本保单意外伤害住院津贴50元/日，无免赔天数，单次赔偿以30天为限，累计以30天为限。<br>
        </div>
        <div><span style="color: red;margin-bottom: 10px"><b>投保须知及说明:</b></span></div>
        <div style="margin-bottom: 35px">
          1. 投保前请您仔细阅读： 产品条款 费率表 保险金赔付比例 客户告知书 保单样本<br>
          2. 免除责任、保障责任、犹豫期、费用扣除、退保、保险单现金价值、投保人、被保险人义务等内容详见产品条款，请务必仔细阅读 产品条款 及电子保单的特别约定。<br>
          3. 本产品由中国太平洋财产保险股份有限公司承保,目前该公司在北京、天津、河北、山西、内蒙古、辽宁、大连、吉林、黑龙江、上海、江苏、无锡、常州、浙江、温州、宁波、安徽、江西、福建、厦门、山东、青岛、苏州、河南、湖北、湖南、广东、东莞、深圳、海南、广西、四川、重庆、贵州、云南、陕西、甘肃、新疆、宁夏、青海、西藏有分支机构。<br>
          4. 所有的保险责任及条款均以中国太平洋财产保险股份有限公司签发的正式保险合同之相应条款为准。<br>
          5. 本计划的承保年龄为1至80周岁,以保单生效时的周岁年龄为准。71至80周岁的被保险人,其涉及“意外身故、残疾保障”的保险金额为上表所载金额的一半,保险费维持不变。<br>
          6. 按中国保监会规定,10周岁以下的未成年人累计身故保险金额不得超过人民币20万元;10至17周岁的未成年人累计身故保险金额不得超过人民币50万元。若未成年被保险人的保险金额超过上述规定,则以上述规定的保险金额为限。<br>
          7. 在同一保险期间，每位被保险人投保同一产品（包括同一产品的同一计划或不同计划）限投保一份，如果投保了多份同一计划，以最先投保之保单为有效，其余部分视为无效，保险费将无息退还；如果投保了多份不同计划，以意外伤害保额最高之保单为有效，其余部分视为无效，保险费将无息退还。<br>
          8. 若被保险人在任意渠道投保由本公司承保的多份“意外身故、残疾保险”、“疾病身故”、“急性病身故”、“猝死”、“意外医疗费用”、“医疗费用(包含意外及突发急性病医疗费用)”、“意外每日住院津贴”、“每日住院津贴”,则本公司仅按其中保险金额最高者做出赔偿。<br>
          9. 外籍人士购买本产品只要符合投保规则即可,无其它特殊要求。<br>
          10. 本产品承保区域仅为中国大陆境内地区（不包含香港、澳门及台湾）。<br>
          11. 本产品指定医院为符合条款要求的医院,除了北京平谷区所有医院。请注意:北京市平谷区所有医院的就医均不给予理赔。<br>
          12. 被保险人故意做出的危险性行为而导致的意外伤害事故，保险公司不承担保险责任，危险性行为包括但不限于：不听从导游、领队、教练或现场安全人员的要求及劝阻；违反景区或当地的警示/禁令标示；违规进入国家或当地政府明令禁止的线路或地区等。<br>
          13. 本产品可扩展承保本市旅游，理赔时需提供相关证明，包括但不限于景点门票、过路费票据、公共交通票据等。<br>
          14. 本产品意外医疗按每次事故免赔100元后80%赔付，限医保范围。<br>
        </div>
        <div><span style="color: red;"><b>特别提醒</b></span> 在官方发布恶劣天气预警之后购买的的旅行延误、旅行变更的责任不承担赔偿责任，其他保障内容不受影响。</div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'PolicyIndex',
  data() {
    return {
      company: '平安',
      plans: [{
        value: '',
        label: '[出境销售型]-计划一[8万]'
      }],
      plan: '[出境销售型]-计划一[8万]',
      policyScopes: [{
        value: '',
        label: '1'
      }],
      policyScope: '1',
      startDate: '',
      endDate: '',
      address: '',
      remark: '',
      name: '',
      gender: '男',
      genders: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      ceriType: '身份证',
      ceriTypes: [{
        value: '身份证',
        label: '身份证'
      }],
      certiNo: '',
      birthday: '',
      mobile: '',
      cpName: '上海xxxxxx有限公司',
      cpNumber: '12352345356345634563456',
      paymethod: '支付宝',
      checked: false
    }
  },
  methods: {}
}
</script>
