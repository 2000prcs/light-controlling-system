import React, { Component } from 'react';
import { Table, Provider, Input } from 'rendition';
import Switch from 'react-toggle-switch';


export default class Control extends Component {

  // Highlight the selected room
  // Note: Walking DOM elements to get all table rows since there is no class/id selector for each table row
  selectRoom(roomInfo, e) {
    this.props.getCurrentRoom(roomInfo);

    // Empty input value when user selects a new room
    if (document.querySelector('input')) {
      document.querySelector('input').value = '';
    }

    if (e) {
      // If user selects table cell or toggle switch, don't highlight it
      let currentTableRow = e.target.parentNode;
      if (currentTableRow.dataset.display === 'table-cell') {
        currentTableRow = currentTableRow.parentNode;
      }
      if (currentTableRow.className.indexOf('toggle') !== -1) {
        currentTableRow = currentTableRow.parentNode.parentNode;
      }
  
      // Highlight the selected room only
      const talbeRows = document.getElementsByClassName('highlight');
      Array.from(talbeRows).forEach(row => row.classList.remove('highlight'));
      currentTableRow.classList.add('highlight');
  
      // Make arrow point to the selected room
      // Note: It's modifying pseudo elements by extending HTML element (it might not be the best approach)
      // http://mcgivery.com/htmlelement-pseudostyle-settingmodifying-before-and-after-in-javascript/
      const arrowbox = document.getElementsByClassName('arrow_box')[0];
      const newArrowLocation = (roomInfo.id - 2) * 24;
      if (arrowbox) {
        arrowbox.pseudoStyle('before', 'top', `${newArrowLocation}%`).pseudoStyle('after', 'top', `${newArrowLocation}%`);
      }
    }
  }

  // Toggle light switch: only toggle when user clicks the switch itself
  toggleSwitch(e) {
    if (e.target.className.indexOf('toggle') === -1) {
      if (e.target.className.indexOf('on') !== -1) {
        e.target.classList.remove('on');
        e.target.nextElementSibling.innerText = 'Off';
        this.setState(() => {
          this.props.getSwitchStatus(false);
        });
      } else {
        e.target.classList.add('on');
        e.target.nextElementSibling.innerText = 'On';
        this.setState(() => {
          this.props.getSwitchStatus(true);
        });
      }
    }
  }

  render() {
    const { room } = this.props;

    const columns = [
      {
        field: 'name',
        label: 'Room',
        sortable: true,
        render: value => <span><b>{value}</b></span>,
      },
      {
        field: 'active',
        label: 'State',
        sortable: false,
        render: (value) => {
          const active = value ? 'On' : 'Off';
          return (
            <div className="toggle-switch">
              <Switch
                onClick={e => this.toggleSwitch(e)}
                on={value}
              />
              <div className="active">
                {active}
              </div>
            </div>
          );
        },
      },
      {
        field: 'brightness',
        label: 'Brightness',
        sortable: false,
        render: value => <span>{value}%</span>,
      },
    ];


    return (
      <Provider>
        <Table
          columns={columns}
          data={room}
          onRowClick={(data, e) => this.selectRoom(data, e)}
        />
      </Provider>
    );
  }
}
