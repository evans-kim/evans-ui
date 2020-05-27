import EvDialog from "../components/EvDialog";
export default {
    install(Vue, options) {

        Vue.ConfirmPlugIn = {
            ComponentCtor : Vue.extend(EvDialog)
        };
        Vue.prototype.$confirm = function (methodOptions) {
            let options = {};
            if( typeof methodOptions === 'string'){
                options.type = 'info';
                options.content = methodOptions;
            }
            if( typeof methodOptions === 'object' ){
                options = methodOptions;
            }

            const componentInstance = new Vue.ConfirmPlugIn.ComponentCtor({ propsData: options });
            componentInstance.$mount();

            window.document.body.appendChild(componentInstance.$el);

            let width = componentInstance.$el.clientWidth;

            componentInstance.$el.style.top = '20%';
            componentInstance.$el.style.left = '50%';
            componentInstance.$el.style.marginLeft =  - (width/2) + 'px';

            return componentInstance;

        }
    }
}
