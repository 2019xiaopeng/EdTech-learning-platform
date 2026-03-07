OCR统一识别接口支持识别多种图片类型，包括通用文字、个人卡证、发票等。您只需要通过Type参数指定图片类型，无须更换接口。

## 接口说明

#### 如何使用本接口

| 步骤  | 概述  |
| --- | --- |
| 1   | 开通[OCR 统一识别](https://common-buy.aliyun.com/?commodityCode=ocr_unity_public_cn)服务。 开通此 API 后会赠送免费额度，可使用免费额度测试。 |
| 2   | 购买[OCR 共享资源包](https://common-buy.aliyun.com/?spm=5176.23043878.0.0.5f3d1287hpm7ZT&commodityCode=ocr_share_dp_cn)。您也可以不购买资源包，系统会通过“[按量付费](https://help.aliyun.com/zh/ocr/product-overview/pay-as-you-go)”方式按实际调用量自动扣款。 |
| 3   | 可以参照[调试页面](https://api.aliyun.com/api/ocr-api/2021-07-07/RecognizeAllText?sdkStyle=dara)提供的代码示例完成 API 接入开发。接入完成后，调用 API 获取识别结果。如果使用子账号调用接口，需要阿里云账号（主账号）对 RAM 账号进行授权。创建 RAM 用户的具体操作，请参考：[创建 RAM 用户。](https://help.aliyun.com/zh/ram/user-guide/create-a-ram-user)文字识别服务提供一种系统授权策略，即 **AliyunOCRFullAccess**。具体授权操作，请参见[在用户页面为 RAM 用户授权。](https://help.aliyun.com/zh/ram/user-guide/grant-permissions-to-the-ram-user) |

#### 重要提示

| 类型  | 概述  |
| 图片格式 | - 本接口支持：PNG、JPG、JPEG、BMP、GIF、TIFF、WebP、PDF。 |
| 图片尺寸 | - 图片长宽需要大于 15 像素，小于 8192 像素。 - 长宽比需要小于 50。 - 如需达到较好识别效果，建议长宽均大于 500px。 |
| 图片大小 | - 图片二进制文件不能超过 10MB。 - 图片过大会影响接口响应速度，建议使用小于 1.5M 图片进行识别，且通过传图片 URL 的方式调用接口。 |
| 其他提示 | - 请保证整张图片内容及其边缘包含在图像内。 - 本能力会自动处理反光、扭曲等干扰信息，但会影响精度。请尽量选择清晰度高、无反光、无扭曲的图片。 |

## 调试

[您可以在OpenAPI Explorer中直接运行该接口，免去您计算签名的困扰。运行成功后，OpenAPI Explorer可以自动生成SDK代码示例。](https://api.aliyun.com/api/ocr-api/2021-07-07/RecognizeAllText)

 [![](https://img.alicdn.com/tfs/TB16JcyXHr1gK0jSZR0XXbP8XXa-24-26.png) 调试](https://api.aliyun.com/api/ocr-api/2021-07-07/RecognizeAllText)

## **授权信息**

下表是API对应的授权信息，可以在RAM权限策略语句的`Action`元素中使用，用来给RAM用户或RAM角色授予调用此API的权限。具体说明如下：

-   操作：是指具体的权限点。
    
-   访问级别：是指每个操作的访问级别，取值为写入（Write）、读取（Read）或列出（List）。
    
-   资源类型：是指操作中支持授权的资源类型。具体说明如下：
    
    -   对于必选的资源类型，用前面加 \* 表示。
        
    -   对于不支持资源级授权的操作，用`全部资源`表示。
        
-   条件关键字：是指云产品自身定义的条件关键字。
    
-   关联操作：是指成功执行操作所需要的其他权限。操作者必须同时具备关联操作的权限，操作才能成功。
    

| **操作** | **访问级别** | **资源类型** | **条件关键字** | **关联操作** |
| --- | --- | --- | --- | --- |
| ocr:RecognizeAllText | none | \\*全部资源 `*` | 无   | 无   |

## 请求参数

| **名称** | **类型** | **必填** | **描述** | **示例值** |
| Url | string | 否   | - 本字段和 body 字段二选一，不可同时透传或同时为空。 - 图片链接（长度不超过 2048 字节，不支持 base64）。 | https://example.png |
| body | string | 否   | - 本字段和 URL 字段二选一，不可同时透传或同时为空。 - 图片二进制文件，最大 10MB。 - 使用 HTTP 方式调用，把图片二进制文件放到 HTTP body 中上传即可。 - 使用 SDK 的方式调用，把图片放到 SDK 的 body 中即可。 | 图片二进制文件 |
| Type | string | 是   | - 图片类型。**必选**参数，且为**单选**。 - 支持的图片类型请参考 **请求参数补充说明**。 - 请注意，对于票据卡证类图片，当图片真实类型和入参指定的 **Type** 不一致时，会导致识别失败。 | Advanced |
| OutputFigure | boolean | 否   | - 是否需要图案检测功能。如果开启，会返回 **FigureInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：不同图片类型（**Type**）的默认值不同，详见**请求参数补充说明**。 - 支持识别的图案类型如下： - blicense\\_title：营业执照标题 - national\\_emblem：国徽 - face：人脸图案 - finger\\_print：指纹 - signature：签名区域 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要识别图案时开启此参数。 | false |
| OutputQrcode | boolean | 否   | - 是否需要二维码检测功能。开启后会返回 **QrCodeInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要识别二维码时开启此参数。 | false |
| OutputBarCode | boolean | 否   | - 是否需要条形码检测功能。开启后会返回 **BarCodeInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要识别条形码时开启此参数。 | false |
| OutputStamp | boolean | 否   | - 是否需要印章检测功能。开启后会返回 **StampInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要识别印章时开启此参数。 | false |
| OutputCoordinate | string | 否   | - 返回坐标格式（**points**、**rectangle**）。 - points：四点坐标；rectangle：旋转矩形。 - 默认不需要传此参数，不返回文字坐标。 | ""  |
| OutputOricoord | boolean | 否   | - 是否需要返回原图坐标信息。 系统会自动对图片做处理（比如自动旋转、图片校正等），您可以设置返回的坐标口径，是“原图坐标”或“算法处理后图片坐标”。 - true：需要；false：不需要。 - 默认值：不同图片类型（**Type**）的默认值不同，详见**请求参数补充说明**。 - **请注意**：仅当 **OutputCoordinate** 不为空时，设置此参数才有意义。 | false |
| OutputKVExcel | boolean | 否   | - 是否需要把识别出的结构化信息转成 Excel 文件链接（默认不需要）。 - true：需要；false：不需要。 - 文件链接有效期为一小时。 - **注意**：开启此参数后，会增加接口的响应时间，请在需要时开启。 | false |
| PageNo | integer | 否   | 当图片类型为混贴票证/增值税发票/定额发票航空行程单/火车票增值税发票卷票/通用机打发票时（即 Type=MixedInvoice/Invoice/QuotaInvoice/AirItinerary/TrainTicket/RollTicket/CommonPrintedInvoice），可通过本字段设置可选功能。 - 指定识别的 PDF/OFD 页码；例如：PageNo=6，则识别 PDF/OFD 的第六页。 - 如果不传此参数，或传值大于 PDF/OFD 总页数，则识别 PDF/OFD 的第一页。 - 默认识别第一页。 | 1   |
| AdvancedConfig | object | 否   | - 当图片类型为通用文字识别高精版时（**Type=Advanced**），可通过本字段设置可选功能。 |     |
| OutputRow | boolean | 否   | - 是否需要成行返回功能。开启后会返回 **RowInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 | false |
| OutputParagraph | boolean | 否   | - 是否需要分段功能。开启后会返回 **ParagraphInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 | false |
| OutputTable | boolean | 否   | - 是否需要输出表格识别结果，包含单元格信息。开启后会返回 **TableInfo** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要识别表格时开启此参数。 | false |
| OutputCharInfo | boolean | 否   | - 是否需要输出单字识别结果。开启后，**BlockInfo** 字段中会返回 **CharInfos** 字段（详见返回参数说明）。 - true：需要；false：不需要。 - 默认值：false。 | false |
| IsLineLessTable | boolean | 否   | - 是否为无线表格或表格只有横线没有竖线。 - true：无线表格；false：有线表格。 - 默认值：false。 - **请注意**：仅当**OutputTable=true**时，设置此参数才生效。 | false |
| IsHandWritingTable | boolean | 否   | - 是否是手写表格。 - true：是手写表格；false：不是手写表格。 - 默认值：false。 - **请注意**：仅当**OutputTable=true**时，设置此参数才生效。 | false |
| OutputTableExcel | boolean | 否   | - 是否将识别的表格结果导出成 Excel，并以文件链接形式返回。 - true：需要；false：不需要。 - 默认值：false。 - 文件链接有效期为一小时。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要时开启此参数。 | false |
| OutputTableHtml | boolean | 否   | - 是否将识别的表格结果导出成 Html 格式结果，并以文件链接形式返回。 - true：需要；false：不需要。 - 默认值：false。 - 文件链接有效期为一小时。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要时开启此参数。 | false |
| IdCardConfig | object | 否   | - 当图片类型为身份证时（**Type=IdCard**），可通过本字段设置可选功能。 |     |
| OutputIdCardQuality | boolean | 否   | - 是否需要身份证质量检测功能。 - 身份证质量检测功能包含：是否翻拍，是否是复印件，完整度评分，整体质量分数。 - true：需要；false：不需要。 - 默认值：false。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要身份证质量检测功能时开启此参数。 | false |
| Llm\\_rec | boolean | 否   |     |     |
| InternationalIdCardConfig | object | 否   | - 当图片类型为国际身份证时（Type=**InternationalIdCard**），可通过本字段设置可选功能。 |     |
| Country | string | 否   | - 国家名称。 - 支持的国家类型：India，Vietnam，Korea，Bangladesh。 - 默认不需要传此参数，算法自动判断。 - **请注意**：如果指定国家名称，接口响应时间更短。 | India |
| InternationalBusinessLicenseConfig | object | 否   | - 当图片类型为国际企业执照时（Type=**InternationalBusinessLicense**），可通过本字段设置可选功能。 |     |
| Country | string | 否   | - 国家名称。 - 支持的国家类型：India，Korea。 - 默认不需要传此参数，算法自动判断。 - 请注意：如果指定国家名称，接口响应时间更短。 **枚举值：** - India : India - Korea : Korea | India |
| MultiLanConfig | object | 否   | - 当图片类型为通用多语言文字时（Type=**MultiLang**），可通过本字段设置可选功能。 |     |
| Languages | string | 否   | - 支持的语言列表。 - chn：中文，eng：英文，ja：日文，lading：拉丁，kor：韩文，sx：手写，tai：泰文，rus：俄文，mys：马来文，idn：印尼文，viet：越南文，ukr：乌克兰。 - **请注意**：可以同时传多个语言参数，用逗号分隔。例如：Languages="eng,chn,lading"。但如果您确认图片的语言类型，建议传一种语言参数，算法识别效果更好。 | eng,chn |
| TableConfig | object | 否   | - 当图片类型为表格时（Type=**Table**），可通过本字段设置可选功能。 |     |
| IsHandWritingTable | boolean | 否   | - 是否是手写表格。 - true：是手写表格；false：不是手写表格。 - 默认值：false。 | false |
| IsLineLessTable | boolean | 否   | - 是否为无线表格或表格只有横线没有竖线。 - true：无线表格；false：有线表格。 - 默认值：false。 | false |
| OutputTableExcel | boolean | 否   | - 是否将识别的表格结果导出成 Excel，并以文件链接形式返回。 - true：需要；false：不需要。 - 默认值：false。 - 文件链接有效期为一小时。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要时开启此参数。 | false |
| OutputTableHtml | boolean | 否   | - 是否将识别的表格结果导出成 Html 格式结果，并以文件链接形式返回。 - true：需要；false：不需要。 - 默认值：false。 - 文件链接有效期为一小时。 - **请注意**：开启此参数后，会增加接口的响应时间，请在需要时开启此参数。 | false |

-   本接口请求参数可分为三级，一级入参是**必传**的基础参数，例如图片链接、图片类型。二级参数可以控制识别内容输出，例如是否返回坐标等。 三级参数和特定的图片类型相关，用于控制是否输出特定信息，例如是否输出身份证的质量检测分数。注意，只有 **Type** 是必传参数，其余参数可以根据需要设置。
    

#### 图片类型（Type）支持的请求参数补充说明

| Type | 类型描述 | 支持的参数 |
| Advanced | 通用文字识别高精版 | - OutputFigure（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - AdvancedConfig（**通用识别高精版**专有参数，默认：空） |
| General | 通用文字识别基础版 | - OutputStamp（默认：false） |
| Commerce | 电商图片文字 | - OutputStamp（默认：false） |
| HandWriting | 手写文字 | - OutputFigure（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| MultiLang | 多语言文字 | - OutputFigure（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - MultiLanConfig（**多语言通用类型**专有参数，默认：空） |
| Table | 表格  | - OutputFigure（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - TableConfig（**表格类型**专有参数，默认：空） |
| IdCard | 身份证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：**true**） - IdCardConfig（**身份证**专有参数，默认：空） |
| BankCard | 银行卡 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| InternationalPassport | 国际护照 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：**true**） |
| ChinesePassport | 中国护照 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| SocialSecurityCard | 社保卡 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| PermitToHK\\_MO\\_TW | 往来港澳台通行证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| PermitToMainland | 来往中国大陆（内地）通行证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| HouseholdHead | 户口本首页 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| HouseholdResident | 户口本常住人口页 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| EstateCertification | 不动产权证 | - OutputFigure（默认：false） - OutputQrCode（默认：true） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| BirthCertification | 出生证明 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| HKIdCard | 中国香港身份证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：**true**） |
| InternationalIdCard | 国际身份证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - InternationalIdCardConfig（**国际身份证**专有参数，默认：空） |
| Stamp | 公章  | - OutputCoordinate（默认：空） - OutputOricoord（默认：false） |
| MixedInvoice | 混贴票证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| Invoice | 增值税发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| CarInvoice | 机动车销售统一发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| QuotaInvoice | 定额发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| AirItinerary | 航空行程单 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| TrainTicket | 火车票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| TollInvoice | 过路过桥费发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| RollTicket | 增值税发票卷票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| BankAcceptance | 银行承兑汇票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| BusShipTicket | 客运车船票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| NonTaxInvoice | 非税收入发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| CommonPrintedInvoice | 通用机打发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - PageNo（默认：1） - OutputKVExcel（默认：false） |
| HotelConsume | 酒店流水 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| PaymentRecord | 支付详情页 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| PurchaseRecord | 电商订单页 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| RideHailingItinerary | 网约车行程单 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| ShoppingReceipt | 购物小票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| TaxClearanceCertificate | 税收完税证明 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| UsedCarInvoice | 二手车销售统一发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| VehicleLicense | 行驶证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| DrivingLicense | 驾驶证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| VehicleRegistration | 机动车登记证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| VehicleCertification | 车辆合格证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| LicensePlateNumber | 车牌  | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| CarVinCode | 车辆 vin 码 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| BusinessLicense | 营业执照 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| InternationalBusinessLicense | 国际企业执照 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） - OutputKVExcel（默认：false） - InternationalBusinessLicenseConfig （**国际企业执照**专有参数，默认：空） |
| MedicalDeviceManageLicense | 医疗器械经营许可证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| MedicalDeviceProduceLicense | 医疗器械生产许可证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| CosmeticProduceLicense | 化妆品生产许可证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| QrCode | 二维码 |     |
| BarCode | 条形码 |     |
| TaxiInvoice | 出租车发票 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| TrademarkCertificate | 商标注册证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| FoodProduceLicense | 食品生产许可证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| FoodManagementLicense | 食品经营许可证 | - OutputFigure（默认：false） - OutputQrCode（默认：**true**） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| ClassIIMedicalDeviceManageLicense | 第二类医疗器械经营备案凭证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| WayBill | 电子面单 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |
| BankAccountPermit | 银行开户许可证 | - OutputFigure（默认：false） - OutputQrCode（默认：false） - OutputBarCode（默认：false） - OutputStamp（默认：false） - OutputCoordinate（默认：空） - OutputOricoord（默认：false） - OutputKVExcel（默认：false） |

## **返回参数**

| **名称** | **类型** | **描述** | **示例值** |
| --- | --- | --- | --- |
|     | object | Schema of Response |     |
| RequestId | string | 请求唯一 ID。 | E2A98925-DC2C-18FB-995F-BAF507XXXXXX |
| Data | object | 识别结果。 |     |
| Height | integer | 原图高度。 | 2000 |
| Width | integer | 原图宽度。 | 1000 |
| Content | string | 图片包含的所有文字汇总。 | "合同编号..." |
| SubImageCount | integer | 图片包含的子图数量。 | 2   |
| SubImages | array<object> | 图片包含的子图信息。 |     |
|     | array<object> |     |     |
| SubImageId | integer | 子图 ID（编号从 **0** 开始）。 | 0   |
| Type | string | 子图类型（例如**身份证正面**、**增值税发票**等）。 | 身份证正面 |
| Angle | integer | 子图顺时针旋转角度（范围：0～359 度）。 | 0   |
| SubImagePoints | array<object> | 子图四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| SubImageRect | object | 子图旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 子图宽度。 | 1000 |
| Height | integer | 子图高度。 | 2000 |
| KvInfo | object | - 子图的结构化信息。 - 个人卡证、票据等类型图片会返回结构化信息。例如身份证图片，此字段会包含姓名、性别等信息。 |     |
| KvCount | integer | 子图所包含结构化信息的键值对数量。 | 6   |
| Data | any | - 结构化信息文字内容。字典类型，**键**为字段名称，**值**为字段对应的识别结果。 - 不同图片类型（**Type**）的结构化字段不同。所有 **Type** 返回的结构化字段详见**返回结果补充说明**。 | { "address": "XX省XX市XX街道XX号", "ethnicity": "汉", "sex": "男", "name": "王XX", "idNumber": "XXX", "birthDate": "2000年1月1日" } |
| KvDetails | object | - 结构化信息明细，字典类型。Key 为字段名称，Value 为此字段对应的识别结果（包含字段值、坐标、置信度等）。 |     |
|     | object | - 结构化信息明细 **Value** 描述。 |     |
| KeyName | string | 字段名称。 | "address" |
| KeyConfidence | integer | 字段置信度（范围：0～100）。 | 100 |
| Value | string | 字段（**KeyName**）名称对应值的文字内容。 | "XX省XX市XX街道" |
| ValueConfidence | integer | 字段名称对应值的置信度（范围：0～100）。 | 98  |
| ValuePoints | array<object> | 字段名称对应值的四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| ValueRect | object | 字段名称对应值的旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 50  |
| Height | integer | 矩形高度。 | 50  |
| ValueAngle | integer | 字段名称对应值的顺时针旋转角度（范围：0～359）。 | 0   |
| BlockInfo | object | - 子图文字块信息。 - 当 **Type** 为 **Advanced**、**General**、**MultiLang**、**Commerce**、**HandWriting** 时返回。 |     |
| BlockCount | integer | 子图文字块数量。 | 12  |
| BlockDetails | array<object> | 子图文字块信息明细。 |     |
|     | array<object> |     |     |
| BlockId | integer | 文字块 ID（编号从 **0** 开始）。 | 0   |
| BlockAngle | integer | 文字块顺时针旋转角度（范围：0～359）。 | 0   |
| BlockContent | string | 文字块的文字内容。 | “合同编号...” |
| BlockConfidence | integer | 文字块置信度（范围：0～100）。 | 98  |
| BlockPoints | array<object> | 文字块四点坐标（当 **OutputCoordinate="points"** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| BlockRect | object | 文字块旋转矩形坐标（当 **OutputCoordinate="rectangle"** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 50  |
| Height | integer | 矩形高度。 | 10  |
| CharInfos | array<object> | 单字信息（当 **AdvancedConfig.OutputCharInfo=true** 时返回）。 |     |
|     | array<object> |     |     |
| CharId | integer | 单字 ID（编号从 **0** 开始）。 | 0   |
| CharContent | string | 单字内容。 | “合” |
| CharConfidence | integer | 单字置信度（范围：0～100）。 | 95  |
| CharPoints | array<object> | 单字四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| CharRect | object | 单字旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 10  |
| Height | integer | 矩形高度。 | 10  |
| TableInfo | object | 表格信息（当 **AdvancedConfig.OutputTable=true** 时返回）。 |     |
| TableCount | integer | 表格数量。 | 2   |
| TableDetails | array<object> | 表格信息明细。 |     |
|     | array<object> |     |     |
| TableId | integer | 表格 ID（编号从 **0** 开始）。 | 0   |
| RowCount | integer | 表格行数。 | 10  |
| ColumnCount | integer | 表格列数。 | 3   |
| CellCount | integer | 表格单元格数量。 | 29  |
| Header | object | 表头信息。 |     |
| Contents | array | 表头文字内容。 |     |
|     | string | - 单行表头内容。 | "12.1本合同当事人" |
| BlockId | integer | 文字块 ID（编号从 0 开始）。 | 0   |
| Footer | object | 表尾信息。 |     |
| Contents | array | 表尾文字内容。 |     |
|     | string | - 单行表尾内容。 | "贷款人/抵押权人（盖章/电子签章）：" |
| BlockId | integer | 文字块 ID（编号从 **0** 开始）。 | 0   |
| CellDetails | array<object> | 单元格信息明细。 |     |
|     | array<object> |     |     |
| CellId | integer | 单元格 ID（编号从 **0** 开始）。 | 0   |
| CellContent | string | 单元格文字内容。 | "借款人/抵押人：" |
| RowStart | integer | 单元格起始行数。第一个单元格位置为 **0**。 | 0   |
| RowEnd | integer | 单元格终止行数。第一个单元格位置为 **0**。**RowStart=0** 且 **RowEnd=0** 表示此单元格只占据了第一行。 | 0   |
| ColumnStart | integer | 单元格起始列数。第一个单元格位置为 **0**。 | 2   |
| ColumnEnd | integer | 单元格终止列数。第一个单元格位置为 **0**。**ColumnStart=0** 且 **ColumnEnd=0** 表示此单元格只占据了第一列。 | 5   |
| BlockList | array | 此单元格所包含的文字块 ID。 |     |
|     | integer | 单个文字块 ID。 | 0   |
| CellPoints | array<object> | 单元格四点坐标（当 **OutputCoordinate="points"** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| CellRect | object | 单元格旋转矩形坐标（当 **OutputCoordinate="rectangle"** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 20  |
| Height | integer | 矩形高度。 | 20  |
| CellAngle | integer | 单元格顺时针旋转角度（范围：0～359）。 | 0   |
| TablePoints | array<object> | 表格四点坐标（当 **OutputCoordinate=“points"** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| TableRect | object | 表格旋转矩形坐标（当 **OutputCoordinate=“rectangle"** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 100 |
| Height | integer | 矩形高度。 | 100 |
| TableExcel | string | - 表格识别结果转成 Excel 后，导出的文件链接。 - 有效期：1 小时。 | https://example.xlsx |
| TableHtml | string | - 表格识别结果转成 Html 格式后，导出的文件链接。 - 有效期：1 小时。 | https://example.html |
| RowInfo | object | 子图行信息（当 **AdvancedConfig.OutputRow=true** 时返回）。 |     |
| RowCount | integer | 子图包含的行数。 | 9   |
| RowDetails | array<object> | 子图行信息明细。 |     |
|     | object |     |     |
| RowId | integer | 行 ID（编号从 **0** 开始）。 | 0   |
| RowContent | string | 行文字内容。 | “合同编号..." |
| BlockList | array | 此行所包含的文字块 ID 列表。 |     |
|     | integer | 单个文字块 ID。 | 0   |
| ParagraphInfo | object | 子图段落信息（当 **AdvancedConfig.OutputParagraph=true** 时返回）。 |     |
| ParagraphCount | integer | 子图所包含段落数量。 | 11  |
| ParagraphDetails | array<object> | 子图段落信息明细。 |     |
|     | object |     |     |
| ParagraphId | integer | 段落 ID（编号从 **0** 开始）。 | 0   |
| ParagraphContent | string | 段落文字内容。 | “合同编号...” |
| BlockList | array | 此段所包含的文字块 ID 列表。 |     |
|     | integer | 单个文字块 ID。 | 0   |
| QrCodeInfo | object | 子图二维码信息（当 **OutputQrcode=true** 时返回）。 |     |
| QrCodeCount | integer | 子图二维码数量。 | 1   |
| QrCodeDetails | array<object> | 子图二维码信息明细。 |     |
|     | array<object> |     |     |
| Data | any | 二维码内容。 | “http://www.gsxt.gov.cn/indeXXX” |
| QrCodePoints | array<object> | 二维码四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| QrCodeRect | object | 二维码旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 100 |
| Height | integer | 矩形高度。 | 100 |
| QrCodeAngle | integer | QrCode 旋转角度（范围：0～359）。 | 0   |
| BarCodeInfo | object | 子图条形码信息（当 **OutputBarCode=true** 时返回）。 |     |
| BarCodeCount | integer | 子图条形码数量。 | 2   |
| BarCodeDetails | array<object> | 条形码信息明细。 |     |
|     | array<object> |     |     |
| Type | string | 条形码类型。支持的类型如下： - Codabar - Code39 - Code93 - Code128 | Code128 |
| Data | any | 条形码内容。 | "1100011XXXXXX" |
| BarCodePoints | array<object> | 条形码四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| BarCodeRect | object | 条形码旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 100 |
| Height | integer | 矩形高度。 | 10  |
| BarCodeAngle | integer | 条形码顺时针旋转角度（范围：0～359）。 | 0   |
| FigureInfo | object | 子图包含的图案信息（当 **OutputFigure=true** 时返回）。字典类型，键为图案类型，值为此类型图案的信息。支持的图案类型如下： - blicense\\_title：营业执照标题 - national\\_emblem：国徽 - face：人脸 - finger\\_print：指纹 - signature：签名区域 |     |
|     | object | 图案详细信息。 |     |
| FigureCount | integer | 子图所包含的图案数量。 | 3   |
| FigureDetails | array<object> | 图案信息明细。 |     |
|     | array<object> |     |     |
| Type | string | 图案类型。为 **blicense\\_title**、**national\\_emblem** 、**face**、**finger\\_print**、**signature** 中的一种。 | face |
| Data | any | 图案数据（有数据才返回）。 | “”  |
| FigurePoints | array<object> | 图案四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| FigureRect | object | 图案旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 50  |
| Height | integer | 矩形高度。 | 50  |
| FigureAngle | integer | 图案顺时针旋转角度（范围：0～359）。 | 0   |
| StampInfo | object | 子图印章信息（当 **OutputStamp=true** 时返回）。 |     |
| StampCount | integer | 子图印章数量。 | 2   |
| StampDetails | array<object> | 印章信息明细。 |     |
|     | array<object> |     |     |
| Data | object | 子图印章识别结果，字典类型，键为字段名称，值为对应字段的识别结果。 |     |
| CompanyId | string | 进出口企业代码。 | "XXX" |
| OrganizationName | string | 组织名。 | "XXX贸易有限公司" |
| AntiFakeCode | string | 防伪编码。 | "3205823XXXXXX" |
| OtherText | string | 其它文字。 | "3205823XXXXXX" |
| TopText | string | 上环文字。 | "XXX贸易有限公司" |
| OrganizationNameEng | string | 英文组织名。 | ""  |
| TaxpayerId | string | 纳税人识别号。 | ""  |
| StampPoints | array<object> | 印章四点坐标（当 **OutputCoordinate=“points”** 时返回）。 |     |
|     | object |     |     |
| X   | integer | 顶点横坐标。 | 100 |
| Y   | integer | 顶点纵坐标。 | 200 |
| StampRect | object | 印章旋转矩形坐标（当 **OutputCoordinate=“rectangle”** 时返回）。 |     |
| CenterX | integer | 矩形中心点横坐标。 | 100 |
| CenterY | integer | 矩形中心点纵坐标。 | 200 |
| Width | integer | 矩形宽度。 | 50  |
| Height | integer | 矩形高度。 | 50  |
| StampAngle | integer | 矩形顺时针旋转角度（范围：0～359）。 | 0   |
| QualityInfo | object | 子图质量检测信息。 |     |
| IsCopy | boolean | 是否为复印件 | false |
| IsReshoot | boolean | 是否是翻拍。仅支持身份证类型图片（**Type=IdCard**）。 | false |
| CompletenessScore | number | 完整度评分。仅支持身份证类型图片（**Type=IdCard**）。 | 90.5 |
| QualityScore | number | 整体质量分数。仅支持身份证类型图片（**Type=IdCard**）。 | 80.5 |
| TamperScore | number | 篡改分数。仅支持身份证类型图片（**Type=IdCard**）。 | 10.5 |
| XmlResult | string | XML 格式返回结果。 | ""  |
| AlgoVersion | string | 算法版本号。 | ""  |
| DebugInfo | any | Debug 信息（不为空时才返回此字段）。 | ""  |
| AlgoServer | array | 算法服务器信息列表（不为空时才返回此字段）。 |     |
|     | string | 算法服务器信息。 | ""  |
| IsMixedMode | boolean | 是否是混贴类型。 | false |
| PageNo | integer | PDF/OFD 页码（从 **1** 开始）。 | 1   |
| KvExcelUrl | string | - 卡证、票据类型图片的结构化信息转成 Excel 格式后，导出的文件链接。 - 有效期：1 小时。 | https://example.xlsx |
| Code | string | 错误码（当识别成功时不会返回）。 | 400 |
| Message | string | 错误信息（当识别成功时不会返回）。 | illegalImageUrl |

#### 图片类型（Type）对应的 KV 信息字段说明。所有 KV 字段都是 String 类型。

| Type | 类型描述 | 返回 KV 信息字段说明 |
| IdCard | 身份证 | - 正面字段： - name：姓名 - sex：性别 - ethnicity：民族 - birthDate：出生日期 - address：住址 - idNumber：身份证号码 - 背面字段： - issueAuthority：签发机关 - validPeriod：有效期限 |
| BankCard | 银行卡 | - cardType：卡种 - bankName：银行名称 - cardNumber：银行卡号 - validToDate：有效期限 |
| InternationalPassport | 国际护照 | - passportType：证件类型 - surname：姓 - givenName：名 - passportNumber：护照号码 - nationality：国家码 - nameEn：英文姓名 - name：非英文姓名 - sex：性别 - birthPlaceEn：出生地 - birthPlace：非英文出生地 - country：国籍 - validToDate：有效期至 - birthDate：出生日期 - birthDateYmd：出生日期（年月日） - issueDateYmd：签发日期 - issuePlaceEn：签发地 - issuePlace：非英文签发地 - issueAuthorityEn：签发机关 - issueAuthority：非英文签发机关 - idNumber：身份号 - mrzLine1：机读码一 - mrzLine2：机读码二 |
| ChinesePassport | 中国护照 | - passportType：证件类型 - countryCode：国家码 - passportNumber：护照号码 - nameEn：英文姓名 - name：中文姓名 - sex：性别 - birthPlace：出生地 - nationality：国籍 - issuePlace：签发地 - issueAuthority：签发机关 - mrzLine1：机读码一 - mrzLine2：机读码二 - validToDate：有效期至 - birthDate：出生日期 - issueDate：签发日期 |
| SocialSecurityCard | 社保卡 | - bankAccount：银行账号 - cardNumber：社保保障卡号 - idNumber：社会保障号码 - issueDate：发卡日期 - name：姓名 - title：标题 - validPeriod：有效期限 |
| PermitToHK\\_MO\\_TW | 往来港澳台通行证 | - permitType：证件类别 - nameCn：中文姓名 - nameEn：英文姓名 - birthDate：出生日期 - sex：性别 - validPeriod：有效期限 - issueAuthority：签发机关 - issuePlace：签发地 - permitNumber：证件号码 - mrzCode：机读码 |
| PermitToMainland | 来往中国大陆（内地）通行证 | - birthDate：出生日期 - issueAuthority：签发机关 - issueCount： 签发次数 - issuePlace：签发地点 - nameCn：中文姓名 - nameEn：英文姓名 - permitNumber：证件号码 - permitType：证件类别 - sex：性别 - validPeriod：有效期限 |
| HouseholdHead | 户口本户首页 | - Registrar：承办人签章 - address：住址 - householdNumber： 户号 - householdType：户别 - householderCommunity：户主社区 - householderName：户主姓名 - issueDate：签发日期 - sectionNo：地段号 |
| HouseholdResident | 户口本常住人口页 | - birthDate：出生日期 - birthPlace：出生地 - bloodGroup：血型 - educationalDegree：文化程度 - employer：服务处所 - ethnicity：民族 - formerName：曾用名 - householdNumber：户号 - idCardNumber：身份证编号 - immigratedToCityInfo：何时何地迁来本市 - immigratedToResidenceInfo：何时由何地迁来本址 - maritalStatus：婚姻状况 - militaryServiceStatus：兵役状况 - name：姓名 - nativePlace：籍贯 - occupation：职业 - otherResidence：本市其他住址 - registrar：承办人签章 - registrationDate：登记日期 - relation：与户主关系 - religious： 宗教信仰 - sex：性别 - stature：身高 |
| EstateCertification | 不动产权证 | - area：面积 - certificateNumber：证号 - mutualOwnershipState： 共有情况 - obligee：权利人 - location：坐落地址 - unitNumber：不动产单元号 - rightType：权利类型 - rightProperty：权利性质 - usage：用途 - serviceLife：使用期限 - otherState：权利其他状况 - buildingArea：房屋建筑面积 |
| BirthCertification | 出生证明 | - neonatalName：新生儿姓名 - sex：性别 - birthTime：出生时间 - gestationalAge：出生孕周 - birthWeight： 出生体重 - birthLength：出生身长 - birthPlace：出生地 - medicalInstitutions：医疗机构名称 - motherName：母亲姓名 - motherAge：母亲年龄 - motherNationality：母亲国籍 - motherEthnicity：母亲民族 - motherAddress：母亲住址 - motherIdCardNumber：母亲有效身份证件号 - fatherName：父亲姓名 - fatherAge：父亲年龄 - fatherNationality：父亲国籍 - fatherEthnicity：父亲民族 - fatherAddress：父亲住址 - fatherIdCardNumber： 父亲有效身份证件号 - issueAuthority：签发机构 - issueDate：签发日期 - certificateNumber：编号 |
| HKIdCard | 中国香港身份证 | - birthDate：出生日期 - firstIssuedDate：首次签发日期 - idNumber：身份证号码 - issuedCode：签发标志 - issuedDate：签发日期 - nameCn： 中文姓名 - nameCode：姓名电码 - nameEn：英文姓名 - sex：性别 |
| InternationalIdCard | 国际身份证 | - 印度身份证正面字段： - name：本国姓名 - nameEn：英文姓名 - birthDate：出生日期 - sex：性别 - cardNumber：证件号码 - virtualNumber：虚拟号码 - 印度身份证反面字段： - address：本国地址 - addressEn：英文地址 - cardNumber：证件号码 - virtualNumber：虚拟号码 - 印度纳税人证件字段： - birthDate：生日 - fatherName：父亲姓名 - name：姓名 - taxId： 税号 - 越南身份证正面字段： - birthDate： 出生日期 - validToDate：有效期至 - residence：居住地 - cardType：证件类型 - placeOfAncestry：原籍地 - cardNumber：证件号码 - name：姓名 - sex：性别 - nationality：国籍 - 越南身份证反面字段： - issuer：签发人 - mrzLine1：机读码一 - mrzLine2：机读码二 - mrzLine3：机读码三 - personalCharacteristics：身份识别特征 - issueDate：签发日期 - 韩国身份证字段： - name：本国姓名 - nameChn：中文姓名 - cardNumber：证件号码 - address：住址 - issueDate：签发日期 - issuer：签发人 - 孟加拉国身份证字段： - name：本国姓名 - nameEn：英文姓名 - fatherName：父亲姓名 - motherName：母亲姓名 - birthDate：出生日期 - cardNumber： 身份证号 |
| Stamp | 公章  | - companyId：进出口企业代码 - organizationName：组织名 - antiFakeCode：防伪编码 - otherText：其它文字 - topText：上环文字 - organizationNameEng：英文组织名 - taxpayerId：纳税人识别号 |
| Invoice | 增值税发票 | - invoiceCode：发票代码 - invoiceNumber：发票号码 - invoiceDate：开票日期 - machineCode：机器编码 - checkCode：校验码 - purchaserName：受票方名称 - passwordArea：密码区 - invoiceAmountPreTax：不含税金额 - invoiceTax：发票税额 - totalAmountInWords：大写金额 - totalAmount：发票金额 - sellerName：销售方名称 - sellerTaxNumber：销售方税号 - sellerContactInfo：销售方地址、电话 - sellerBankAccountInfo：销售方开户行、账号 - drawer：开票人 - title：标题 - invoiceType：发票类型（电子普通发票、电子专用发票、专用发票、普通发票、通用发票） - formType：联次 - printedInvoiceCode：机打发票代码 - printedInvoiceNumber：机打发票号码 - purchaserBankAccountInfo：受票方开户行、账号 - purchaserContactInfo：受票方地址、电话 - purchaserTaxNumber：受票方税号 - recipient：收款人 - remarks：备注 - reviewer：复核人 - specialTag：特殊标识信息 - invoiceDetails：发票详单 |
| CarInvoice | 机动车销售统一发票 | - taxCode：税控码 - invoiceDate：开票日期 - invoiceCode：发票代码 - invoiceNumber：发票号码 - machineCode：机器编号 - purchaserName：购买方名称 - purchaseCode：购买方身份证号码/组织机构代码 - vehicleType：车辆类型 - brandMode：厂牌型号 - origin：产地 - certificateNumber：合格证号 - importCertificateNumber：进口证明书号 - commodityInspectionNumber：商检单号 - engineNumber：发动机号码 - vinCode：车辆识别代号/车架号码 - invoiceAmountCn：价税合计（大写） - invoiceAmount：价税合计（小写） - sellerName：销货单位名称 - sellerContact：销货单位电话 - sellerTaxNumber：销货单位纳税人识别号 - sellerBankAccount：销货单位账号 - sellerAddress：销货单位地址 - sellerDepositaryBank：销货单位开户银行 - taxRate：增值税税率或征收率 - tax：增值税税额 - taxAuthoritiesInfo：主管税务机关及代码 - taxAuthoritiesName：主管税务机关 - taxAuthoritiesCode：主管税务代码 - preTaxAmount：不含税价 - passengerLimitNumber：限乘人数 - issuer：开票人 - tonnage：吨位 - purchaserTaxNumber：购买方纳税人识别号 - taxPaymentNumber：完税凭证号码 |
| QuotaInvoice | 定额发票 | - invoiceCode：发票代码 - invoiceNumber：发票号码 - AmountInWords：大写金额 - Amount：小写金额 - title：发票标题 - formType：联次 |
| AirItinerary | 航空行程单 | - agentCode：销售单位代号 - caacDevelopmentFund：民航发展基金 - endorsement：签注 - fare：票价 - flights：航班详单 - fuelSurcharge：燃油附加费 - idCardNumber：有效身份证号码 - insurance：保险费 - internationalFlightSign：国内国际标签 - issueCompany：填开单位 - issueDate：填开日期 - otherTaxes：其他税费 - passengerName：旅客姓名 - pnrCode：PNR 码 - promptMessage：提示信息 - serialNumber：印刷序号 - ticketNumber：电子客票号码 - totalAmount：合计 - validationCode：验证码 |
| TrainTicket | 火车票 | - departureStation：出发站 - arrivalStation：到达站 - trainNumber：车次 - departureTime：开车时间 - seatNumber：座位号 - fare：票价 - ticketGate：检票口 - seatType：座位类型 - passengerInfo：旅客信息 - passengerName：旅客姓名 - ticketNumber：票号 - ticketCode：售票码 - saleInfo：售票车站信息 |
| TollInvoice | 过路过桥费发票 | - title：标题 - formType：联次 - invoiceCode：发票代码 - invoiceNumber：发票号码 - date：日期 - time：时间 - vehicleType：车型 - entranceName：入口 - exitName：出口 - totalAmount：总金额 - ftype：是否是复印件（1：是，0：否） |
| RollTicket | 增值税发票卷票 | - invoiceCode：发票代码 - invoiceNumber：发票号码 - invoiceDate：开票日期 - checkCode：校验码 - sellerName：销售方名称 - sellerTaxNumber：销售方税号 - purchaserName：购买方名称 - purchaserTaxCode：购买方税号 - title：标题 - IGNORE：机打号码 - machineCode：机器编号 - cashier：收款员 - totalAmountInWords：合计金额（大写） - totalAmount：合计金额（小写） - invoiceDetails：发票详单 - itemName：项目 - quantity：数量 - unitPrice：单价 - amount：金额 |
| BankAcceptance | 银行承兑汇票 | - issueDate：出票日期 - validToDate：到期日期 - draftStatus：票据状态 - draftNumber：票据号码 - issuerName：出票人全称 - issuerAccountNumber：出票人账号 - issuerAccountBank：出票人开户银行 - payeeName：收票人全称 - payeeAccountNumber：收票人账号 - payeeAccountBank：收票人开户银行 - totalAmountInWords：票据金额大写 - totalAmount：票据金额小写 - acceptorName：承兑人全称 - acceptorAccountNumber：承兑人账号 - acceptorBankNumber：承兑人开户行行号 - acceptorAccountBank：承兑人开户行名称 - agreementNumber：交易合同号 - assignability：能否转让 - acceptanceDate：承兑日期 |
| BusShipTicket | 客运车船票 | - title：标题 - formType：发票联次 - invoiceCode：发票代码 - invoiceNumber：发票号码 - date：日期 - time：时间 - departureStation：出发车站 - arrivalStation：到达车站 - totalAmount：总金额 - passengerName：姓名 - idcardNo：身份证号 |
| NonTaxInvoice | 非税收入发票 | - additionalInfo：其他信息 - invoiceCode：票据代码 - invoiceDate：开票日期 - invoiceDetails：项目详单 - invoiceNumber：票据号码 - payeeName：收款单位 - payerCreditCode：交款人统一社会信用代码 - payerName：交款人 - recipient：收款人 - reviewer：复核人 - title：标题 - totalAmount：合计金额（小写） - totalAmountInWords：合计金额（大写） - validationCode：校验码 |
| CommonPrintedInvoice | 通用机打发票 | - title：标题 - formType：发票联次 - invoiceCode：发票代码 - invoiceNumber：发票号码 - printedInvoiceCode：发票代码-机打 - printedInvoiceNumber：发票号码-机打 - invoiceDate：开票日期 - totalAmount：合计金额 - sellerName：销售方名称 - sellerTaxNumber：销售方纳税人识别号 - purchaserName：购买方名称 - purchaserTaxNumber：购买方纳税人识别号 - drawer：开票人 - recipient：收款人 - remarks：备注 - invoiceDetails：发票详单 - itemName：项目名称 - unit：单位 - quantity：数量 - unitPrice：单价 - amount：总值 - ftype：是否是复印件（1：是，0：否） |
| HotelConsume | 酒店流水 | - fax：传真 - phone：电话 - postCode：邮编 - roomNo：房号 - checkInDate：入住日期 - departureDate：离店日期 - memberNumber：会员号码 - totalConsumption：消费总计 - name：姓名 - roomType：房型 - numberOfGuests：住店人数 - roomRate：房费 - address：地址 - consumptionDetails：消费详单 - *消费详单* 内字段说明 - date：日期 - item：项目 - consumption：消费 - payment：付款 |
| PaymentRecord | 支付详情页 | - description：商品说明 - orderNumber：订单号 - paymentMethod：付款方式 - paymentTime：支付时间 - recipientName：收款方名称 - totalAmount：合计金额 |
| PurchaseRecord | 电商订单页 | - orderNumber：订单编号 - transactionTime：交易时间 - deliveryInfo：收货信息 - totalAmount：交易金额 - shopName：店铺名称 - ftype：是否是复印件（1：是，0：否） - shoppingDetails：商品详单 - 商品详单字段说明： - name：商品名称 - specification：商品规格 - price：商品单价 - quantity：商品数量 |
| RideHailingItinerary | 网约车行程单 | - serviceProvider：服务商 - applicationDate：申请日期 - startTime：行程开始时间 - endTime：行程结束时间 - phoneNumber：行程人手机号 - totalAmount：总金额 - rideDetails：行程详单 - Number：序号 - carType：车型 - pickUpTime：上车时间 - city：城市 - startPlace：起点 - endPlace：终点 - mileage：里程 - amount：金额 - remarks：备注 |
| ShoppingReceipt | 购物小票 | - shopName：开票方名称 - receiptDate：开票日期 - receiptTime：开票时间 - contactNumber：联系电话 - shopAddress：地址 - totalAmount：合计（实付）金额 - receiptDetails：商品详单 |
| TaxClearanceCertificate | 税收完税证明 | - certificateNumber：编号 - drawer：填票人 - formType：联次 - issueDate：填发日期 - name：纳税人名称 - remarks：备注 - taxAuthorityName：税务机关 - taxClearanceDetails：完税详单 - taxNumbe：纳税人识别号 - totalAmount：合计金额（小写） - totalAmountInWords：合计金额（大写） |
| UsedCarInvoice | 二手车销售统一发票 | - title：标题 - formType：联次 - invoiceDate：开票日期 - invoiceCode：发票代码 - invoiceNumber：发票号码 - printedInvoiceCode：机打代码 - printedInvoiceNumber：机打号码 - taxCode：税控码 - purchaserName：买方单位/个人姓名 - purchaserCode：买方单位代码/身份证号码 - purchaserAddress：买方单位/个人地址 - purchaserPhoneNumber：买方电话 - sellerName：卖方单位/个人姓名 - sellerCode：卖方单位代码/身份证号码 - sellerAddress：卖方单位/个人住址 - sellerPhoneNumber：卖方电话 - licensePlateNumber：车牌照号 - certificateNumber：登记证号 - vehicleType：车辆类型 - vinCode：车架号/车辆识别代码 - brandMode：厂牌型号 - vehicleAdministrationName：转入地车辆管理所名称 - totalAmountInWords：车价合计（大写） - totalAmount：车价合计（小写） - marketName：二手车市场名称 - marketTaxNumber：二手车市场纳税人识别号 - marketAddress：二手车市场地址 - marketBankAccountInfo：二手车市场开户银行及账户 - marketPhoneNumber：二手车市场电话 - remarks：备注 - drawer：开票人 |
| VehicleLicense | 行驶证 | - 行驶证正面字段： - address：住址 - engineNumber：发动机号码 - issueDate：发证日期 - model：品牌型号 - owner：所有人 - licensePlateNumber：号牌号码 - registrationDate：注册日期 - useNature：使用性质 - vehicleType：车辆类型 - vinCode：车辆识别代码 - issueAuthority：签发机关 - 行驶证反面字段： - licensePlateNumber：号牌号码 - inspectionRecord：检验记录 - passengerCapacity：核定载人数 - totalWeight：总质量 - curbWeight：整备质量 - permittedWeight：核定载质量 - overallDimension：外廓尺寸 - tractionWeight：准牵引总质量 - energySign：能源标志 - recordNumber：档案编号 - remarks：备注 |
| DrivingLicense | 驾驶证 | - 驾驶证正面字段： - licenseNumber：证号 - name：姓名 - sex：性别 - nationality：国籍 - address：住址 - birthDate：出生日期 - initialIssueDate：初次领证日期 - approvedType：准驾类型 - issueAuthority：发证单位 - validFromDate：有效起始日期 - validPeriod：有效期限 - 驾驶证反面字段： - name：姓名 - recordNumber：档案编号 - record：记录 - licenseNumber：证号 |
| VehicleRegistration | 机动车登记证 | - acquisitionMethod：车辆获得方式 - axleNumber：轴数 - barCode：条形编号 - cabPassengerCapacity：驾驶室载客 - containerDimension：货箱内部尺寸 - displacement：排量 - engineNumber：发动机号 - engineType：发动机型号 - frontWheelTrack：轮距前 - fuelType：燃料种类 - isDomestic：国产/进口 - issueAuthority：发证机关 - issueDate：发证日期 - manufactureDate：车辆出厂日期 - manufactureName：制造厂名称 - overallDimension：外轮廓尺寸 - passengerCapacity：驾驶室载客 - permittedWeight：核定载质量 - power：功率 - rearWheelTrack：轮距后 - registrationAuthority：登记机关 - registrationDate：登记日期 - registrationNumber：机动车登记编号 - springNumber：钢板弹簧数 - steeringForm：转向形式 - tireNumber：轮胎数 - tireSize：轮胎规格 - totalWeight：总质量 - tractionWeight：准牵引总质量 - useNature：使用性质 - vehicleBrand：车辆品牌 - vehicleColor：车身颜色 - vehicleModel：车辆型号 - vehicleOwnerInfo：机动车所有人/身份证明名称/号码 - vehicleType：车辆类型 - vinCode：车辆识别代号/车架号 - wheelbase：轴距 |
| VehicleCertification | 车辆合格证 | - MaximumLoadMass：半挂车鞍座最大允许总质量 - axleLoad：轴荷 - axleNumber：轴数 - cabPassengerCapacity：驾驶室准驾人数 - certificateNumber：合格证编号 - chassisCertificateNumber：底盘合格证编号 - chassisId：底盘 ID - chassisModel：底盘型号 - containerDimension：货箱内部尺寸 - displacement：排量 - emissionStandard：排放标准 - engineModel：发动机型号 - engineNumber：发动机号 - equipmentWeight：装备质量 - frontWheelTrack：轮距前 - fuelConsumption：油耗 - fuelType：燃料种类 - issueDate：发证日期 - manufactureDate：车辆制造日期 - manufactureName：车辆制造企业名称 - massUtilizationCoefficient：载质量利用系数 - maxDesignSpeed：最高设计车速 - maximumLadenMass：额定载质量 - overallDimension：外廓尺寸 - passengerCapacity：额定载客 - power：功率 - rearWheelTrack：轮距后 - remarks：备注 - springNumber：钢板弹簧数 - steeringForm：转向形式 - tireNumber：轮胎数 - tireSize：轮胎规格 - totalWeight：总质量 - tractionWeight：准牵引总质量 - vehicleBrand：车辆品牌 - vehicleColor：车身颜色 - vehicleModel：车辆型号 - vehicleName：车辆名称 - vinCode：车辆识别代号/车架号 - wheelbase：轴距 |
| LicensePlateNumber | 车牌  | - data：车牌信息 |
| CarVinCode | 车辆 vin 码 | - vinCode：车牌 vin 码信息 |
| BusinessLicense | 营业执照 | - title：标题 - creditCode：统一社会信用代码 - companyName：营业名称 - companyType：类型 - businessAddress：营业场所/住所 - legalPerson：法人/负责人 - businessScope：经营范围 - registeredCapital：注册资本 - RegistrationDate：注册日期 - issueDate：发证日期 - validPeriod：营业期限 - validFromDate：格式化营业期限起始日期 - validToDate：格式化营业期限终止日期 - companyForm：组成形式 |
| BusinessLicense | 国际企业执照 | - 印度公司注册证字段： - certificateType：证件类型 - registrationNo：注册号 - legalName：法定名称 - tradeName：商号 - businessConstitution：商业类型 - businessAddress：地址 - liabilityDate：责任日期 - validFromDate：有效起始日期 - validToDate：有效终止日期 - registrationType：注册类型 - particularsOfApprovingAuthority：审批机关详情 - name：姓名 - designation：委任 - jurisdictionalOffice：管辖办事处 - issueDate：签发日期 - 韩国商业登记证字段： - certificateType：证件类型 - issuanceNo：发行号 - processingTime：处理时间 - companyNameEn：英文公司名称 - companyName：非英文公司名称 - registrationNo：商业注册号 - nameOfRepresentativeEn：英文法人姓名 - nameOfRepresentative：非英文法人姓名 - residentRegistrationNo：法人证件号 - businessAddressEn：英文商业地址 - businessAddress：非英文商业地址 - businessCommencementDate：商业起始时间 - businessRegistrationDate：商业注册时间 - businessTypeEn：英文商业类型 - businessType：非英文商业类型 - businessItemEn：英文经营范围 - businessItem：非英文经营范围 - jointCompanyName：联合企业名称 - jointCompanyRegistrationNo：联合企业注册号 - issueDate：签发日期 - issuer：签发人 |
| MedicalDeviceManageLicense | 医疗器械经营许可证 | - title：证照标题 - licenseNumber：许可证编号 - companyName：企业名称 - businessType：经营方式 - officeAddress：住所 - businessScope：经营范围 - businessAddress：经营场所 - warehouseAddress：库房/仓库地址 - issueDate：发证日期 - issueAuthority：发证部门 - legalRepresentative：法定代表人 - responsiblePerson：企业负责人 - qualityManager：质量管理人 - registeredAddress：注册地址 - validToDate：有效期限/许可期限 |
| MedicalDeviceProduceLicense | 医疗器械生产许可证 | - registeredAddress：注册地址 - issueDate：发证日期 - licenseNumber：许可证编号 - issueAuthority：发证部门 - legalRepresentative：法定代表人 - productionAddress：生产地址 - responsiblePerson：企业负责人 - companyName：企业名称 - validToDate：有效期限 - officeAddress：住所 - productionScope：生产范围 |
| CosmeticProduceLicense | 化妆品生产许可证 | - title：证照名称 - enterpriseName：企业名称 - creditCode：社会信用代码 - officeAddress：住址 - legalRepresentative：法定代表人 - responsiblePerson：企业负责人 - safetyManager：质量安全负责人 - productionAddress：生产地址 - licenceNumber：许可证编号 - licensedItemScope：许可项目 - regulatoryAuthority：日常监督管理机关 - regulatoryPersonnel：日常监督管理人员 - reportHotline：投诉举报电话 - issueOfficer：签发人 - issueAuthority：发证机关 - issueDate：发证日期 - validToDate：有效期至 - ftype：是否是复印件 |
| TaxiInvoice | 出租车发票 | - date：乘车日期 - dropOffTime：下车时间 - fare：金额 - invoiceCode：发票代码 - invoiceNumber：发票号码 - licensePlateNumber：车牌号 - mileage：里程 - pickUpTime：上车时间 |
| TrademarkCertificate | 商标注册证 | - validToDate：有效期至 - registeredAddress：注册人地址 - registrationDate：注册日期 - registrant：注册人 - approvedRightScope：核定使用商品/服务项目 - iprNumber：知识产权编号 - certificateNumber：编码 |
| FoodProduceLicense | 食品生产许可证 | - producerName：生产者名称 - creditCode：社会信用代码（身份证号码） - legalRepresentative：法定代表人（负责人） - officeAddress：住所 - productionAddress：生产地址 - foodType：食品类别 - licenceNumber：许可证编号 - regulatoryAuthority：日常监督管理机构 - regulatoryPersonnel：日常监督管理人员 - reportHotline：投诉举报电话 - issueAuthority：发证机关 - issueOfficer：签发人 - issueDate：签发日期 - validToDate：有效期至 |
| FoodManagementLicense | 食品经营许可证 | - operatorName：经营者名称 - creditCode：社会信用代码（身份证号码） - legalRepresentative：法定代表人（负责人） - officeAddress：住所 - businessAddress：经营场所 - mainBusiness：主体业态 - businessScope：经营项目 - licenceNumber：许可证编号 - regulatoryAuthority：日常监督管理机构 - regulatoryPersonnel：日常监督管理人员 - reportHotline：投诉举报电话 - issueAuthority：发证机关 - issueOfficer：签发人 - issueDate：签发日期 - standardizedIssueDate：格式化签发日期 - validToDate：有效期至 - standardizedValidToDate：格式化有效期至 |
| ClassIIMedicalDeviceManageLicense | 第二类医疗器械经营备案凭证 | - recordNumber：备案编号 - companyName：企业名称 - officeAddress：住所 - businessAddress：经营场所 - warehouseAddress：库房地址 - businessType：经营方式 - legalRepresentative：法定代表人 - responsiblePerson：企业负责人 - businessScope：经营范围 - recordationAuthority：备案部门 - recordationDate：备案日期 |
| WayBill | 电子面单 | - recipientName：收件人姓名 - senderAddress：寄件人姓名 - senderPhoneNumber：寄件人电话 - senderAddress：寄件人地址 - recipientPhoneNumber：收件人电话 - recipientAddress：收件人地址 |
| BankAccountPermit | 银行开户许可证 | - bankAccount：账号 - legalRepresentative：法定代表人 - depositaryBank：开户银行 - approvalNumber：核准号 - customerName：名称 - permitNumber：编号 - title：标题 |

## 示例

正常返回示例

`JSON`格式

```
{
  "RequestId": "E2A98925-DC2C-18FB-995F-BAF507XXXXXX",
  "Data": {
    "Height": 2000,
    "Width": 1000,
    "Content": "\"合同编号...\"",
    "SubImageCount": 2,
    "SubImages": [
      {
        "SubImageId": 0,
        "Type": "身份证正面",
        "Angle": 0,
        "SubImagePoints": [
          {
            "X": 100,
            "Y": 200
          }
        ],
        "SubImageRect": {
          "CenterX": 100,
          "CenterY": 200,
          "Width": 1000,
          "Height": 2000
        },
        "KvInfo": {
          "KvCount": 6,
          "Data": "{\n  \"address\": \"XX省XX市XX街道XX号\",\n  \"ethnicity\": \"汉\",\n  \"sex\": \"男\",\n  \"name\": \"王XX\",\n  \"idNumber\": \"XXX\",\n  \"birthDate\": \"2000年1月1日\"\n}",
          "KvDetails": {
            "key": {
              "KeyName": "\"address\"",
              "KeyConfidence": 100,
              "Value": "\"XX省XX市XX街道\"",
              "ValueConfidence": 98,
              "ValuePoints": [
                {
                  "X": 100,
                  "Y": 200
                }
              ],
              "ValueRect": {
                "CenterX": 100,
                "CenterY": 200,
                "Width": 50,
                "Height": 50
              },
              "ValueAngle": 0
            }
          }
        },
        "BlockInfo": {
          "BlockCount": 12,
          "BlockDetails": [
            {
              "BlockId": 0,
              "BlockAngle": 0,
              "BlockContent": "“合同编号...”",
              "BlockConfidence": 98,
              "BlockPoints": [
                {
                  "X": 100,
                  "Y": 200
                }
              ],
              "BlockRect": {
                "CenterX": 100,
                "CenterY": 200,
                "Width": 50,
                "Height": 10
              },
              "CharInfos": [
                {
                  "CharId": 0,
                  "CharContent": "“合”",
                  "CharConfidence": 95,
                  "CharPoints": [
                    {
                      "X": 100,
                      "Y": 200
                    }
                  ],
                  "CharRect": {
                    "CenterX": 100,
                    "CenterY": 200,
                    "Width": 10,
                    "Height": 10
                  }
                }
              ]
            }
          ]
        },
        "TableInfo": {
          "TableCount": 2,
          "TableDetails": [
            {
              "TableId": 0,
              "RowCount": 10,
              "ColumnCount": 3,
              "CellCount": 29,
              "Header": {
                "Contents": [
                  "\"12.1本合同当事人\""
                ],
                "BlockId": 0
              },
              "Footer": {
                "Contents": [
                  "\"贷款人/抵押权人（盖章/电子签章）：\""
                ],
                "BlockId": 0
              },
              "CellDetails": [
                {
                  "CellId": 0,
                  "CellContent": "\"借款人/抵押人：\"",
                  "RowStart": 0,
                  "RowEnd": 0,
                  "ColumnStart": 2,
                  "ColumnEnd": 5,
                  "BlockList": [
                    0
                  ],
                  "CellPoints": [
                    {
                      "X": 100,
                      "Y": 200
                    }
                  ],
                  "CellRect": {
                    "CenterX": 100,
                    "CenterY": 200,
                    "Width": 20,
                    "Height": 20
                  },
                  "CellAngle": 0
                }
              ],
              "TablePoints": [
                {
                  "X": 100,
                  "Y": 200
                }
              ],
              "TableRect": {
                "CenterX": 100,
                "CenterY": 200,
                "Width": 100,
                "Height": 100
              }
            }
          ],
          "TableExcel": "https://example.xlsx",
          "TableHtml": "https://example.html"
        },
        "RowInfo": {
          "RowCount": 9,
          "RowDetails": [
            {
              "RowId": 0,
              "RowContent": "“合同编号...\"",
              "BlockList": [
                0
              ]
            }
          ]
        },
        "ParagraphInfo": {
          "ParagraphCount": 11,
          "ParagraphDetails": [
            {
              "ParagraphId": 0,
              "ParagraphContent": "“合同编号...”",
              "BlockList": [
                0
              ]
            }
          ]
        },
        "QrCodeInfo": {
          "QrCodeCount": 1,
          "QrCodeDetails": [
            {
              "Data": "“http://www.gsxt.gov.cn/indeXXX”",
              "QrCodePoints": [
                {
                  "X": 100,
                  "Y": 200
                }
              ],
              "QrCodeRect": {
                "CenterX": 100,
                "CenterY": 200,
                "Width": 100,
                "Height": 100
              },
              "QrCodeAngle": 0
            }
          ]
        },
        "BarCodeInfo": {
          "BarCodeCount": 2,
          "BarCodeDetails": [
            {
              "Type": "Code128",
              "Data": "\"1100011XXXXXX\"",
              "BarCodePoints": [
                {
                  "X": 100,
                  "Y": 200
                }
              ],
              "BarCodeRect": {
                "CenterX": 100,
                "CenterY": 200,
                "Width": 100,
                "Height": 10
              },
              "BarCodeAngle": 0
            }
          ]
        },
        "FigureInfo": {
          "key": {
            "FigureCount": 3,
            "FigureDetails": [
              {
                "Type": "face",
                "Data": "“”",
                "FigurePoints": [
                  {
                    "X": 100,
                    "Y": 200
                  }
                ],
                "FigureRect": {
                  "CenterX": 100,
                  "CenterY": 200,
                  "Width": 50,
                  "Height": 50
                },
                "FigureAngle": 0
              }
            ]
          }
        },
        "StampInfo": {
          "StampCount": 2,
          "StampDetails": [
            {
              "Data": {
                "CompanyId": "\"XXX\"",
                "OrganizationName": "\"XXX贸易有限公司\"",
                "AntiFakeCode": "\"3205823XXXXXX\"",
                "OtherText": "\"3205823XXXXXX\"",
                "TopText": "\"XXX贸易有限公司\"",
                "OrganizationNameEng": "\"\"",
                "TaxpayerId": "\"\""
              },
              "StampPoints": [
                {
                  "X": 100,
                  "Y": 200
                }
              ],
              "StampRect": {
                "CenterX": 100,
                "CenterY": 200,
                "Width": 50,
                "Height": 50
              },
              "StampAngle": 0
            }
          ]
        },
        "QualityInfo": {
          "IsCopy": false,
          "IsReshoot": false,
          "CompletenessScore": 90.5,
          "QualityScore": 80.5,
          "TamperScore": 10.5
        }
      }
    ],
    "XmlResult": "\"\"",
    "AlgoVersion": "\"\"",
    "DebugInfo": "\"\"",
    "AlgoServer": [
      "\"\""
    ],
    "IsMixedMode": false,
    "PageNo": 1,
    "KvExcelUrl": "https://example.xlsx"
  },
  "Code": "400",
  "Message": "illegalImageUrl"
}
```

## 错误码

| **HTTP status code** | **错误码** | **错误信息** | **描述** |
| --- | --- | --- | --- |
| 400 | invalidInputParameter | %s  |     |
| 400 | InvalidCountry | Specified parameter Country is not valid. | 不支持的国家。 |

访问[错误中心](https://api.aliyun.com/document/ocr-api/2021-07-07/errorCode)查看更多错误码。

## **变更历史**

更多信息，参考[变更详情](https://api.aliyun.com/document/ocr-api/2021-07-07/RecognizeAllText#workbench-doc-change-demo)。