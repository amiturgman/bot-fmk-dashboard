import connectToStores from 'alt-utils/lib/connectToStores';
import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from 'recharts';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import colors from '../colors';
import styles from '../styles';
var {ThemeColors} = colors;

import ConversionStore from '../../../stores/ConversionStore';
import ConversionActions from '../../../actions/ConversionActions';

class ConversionsPie extends Component {

  static getStores() {
    return [ConversionStore];
  }

  static getPropsFromStores() {
    return ConversionStore.getState();
  }

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }
  
  renderActiveShape = (props) => {
    const { mode } = this.props;
    var type = mode == 'users' ? 'Users' : 'Messages';

    const RADIAN = Math.PI / 180;
    const { name, cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    var c = {};
    c.midAngle = 54.11764705882353;
    c.sin = Math.sin(-RADIAN * c.midAngle);
    c.cos = Math.cos(-RADIAN * c.midAngle);
    c.cx = cx;
    c.cy = cy;
    c.sx = cx + (outerRadius + 10) * c.cos; 
    c.sy = cy + (outerRadius + 10) * c.sin; 
    c.mx = cx + (outerRadius + 30) * c.cos; 
    c.my = cy + (outerRadius + 30) * c.sin; 
    c.ex = c.mx + (c.cos >= 0 ? 1 : -1) * 22; 
    c.ey = c.my; 
    c.textAnchor = 'start'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={c.cx}
          cy={c.cy}
          startAngle={300}
          endAngle={60}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${c.sx},${c.sy}L${c.mx},${c.my}L${c.ex},${c.ey}`} stroke={fill} fill="none"/>
        <circle cx={c.ex} cy={c.ey} r={2} fill={fill} stroke="none"/>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} textAnchor={c.textAnchor} fill="#333">{`${value} ${type.toLowerCase()}`}</text>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} dy={18} textAnchor={c.textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  onPieEnter(data, index) {
    this.setState({ activeIndex: index });
  }
  
  render() {
    const { conversions } = this.props;

    // Todo: Receive the width of the SVG component from the container
    return (
      <Card className='dash-card'>
        <CardHeader
            className='card-header'
            title="Action Types"
            subtitle={`Which actions are being used`} />
        <CardMedia style={styles.cardMediaStyle}>
          <PieChart width={500} height={240}>
            <Pie
              data={conversions} 
              onMouseEnter={this.onPieEnter.bind(this)}
              cx={150} 
              cy={120} 
              innerRadius={60}
              outerRadius={80} 
              fill="#8884d8"
              activeIndex={this.state.activeIndex}
              activeShape={this.renderActiveShape.bind(this)} 
              paddingAngle={0}>
              {conversions.map((val, idx) => <Cell key={idx} fill={ThemeColors[idx]} />)}
              <Tooltip/>
            </Pie>
            <Legend layout='vertical' align='right' wrapperStyle={{ top: 10, right: 11 }} />
          </PieChart>
        </CardMedia>
      </Card>
    );
  }
}

export default connectToStores(ConversionsPie);