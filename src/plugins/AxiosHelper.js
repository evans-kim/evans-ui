import axios from './axios'
import _ from 'lodash'
/**
 * Axios 동기화 핼퍼 믹스
 */
export default {
    data() {
        return {
            /**
             * REST API Route
             */
            uri: '',
            primaryKey: 'id',
            primaryLabelKey: 'name',
            /**
             * Form Data 기본 구성
             */
            formParams: {},
            /**
             * 데이터
             */
            items: [],
            /**
             * crud 를 위해 선택된 데이터를
             */
            selectedItem: {},
            /**
             * 유효성 검사 에러
             */
            errors: {},
            /**
             * index queries 관
             */
            query: {
                page: 1
            },
            queryString: '',
            /**
             * 페이지 네이션
             */
            total: 0,

            page: 1,

            perPage: 15,

            response: {},
            process: {
                done: 0,
                percent: 0,
                show: false,
                total: 0
            },
            routeBinding: false,
            routeBindingFirst: false,
        }
    },
    watch: {
        checkRouteQuery(val, old) {
            if (!_.isEqual(val, old)) {
                this.bindingQueryFromRoute();
                this.getItems();
            }
        }
    },
    computed: {
        checkRouteQuery() {
            if (!this.$route) {
                return;
            }
            return this.$route.query;
        },
        /**
         * selectedItem 의 그룹
         */
        selectedItems() {
            return this.items.filter((item) => {
                return item.__is_selected;
            });
        },
        getUri() {
            return this.uri;
        },
        getPrimary() {
            return this.selectedItem[this.primaryKey];
        },
        getColumns() {
            if (this.items.length === 0) {
                return [];
            }
            return Object.keys(this.items[0]);
        },
        blankFrom() {
            let blank = {};
            let temp = this.items[0];
            this.getColumns.map(col => {
                let element = temp[col];
                if (Array.isArray(element)) {
                    return blank[col] = [];
                } else if (typeof element === 'object' && element !== null) {
                    blank[col] = {};
                } else if (typeof element === 'number') {
                    blank[col] = 0;
                } else if (typeof element === 'string') {
                    blank[col] = '';
                } else {
                    blank[col] = null;
                }
            });
            return blank;
        }
    },
    methods: {
        checkSelections() {
            if (this.selectedItems.length === 0) {
                this.$message.warning('선택된 데이터가 없습니다.');
                throw 'No selection error';
            }
        },
        bindingQueryFromRoute() {
            /**
             * 라우트의 쿼리값을 Axios 의 query 값과 바인딩 합니다.
             * 마운트에서 한번만 적용시킵니다. 라우트에서 지정된 그리드만 작동해야 합니다.
             */
            this.routeBinding = true;
            this.routeBindingFirst = false;

            if (
                this.$route && Object.keys(this.$route.query).length > 0
            ) {
                Object.keys(this.$route.query).map((key) => {
                    let notation = key.split(/\[|\]/g).filter(i => i).join('.');
                    this.setQuery(notation, this.$route.query[key]);
                });

                return true;
            }

            return false;
        },
        /**
         * 닷 노테이션으로 값을 가져 옵니다.
         * @param key
         * @param defaults
         */
        getQuery(key, defaults = undefined) {
            let fields = key.split('.');
            let value = undefined;
            if (fields.length > 1) {
                value = fields.reduce((pre, cur) => {
                    if (typeof pre === 'string') {
                        return this.query[pre];
                    }
                    if (typeof pre === 'object' && pre) {
                        return pre[cur];
                    }
                    if (typeof pre === 'undefined') {
                        return undefined;
                    }
                });
            }
            value = this.query[key];

            if (value === undefined && defaults !== undefined) {
                this.setQuery(key, defaults);
                return this.getQuery(key);
            }

            return value;
        },
        /**
         * 점(dot) 노테이션으로 값을 query 에 넣습니다..
         *
         * @param key
         * @param value
         */
        setQuery(key, value) {
            if (typeof value === 'undefined') {
                return;
            }
            let fields = key.split('.');
            if (fields.length > 1) {
                let parentKey = fields[0];
                let objs = fields.reverse().reduce((pre, cur, idx, arr) => {

                    if (typeof pre === 'string') {
                        let obj = {};
                        obj[pre] = value;
                        let obj2 = {};
                        obj2[cur] = obj;
                        return obj2;
                    }
                    if (typeof pre === 'object') {
                        let obj = {};
                        obj[cur] = pre;
                        return obj;
                    }
                });

                if (!this.query[parentKey]) {
                    this.$set(this.query, parentKey, objs[parentKey]);
                } else {
                    Object.assign(this.query[parentKey], objs[parentKey]);
                }
                return;
            }
            if (typeof this.query[key] === 'undefined') {
                this.$set(this.query, key, value);
            } else {
                this.query[key] = value;
            }
        },
        serializeQuery() {
            return Object.keys(this.query).map((key) => {
                if (!this.query[key]) {
                    return null;
                }
                if (typeof this.query[key] === 'object' && this.query[key]) {
                    return this.parseQuery(this.query[key], key);
                }

                return key + '=' + this.query[key];

            }).filter(item => {
                return item;
            }).join('&');
        },
        setDefaultQuery() {

            if (!this.query['page']) {
                this.$set(this.query, 'page', 1);
            }

        },
        getQueryString() {

            this.setDefaultQuery();

            this.queryString = '?' + this.serializeQuery();

            return this.queryString;
        },
        koreanSuffix(txt, josa) {
            // 원본 문구가 없을때는 빈 문자열 반환

            if (typeof txt !== 'string' || txt.length === 0) return '';

            var jong = (txt.charCodeAt(txt.length - 1) - 0xac00) % 28 > 0;

            if (josa === '을' || josa === '를') josa = (jong ? '을' : '를');
            if (josa === '이' || josa === '가') josa = (jong ? '이' : '가');
            if (josa === '은' || josa === '는') josa = (jong ? '은' : '는');
            if (josa === '와' || josa === '과') josa = (jong ? '와' : '과');

            return txt + josa;
        },
        parseQuery(queryObject, parentKey) {

            return Object.keys(queryObject).map((key) => {

                if (!queryObject[key]) {
                    return null;
                }
                if (typeof queryObject[key] === 'string') {
                    return [parentKey, '[', key, ']'].join('') + '=' + queryObject[key];
                }
                if (typeof queryObject[key] === 'object' && query[key]) {
                    return this.parseQuery(query[key], [parentKey, '[', query, ']'].join());
                }
            }).filter(r => r).join('&');
        },
        pushBlankForm() {
            this.items.push(this.blankFrom);
        },
        addBlankForm() {
            this.items.unshift(this.blankFrom);
        },
        async setPage(page) {
            this.page = page;
            this.query['page'] = page;
            await this.getItems();
        },
        isSelected(item) {
            return item[this.primaryKey] === this.selectedItem[this.primaryKey];
        },
        cleanErrors() {
            this.errors = {};
        },
        cleanError(key, field) {
            if (this.errors[key] && this.errors[key][field]) {
                this.errors[key][field] = [];
            }
        },
        unsetSelectedItem(selectedItem) {
            this.items = this.items.map((item)=>{
                if( item[this.primaryKey] === selectedItem[this.primaryKey] ){
                    item.__is_selected = false;
                }
                return item;
            })
        },
        setSelectedItem(selectedItem) {
            this.items = this.items.map((item) => {
                item.__is_selected = item[this.primaryKey] === selectedItem[this.primaryKey];
                return item;
            });
        },
        confirmDelete(selectedItem = null) {
            if (selectedItem) {
                this.setSelectedItem(selectedItem);
                this.selectedItem = {};
            }
            if (this.selectedItems.length === 0) {
                return this.$message.warning('선택된 데이터가 없습니다.');
            }
            this.$confirm('정말 삭제하시겠습니까? ' + this.selectedItems.length + '개의 데이터가 삭제 됩니다.')
                .then(async () => {
                    await this.deleteSelectedItems();
                });
        },
        confirmSubmit() {
            if (this.selectedItems.length === 0) {
                return this.$message.warning('선택된 데이터가 없습니다.');
            }
            this.$confirm(this.selectedItems.length + "개의 데이터를 처리하시겠습니까?")
                .then(async () => {

                    await this.submitSelectedItems();

                });
        },
        async setPaginationConfig() {
            this.total = this.response.data.total;
            this.perPage = parseInt(this.response.data.per_page);
            this.page = this.response.data.current_page;
            this.query['page'] = this.response.data.current_page;
        },
        async getIndex() {
            this.response = await this.index();
            this.items = this.response.data.data;
            if (this.$route && this.routeBinding) {

                if (!this.routeBindingFirst) {
                    this.routeBindingFirst = true;
                } else {
                    this.$router.push(this.$route.path + this.queryString);
                }
            }
        },
        async getItems() {
            await this.getIndex();
            await this.setPaginationConfig();
        },
        async submitSelectedItems() {
            if (!this.selectedItems.length) {
                this.$message.warning('선택된 내역이 없습니다.');
                return;
            }

            for (let i in this.selectedItems) {
                await this.submit(this.selectedItems[i]);
            }

            this.getItems();
        },
        async deleteSelectedItems() {
            if (!this.selectedItems.length) {
                this.$message.warning('선택된 내역이 없습니다.');
                return;
            }

            for (let i in this.selectedItems) {
                await this.delete(this.selectedItems[i][this.primaryKey]);
            }

            this.getItems();
        },
        catchErrors(err, data) {
            let response = err.response;
            if (data[this.primaryKey] && data[this.primaryKey] !== 'primary') {
                if (!this.errors[data[this.primaryKey]]) {
                    this.$set(this.errors, data[this.primaryKey], {});
                }
                this.errors[data[this.primaryKey]] = response.data;
            } else {
                this.errors = response.data;
            }
            this.$message.error('잘못된 입력값이 있습니다. 확인해 주세요.');
        },
        async submit(data) {
            try {
                let res;
                if (data[this.primaryKey] && data[this.primaryKey] !== 'primary') {
                    res = await this.update(data[this.primaryKey], data);
                } else {
                    res = await this.store(data);
                }
                this.$message.success('적용되었습니다.');
            } catch (err) {
                this.catchErrors(err, data);

                throw err;

                //return false;
            }
        },
        async index() {
            this.cleanErrors();
            this.getQueryString();
            try {
                return await axios.get(this.getUri + this.queryString)
            } catch (err) {
                let response = err.response;
                if (response.status === 422) {
                    Object.keys(response.data).map((key) => {
                        if (!this.errors[key]) {
                            this.$set(this.errors, key, response.data[key]);
                        } else {
                            this.errors[key] = response.data[key];
                        }
                    });
                }

                if (response.data.message) {
                    this.$alert(response.data.message);
                }
                return Promise.reject(err);
            }
        },
        async store(data) {
            this.cleanErrors();
            return await axios.post(this.getUri, data)
        },
        async show(id) {
            this.cleanErrors();
            return await axios.get(this.getUri + '/' + id)
        },
        async update(id, data) {
            this.cleanErrors();
            return await axios.put(this.getUri + '/' + id, data)
        },
        async patch() {
            this.cleanErrors();
            return await axios.patch(this.getUri, {items: this.items})
        },
        async delete(id) {
            this.cleanErrors();
            return await axios.delete(this.getUri + '/' + id)
        }
    }
}
