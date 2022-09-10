//#region import 
//#region RN
import React, { Component } from 'react';
import { View, TextInput, SafeAreaView, Keyboard, StyleSheet } from 'react-native';
//#endregion
//#region common files
import { wp, DEVICE_OS } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
//#endregion
//#region third party libs
import moment from 'moment';
let regx = /^[0-9]\d*$/;
//#endregion
//#endregion
export default class BirthdateTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_1: '',
      date_2: '',
      month_1: '',
      month_2: '',
      year_1: '',
      year_2: '',
      year_3: '',
      year_4: '',
      day_limit: 31,
      position: 1,
    };
  }

  onChangeTextValue = (id, val) => {
    let date_1 = id == 'day_1' ? val : this.state.date_1,
      date_2 = id == 'day_2' ? val : this.state.date_2,
      month_1 = id == 'month_1' ? val : this.state.month_1,
      month_2 = id == 'month_2' ? val : this.state.month_2,
      year_1 = id == 'year_1' ? val : this.state.year_1,
      year_2 = id == 'year_2' ? val : this.state.year_2,
      year_3 = id == 'year_3' ? val : this.state.year_3,
      year_4 = id == 'year_4' ? val : this.state.year_4;

    let birthDate = date_1 + date_2 + month_1 + month_2 + year_1 + year_2 + year_3 + year_4;
    this.props.onChangeTextValue(birthDate);
  }

  handle_date1 = val => {
    const { date_2, day_limit } = this.state;
    if (!regx.test(val) == false) {
      let x = val;
      let concat = parseInt(x + date_2);
      if (x >= 0 && x <= 3) {
        this.setState({ date_1: val });
        this.onChangeTextValue('day_1', val);
        if (val.length == 1) {
          this.day2Input.focus();
        }
        if (concat >= 0 && concat <= day_limit) {
        } else {
          if (x != '') {
            this.setState({ date_2: '' });
            this.onChangeTextValue('day_2', '');
            this.day2Input.focus();
          } else {
            this.setState({ day_limit: 31 });
          }
        }
      } else {
        this.setState({ date_1: '' });
        this.onChangeTextValue('day_1', '');
        this.day1Input.focus();
      }
    }
  };

  handle_date2 = val => {
    const { date_1, day_limit } = this.state;
    let x = val;
    let concat = parseInt(date_1 + x);
    if (concat >= 1 && concat <= day_limit) {
      this.setState({ date_2: x });
      this.onChangeTextValue('day_2', x);
      if (x != '') {
        this.month1Input.focus();
      } else {
        this.setState({ day_limit: 31 });
      }
    } else {
      this.setState({ date_2: '' });
      this.onChangeTextValue('day_2', '');
    }
  };

  handle_month_1 = val => {
    const { date_1, date_2, month_1, year_1, year_2, year_3, year_4, month_2 } = this.state;
    let x = val;
    let concate_month = parseInt(x + month_2);
    let concate_date = parseInt(date_1 + date_2);
    let concate_year = parseInt(year_1 + year_2 + year_3 + year_4);
    let day_limit;
    if (x >= 0 && x <= 1) {
      this.setState({ month_1: val });
      this.onChangeTextValue('month_1', val);
      if (val.length == 1) {
        this.month2Input.focus();
      }
      if (concate_month >= 0 && concate_month <= 12) {
        day_limit = new Date(concate_year, concate_month, 0).getDate();
        if (month_2 == '') {
          this.setState({ day_limit: 31 });
        } else {
          this.setState({ day_limit: day_limit });
          if (concate_date >= 0 && concate_date <= day_limit) {
          } else {
            this.setState({ date_1: '', date_2: '' });
            this.onChangeTextValue('day_1', '');
            this.onChangeTextValue('day_2', '');
            this.day1Input.focus();
          }
        }
      } else {
        if (x != '') {
          this.setState({ month_2: '' });
          this.onChangeTextValue('month_2', '');
          this.month2Input.focus();
        }
      }
    } else {
      this.setState({ month_1: '' });
      this.onChangeTextValue('month_1', '');
      this.month1Input.focus();
    }
  };

  handle_month_2 = val => {
    const { date_1, date_2, month_1, year_1, year_2, year_3, year_4, month_2 } = this.state;
    let x = val;
    let concate_date = parseInt(date_1 + date_2);
    let concate_month = parseInt(month_1 + x);
    let concate_year = parseInt(year_1 + year_2 + year_3 + year_4);
    let day_limit;
    if (concate_month >= 1 && concate_month <= 12) {
      this.setState({ month_2: x });
      this.onChangeTextValue('month_2', x);
      if (val.length == 1) {
        this.year1Input.focus();
      }
      if (year_1 == '') {
        this.setState({ day_limit: 31 });
      } else {
        day_limit = new Date(concate_year, concate_month, 0).getDate();
        this.setState({ day_limit: day_limit });
        if (concate_date >= 0 && concate_date <= day_limit) {
        } else {
          if (x != '') {
            this.setState({ date_1: '', date_2: '' });
            this.onChangeTextValue('day_1', '');
            this.onChangeTextValue('day_2', '');
            this.day1Input.focus();
          } else {
          }
        }
      }
    } else {
      this.setState({ month_2: '' });
      this.onChangeTextValue('month_2', '');
    }
  };

  handle_year_1 = val => {
    const { year_2 } = this.state;
    let x = val;
    let concat = parseInt(x + year_2);
    if (x >= 1 && x <= 2) {
      this.setState({ year_1: val });
      this.onChangeTextValue('year_1', val);
      if (val.length == 1) {
        this.year2Input.focus();
      }
      if (concat >= 19 && concat <= 20) {
      } else {
        if (x != '') {
          this.setState({ year_2: '' });
          this.onChangeTextValue('year_2', '');
          this.year2Input.focus();
        }
      }
    } else {
      this.setState({ year_1: '' });
      this.onChangeTextValue('year_1', '');
    }
  };

  handle_year_2 = val => {
    const { year_1 } = this.state;
    let x = val;
    let concat = parseInt(year_1 + x);
    if (concat >= 19 && concat <= 20) {
      this.setState({ year_2: x });
      this.onChangeTextValue('year_2', x);
      if (val.length == 1) {
        this.year3Input.focus();
      }
    } else {
      this.setState({ year_2: '' });
      this.onChangeTextValue('year_2', '');
    }
  };

  handle_year_3 = val => {
    const { date_1, date_2, year_1, year_2, year_4, month_1, month_2 } = this.state;
    let current_year = moment(new Date()).format('YYYY');
    let x = val;
    let concate_date = parseInt(date_1 + date_2);
    let concate_year;
    let concate_month = parseInt(month_1 + month_2);
    let day_limit;
    if (x >= 0 && x <= 9) {
      concate_year = parseInt(year_1 + year_2 + x + year_4);
      if (concate_year <= current_year) {
        this.setState({ year_3: x });
        this.onChangeTextValue('year_3', x);
        if (val.length == 1) {
          this.year4Input.focus();
        }
        day_limit = new Date(concate_year, concate_month, 0).getDate();
        this.setState({ day_limit: day_limit });
        if (concate_date >= 0 && concate_date <= day_limit) {
        } else if (month_2 == '') {
          this.setState({ day_limit: 31 });
        } else if (month_1 == '') {
          this.setState({ day_limit: 31 });
        } else {
          if (x != '') {
            this.setState({ date_1: '', date_2: '' });
            this.onChangeTextValue('day_1', '');
            this.onChangeTextValue('day_2', '');
            this.day1Input.focus();
          }
        }
      } else {
        this.setState({ year_3: '' });
        this.onChangeTextValue('year_3', '');
      }
    } else {
      this.setState({ year_3: '' });
      this.onChangeTextValue('year_3', '');
    }
  };

  handle_year_4 = val => {
    const { date_1, date_2, year_1, year_2, year_3, month_1, month_2 } = this.state;
    let current_year = moment(new Date()).format('YYYY');
    let x = val;
    let concate_date = parseInt(date_1 + date_2);
    let concate_year;
    let concate_month = parseInt(month_1 + month_2);
    let day_limit;
    if (x >= 0 && x <= 9) {
      concate_year = parseInt(year_1 + year_2 + year_3 + x);
      if (concate_year <= current_year) {
        this.setState({ year_4: x });
        this.onChangeTextValue('year_4', x);
        if (val.length == 1) {
          Keyboard.dismiss();
        }
        day_limit = new Date(concate_year, concate_month, 0).getDate();
        this.setState({ day_limit: day_limit });
        if (concate_date >= 0 && concate_date <= day_limit) {
        } else if (month_2 == '') {
          this.setState({ day_limit: 31 });
        } else if (month_1 == '') {
          this.setState({ day_limit: 31 });
        } else {
          this.setState({ date_1: '', date_2: '' });
          this.onChangeTextValue('day_1', '');
          this.onChangeTextValue('day_2', '');
          this.day1Input.focus();
        }
      } else {
        this.setState({ year_4: '' });
        this.onChangeTextValue('year_4', '');
      }
    } else {
      this.setState({ year_4: '' });
      this.onChangeTextValue('year_4', '');
    }
  };

  render() {
    const {
      date_1,
      date_2,
      month_1,
      month_2,
      year_1,
      year_2,
      year_3,
      year_4,
      position,
    } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder={'D'}
            onChangeText={val => this.handle_date1(val)}
            placeholderTextColor={colors.DARK}
            maxLength={1}
            value={date_1}
            ref={input => { this.day1Input = input; }}
            style={styles.input}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                this.day1Input.focus();
                this.setState({ date_1: '' });
                this.setState({ position: 1 });
              }
            }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            placeholder={'D'}
            onChangeText={val => this.handle_date2(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (date_2 != '') {
                  if (position == 3) {
                    this.day1Input.focus();
                    this.setState({ date_1: '' });
                  } else {
                    this.day2Input.focus();
                    this.setState({ date_2: '' });
                  }
                  this.setState({ position: 2 });
                } else {
                  this.day1Input.focus();
                  this.setState({ position: 2, date_1: "" });
                }
              }
            }}
            maxLength={1}
            value={date_2}
            ref={input => { this.day2Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <TextInput
            placeholder={'/'}
            editable={false}
            placeholderTextColor={colors.DARK}
            style={[styles.input, styles.input_sparate]}
          />
          <TextInput
            placeholder={'M'}
            onChangeText={val => this.handle_month_1(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (month_1 != '') {
                  if (position == 4) {
                    this.day2Input.focus();
                    this.setState({ date_2: '' });
                  } else {
                    this.month1Input.focus();
                    this.setState({ month_1: '' });
                  }
                  this.setState({ position: 3 });
                } else {
                  this.day2Input.focus();
                  this.setState({ position: 3, date_2: '' });
                }
              }
            }}
            maxLength={1}
            value={month_1}
            ref={input => { this.month1Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            placeholder={'M'}
            onChangeText={val => this.handle_month_2(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (month_2 != '') {
                  if (position == 5) {
                    this.month1Input.focus();
                    this.setState({ month_1: '' });
                  } else {
                    this.month2Input.focus();
                    this.setState({ month_2: '' });
                  }
                  this.setState({ position: 4 });
                } else {
                  this.month1Input.focus();
                  this.setState({ position: 4, month_1: '' });
                }
              }
            }}
            maxLength={1}
            value={month_2}
            ref={input => { this.month2Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <TextInput
            placeholder={'/'}
            placeholderTextColor={colors.DARK}
            editable={false}
            style={[styles.input, styles.input_sparate]}
          />
          <TextInput
            placeholder={'Y'}
            onChangeText={val => this.handle_year_1(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (year_1 != '') {
                  if (position == 6) {
                    this.month2Input.focus();
                    this.setState({ month_2: '' });
                  } else {
                    this.year1Input.focus();
                    this.setState({ year_1: '' });
                  }
                  this.setState({ position: 5 });
                } else {
                  this.month2Input.focus();
                  this.setState({ position: 5, month_2: '' });
                }
              }
            }}
            maxLength={1}
            value={year_1}
            style={styles.input}
            ref={input => { this.year1Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            placeholder={'Y'}
            onChangeText={val => this.handle_year_2(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (year_2 != '') {
                  if (position == 7) {
                    this.year1Input.focus();
                    this.setState({ year_1: '' });
                  } else {
                    this.year2Input.focus();
                    this.setState({ year_2: '' });
                  }
                  this.setState({ position: 6 });
                } else {
                  this.year1Input.focus();
                  this.setState({ position: 6, year_1: '' });
                }
              }
            }}
            maxLength={1}
            value={year_2}
            style={styles.input}
            ref={input => { this.year2Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <TextInput
            placeholder={'Y'}
            onChangeText={val => this.handle_year_3(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (year_3 != '') {
                  if (position == 8) {
                    this.year2Input.focus();
                    this.setState({ year_2: '' });
                  } else {
                    this.year3Input.focus();
                    this.setState({ year_3: '' });
                  }
                  this.setState({ position: 7 });
                } else {
                  this.year2Input.focus();
                  this.setState({ position: 7, year_2: '' });
                }
              }
            }}
            maxLength={1}
            value={year_3}
            style={styles.input}
            ref={input => { this.year3Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            placeholder={'Y'}
            onChangeText={val => this.handle_year_4(val)}
            placeholderTextColor={colors.DARK}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Backspace') {
                if (year_4 != '') {
                  this.year4Input.focus();
                  this.setState({ position: 8, year_4: '' });
                } else {
                  this.year3Input.focus();
                  this.setState({ position: 8, year_3: '' });
                }
              }
            }}
            maxLength={1}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={year_4}
            style={styles.input}
            ref={input => { this.year4Input = input; }}
            blurOnSubmit={false}
            type={'numeric'}
            keyboardType={'numeric'}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {  
    textAlign: 'center',  
    fontSize: wp('5.4%'),
    fontFamily: fonts.VR,
    color: colors.DARK,
    padding: 0,
    margin: DEVICE_OS === 'ios' ? 0 : -wp('0.5%'),
    width: DEVICE_OS === 'ios' ? wp('4.55%') : wp('5%')
  },
  input_sparate: {
    marginLeft: DEVICE_OS === 'ios' ? wp('1%') : 0,
    marginRight: DEVICE_OS === 'ios' ? wp('1%') : 0,
    margin: 0,
  },
});