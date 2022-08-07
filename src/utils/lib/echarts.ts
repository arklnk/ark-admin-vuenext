// https://echarts.apache.org/zh/api.html#echarts.use
import * as echarts from 'echarts/core'

/**
 * svg vs canvas
 * https://echarts.apache.org/handbook/zh/best-practices/canvas-vs-svg
 */
import { SVGRenderer } from 'echarts/renderers'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// 注册必须的组件
echarts.use([SVGRenderer])

export default echarts
