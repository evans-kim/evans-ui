<template>
    <div>
        <div class="text-wrapper">
            <textarea class="text-message bg-gray-200 p-2" :value="value"
                      :style="alertExceedLimit ? {'border':'1px solid red'} : {}"
                      @input="messageText"
            >
            </textarea>
            <span class="message-length"
                  :style="alertExceedLimit ? {'color' : 'red'} : {}">{{messageLength}}/50</span>
        </div>
        <span v-if="alertMessage.message" class="warning-message">
            {{__('메시지는 '+textLimit+'자를 초과하여 입력할 수 없습니다. 다시 입력해주세요.',
            'The message cannot exceed '+textLimit+' characters')}}
        </span>
        <span v-else-if="alertMessage.lineBreak" class="warning-message">
            {{__('메시지는 최대 '+lineBreakLimit+'줄까지 입력됩니다. 다시 입력해주세요.',
            'Line break cannot exceed '+lineBreakLimit+' times.')}}
        </span>
    </div>
</template>

<script>
    export default {
        name: "LimitText",
        props:{
            textLimit:{type:Number, default:50},
            lineBreakLimit:{type:Number, default: 5},
            korean:{type:Number, default:1.4},
            value:null
        },
        data() {
            return {
                message:'',
                alertMessage:{
                    'message' : false,
                    'lineBreak' : false,
                },
                splitMessage:[],
            }
        },
        computed: {
            alertExceedLimit() {
                if (this.alertMessage.message || this.alertMessage.lineBreak)
                    return true;

                return false;
            },
            messageLength() {
                return this.message.replace(/\n/g,'').length;
            },
            lineBreakLength() {
                return (this.message.match(/\n/g) || []).length+1;
            }
        },
        methods:{
            messageText(e) {
                this.message = e.target.value;
                if (this.messageLength > this.textLimit) {
                    this.alertMessage.message = true;
                    this.message = this.message.slice(0, -1);
                    return;
                }

                if (this.lineBreakLength > this.lineBreakLimit) {
                    this.alertMessage.lineBreak = true;
                    this.message = this.message.slice(0,-1);
                    return;
                }

                for(let key in this.alertMessage) {
                    this.alertMessage[key] = false;
                }

                let text = this.getMessageText(this.message);

                this.$emit('input', text);
            },
            messageByteLength(s,b,i,c){
                /**
                 * Charater의 Byte를 리턴하는 함수 커스터마이징
                 * 한글은 1.4 byte, 영문 및 특수문자는 1 byte
                 * 한글은 10자, 영문은 14자 이상을 넘지 않게 하기 위함입니다.
                 * */
                for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?this.korean:c>>7?2:1);
                return b;
            },
            splitText(text) {
                /**
                 * 분절되어 있지 않은 단어를 쪼개는 재귀함수
                 * */
                if (this.messageByteLength(text) < 14) {
                    if(!text) {
                        return;
                    }
                    this.splitMessage.push(text.trim());
                    return;
                }

                let byte = 0;
                let leftText = '';
                let rightText = '';
                text = text.trim();

                for (let i = 0; i < text.length; i++) {

                    byte += this.messageByteLength(text.charAt(i));

                    leftText = text.substring(0,i+1);
                    rightText = text.substring(i+1,text.length);

                    if( byte >= 14 ) {
                        this.splitMessage.push(leftText.trim());
                        return this.splitText(rightText);
                    }
                }

                this.splitMessage.push(leftText.trim());
                this.splitMessage.push(rightText.trim());

            },
            getMessageText(text) {
                /**
                 * 사용자의 엔터값을 기준으로 배열로 나누고,
                 * 제한 길이를 넘어서는 text는 splitText 함수에서 처리합니다.
                 *  */
                if(!text.includes('\n') && this.messageByteLength(text) < 14) {
                    return text;
                }

                let message = text.split('\n');
                this.splitMessage = [];

                for (let i = 0; i < message.length; i++) {
                    if(message[i] === '') {
                        message[i] = '\n';
                    }
                    this.splitText(message[i]);
                }

                if (this.splitMessage.length > this.lineBreakLimit)
                    this.alertMessage.lineBreak = true;

                return this.splitMessage.slice(0,this.lineBreakLimit).join('\n');
            },
        },
    }
</script>
<style lang="scss" scoped>

    .text-wrapper {
        width: 100%;
        position: relative;
    }

    .text-message {
        outline: none;
        width: 100%;
        line-height: 20px;
        height: 110px;
        z-index:99;
    }

    .message-length {
        position: absolute;
        margin-left: -45px;
        margin-top: 77px;
        color: #606060;
        z-index: 10;

    }

    .warning-message {
        color: red;
        margin-top: -22px;
        position: absolute;
        font-size: 12px;
        z-index: 10;
    }
</style>
