import componentSetting from '/@/settings/componentSetting'

const {
  table: {
    pagination: { pageSize, pageSizes, small, layout, background },
    fetchSetting,
  },
} = componentSetting

export const DEFAULT_PAGE_SIZE = pageSize

export const DEFAULT_PAGE_SIZES_OPTIONS = pageSizes

export const DEFAULT_PAGE_SMALL = small

export const DEFAULT_PAGE_BG = background

export const DEFAULT_PAGE_LAYOUT = layout

export const FETCH_SETTING = fetchSetting
