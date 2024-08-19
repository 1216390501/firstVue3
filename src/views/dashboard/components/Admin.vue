<template>
  <div class="app-container center">
    <div class="table-with-button">
      <!-- 添加按钮 -->
      <div class="button-group">
        <!-- <el-button type="primary" @click="addRow">添加一行</el-button> -->
        <!-- <el-button type="primary" @click="getprodschedul">测试接口按钮</el-button>
        <el-button type="primary" @click="getprodschedul2">测试接口按钮</el-button> -->
        <div class="main">
          <label class="mainclass">机台</label>
          <el-select v-model="selectedMachine" placeholder="请选择机台" @change="datachange">
            <el-option v-for="item in machineOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <label class="mainclass">订单类型</label>
          <el-select v-model="selectedddlx" placeholder="订单类型" @change="datachange">
            <el-option v-for="item in ddOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <label class="mainclass">生产车间</label>
          <el-select v-model="selectedsccj" placeholder="生产车间" @change="datachange">
            <el-option v-for="item in sccjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <label class="mainclass">排产工序</label>
          <el-input v-model="selectedpcgx" placeholder="请输入排产工序" />
        </div>
      </div>

      <!-- 显示响应数据 -->
      <el-table :data="orderList" style="width: 100%; margin-top: 5px">
        <el-table-column prop="priority" label="优先级" width="40" />

        <el-table-column prop="orderCode" label="生产订单编码" width="180" />
        <el-table-column prop="processPlanNo" label="工序计划号" width="130" />
        <el-table-column prop="customerName" label="客户简称" />
        <!-- <el-table-column prop="businessDepartment" label="业务部门" /> -->
        <el-table-column prop="salesperson" label="业务员" width="70" />
        <el-table-column prop="materialCode" label="物料编号" width="135" />
        <el-table-column prop="materialName" label="物料名称" width="135" />
        <el-table-column prop="width" label="门幅" width="60" />
        <el-table-column prop="patternNumber" label="花号" width="105" />
        <el-table-column prop="patternDescription" label="花型描述" width="135" />
        <!-- 花型图片列 -->
        <el-table-column prop="patternImage" label="花型图片" width="100">
          <template #default="{ row }">
            <img
              :src="row.patternImage"
              alt="Pattern Image"
              style="max-width: 50px; max-height: 50px"
              @click="showModal(row.patternImage)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="colorist" label="调色员" width="70" />
        <el-table-column prop="HJ" label="货架" width="70" />
        <el-table-column prop="needqty" label="需要排产数量" width="60" />
        <el-table-column prop="qualiqty" label="合格数量" width="60" />

        <el-table-column prop="processqty" label="工序数量" width="60" />

        <el-table-column fixed="right" label="操作">
          <template #default="{ row, $index }">
            <el-button type="text" size="small" @click="setStatusRow(row, $index)">完工</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog v-model="dialogVisible" title="查看图片" :width="dialogWidth" :height="dialogHeight">
        <img :src="dialogImageUrl" alt="Enlarged Image" class="enlarged-image" />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import * as springApi from "@/api/springApi/index"
import Swal from "sweetalert2"

// 用于存储定时器ID
let intervalId: any

// 在组件挂载时调用获取设备列表
onMounted(() => {
  fetchMachineEquitList()
  intervalId = setInterval(
    () => {
      fetchProductionData(selectedMachine.value, selectedddlx.value, selectedsccj.value, selectedpcgx.value)
    },
    10 * 60 * 1000
  ) // 每隔10分钟执行一次
})

// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(intervalId)
})

// 值改变事件
function datachange() {
  fetchProductionData(selectedMachine.value, selectedddlx.value, selectedsccj.value, selectedpcgx.value)
  console.log("selectedMachine.value:", selectedMachine.value)

  // 这里可以根据需要实现过滤逻辑
  // 例如：orderList.value = orderList.value.filter(row => row.machine === selectedMachine.value);
}

// 设置状态，一行数据
async function setStatusRow(row: OrderItem, index: number) {
  try {
    const response = await springApi.setOperStatusApi({
      operDetailId: row.FDetailID,
      operPkId: row.Fid,
      operationNumber: "ToFinish"
    })

    if (response.data === "true") {
      orderList.value.splice(index, 1)
      Swal.fire({
        icon: "success",
        title: "状态转换成功！",
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "状态转换失败！",
        text: "请检查您的操作或联系管理员。",
        confirmButtonText: "确定"
      })
    }
  } catch (error) {
    console.error("Failed to set operation status:", error)
    Swal.fire({
      icon: "error",
      title: "状态转换失败！",
      text: "发生了一个错误，请稍后再试。",
      confirmButtonText: "确定"
    })
  }
}
// // 测试接口按钮的操作
// function getprodschedul() {
//   Swal.fire({
//     icon: "success",
//     title: "状态转换成功！",
//     showConfirmButton: false,
//     timer: 1500
//   })
//   // console.log("机台:", selectedMachine.value)
//   // console.log("订单类型:", selectedddlx.value)
//   // console.log("生产车间:", selectedsccj.value)
//   // console.log("排产工序:", selectedpcgx.value)
// }

// function getprodschedul2() {
//   Swal.fire({
//     icon: "error",
//     title: "状态转换失败！",
//     text: "请检查您的操作或联系管理员。",
//     confirmButtonText: "确定"
//   })
//   // console.log("测试接口按钮：" + machineOptions.value)
//   // console.log("测试接口按钮：" + selectedMachine.value)
// }

// 机器设备选项
const machineOptions = ref<{ value: string; label: string }[]>([])
const selectedMachine = ref("")
const fetchMachineEquitList = async () => {
  try {
    const { data } = await springApi.getequitApi()
    machineOptions.value = data.map(([label, value]) => ({ value, label }))
    if (machineOptions.value.length > 0) {
      selectedMachine.value = machineOptions.value[0].value
    }
    console.log("Material data:", data)
  } catch (error) {
    console.error("Failed to fetch material data:", error)
  }
}

type ProductionDataItem = [
  string, // FBillNo
  string, // FMONumber
  string, // FEquipmentNo
  string, // FOperNumber
  string, // KHJC
  string, // BM
  string, // XSY
  string, // FProductId
  string, // FProductName
  string, // YXMF
  string, // HH
  string, // HXMS
  number, // Qty
  string, // QualiQty
  string, // processqty
  string, // picBase64
  string, // HJ
  string, // Fid
  string // FDetailID
]
// 定义 fetchProductionData 方法
const fetchProductionData = async (equit: string, ddlx: string, sccj: string, pcgx: string) => {
  try {
    const result = await springApi.getentryApi(equit, ddlx, sccj, pcgx) // 假设这是你API的调用方式
    console.log("Entry data:", result)
    // 格式化数据
    const formattedData: OrderItem[] = result.data.map(
      (
        [
          FBillNo,
          FMONumber,
          FEquipmentNo,
          FOperNumber,
          KHJC,
          BM,
          XSY,
          FProductId,
          FProductName,
          YXMF,
          HH,
          HXMS,
          Qty,
          QualiQty,
          processqty,
          picBase64,
          HJ, //货架
          Fid,
          FDetailID
        ]: ProductionDataItem,
        index: number
      ) => ({
        priority: index + 1, // 默认优先级
        orderCode: FMONumber, // 假设订单编码与物料编码相关
        processPlanNo: FBillNo || "无计划单号", // 如果 FBillNo 未定义，则使用 '无计划单号'
        customerName: KHJC, // 客户简称
        // businessDepartment: BM || "未知部门", // 如果 DepartmentNo 未定义，则使用 '未知部门'
        salesperson: XSY, // 示例数据
        materialCode: FProductId, // 示例数据
        materialName: FProductName, // 示例数据
        width: YXMF, // 示例数据
        patternNumber: HH, // 假设花号与物料编码相关
        patternDescription: HXMS, // 假设花型描述与物料名称相同，这里直接使用了 materialName 的值 "123"
        patternImage: picBase64, // 示例数据
        colorist: " ", // 示例数据
        needqty: Qty,
        qualiqty: QualiQty,
        processqty: processqty,
        HJ: HJ,
        Fid: Fid,
        FDetailID: FDetailID,
        FEquipmentNo: FEquipmentNo,
        FOperNumber: FOperNumber,
        BM: BM
      })
    )

    // 清空表格数据
    orderList.value = []

    // 将格式化后的数据添加到表格
    orderList.value = formattedData

    console.log("Production data:", formattedData)
  } catch (error) {
    console.error("Failed to fetch production data:", error)
    // 清空表格数据
    orderList.value = []
  }
}
// 定义 OrderItem 类型
type OrderItem = {
  priority: number
  orderCode: string
  processPlanNo: string
  customerName: string
  // businessDepartment: string
  salesperson: string
  materialCode: string
  materialName: string
  width: string
  patternNumber: string
  patternDescription: string
  patternImage: string
  colorist: string
  needqty: Number
  qualiqty: string
  processqty: string
  HJ: string
  Fid: string
  FDetailID: string
  FEquipmentNo: string
  FOperNumber: string
  BM: string
}
// 数据列表
const orderList = ref<OrderItem[]>([])
// 模态框相关
const dialogVisible = ref(false)
const dialogImageUrl = ref("")
const dialogWidth = ref("auto")
const dialogHeight = ref("auto")

// 显示模态框并设置图片 URL
function showModal(imageUrl: string) {
  dialogImageUrl.value = imageUrl
  dialogVisible.value = true
  adjustDialogSize()
}
// 调整模态框尺寸以适应图片
function adjustDialogSize() {
  const imgElement = document.querySelector(".enlarged-image") as HTMLImageElement
  if (imgElement) {
    const naturalWidth = imgElement.naturalWidth
    const naturalHeight = imgElement.naturalHeight

    // 计算合适的宽度和高度
    let width = naturalWidth
    let height = naturalHeight

    // 限制宽度不超过屏幕宽度的90%
    if (width > window.innerWidth * 0.9) {
      width = window.innerWidth * 0.9
      height = (height / naturalWidth) * width
    }

    // 限制高度不超过屏幕高度的90%
    if (height > window.innerHeight * 0.9) {
      height = window.innerHeight * 0.9
      width = (width / naturalHeight) * height
    }

    dialogWidth.value = `${width}px`
    dialogHeight.value = `${height}px`
  }
}
// 在模态框打开时调整尺寸
// watch(dialogVisible, (newValue) => {
//   if (newValue) {
//     adjustDialogSize()
//   }
// })

// 排产工序和生产车间选项
const selectedpcgx = ref("喷印")
const sccjOptions = ref([
  { value: "027077", label: "生产-调色喷印部" },
  { value: "020087", label: "丝科真彩事业部" },
  { value: "020072", label: "丝科-四维事业部" },
  { value: "020071", label: "丝科口罩采购部" }
])
const ddOptions = ref([
  { value: "A", label: "大货单" },
  { value: "B", label: "打样单" }
])
const selectedsccj = ref("027077")
const selectedddlx = ref("A")
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100%;
}

.table-with-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;
}
/* 设置 el-select 的内边距和外边距 */
.main {
  display: flex;
  flex-wrap: nowrap; /* 不允许换行 */
  gap: 8px; /* 间距 */
  padding: 8px 12px; /* 内边距 */
  margin: 5px 0; /* 外边距 */
  width: 200%;
}

.mainclass {
  width: 50%;
  text-align: right; /* 让标签右对齐 */
  font-size: 14px; /* 标签字体大小 */
  line-height: 32px; /* 与选择框对齐 */
}
.enlarged-image {
  max-width: 100%;
  height: auto;
}
/* 使用Flexbox布局来确保模态框居中显示 */
.el-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
