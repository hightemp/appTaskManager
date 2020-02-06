
import Vue from 'vue';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { Watch } from 'vue-property-decorator';
import { remote } from 'electron';
import * as fs from 'fs';

// import { keys } from 'ts-transformer-keys';
// import deepcopy from 'deepcopy';
declare module deepcopy {};
const deepcopy = require('deepcopy');

// var oWatcherProcess: child_process.ChildProcess;
const sConfigPath: string = remote.app.getPath("home")+"/appTaskManager.config.json";

export interface IWindowOptions {
  outerWidth: number
  outerHeight: number
  screenX: number
  screenY: number
}

const aKeysOfIWindowOptions: string[] = [
  'outerWidth',
  'outerHeight',
  'screenX',
  'screenY'
];// keys<IWindowOptions>();

/*
if (typeof window === 'undefined') {
  (<any>global).window = {};
}
*/

export const aFields = [
  'pid',
  'ppid',
  'name',
  'path',
  'threads',
  'owner',
  'priority',
  'cmdline',
  'starttime',
  'vmem',
  'pmem',
  'cpu',
  'utime',
  'stime',  
];

export const aFixedColumns = [
  'pid',
  'ppid',
  'name'
];

var oWindow = window || globalThis || (<any>global).window;

export interface IConfig {
  iRefreshTimeout: number

  iSelectFilterListItem: number
  m_oSelectedPreparedFiltersListItem: any
  aFiltersList: any[]

  aVisibleColumns: string[]

  oIconCache: any

  oWindowPosition: IWindowOptions | null
}

@Mixin
export default class Config extends Vue {

  bMounted: boolean = false

  oConfig: IConfig = {
    iRefreshTimeout: 2000,

    iSelectFilterListItem: -1,
    m_oSelectedPreparedFiltersListItem: null,
    aFiltersList: [],

    aVisibleColumns: aFields.slice(),

    oIconCache: {},

    oWindowPosition: null
  }

  @Watch('oConfig', { immediate: true, deep: true })    
  on_oConfigChange(v: any, o: any) { 
    if (this.bMounted) {
      console.log('on_oConfigChange', v, o);
      this.fnSaveConfig(); 
    }
  } 

  fnAfterConfigLoad()
  {
    var oThis = this;

    if (oThis.oConfig.oWindowPosition) {
      var { outerWidth, outerHeight, screenX, screenY } = oThis.oConfig.oWindowPosition;
      (<any>oWindow).resizeTo(outerWidth, outerHeight);
      (<any>oWindow).moveTo(screenX, screenY);
    }
  }

  fnBeforeConfigSave(oConfig: IConfig)
  {
    var oThis = this;

    var oConfigCopy = deepcopy(oConfig);

    oConfigCopy.oWindowPosition = <any>{};

    aKeysOfIWindowOptions.forEach((sKey: string) => {
      console.log('fnBeforeConfigSave', window, globalThis, (<any>global).window, sKey);
      (<any>oConfigCopy.oWindowPosition)[sKey] = (<any>oWindow)[sKey];
    });

    return oConfigCopy;
  }

  fnLoadConfig()
  {
    var oThis = this;
    
    if (fs.existsSync(sConfigPath)) {
      try {
        Vue.set(oThis, 'oConfig', JSON.parse(fs.readFileSync(sConfigPath).toString()));
        oThis.fnAfterConfigLoad();
      } catch (oError) {
        console.error(oError);
      }
    }
  }

  fnSaveConfig()
  {
    var oThis = this;
    
    try {
      var oConfig = oThis.fnBeforeConfigSave(oThis.oConfig);
      fs.writeFileSync(sConfigPath, JSON.stringify(oConfig));      
    } catch (oError) {
      console.error(oError);
    }
  }
}