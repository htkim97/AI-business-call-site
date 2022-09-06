import { Calendar } from 'react-date-range';
import { Component } from 'react';
class CalendarComponent extends Component {
  handleSelect(date) {
    console.log(date); // native Date object   
  }   
  render(){     
    return (<Calendar date= 'onChange=' /> );   
  } 
} 
export default CalendarComponent; 