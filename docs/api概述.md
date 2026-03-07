本产品（`文字识别/2021-07-07`）的OpenAPI采用RPC签名风格，签名细节参见[签名机制说明](https://help.aliyun.com/zh/sdk/product-overview/request-structure-and-signature/)。我们已经为开发者封装了常见编程语言的SDK，开发者可通过[下载SDK](https://api.aliyun.com/api-tools/sdk/ocr-api?version=2021-07-07)直接调用本产品OpenAPI而无需关心技术细节。如果现有SDK不能满足使用需求，可通过签名机制进行自签名对接。由于自签名细节非常复杂，需花费 5个工作日左右。因此建议加入我们的服务钉钉群（78410016550），在专家指导下进行签名对接。

在使用API前，您需要准备好身份账号及访问密钥（AccessKey），才能有效通过客户端工具（SDK、CLI等）访问API。细节请参见[获取AccessKey](https://help.aliyun.com/zh/ram/user-guide/create-an-accesskey-pair)。

## OCR统一识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeAllText](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizealltext) | OCR统一识别 | OCR统一识别接口支持识别多种图片类型，包括通用文字、个人卡证、发票等。您只需要通过Type参数指定图片类型，无须更换接口。 |
| [RecognizeGeneralStructure](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizegeneralstructure) | 通用票证抽取 | 通用票证抽取结合读光OCR和通义千问大模型的能力，针对OCR不支持的长尾票据，提供关键KV信息抽取，例如名称、地址、开票日期等关键字段结构化识别输出。 |

## 通用文字识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeAdvanced](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeadvanced) | 全文识别高精版 | 支持多格式版面、复杂文档背景和光照环境的精准识别，可实现印章擦除后识别，支持低置信度过滤、图案检测等高阶功能。 |
| [RecognizeHandwriting](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizehandwriting) | 通用手写体识别 | 支持中文手写体、英文手写体、数字手写体等各种复杂场景的手写文字识别。 |
| [RecognizeBasic](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebasic) | 电商图片文字识别 | 针对电商商品宣传图片、社区贴吧图片、网络UGC图片等网络场景下图片字符快速精准识别。 |
| [RecognizeGeneral](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizegeneral) | 通用文字识别 | 适用于非结构化文字识别，支持返回文字内容和位置坐标信息。 |
| [RecognizeTableOcr](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizetableocr) | 表格识别 | 支持对有线表格、条纹表格、无线表格进行有效识别。 |
| [RecognizeDocumentStructure](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizedocumentstructure) | 文档结构化识别 | 对文档信息进行结构化识别，并提供元素平铺和层级树两种视角的版面信息输出。能够将文档中的文字元素（单字、文字块、行等）和相应的版面格式（标题、段落、表格）抽离并按顺序输出。 |

## 个人证照识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeIdcard](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeidcard) | 身份证识别 | 支持二代身份证正反面，包括姓名、性别、民族、地址、出生日期、身份证号、签发机关、有效期限等字段的结构化识别。支持身份证质量检测，是否翻拍，是否是复印件，完整度评分，整体质量分数、篡改指数及人脸位置检测。 |
| [RecognizePassport](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizepassport) | 国际护照识别 | 可对美国、法国、英国、日本、韩国等世界多个主要国家和地区护照提供识别服务，支持字段包括国籍、护照号码、出生日期、姓名等。 |
| [RecognizeHousehold](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizehousehold) | 户口本识别 | 可结构化识别户口常住人口登记卡页面及户主页的内容，有效识别户口本上的相关户籍证明信息。 |
| [RecognizeEstateCertification](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeestatecertification) | 不动产权证识别 | 可准确识别不动产证中的各项关键信息，包括户主信息、房屋地址、面积大小、土地权利类型等，适用于全国各地的不同房产证识别。 |
| [RecognizeBankCard](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebankcard) | 银行卡识别 | 可精准识别各类银行卡中的银行卡卡号和有效期，且支持横卡、竖卡及银行卡任意角度偏斜情况的识别与提取，支持中国内地大多数银行，以及各种位数、凸字卡面、平面卡面等的识别。 |
| [RecognizeBirthCertification](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebirthcertification) | 出生证明识别 | 可准确识别出生证明中的各项关键信息，包括出生日期、出生体重、出生地点等。 |
| [RecognizeChinesePassport](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizechinesepassport) | 中国护照识别 | 支持中国人民共和国护照的结构化内容检测识别功能，支持中国内地、中国香港、中国澳门和中国台湾地区的护照识别，识别内容包括出生地、出生日期、国籍、性别、护照号码、有效期至、签发国、签发地等字段。 |
| [RecognizeExitEntryPermitToMainland](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeexitentrypermittomainland) | 来往大陆（内地）通行证识别 | 可准确识别通行证中的各项关键信息，包括姓名、出生日期、证件号码等。包括港澳居民来往大陆通行证以及台湾居民来往大陆通行证。 |
| [RecognizeExitEntryPermitToHK](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeexitentrypermittohk) | 往来港澳台通行证识别 | 支持通行证中的各项关键信息，姓名、出生日期、证件号码等字段的准确识别。 |
| [RecognizeHKIdcard](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizehkidcard) | 中国香港身份证识别 | 支持香港永久性居民身份证和香港居民身份证两种类型的证件识别，已支持全字段识别，包括中文姓名（如有）、英文姓名、中文姓名电码（如有）、出生日期、性别、符号标记、身份证号码等。 |
| [RecognizeSocialSecurityCardVersionII](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizesocialsecuritycardversionii) | 社保卡识别 | 支持全字段识别，包括标题、姓名、社会保障号码、社会保障卡号、银行账号、发卡日期等。 |
| [RecognizeInternationalIdcard](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeinternationalidcard) | 国际身份证识别 | 可对国外身份证件进行结构化识别，目前支持越南、韩国、印度、孟加拉居民身份证，可识别字段包括姓名、出生日期、证件号码等。 |

## 票据凭证识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeMixedInvoices](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizemixedinvoices) | 混贴发票识别 | 支持各类票据的发票代码、价税合计、合计金额、购买方识别号、开票日期等关键字段结构化识别输出。 |
| [RecognizeInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeinvoice) | 增值税发票识别 | 支持增值税专用发票、增值税普通发票、增值税电子发票识别，支持包括发票代码、发票号码、开票日期、发票金额、发票税额、检验码、购买方税号、销售方税号、发票详情等关键字段结构化识别输出。 |
| [RecognizeCarInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizecarinvoice) | 机动车销售统一发票识别 | 支持包括发票代码、开票号码、开票日期、发票金额、增值税税额、合格证号、购买方名称、购买方身份证号/代码等关键字段结构化识别输出。 |
| [RecognizeQuotaInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizequotainvoice) | 定额发票识别 | 支持包括发票号码、发票代码、发票金额等关键字段结构化识别输出。 |
| [RecognizeAirItinerary](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeairitinerary) | 航空行程单识别 | 支持包括旅客姓名、身份证号码、电子客票号码、填开日期、填开单位等字段结构化识别输出。 |
| [RecognizeTrainInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizetraininvoice) | 火车票识别 | 支持包括票号、出发站、到达站、开车时间、票价、座位类型、旅客信息、座位号、车次等字段结构化识别输出。 2024.12.31更新后，支持电子火车票，增加返回以下新字段：电子客票号、购买方名称、购买方统一信用代码、标题、开票日期、备注。 |
| [RecognizeTaxiInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizetaxiinvoice) | 出租车发票识别 | 支持包括发票代码、发票号码、日期、发票金额等关键字段结构化识别输出。 |
| [RecognizeRollTicket](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizerollticket) | 增值税发票卷票识别 | 支持对卷票上包括发票代码、发票号码、开票日期、发票金额、校验码、大写金额、销售方税号、购买方税号等关键字段结构化识别输出。 |
| [RecognizeBankAcceptance](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebankacceptance) | 银行承兑汇票识别 | 支持包括出票日期、票据号码、出票人信息、收票人信息、承兑人信息、票据金额等关键字段结构化识别输出。 |
| [RecognizeBusShipTicket](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebusshipticket) | 客运车船票识别 | 支持包括标题、发票号码、出发车站、到达车站、日期、金额等关键字段结构化识别输出。 |
| [RecognizeNonTaxInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizenontaxinvoice) | 非税收入发票识别 | 支持包括票据代码、交款人、票据号码、合计金额、收款单位等关键字段结构化识别输出。 |
| [RecognizeCommonPrintedInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizecommonprintedinvoice) | 通用机打发票识别 | 支持包括发票代码、发票号码、销售方名称、销售方识别号、购买方名称、购买方识别号、合计金额等关键字段结构化识别输出。 |
| [RecognizeHotelConsume](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizehotelconsume) | 酒店流水识别 | 支持包括房号、入住日期、离店日期、消费总计、付款总计、消费详单等关键字段结构化识别输出。 |
| [RecognizePaymentRecord](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizepaymentrecord) | 支付详情页识别 | 支持包括收款方名称、合计金额、付款方式、商品说明、支付时间等关键字段结构化识别输出。 |
| [RecognizePurchaseRecord](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizepurchaserecord) | 电商订单页识别 | 支持包括订单编号、收货信息、交易金额、店铺名称、商品详单等关键字段结构化识别输出。 |
| [RecognizeRideHailingItinerary](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeridehailingitinerary) | 网约车行程单识别 | 支持网约车行程单全部字段的识别，包括：服务商、申请日期、行程开始时间、行程结束时间、行程人手机号、总金额等字段。 |
| [RecognizeShoppingReceipt](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeshoppingreceipt) | 购物小票识别 | 支持包括开票方名称、开票日期、联系电话、地址、合计（实际）金额等关键字段结构化识别输出。 |
| [RecognizeTollInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizetollinvoice) | 过路过桥费发票识别 | 支持包括发票代码、发票号码、金额、日期、车型、出口、入口等关键字段结构化识别输出。 |
| [RecognizeTaxClearanceCertificate](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizetaxclearancecertificate) | 税收完税证明识别 | 支持包括税务机关、纳税人识别号、纳税人名称、合计金额、填票人、完税详单等关键字段的结构化识别输出。 |
| [RecognizeUsedCarInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeusedcarinvoice) | 二手车统一销售发票识别 | 支持包括发票代码、发票号码、开票日期、发票金额、购买方名称、购买方身份证号等关键字段结构化识别输出。 |

## 企业资质识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeBusinessLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebusinesslicense) | 营业执照识别 | 可快速精准的识别企业营业执照中的统一社会信用代码、公司名称、地址、主体类型、法定代表人、注册资金、组成形式、成立日期、营业期限和经营范围等关键有效字段。支持营业执照、民办非企业登记证书、社会团体法人登记证书、事业单位法人证书。 |
| [RecognizeBankAccountLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizebankaccountlicense) | 银行开户许可证识别 | 可快速精准的识别银行开户许可证中的账号、法定代表人、开户银行、核准号、企业名称、编号等关键信息。 |
| [RecognizeTradeMarkCertification](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizetrademarkcertification) | 商标注册证识别 | 可快速精准的识别商标注册证中所包含的商标名称、注册人、注册人地址以及有效期限、核定服务项目等关键有效字段信息。 |
| [RecognizeFoodProduceLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizefoodproducelicense) | 食品生产许可证识别 | 可快速精准的识别食品生产许可证所包含经营者名称、社会信用代码、法定代表人姓名、地址、经营场所、经营项目、有效期、许可证编号等关键字段信息。 |
| [RecognizeFoodManageLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizefoodmanagelicense) | 食品经营许可证识别 | 可快速精准的识别食品经营许可证所包含生产者名称、社会信用代码、法定代表人姓名、地址、生产场所、食品类别、有效期、许可证编号等关键字段信息。 |
| [RecognizeMedicalDeviceManageLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizemedicaldevicemanagelicense) | 医疗器械经营许可证识别 | 可快速精准的识别医疗器械经营许可证所包含许可证编号、企业名称、注册地址、法定代表人、企业负责人、质量管理人、仓库地址、经营范围、许可期限、发证日期等关键字段信息。 |
| [RecognizeMedicalDeviceProduceLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizemedicaldeviceproducelicense) | 医疗器械生产许可证识别 | 可快速精准的识别医疗器械生产许可证所包含许可证编号、法定代表人、企业名称、注册地址、生产地址、生产范围、企业负责人、有效期限等关键字段信息。 |
| [RecognizeCtwoMedicalDeviceManageLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizectwomedicaldevicemanagelicense) | 第二类医疗器械经营备案凭证识别 | 可快速精准的识别第二类医疗器械经营备案凭证所包含备案编号、企业名称、住所、经营场所、库房地址、经营方式、法定代表人、企业负责人、经营范围、许可期限、备案日期等关键字段信息。 |
| [RecognizeCosmeticProduceLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizecosmeticproducelicense) | 化妆品生产许可证识别 | 支持关键字段识别，包括证照名称、企业名称、社会信用代码、住址、法定代表人、许可证编号等。 |
| [RecognizeInternationalBusinessLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeinternationalbusinesslicense) | 国际企业执照识别 | 支持韩国、印度营业执照类型，提供包括证件类型、公司名称、注册号、法人姓名、签发日期等关键字段的识别能力。 |

## 车辆物流识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeVehicleLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizevehiclelicense) | 行驶证识别 | 支持对行驶证正页、副页关键字段的自动定位和识别，同时也支持对正副页在同一张图片的场景进行自动分割与结构化识别。 |
| [RecognizeDrivingLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizedrivinglicense) | 驾驶证识别 | 支持对驾驶证上的姓名、证号、国籍、住址、初次领证日期、准驾类型、有效期等字段进行结构化提取。 |
| [RecognizeWaybill](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizewaybill) | 电子面单识别 | 支持识别面单上所有关键字段。 |
| [RecognizeCarNumber](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizecarnumber) | 车牌识别 | 可有效识别车辆车牌信息，支持机动车车牌、摩托车车牌以及临时车牌。 |
| [RecognizeCarVinCode](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizecarvincode) | 车辆vin码识别 | 支持识别车辆VIN码。 |
| [RecognizeVehicleRegistration](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizevehicleregistration) | 机动车注册登记证识别 | 可快速精准的识别机动车注册证所包含证件类别、条形编码、登记机关、登记日期、机动车登记编号等关键字段信息。 |
| [RecognizeVehicleCertification](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizevehiclecertification) | 车辆合格证识别 | 支持车辆型号、车辆识别代号、底盘型号、发动机型号等字段进行结构化提取。 |

## 教育场景识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeEduFormula](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeeduformula) | 印刷体数学公式识别 | 支持印刷体的数学公式识别。 |
| [RecognizeEduOralCalculation](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeeduoralcalculation) | 口算判题 | 可以识别小学数学口算题目并给出题目判断结果。可支持整数的加减乘除四则运算、整数的混合运算、大小比较、最大数最小数等。 |
| [RecognizeEduPaperOcr](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeedupaperocr) | 整页试卷识别 | 支持K12全学科扫描场景的整页内容文字识别。接口支持印刷体文本及公式的OCR识别和坐标返回，此外，接口还可对题目中的配图位置进行检测并返回坐标位置。 |
| [RecognizeEduPaperCut](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeedupapercut) | 试卷切题识别 | 支持各学科的教辅试卷的结构化电子录入，将试卷中的题目进行自动化切分和结构化打标，并进行对应题目、题干、选项、答案等内容的结构化输出。 |
| [RecognizeEduQuestionOcr](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeeduquestionocr) | 题目识别 | 可对题目进行有效识别。通过对题目的元素进行打标，提升题目的识别效果。 |
| [RecognizeEduPaperStructed](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeedupaperstructed) | 精细版结构化切题 | 支持多学科教辅试卷的结构化识别，将整页练习册、试卷或教辅中的题目进行自动切题，并识别出其中的文字内容和坐标位置。 |

## 小语种文字识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeMultiLanguage](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizemultilanguage) | 通用多语言识别 | 支持国际主流几大语系的自动语言分类判定并返回对应语言的文字信息。 |
| [RecognizeEnglish](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizeenglish) | 英语作文识别 | 针对全英文图片文档场景下英文印刷体字符高效检测和识别，具备英文专项识别和英文分词功能，支持旋转、表格、文字坐标等多项基础功能。 |
| [RecognizeThai](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizethai) | 泰语识别 | 针对泰语图片文档场景下泰文印刷体高效检测和识别，支持旋转、表格、文字坐标等多项基础功能。 |
| [RecognizeJanpanese](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizejanpanese) | 日语识别 | 针对全日文图片文档场景下日文印刷体高效检测和识别，支持旋转、表格、文字坐标等多项基础功能。 |
| [RecognizeKorean](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizekorean) | 韩语识别 | 针对韩语图片文档场景下韩文印刷体高效检测和识别，支持旋转、表格、文字坐标等多项基础功能。 |
| [RecognizeLatin](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizelatin) | 拉丁语识别 | 针对拉丁语系的图片文档场景下印刷体高效检测和识别，支持旋转、表格、文字坐标等多项基础功能。 |
| [RecognizeRussian](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizerussian) | 俄语识别 | 针对图片文档场景下俄文印刷体高效检测和识别，支持旋转、表格、文字坐标等多项基础功能。 |

## 医疗场景识别

| API | 标题  | API概述 |
| --- | --- | --- |
| [RecognizeCovidTestReport](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-recognizecovidtestreport) | 核酸检测报告识别 | 支持对全国各地区不同版式的核酸检测记录中姓名、证件号码、采样日期、采样时间、检测机构、检测结果等6个关键字段的结构化结果输出。 |

## 票证核验

| API | 标题  | API概述 |
| --- | --- | --- |
| [VerifyBusinessLicense](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifybusinesslicense) | 营业执照核验 | 营业执照三要素核验支持通过输入营业执照的统一信用社会代码（工商注册号）、企业名称、法人姓名做一致性验证。 |
| [VerifyVATInvoice](https://help.aliyun.com/zh/ocr/developer-reference/api-ocr-api-2021-07-07-verifyvatinvoice) | 发票核验 | 发票核验接口支持包括：增值税专用发票、增值税普通发票（折叠票）、增值税普通发票（卷票）、增值税电子普通发票（含收费公路通行费增值税电子普通发票）、机动车销售统一发票、二手车销售统一发票多种类型发票核验。您可以通过输入发票的关键验证字段，返回真实的票面信息，包括发票类型、发票代码、发票号码、作废标志、开票日期、购方税号及其他发票信息等。当天开具发票当日可查验（T+0）。注意：可能有几小时到十几小时的延迟。 |