import bus from '../../common/bus'
import { VXETable } from 'vxe-table'
import {error} from '../error'
// 检查数据
export function checkData (ref) {
  const { insertRecords, removeRecords, updateRecords } = ref.getRecordset()
  const value = insertRecords.length === 0 && removeRecords.length === 0 && updateRecords.length === 0
  bus.$emit('checkDataEvent', value)
}
// 插入新行
export function insertEvent (ref, record) {
  ref.insertAt(record, -1).then(() => {})
}
// 移除数据
export async function removeEvent (ref) {
  const selectRecords = ref.getCheckboxRecords()
  if (selectRecords.length) {
    const type = await VXETable.modal.confirm('您确定要删除选中的数据吗?')
    if (type === 'confirm') {
      await ref.removeCheckboxRow()
    }
  } else {
    await VXETable.modal.message({ content: '请至少选择一条数据', status: 'error' })
  }
}
// 还原数据
export async function revertEvent (ref) {
  const type = await VXETable.modal.confirm('您确定要还原数据吗?')
  if (type === 'confirm') {
    ref.revertData()
  }
}
// 校验数据
async function fullValidEvent (ref) {
  const errMap = await ref.fullValidate().catch(errMap => errMap)
  if (errMap) {
    const msgList = []
    Object.values(errMap).forEach(errList => {
      errList.forEach(params => {
        const { rowIndex, column, rules } = params
        rules.forEach(rule => {
          msgList.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
        })
      })
    })
    VXETable.modal.message({
      status: 'error',
      slots: {
        default () {
          return [
            <div class="red" style="max-height: 400px;overflow: auto;">
              {
                msgList.map(msg => <div>{msg}</div>)
              }
            </div>
          ]
        }
      }
    }).then(() => {})
  }
  return errMap
}
// 创建新表
export async function saveAdd (ref, tableForm) {
  if (tableForm.db_name === '' || tableForm.tb_name === '') {
    return this.$alert('请输入数据库和表名', '警告', {confirmButtonText: '确定', callback: () => {}})
  }
  const { insertRecords, removeRecords, updateRecords } = ref.getRecordset()
  const Saved = insertRecords.length === 0 && removeRecords.length === 0 && updateRecords.length === 0
  if (Saved) {
    return this.$alert('请输入数据', '警告', {confirmButtonText: '确定', callback: () => {}})
  }
  if (await fullValidEvent(ref)) {
    return
  }
  let data = {
    db_name: tableForm.db_name,
    tb_name: tableForm.tb_name,
    column: insertRecords
  }
  try {
    const res = await this.$http.post('/api/tb/add', data)
    console.log(res.data.data)
    if (res.data.code !== 200) {
      error(res.data.msg)
    } else {
      this.$message.success(res.data.msg)
      bus.$emit('setShowTbFormEvent', false)
      ref.reloadData(res.data.data)
    }
  } catch (e) {
    error(e.message)
  }
}
// 修改表
export function saveEdit (ref, tableForm) {
  const { insertRecords, removeRecords, updateRecords } = ref.getRecordset()
  const Saved = insertRecords.length === 0 && removeRecords.length === 0 && updateRecords.length === 0
  if (Saved) {
    return this.$alert('请输入数据', '警告', {confirmButtonText: '确定', callback: () => {}})
  }
  ref.reloadData(this.tableData)
}
