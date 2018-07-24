'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oppositeAxis = oppositeAxis;
var vertical = exports.vertical = {
  direction: 'vertical',
  line: 'y',
  crossAxisLine: 'x',
  start: 'top',
  end: 'bottom',
  size: 'height',
  crossAxisStart: 'left',
  crossAxisEnd: 'right',
  crossAxisSize: 'width'
};

var horizontal = exports.horizontal = {
  direction: 'horizontal',
  line: 'x',
  crossAxisLine: 'y',
  start: 'left',
  end: 'right',
  size: 'width',
  crossAxisStart: 'top',
  crossAxisEnd: 'bottom',
  crossAxisSize: 'height'
};

function oppositeAxis(axis) {
  if (axis.direction === 'horizontal') {
    return vertical;
  }
  return horizontal;
}