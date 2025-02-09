<template>
    <div>
        <vxe-toolbar perfect>
            <template #buttons>
                <vxe-button icon="fa fa-plus" status="perfect" @click="insertEvent($refs.editFieldTable, tableName)">新增</vxe-button>
                <vxe-button icon="fa fa-trash-o" status="perfect" @click="removeEvent($refs.editFieldTable, tableName)">移除</vxe-button>
                <vxe-button icon="fa fa-save" status="perfect" @click="saveEvent($refs.editFieldTable, tableName)">保存</vxe-button>
                <vxe-button icon="fa fa-mail-reply" status="perfect" @click="revertEvent($refs.editFieldTable, tableName)">还原</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="editFieldTable"
            border
            resizable
            keep-source
            show-overflow
            :data="tableData"
            :edit-config="{trigger: 'click', mode: 'cell',showStatus: true}"
            size="mini"
            @edit-actived="editActiveEvent"
        >
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column type="seq" width="60"></vxe-column>
            <vxe-column field="name" title="字段名称" :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #edit="{ row }">
                    <vxe-input v-model="row.name" type="text"></vxe-input>
                </template>
            </vxe-column>
            <vxe-column field="type" title="字段类型" :edit-render="{}">
                <template #default="{ row }">
                    <span>{{ formatType(row.type) }}</span>
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.type" transfer>
                        <vxe-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-column>
            <vxe-column field="length" title="字段长度" :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #edit="{ row }">
                    <vxe-input v-model.number="row.length" type="text"></vxe-input>
                </template>
            </vxe-column>
            <vxe-column field="place" title="小数位数" :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #edit="{ row }">
                    <vxe-input v-model.number="row.place" type="text" :disabled="placeDisabled"></vxe-input>
                </template>
            </vxe-column>
            <vxe-column field="pk" title="主键" :edit-render="{}">
                <template #edit="{ row }">
                    <vxe-checkbox v-model="row.pk"></vxe-checkbox>
                </template>
            </vxe-column>
            <vxe-column field="notNull" title="非空" :edit-render="{}">
                <template #edit="{ row }">
                    <vxe-checkbox v-model="row.notNull"></vxe-checkbox>
                </template>
            </vxe-column>
            <vxe-column field="unique" title="唯一" :edit-render="{}">
                <template #edit="{ row }">
                    <vxe-checkbox v-model="row.unique"></vxe-checkbox>
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>

<script>

    import { insertEvent } from '../commonFunction/insertEvent';
    import { removeEvent } from '../commonFunction/removeEvent';
    import { revertEvent } from '../commonFunction/revertEvent';
    import { checkData } from '../commonFunction/checkData';

    export default {
        name: 'EditField',
        props: {
            saveEvent: {
                type: Function,
                default() {}
            },
            currentTable: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                newLine: {
                    name: '', type: '', length: '', place: '', pk: false, notNull: false, unique: false
                },
                tableName: '',
                tableData: [],
                placeDisabled: true,
                options: [
                    { label: '整数', value: 'int' },
                    { label: '小数', value: 'numeric' },
                    { label: '字符串', value: 'varchar' },
                    { label: '日期', value: 'date' },
                    { label: '时间', value: 'time' },
                    { label: '日期时间', value: 'datetime' },
                    { label: '文件', value: 'char' },
                ],
            };
        },
        watch: {
            currentTable: {
                handler(newValue, oldValue) {
                    this.tableName = newValue;
                },
                immediate: true
            }
        },
        methods: {
            insertEvent,
            removeEvent,
            revertEvent,
            editActiveEvent({ row }) {
                this.placeDisabled = row.type !== 'numeric';
            },
            checkSave() {
                checkData(this.$refs.editFieldTable);
            },
            formatType(value) {
                switch (value) {
                case 'int':
                    return '整数';
                case 'numeric':
                    return '小数';
                case 'varchar':
                    return '字符串';
                case 'date':
                    return '日期';
                case 'time':
                    return '时间';
                case 'datetime':
                    return '日期时间';
                default:
                    return '';
                }
            },
        }
    };
</script>

<style scoped>

</style>
