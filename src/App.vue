<template>
  <div 
    id="q-app" 
    style="width: 100vw; height: 100vh;"
    class="column"
  >
    <div 
      class="col-auto column" 
      :style="bShowSystenInfoPanel ? 'height: 200px !important' : 'height: 43px !important'"
    >
      <div class="col" v-if="bShowSystenInfoPanel">

      </div>
      <div class="col-auto row">
        <q-select
          class="col-auto"
          style="min-width: 300px"
          dense
          square 
          outlined 
          v-model="oFiltersListSelectedItem" 
          :options="aPreparedFiltersList" 
          label="Prepared filter" 
        />
        <q-btn
          class="col-auto" 
          dense
          flat
          title="options"
          color="primary" 
          icon="create" 
          @click="fnShowFiltersListEditWindow" 
        />
        <q-input
          class="col"
          dense
          outlined
          square
          clearable
          v-model="sFilterString" 
          type="text" 
          label="Filter..."
        />
        <q-btn 
          dense
          flat
          :disabled="!aSelected.length"
          title="kill"
          color="primary" 
          icon="my_location" 
          @click="fnTerminateSelected" 
        />
        <q-btn 
          dense
          flat
          title="show system info panel"
          color="primary" 
          icon="show_chart" 
          @click="bShowSystenInfoPanel = !bShowSystenInfoPanel" 
        />
        <q-btn 
          dense
          flat
          title="options"
          color="primary" 
          icon="settings" 
          @click="fnShowOptionsWindow" 
        />
      </div>
    </div>
    <q-table
      class="col sticky-header-column-table"      
      dense
      flat
      square
      row-key="pid"
      :table-style="'max-width: 100vw; max-height: calc(100vh - 42px ' + (bShowSystenInfoPanel ? '- 200px' : '- 43px') + ')'"
      :selected-rows-label="fnGetSelectionDescription"
      :filter="sFilterString"
      :visible-columns="aVisibleColumns"
      :rows-per-page-options="[0]"
      :pagination.sync="oPagination"
      :data="aTasks"
      :columns="aColumns"
      :selected.sync="aSelected"
      selection="multiple"
      :loading="bLoading"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-icon 
            v-if="!props.value.icon"
            name="watch_later"
            color="grey-1"
            size="16px"
          />
          <img
            v-if="props.value.icon"
            style="width:16px; float:left; margin-right: 10px;"
            :src="'data:image/png;base64,'+props.value.icon"
          />
          {{ props.value.value }}
        </q-td>
      </template>
    </q-table>
    <!--div class="q-mt-md">
      Selected: {{ JSON.stringify(aSelected) }}
    </div-->

    <q-dialog
      v-model="bShowOptionsWindow"
    >
      <q-card class="column" style="width: 500px; height: 100vh">
        <q-card-section>
          <div class="text-h6">Options</div>
        </q-card-section>

        <q-card-section class="col row q-pt-none">
          <q-tabs
            v-model="sOptionsSelectedTab"
            vertical
            class="col-auto text-teal"
          >
            <q-tab name="columns" icon="low_priority" label="Columns" />
            <q-tab name="other" icon="dehaze" label="Other" />
          </q-tabs>
          <q-tab-panels
            v-model="sOptionsSelectedTab"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
            class="col full-height"
          >
            <q-tab-panel name="columns" class="columns full-height">
              <!--div class="col-auto">

              </div-->
              <q-list
                bordered 
                separator
                dense
                class="col full-height" 
                style="overflow-y: scroll"
              >
                <q-item 
                  dense
                  v-for="(oItem, iIndex) in aFixedColumns"
                  :key="iIndex"
                >
                  <q-item-section side top>
                    <q-checkbox disabled v-model="aVisibleColumns" :val="oItem.field" />
                  </q-item-section>                    
                  <q-item-section>
                    {{ oItem.label }}
                  </q-item-section>
                </q-item>
                <draggable v-model="aAvailableColumns">
                  <q-item 
                    dense
                    v-for="(oItem, iIndex) in aAvailableColumns"
                    :key="iIndex"
                  >
                    <q-item-section side top>
                      <q-checkbox v-model="aVisibleColumns" :val="oItem.field" />
                    </q-item-section>                    
                    <q-item-section>
                      {{ oItem.label }}
                    </q-item-section>
                  </q-item>
                </draggable>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="other">
              <q-input
                v-model.number="iRefreshTimeout"
                type="number"
                filled
                style="max-width: 200px"
                label="Refresh timeout"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="sass">
.q-list--separator > div > .q-item-type + .q-item-type, 
.q-list--separator > .q-virtual-scroll__content > div > .q-item-type + .q-item-type,
.q-list--separator > .q-item-type + div
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.sticky-header-column-table
  .q-table__middle
    max-height: 200px
  td
    background-color: #fff !important
  tr th
    position: sticky
    z-index: 2
    background: #fff
  thead tr:last-child th
    top: 48px
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child, 
  tr:first-child th:nth-child(2),
  tr:first-child th:nth-child(3),
  tr:first-child th:nth-child(4)
    z-index: 3
  td:first-child, 
  td:nth-child(2),
  td:nth-child(3),
  td:nth-child(4)
    z-index: 1
  td:first-child, th:first-child
    position: sticky
    left: 0
  td:nth-child(2), th:nth-child(2)
    position: sticky
    left: 44px !important
  td:nth-child(3), th:nth-child(3)
    position: sticky
    left: calc(214px + 44px) !important
  td:nth-child(4), th:nth-child(4)
    position: sticky
    left: calc(214px + 44px + 53px) !important
  td:first-child,
  th:first-child,
  .name-column,
  .pid-column,
  .ppid-column
    background-color: #eee !important
  th:first-child,
  th.name-column,
  th.pid-column,
  th.ppid-column
    background-color: #ddd !important
  .name-column
    width: 214px
  .pid-column
    width: 53px
  .ppid-column
    width: 57px
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import child_process from 'child_process';

import draggable from 'vuedraggable';

// import iconExtractor from 'icon-extractor';
var iconExtractor = require('icon-extractor');

import moment from 'moment';

const aFields = [
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

const aFixedColumns = [
  'pid',
  'ppid',
  'name'
];

enum ProcType {
  none = 'none',
  exited = 'exited',
  heavy_cpu_usage = 'heavy_cpu_usage',
  heavy_memory_usage = 'heavy_memory_usage'
}

const sProcessWatcherPath = "./src/child_process/process_watcher.js";
var oWatcherProcess: any;

@Component({
  components: {
    draggable
  }
})
export default class App extends Vue {

  sOptionsSelectedTab: string = "columns"

  bShowSystenInfoPanel: boolean = false

  bShowOptionsWindow: boolean = false
  bShowFiltersListEditWindow: boolean = false

  bLoading: boolean = true

  aTasks: any[] = []
  iRefreshTimeout: number = 2000

  oFiltersListSelectedItem: any
  aFiltersList: any[] = []

  aSelected: any[] = []

  oIconCache: any = {}

  aVisibleColumns: string[] = aFields.slice()
  bEnableFilter: boolean = false
  oPagination: any = { rowsPerPage: 0 }
  sFilterString: string = ''
  iRowCount: number = 100000
  aColumns: any[] = [
    { name: 'name', align: 'left', label: 'name', field: 'name', sortable: true, classes: 'name-column', headerClasses: 'name-column', format: (v, r) => ({ value: v, icon: this.oIconCache[r.path] }) },
    { name: 'pid', align: 'right', label: 'pid', field: 'pid', sortable: true, classes: 'pid-column', headerClasses: 'pid-column' },
    { name: 'ppid', align: 'right', label: 'ppid', field: 'ppid', sortable: true, classes: 'ppid-column', headerClasses: 'ppid-column' },
    { name: 'vmem', align: 'right', label: 'vmem', field: 'vmem', sortable: true, format: v => this.fnFormatSize(v), sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10)  },
    { name: 'pmem', align: 'right', label: 'pmem', field: 'pmem', sortable: true, format: v => this.fnFormatSize(v), sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'cpu', align: 'right', label: 'cpu', field: 'cpu', sortable: true },
    { name: 'cmdline', align: 'left', label: 'cmdline', field: 'cmdline', sortable: true },
    { name: 'path', align: 'left', label: 'path', field: 'path', sortable: true },
    { name: 'threads', align: 'right', label: 'threads', field: 'threads', sortable: true },
    { name: 'owner', align: 'left', label: 'owner', field: 'owner', sortable: true },
    { name: 'priority', align: 'right', label: 'priority', field: 'priority', sortable: true },
    { name: 'starttime', align: 'left', label: 'starttime', field: 'starttime', sortable: true },
    { name: 'utime', align: 'left', label: 'utime', field: 'utime', sortable: true },
    { name: 'stime', align: 'left', label: 'stime', field: 'stime', sortable: true },
  ]

  get aFixedColumns()
  {
    var oThis = this;
    
    return oThis.aColumns.filter((v:any) => ~aFixedColumns.indexOf(v.field))
  }

  get aAvailableColumns()
  {
    var oThis = this;
    
    return oThis.aColumns.filter((v:any) => !~aFixedColumns.indexOf(v.field))
  }

  set aAvailableColumns(aColumns: any)
  {
    var oThis = this;

    Vue.set(oThis, 'aColumns', oThis.aFixedColumns.concat(aColumns))
  }

  get aPreparedFiltersList()
  {
    var oThis = this;
    var aResult = oThis.aFiltersList.slice();

    aResult.unshift({
      label: 'None',
      value: 'none'
    });
    
    return aResult;
  }

  fnShowFiltersListEditWindow()
  {
    var oThis = this;
    
    oThis.bShowFiltersListEditWindow = true;
  }

  fnShowOptionsWindow()
  {
    var oThis = this;
    
    oThis.bShowOptionsWindow = true;
  }

  fnFormatSize(iSize: string | number)
  {
    iSize = +iSize;
    var sz = 'BKMGTP';
    var factor = Math.floor(((iSize+"").length - 1) / 3);
    return  Math.round(iSize / Math.pow(1024, factor) * 100) / 100 + sz[factor];
  }

  fnGetSelectionDescription() 
  {
    var oThis = this;
    
    return oThis.aSelected.length === 0 ? 
    '' : 
    `${oThis.aSelected.length} record${oThis.aSelected.length > 1 ? 's' : ''} selected of ${oThis.aTasks.length}`
  }

  fnSafelyKill(pid: number, signal: string) 
  {
    if (signal && process.platform!='win32') {
      process.kill(pid, signal);
    } else {
      process.kill(pid);
    }
  }

  fnTerminateSelected()
  {
    var oThis = this;

    oThis.aSelected.forEach((oItem: any) => {
      // console.log('fnTerminateSelected', oItem);
      oThis.fnSafelyKill(oItem.pid, 'SIGTERM');
      oThis.fnSafelyKill(oItem.pid, 'SIGKILL');
      // fkill(oItem.pid);
    });
  }

  fnStopWatcher()
  {
    if (oWatcherProcess && oWatcherProcess.kill) {
      /*
      oWatcherProcess.send('exit');      

      oWatcherProcess.kill('SIGTERM');
      oWatcherProcess.kill('SIGKILL');
      */
      oWatcherProcess.disconnect();
    }
  }

  fnStartWatcher(sPath: string)
  {
    var oThis = this;

    if (oWatcherProcess && oWatcherProcess.kill) {
      return;
    }
    
    // oThis.fnStopWatcher();

    var aArgs: any = [
      'node',
      [
        // require.resolve(sPath)
        sPath
      ],
      {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        env: {} 
      }
    ];

    oWatcherProcess = child_process.spawn(
      aArgs[0],
      aArgs[1],
      aArgs[2]
    );

    oWatcherProcess.on('message', (aTasks) => {
      aTasks = aTasks.map((v:any) => {
        v.cpu = Math.round(v.cpu*100)/100;
        v.type = 'none';
        v.icon = '';

        return v;
      })

      Vue.set(oThis, 'aTasks', aTasks);

      aTasks.map((v:any) => {
        if (!oThis.oIconCache[v.path]) {
          iconExtractor.getIcon(v.pid, v.path);
        }
      });

      setTimeout(oThis.fnUpdate, oThis.iRefreshTimeout);
      oThis.bLoading = false;
    });

    oWatcherProcess.on('exit', (iCode: number, sSignal: string) => {
      console.log('exit - iCode, sSignal', iCode, sSignal);      
      oThis.fnUpdate();
    });

    oWatcherProcess.on('close', () => {
      console.log('close');
      oThis.fnUpdate();
    });

    console.log('oWatcherProcess', oWatcherProcess.pid, oWatcherProcess);
  }

  async fnUpdate()
  {
    var oThis = this;
    
    try {
      oThis.fnStartWatcher(sProcessWatcherPath);

      oWatcherProcess.send('update');

      // aTasks = await snapshot(...aFields);
      // aTasks = await psList();
    } catch (_) {
      console.error(_);
    }
  }

  fnOnExit(mEvent: any)
  {
    var oThis = this;

    console.log('fnOnExit', arguments);

    oThis.fnStopWatcher();
    // oThis.fnSaveConfig();
  }

  created()
  {
    var oThis = this;

    iconExtractor.emitter.on(
      'icon', 
      function(data: any) 
      {
        //if (data.Context) {
          var sPath = oThis.aTasks.filter((vv:any) => vv.pid==data.Context)[0].path;
          oThis.oIconCache[sPath] = data.Base64ImageData;
          // console.log('fnStartWatcher', sPath, { img:data.Base64ImageData });
          // oThis.aTasks.filter((vv:any) => vv.pid==data.Context)[0].icon = data.Base64ImageData;
        //}
        /*
        console.log('Here is my context: ' + data.Context);
        console.log('Here is the path it was for: ' + data.Path);
        console.log('Here is the base64 image: ' + data.Base64ImageData);
        */
      }
    );

    oThis.oFiltersListSelectedItem = oThis.aPreparedFiltersList[0];

    process.on('exit', oThis.fnOnExit);
    process.on('SIGTERM', oThis.fnOnExit);
    process.on('SIGKILL', oThis.fnOnExit);
    window.onbeforeunload = oThis.fnOnExit;

    oThis.fnUpdate();
  }
}
</script>
