//Sequence 연속적 실행
import EvProgressDialog from "../components/EvProgressDialog";

export default {
    /**
     *
     * @param Vue {Vue}
     */
    install(Vue) {

        function Sequencer(){
            this.Component = Vue.extend(EvProgressDialog);
            this.instance = null;
            /**
             * 배열에 포함된 데이터를 차례대로 Promise 함수에 넣어 실행하고 그 결과를
             * @param items {Array}
             * @param promise {Promise}
             * @returns {Promise<*>}
             */
            this.execute = async (items, promise) => {
                if (!Array.isArray(items)) {
                    throw '데이터는 배열로 와야 합니다.';
                }

                if (typeof promise !== 'function') {
                    throw '적절한 함수가 아닙니다.';
                }

                let instance = new this.Component({propsData: {items: items, method: promise}});
                instance.$mount();
                window.document.body.appendChild(instance.$el);

                return await instance.run();
            }
        }
        const sequencer = new Sequencer();
        Vue.prototype.$progress = sequencer.execute;
    }
}
