'use strict';


class Robot {

  constructor(config, table, messenger) {

    this._config = config;
    this._table = table;
    this._messenger = messenger;
    this._isFirstStepMade = false;
    this._currentPosition = {
      x: undefined,
      y: undefined,
      f: undefined
    };
  }

  place(x, y, f) {

    let arg = {};

    try {
      arg = this._validateInput(x, y, f);
    } catch (e) {
      return e;
    }

    if (this._isOutOfTable(arg.x, arg.y)) {
      return new Error(this._messenger.getMessage({
        msg: 'wrongPlace'
      }));
    }

    this._setPosition(arg.x, arg.y, arg.f);

    if (!this._isFirstStepMade)
      this._isFirstStepMade = true;

    return this;
  }

  move() {
    let x, y, f;

    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }

    x = this._currentPosition.x;
    y = this._currentPosition.y;
    f = this._currentPosition.f;

    switch (f) {
      case 0: //NORTH
        ++y;
        break;
      case 1: //NORTHEAST
	++x;
	++y;
	break; 
      case 2: //EAST 
        ++x;
        break;
      case 3: //SOUTHEAST
	++x;
	--y;
	break;
      case 4: //SOUTH 
        --y;
        break;
      case 5: //SOUTHWEST
	--x;
	--y;
	break;
      case 6: //WEST 
        --x;
        break;
      case 7: //NORTHWEST
	--x;
	++y;
	break;
         }

    if (this._isOutOfTable(x, y)) {
      return new Error(this._messenger.getMessage({
        msg: 'wrongMove'
      }));
    }

    this._setPosition(x, y, this._config.directions[f]);

    return this;
  }

  right() {
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }
	//console.log("F is::"+this._currentPosition.f);
    if( this._currentPosition.f==0 || this._currentPosition.f==2 || this._currentPosition.f==4 || this._currentPosition.f==6)
    {

    this._currentPosition.f =
      (this._currentPosition.f + 2) > 6 ?
        0 : this._currentPosition.f + 2;
	//console.log("F after right is::"+this._currentPosition.f);
    return this;
	
    }
    else if( this._currentPosition.f==1 || this._currentPosition.f==3 || this._currentPosition.f==5 || this._currentPosition.f==7)
    {
    this._currentPosition.f =
      (this._currentPosition.f + 1) > 6 ?
        1 : this._currentPosition.f + 2;
	//console.log("F after right is::"+this._currentPosition.f);
    return this;
    }
  }
  hright() {
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }
	//console.log("F is::"+this._currentPosition.f);
    if( this._currentPosition.f==0 || this._currentPosition.f==2 || this._currentPosition.f==4 || this._currentPosition.f==6)
    {

    this._currentPosition.f =
      (this._currentPosition.f + 1) > 7 ?
        0 : this._currentPosition.f + 1;
	//console.log("F after right is::"+this._currentPosition.f);
    return this;
	
    }
    else if( this._currentPosition.f==1 || this._currentPosition.f==3 || this._currentPosition.f==5 || this._currentPosition.f==7)
    {
    this._currentPosition.f =
      (this._currentPosition.f + 1) > 6 ?
        0 : this._currentPosition.f + 1;
	//console.log("F after right is::"+this._currentPosition.f);
    return this;
    }
  }
  left() {
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }
	//console.log("F is::"+this._currentPosition.f);
    if( this._currentPosition.f==0 || this._currentPosition.f==2 || this._currentPosition.f==4 || this._currentPosition.f==6)
    {
    this._currentPosition.f =
      (this._currentPosition.f - 2) < 0 ?
        6 : this._currentPosition.f - 2;
	//console.log("F after left is::"+this._currentPosition.f);
    return this;
    }
    else if( this._currentPosition.f==1 || this._currentPosition.f==3 || this._currentPosition.f==5 || this._currentPosition.f==7)
    {
    this._currentPosition.f =
      (this._currentPosition.f - 2) < 0 ?
        7 : this._currentPosition.f - 2;
	//console.log("F after left is::"+this._currentPosition.f);
    return this;
    }
  }
  hleft() {
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }
	//console.log("F is::"+this._currentPosition.f);
    if( this._currentPosition.f==0 || this._currentPosition.f==2 || this._currentPosition.f==4 || this._currentPosition.f==6)
    {
    this._currentPosition.f =
      (this._currentPosition.f - 1) < 0 ?
        7 : this._currentPosition.f - 1;
	//console.log("F after left is::"+this._currentPosition.f);
    return this;
    }
    else if( this._currentPosition.f==1 || this._currentPosition.f==3 || this._currentPosition.f==5 || this._currentPosition.f==7)
    {
    this._currentPosition.f =
      (this._currentPosition.f - 1) < 0 ?
        7 : this._currentPosition.f - 1;
	//console.log("F after left is::"+this._currentPosition.f);
    return this;
    }
  }

  report() {
    let position = this._getPosition();

    if (position.x === undefined &&
      position.y === undefined &&
      position.f === undefined) {
      return this._messenger.getMessage({
        msg: 'placeMeFirst'
      });
    } else {
      return this._messenger.getMessage({
        msg: 'position',
        x: position.x,
        y: position.y,
        f: position.f
      });
    }
  }

  _validateInput(x, y, f) {

    if (!f) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'noFace'
      }));
    }

    if (typeof f !== 'string') {
      throw new TypeError(this._messenger.getMessage({
        msg: 'faceNotString'
      }));
    }

    let _f = f.toUpperCase(),
      _x = parseInt(x),
      _y = parseInt(y);

    if (!Number.isInteger(_x) || !Number.isInteger(_y)) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'nonIntCoordinates'
      }));
    }

    if (_x < 0 || _y < 0) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'noNegativeCoordinates'
      }));
    }

    if (!this._isDirectionValid(_f)) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'wrongDirection'
      }));
    }

    return {
      x: _x,
      y: _y,
      f: _f
    };
  }

  _isDirectionValid(sFace) {
    return this._config.directions.indexOf(sFace) !== -1;
  }

  _setPosition(x, y, f) {
    this._currentPosition.x = x;
    this._currentPosition.y = y;
    this._currentPosition.f = this._config
      .directions.indexOf(f);
  }

  _isOutOfTable(x, y) {
    return this._table.isOutOfTable(x, y);
  }

  _getPosition() {
    return {
      x: this._currentPosition.x,
      y: this._currentPosition.y,
      f: this._config.directions[this._currentPosition.f]
    }
  }

  _getIsFirstStepMade() {
    return this._isFirstStepMade;
  }

  getMessenger() {
    return this._messenger;
  }
}

module.exports = Robot;