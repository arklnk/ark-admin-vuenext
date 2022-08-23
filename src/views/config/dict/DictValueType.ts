import { t } from '/@/composables/core/useTransl'

// 1文本 2数字 3数组 4单选 5多选 6下拉 7日期 8时间 9单图 10多图 11单文件 12多文件
export const DictValueTypes: LabelValueOptions = [
  {
    label: t('views.config.dict.editform.valueTypeText'),
    value: 1,
  },
  {
    label: t('views.config.dict.editform.valueTypeNumber'),
    value: 2,
  },
  {
    label: t('views.config.dict.editform.valueTypeArray'),
    value: 3,
  },
  {
    label: t('views.config.dict.editform.valueTypeRadio'),
    value: 4,
  },
  {
    label: t('views.config.dict.editform.valueTypeCheckbox'),
    value: 5,
  },
  {
    label: t('views.config.dict.editform.valueTypeSelect'),
    value: 6,
  },
  {
    label: t('views.config.dict.editform.valueTypeDate'),
    value: 7,
  },
  {
    label: t('views.config.dict.editform.valueTypeDatetime'),
    value: 8,
  },
  {
    label: t('views.config.dict.editform.valueTypeSingleImage'),
    value: 9,
  },
  {
    label: t('views.config.dict.editform.valueTypeMultipleImage'),
    value: 10,
  },
  {
    label: t('views.config.dict.editform.valueTypeSingleFile'),
    value: 11,
  },
  {
    label: t('views.config.dict.editform.valueTypeMultipleFile'),
    value: 12,
  },
]
