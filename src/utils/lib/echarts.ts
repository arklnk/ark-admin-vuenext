// https://echarts.apache.org/zh/api.html#echarts.use
import * as echarts from 'echarts/core'

/**
 * svg vs canvas
 * https://echarts.apache.org/handbook/zh/best-practices/canvas-vs-svg
 */
import { SVGRenderer } from 'echarts/renderers'

// 组件
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  PolarComponent,
  DatasetComponent,
  VisualMapComponent,
  TransformComponent,
  GridComponent,
  CalendarComponent,
  DataZoomComponent,
  TimelineComponent,
  AriaComponent,
  AxisPointerComponent,
} from 'echarts/components'

// 图表
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  MapChart,
  PictorialBarChart,
} from 'echarts/charts'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// 注册必须的组件
echarts.use([
  // render
  SVGRenderer,

  // component
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  PolarComponent,
  DatasetComponent,
  VisualMapComponent,
  TransformComponent,
  GridComponent,
  CalendarComponent,
  DataZoomComponent,
  TimelineComponent,
  AriaComponent,
  AxisPointerComponent,

  // charts
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  MapChart,
  PictorialBarChart,
])

export default echarts
