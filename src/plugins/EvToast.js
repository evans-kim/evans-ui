import EvAlert from "../components/EvAlert";
import Vue from "vue";
export default {

    install(Vue) {

        const $messageClass = new Message();

        Vue.prototype.$message = function (options) {
            if (options) {
                $messageClass.setOption(options);
            }
            $messageClass._render();
            return $messageClass;
        };

        Vue.prototype.$message.error = function (message) {
            $messageClass.error(message);
        };
        Vue.prototype.$message.success = function (message) {
            $messageClass.success(message);
        };
        Vue.prototype.$message.info = function (message) {
            $messageClass.info(message);
        };
        Vue.prototype.$message.warning = function (message) {
            $messageClass.warning(message);
        };

        Vue.prototype.$alert = function (message) {
            $messageClass.warning(message);
        }
    }
}

function Messenger(){
    const $messageClass = new Message();
    const proto = {};

    proto.$message = function (options) {
        if (options) {
            $messageClass.setOption(options);
        }
        $messageClass._render();
        return $messageClass;
    };

    proto.error = function (message) {
        $messageClass.error(message);
    };
    proto.success = function (message) {
        $messageClass.success(message);
    };
    proto.info = function (message) {
        $messageClass.info(message);
    };
    proto.warning = function (message) {
        $messageClass.warning(message);
    };

    proto.$alert = function (message) {
        $messageClass.warning(message);
    }

    return proto;
}

export const messenger = new Messenger();

export function Message(methodOptions = null) {
    this.options = {
        toggle: false
    };
    if (methodOptions) {
        this.options = methodOptions;
    }

    this.AlertComponenet = Vue.extend(EvAlert);
    this.setOption = function (opt) {
        this.options = opt;
    };
    this.success = function (message) {
        this.options.type = 'success';
        this.options.message = message;

        this._render();
    };
    this.info = function (message) {
        this.options.type = 'info';
        this.options.message = message;
        this._render();
    };
    this.error = function (message) {
        this.options.type = 'error';
        this.options.message = message;
        this._render();
    };
    this.warning = function (message) {
        this.options.type = 'warning';
        this.options.message = message;
        this._render();
    };
    this._render = function () {
        this.componentInstance = new this.AlertComponenet({propsData: this.options});
        this.componentInstance.$mount();

        let items = document.getElementsByClassName('ev-alert');
        if (items.length > 0 && !this.options.floating) {
            let last = items[(items.length > 1) ? items.length - 1 : 0];
            let topVale = 110;
            if (last) {
                topVale = last.clientHeight + last.offsetTop;
            }
            this.componentInstance.$el.style.top = topVale + 'px';
        }

        window.document.body.appendChild(this.componentInstance.$el);
    }
}
