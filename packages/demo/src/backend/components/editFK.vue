<template>
    <div>
        <vxe-toolbar perfect>
            <template #buttons>
                <vxe-button icon="fa fa-plus" status="perfect" @click="insertEvent($refs.editFkTable)">新增</vxe-button>
                <vxe-button icon="fa fa-trash-o" status="perfect" @click="removeEvent($refs.editFkTable)">移除</vxe-button>
                <vxe-button icon="fa fa-save" status="perfect" @click="saveEvent($refs.editFkTable)">保存</vxe-button>
                <vxe-button icon="fa fa-mail-reply" status="perfect" @click="revertEvent($refs.editFkTable)">还原</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            ref="editFkTable"
            border
            resizable
            keep-source
            show-overflow
            :data="tableData"
            :edit-config="{trigger: 'click', mode: 'cell',showStatus: true}"
            size="mini"
        >
            <vxe-column type="checkbox" width="60"></vxe-column>
            <vxe-column type="seq" width="60"></vxe-column>
            <vxe-column field="fk" title="建立外键字段" :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #default="{ row }">
                    <span>{{ row.fk }}</span>
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.fk" transfer>
                        <vxe-option v-for="item in fkList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-column>
            <vxe-column field="table" title="被参照表" :edit-render="{}">
                <template #default="{ row }">
                    <span>{{ row.table }}</span>
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.table" transfer>
                        <vxe-option v-for="item in tableList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-column>
            <vxe-column field="field" title="被参照字段" :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #default="{ row }">
                    <span>{{ row.field }}</span>
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.field" transfer>
                        <vxe-option v-for="item in fieldList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-column>
            <vxe-column field="type" title="类型" :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #default="{ row }">
                    <span>{{ row.type }}</span>
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.type" transfer>
                        <vxe-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>

<script>

    import { insertEvent } from '../commonFunction/insertEvent';
    import { removeEvent } from '../commonFunction/removeEvent';
    import { revertEvent } from '../commonFunction/revertEvent';
    import { saveEdit } from '../commonFunction/saveEdit';
    import { checkData } from '../commonFunction/checkData';

    export default {
        name: 'EditFk',
        props: {
            saveEvent: {
                type: Function,
                default: saveEdit
            },
            tableName: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                Save: true,
                newLine: {
                    fk: '', table: '', field: '', type: ''
                },
                fkList: [],
                tableList: [],
                typeList: [],
                tableData: []
            };
        },
        methods: {
            insertEvent,
            removeEvent,
            revertEvent,
            checkSave() {
                checkData(this.$refs.editFkTable);
            },
            formatType(value) {
                switch (value) {
                case 'unique':
                    return '唯一索引';
                case 'numeric':
                    return '小数';
                case 'varchar':
                    return '字符串';
                default:
                    return '';
                }
            },
        }
    };
</script>

<style scoped>

</style>
