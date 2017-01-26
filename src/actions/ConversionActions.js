import moment from 'moment';
import alt from '../alt';

import common from './actions-common';

class ConversionActions {

  constructor() {
    this.generateActions(
      'refreshFail'
    );
  }

  refresh(timespan) {

    return (dispatch) => {

      // var query = ` customEvents` +
      //   ` | extend successful=customDimensions.successful` +
      //   ` | where name startswith 'message.convert'` +
      //   ` | summarize event_count=count() by name, tostring(successful)`;
      var query = `customEvents ` +
                    `| where name startswith "custom-" ` +
                    `| extend  cnt=todouble(customMeasurements['count'])` +
                    `| summarize count=sum(cnt) by name`;
      var mappings = [
        { key: 'name' },
        { key: 'event_count', def: 0 }
      ];

      common.fetchQuery({ timespan, query, mappings }, (error, conversions) => {
        if (error) {
          return this.refreshFail(error)
        }

        conversions = conversions.map((conv) => { return { name: conv.name.replace('custom-', ''), value: conv.event_count }})
        return dispatch({ conversions, timespan });
      });
    }
  }
}

export default alt.createActions(ConversionActions);