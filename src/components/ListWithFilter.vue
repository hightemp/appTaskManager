<template>
  <div :class="sClass" :style="sStyle">
    <div class="col-auto row">
      <q-input
        dense
        square
        outlined
        v-model="sFilterText" 
        type="text" 
        label="Filter..."
        class="col" 
      />
      <q-btn-toggle
        v-model="bEnableFilter"
        clearable
        square
        spread
        no-caps
        unelevated
        toggle-color="primary"
        color="white"
        text-color="black"
        title="Filter"
        :options="[
          {value: true, icon: 'filter_list'},
        ]"
      ></q-btn-toggle>
    </div>
    <div class="col" style="overflow-y: auto">
      <q-list 
        bordered 
        separator
        dense
      >
        <q-item 
          v-for="(oItem, iItemIndex) in aFilteredList"
          :key="iItemIndex"
          dense
          clickable 
          v-ripple
          class="wraped"
          :active="m_iSelectedIndex==iItemIndex"
          active-class="bg-primary text-white"
          @click="$emit('item-click', iItemIndex); m_iSelectedIndex=iItemIndex"
        >
          <q-item-section :class="{ 'text-grey-4': !oItem.sTitle.trim() }">
            {{ oItem.sTitle.trim() ? oItem.sTitle : 'Untitled' }}
          </q-item-section>
          <q-item-section side>
            <q-badge 
              v-if="oItem.sBadge!=='' && oItem.sBadge!==undefined"
              :color="m_iSelectedIndex==iItemIndex ? 'red-1 text-black' : 'primary'"
              :label="oItem.sBadge" 
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>          
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator'

export interface IListItem {
  sTitle: string
  sBadge?: string    
}

@Component({
  name: 'list-with-filter'
})
export default class ListWithFilter extends Vue {

  @Prop({ default: 'col column', type: String }) readonly sClass: string = '';
  @Prop({ default: '', type: String }) readonly sStyle: string = '';
  @Prop([Array]) readonly aList: IListItem[] = [];
  @Prop({ default: -1, type: Number }) readonly iSelectedIndex: number = -1;

  bEnableFilter: boolean = false
  sFilterText: string = ""

  m_iSelectedIndex: number = -1

  @Watch('iSelectedIndex')
  fnOn_iSelectedIndex(iNewValue: any, iOldValue: any)
  {
    var oThis: any = this;
    
    oThis.m_iSelectedIndex = iNewValue;
  }

  get aFilteredList()
  {
    var oThis: any = this;
    
    if (!oThis.bEnableFilter) {
      return oThis.aList;
    }

    return oThis.aList.filter((v:IListItem) => ~v.sTitle.indexOf(oThis.sFilterText))
  }

  created()
  {
    var oThis: any = this;
    
    oThis.m_iSelectedIndex = oThis.iSelectedIndex;
  }
}

Vue.component('list-with-filter', ListWithFilter);

/*
export default { 
  ListWithFilter,
  IListItem
};
*/
</script>