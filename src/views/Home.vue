<template>
  <div class="home">
    Evans UI
    <div class="mx-auto max-w-5xl text-left" >
      <ev-card title="폼 컴포넌트" body-classes="p-4">
        <ul>
          <li>특징</li>
          <li>모델값이 오브젝트라면 필드값이 사전 정의 되어 있지 않아도 자동으로 반응형 프로퍼티를 추가합니다.</li>
          <li>라라벨의 paginate response 와 연동되어 errors 만 지정되어 있으면 해당 필드에 validate error 를 보여줍니다.</li>
          <li>폼필드의 레이블 값의 길이에 따라 자동 정렬됩니다.</li>
        </ul>
        <ev-form v-model="model" :errors="errors" class="m-2" >
          <ev-form-field field="user" label="아이디" ></ev-form-field>
          <ev-form-field field="password" label="패스워드" type="password" ></ev-form-field>
        </ev-form>
        <p> Tailwind Class 를 이용한 자유로운 폼 필드의 길이조절 </p>
        <p> Slot를 이용한 커스텀 인풋 사용으로 확장 가능 </p>
        <ev-form v-model="model2" class="m-2" >
          <ev-form-field field="user" label="이름" class="w-1/2"></ev-form-field>
          <ev-form-field field="password" label="별명" type="password" class="w-1/2"></ev-form-field>
          <ev-form-field field="zipcode" label="우편번호" class="w-1/5">
            <template v-slot:default="prop">
              <daum-zip-finder :value="prop.value" @input="prop.handler"></daum-zip-finder>
            </template>
          </ev-form-field>
          <ev-form-field field="address" label="주소" class="w-2/5"></ev-form-field>
          <ev-form-field field="address2" label="상세주소" type="password" class="w-2/5"></ev-form-field>
          <ev-form-field field="reservation" label="예약일자" type="datepicker" class="w-1/2"></ev-form-field>
          <ev-form-field field="option" label="선택번호" type="select" :options="[
                  {value : 1, label : '1번 옵션'},
                  {value : 2, label : '2번 옵션'},
                  {value : 3, label : '3번 옵션'},
          ]" class="w-1/2"></ev-form-field>
        </ev-form>
      </ev-card>

      <ev-card title="그리드 템플릿">
        <ev-form v-model="gridOption">
          <ev-form-field field="type" label="유형" type="radio-group" :options="[
                  {label : '값', value:'value'},
                  {label : '인풋', value:'input'},
          ]"></ev-form-field>
        </ev-form>
        <grid-template v-model="items" :field-labels="{id:'번호',name:'이름',country:'국가'}" :cell-type="gridOption.type"></grid-template>
      </ev-card>

    </div>

  </div>
</template>

<script>

import DaumZipFinder from "../components/DaumZipFinder";
import GridTemplate from "../templates/GridTemplate";
export default {
  name: 'Home',
  components: {
    GridTemplate,
    DaumZipFinder

  },
  data(){
    return {
      model: {},
      errors: {
        user:['필수입력']
      },
      model2:{},
      model3: null,
      model4: [],
      model5:null,
      items : [
        {id:1,name:'홍길동',country:'한국'},
        {id:2,name:'제임스',country:'미국'},
        {id:3,name:'야스오',country:'일본'},
        {id:4,name:'신짜오',country:'중국'},
        {id:5,name:'가렌',country:'영국'},
        {id:6,name:'누누',country:'그린란드'},
       {id:7,name:'야스오',country:'일본'},

      ],
      gridOption: {
        type: 'value'
      }
    }
  }
}
</script>
