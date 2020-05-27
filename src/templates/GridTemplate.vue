<template>
    <div>
        <table class="table-auto w-full bg-white border-l border-r">
            <thead>
            <tr>
                <th v-if="value.length === 0">
                    <h4 class="p-8">데이터가 없습니다.</h4>
                </th>
                <th v-if="!hiddenChecker" class="px-2 py-2 border-b">
                    <ev-check-box type="checkbox" v-model="toggleAll"/>
                </th>
                <th v-for="head in getColumns " class="px-2 py-2 border-b">
                    <div class="flex items-center justify-around">
                        <slot :name="'header:'+head" :head="head">{{ getHead(head) }}</slot>
                        <span v-if="isSortableHead(head)" class="flex flex-col text-sm border rounded">
                            <i @click="setSortQuery(head, 'asc')" class="fa fa-arrow-up hover:bg-gray-100 border-b p-1" style="width: 22px; height : 22px"></i>
                            <i @click="setSortQuery(head, 'desc')" class="fa fa-arrow-down hover:bg-gray-100 p-1" style="width: 22px; height : 22px" ></i>
                        </span>
                    </div>
                </th>
                <th v-if="hasActionSlot" class="px-2 py-2 border-b"> @</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(item, idx) in value">
                <tr :class="getRowClasses(value[idx])">
                    <td class="border-b px-2 py-2 text-14" v-if="!noChecker"
                        :style="(Object.keys(fieldWidth).length) ? {width : '40px'} : {} ">
                        <ev-check-box type="checkbox" :value="value[idx]['__is_selected']" @input="toggle(idx)"/>
                    </td>
                    <template v-for="head in getColumns">
                        <td class="border-b px-2 py-2 text-14"
                            :style="(Object.keys(fieldWidth).includes(head)) ? {width : fieldWidth[head] + 'px'} : {} ">
                            <slot :name="'cell:'+head" :row="item" :field="head" :value="getCell(item, head)"
                                  :index="idx"
                                  :handler="(val)=>{ value[idx][head] = val; }">
                                <template v-if=" Object.keys(fieldType).includes(head) ">
                                    <ev-input v-if="fieldType[head] === 'input'" :auto-max="120"
                                              :value="getCell(item, head)" @input="(val)=>{updateCell(idx,head,val)}"/>
                                    <ev-datepicker v-if="fieldType[head] === 'datepicker'" v-model="value[idx][head]"/>
                                    <ev-textarea v-if="fieldType[head] === 'textarea'" :value="getCell(item, head)"
                                                 @input="(val)=>{updateCell(idx,head,val)}"/>
                                </template>
                                <template v-else>
                                    <ev-input v-if="cellType === 'input'" :value="getCell(item, head)"
                                              @input="(val)=>{updateCell(idx,head,val)}"/>
                                    <span v-if="cellType === 'value'"> {{ getCell(item, head )}} </span>
                                </template>
                            </slot>
                            <div v-if="hasErrorCell(item, head)" v-for="error in getErrorCell(item, head)"
                                 class="absolute p-2 shadow bg-white text-red-400 hover:opacity-75 z-10 ">{{error}}
                            </div>
                        </td>
                    </template>
                    <slot name="action" :index="idx" :item="item"></slot>
                </tr>
                <slot name="children" :index="idx" :item="item"></slot>
            </template>
            </tbody>
            <slot name="footer" v-if="footable">
                <tfoot>
                <tr class="border-t">
                    <td class="border px-2 py-2" v-if="!hiddenChecker">
                        &nbsp;
                    </td>
                    <template v-for="head in getColumns">
                        <td class="border px-2 py-2">
                            <slot :name="'foot:'+head" :field="head"></slot>
                        </td>
                    </template>
                </tr>
                </tfoot>
            </slot>
        </table>
        <slot name="controller" v-if="controlable">
            <div class="my-2 ml-4">
                <ev-button type="primary" @click="addBlank">
                    <i class="fa fa-plus"></i>
                </ev-button>
                <ev-button type="primary" @click="submit">
                    <i class="fa fa-pencil"></i>
                </ev-button>
                <ev-button type="primary" @click="destroy">
                    <i class="fa fa-trash"></i>
                </ev-button>
            </div>
        </slot>

        <slot name="pagination" v-if="pagination">
            <ev-pagination class="border p-2"
                           :total="getParentData.total"
                           :per-page="getParentData.perPage"
                           :value="getParentData.page"
                           @input="updatePage"
                           :scope="5"></ev-pagination>
        </slot>

    </div>
</template>

<script>
    export default {
        name: "GridTemplate",
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            /**
             * 그리드 삭제, 수정시 RESTful API 에 키값이 되는 컬럼명
             */
            primaryKey: {
                type: String,
                default: 'id'
            },
            /**
             * 데이터 중에 일부 필드만 보여 줍니다.
             */
            fieldLabels: {
                type: Object,
                default() {
                    return {};
                }
            },
            /**
             * 특정 컬럼에 datepicker 같은 특정 컨트롤 폼을 넣습니다.
             */
            fieldType: {
                type: Object,
                default() {
                    return {};
                }
            },
            /**
             * 보여주지 않을 컬럼을 제외 합니다.
             */
            excepts: {
                type: Array,
                default() {
                    return [];
                }
            },
            /**
             * 그리드 기본 셀 타입을 정합니다. inpput / value
             */
            cellType: {
                default: 'input'
            },
            /**
             * 셀의 기본 width
             */
            cellWidth: {
                default: 'auto'
            },
            /**
             * 셀렉트 row 를 axios submit 한 결과 값에 validate error 가 있는 경우 출력
             */
            errors: {
                default() {
                    return {}
                }
            },
            /**
             * 셀렉트 체크박스를 감춥니다.
             */
            noChecker: {
                type: Boolean,
                default: false
            },
            /**
             * 테이블 푸터 slot 을 생성합니다. 접근 방법은 v-slot:foot:컬럼명
             */
            footable: {
                type: Boolean,
                default: false
            },
            /**
             * 각 컬럼별 width 값을 지정합니다.
             */
            fieldWidth: {
                type: Object,
                default() {
                    return {}
                }, required: false
            },
            /**
             * 삭제, 수정, 신규생성 버튼 slot 을 보여 줍니다. ($parent 가 AxiosHelper 를 이용해야함)
             */
            controlable: {type: Boolean, default: false},
            /**
             * 페이지네이션을 보여줍니다. ($parent 가 AxiosHelper 를 이용해야함)
             */
            pagination: {type: Boolean, default: false},
            /**
             * AxiosHelper 가 지정된 컴포넌트가 바로 상위 $parent 가 아닌 경우, 찾아서 지정합니다.
             */
            parentData: {
                type: Object
            },
            // 조건에 따라 tr 클래스를 추가합니다.
            rowStyler: {
                type: Function,
                default: null,
                required: false
            },
            /**
             * 데이터를 재정렬하는 옵션을 엽니다. ($parent 가 AxiosHelper 를 이용해야함)
             */
            sortables: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                toggleAll: false,
                selectedItems: {}
            }
        },
        watch: {
            toggleAll(val) {
                if (val) {
                    this.value.map((item, idx) => {
                        this.setItemSelected(idx);
                    });
                } else {
                    this.value.map((item, idx) => {
                        item.__is_selected = false;
                    });
                }

            }
        },
        computed: {
            getParent(){
                if(this.parentData){
                    return this.parentData;
                }
                return this.$parent;
            },
            getColumns() {
                if (this.getItems.length === 0) {
                    return [];
                }

                if (Object.keys(this.fieldLabels).length > 0) {
                    return Object.keys(this.fieldLabels);
                }
                return Object.keys(this.getItems[0]);
            },
            getItems() {
                return this.value.map((item) => {
                    let availableKeys = Object.keys(item).filter(key => {
                        return !this.excepts.includes(key)
                    });

                    let data = {};
                    availableKeys.map(k => {
                        data[k] = item[k];
                    });

                    return data;
                });
            },
            hasActionSlot() {

                return this.$scopedSlots.hasOwnProperty('action') && this.value.length !== 0;
            },
            hiddenChecker() {
                return this.noChecker || this.value.length === 0
            },
            getParentData() {
                if (this.parentData) {
                    return this.parentData;
                } else {
                    return this.getParent.$data;
                }
            }
        },
        methods: {
            getColumnValueLength(head) {
                let values = this.getItems.map((item) => {
                    if (!item[head]) {
                        return 0;
                    }
                    if (typeof item[head] !== 'string') {
                        return item[head].toString().length;
                    }
                    return item[head].length;
                });
                return (Math.max(...values) * 8.5);
            },
            getInputStyle(head) {
                if (this.cellWidth !== 'auto') {
                    return {width: this.cellWidth}
                }
                let num = this.getColumnValueLength(head);
                if (!num) {
                    return {};
                }
                return {width: num + 52 + 'px'}
            },
            getHead(head) {
                if (this.fieldLabels.hasOwnProperty(head)) {
                    return this.fieldLabels[head];
                }
                return head;
            },
            getCell(item, head) {
                return item[head];
            },
            updateCell(index, head, value) {

                let temps = this.value;
                temps[index][head] = value;
                this.clearError(index, head);
                this.setItemSelected(index);
                this.$emit('input', temps);
            },
            clearError(index, head) {
                this.getParent.cleanError(this.getItems[index][this.primaryKey], head);
            },
            addBlank() {
                this.getParent.addBlankForm();
            },
            unsetItemSelected(idx) {
                this.$set(this.value[idx], '__is_selected', false);
            },
            setItemSelected(idx) {
                this.$set(this.value[idx], '__is_selected', true);
            },
            toggle(idx) {
                if (this.isSelectedRow(idx)) {
                    this.unsetItemSelected(idx);
                } else {
                    this.setItemSelected(idx);
                }
            },
            isSelectedRow(idx) {
                return this.value && this.value[idx] && this.value[idx].__is_selected;
            },
            hasErrorCell(item, head) {
                return item[this.primaryKey] && this.errors[item[this.primaryKey]] && this.errors[item[this.primaryKey]][head];
            },
            getErrorCell(item, head) {
                if (!this.hasErrorCell(item, head)) {
                    return [];
                }
                return this.errors[item[this.primaryKey]][head];
            },
            updatePage(val) {

                this.getParent.setPage(val);
            },
            hasChildren(value) {
                return false;
            },
            getRowClasses(row) {

                let classes = [];

                if (row['__is_selected']) {
                    classes.push(['bg-gray-100']);
                }

                if (this.rowStyler && typeof this.rowStyler === 'function') {
                    classes.push(this.rowStyler(row));
                }

                return classes;
            },
            setSortQuery(field, direction){
                this.getParent.query.sort = field
                this.getParent.query.order = direction;
                this.getParent.getItems();
            },
            isSortableHead(head) {
                return this.sortables.filter((sort)=>{
                    return head === sort;
                }).length > 0;
            },
            submit() {
                this.getParent.confirmSubmit();
            },
            destroy(){
                this.getParent.confirmDelete();
            }
        }
    }
</script>

