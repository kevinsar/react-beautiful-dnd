import _Object$keys from 'babel-runtime/core-js/object/keys';

import invariant from 'tiny-invariant';
import 'css-box-model';
import { closest } from '../position';
import isWithin from '../is-within';
import { getCorners } from '../spacing';
import isPartiallyVisibleThroughFrame from '../visibility/is-partially-visible-through-frame';


var getSafeClipped = function getSafeClipped(droppable) {
  var rect = droppable.viewport.clippedPageMarginBox;

  invariant(rect, 'Cannot get clipped area from droppable');

  return rect;
};

export default (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      source = _ref.source,
      droppables = _ref.droppables,
      viewport = _ref.viewport,
      customAxis = _ref.customAxis;

  var sourceClipped = source.viewport.clippedPageMarginBox;

  if (!sourceClipped) {
    return null;
  }

  var axis = customAxis || source.axis;
  var isBetweenSourceClipped = isWithin(sourceClipped[axis.start], sourceClipped[axis.end]);
  var candidates = _Object$keys(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    return droppable !== source;
  }).filter(function (droppable) {
    return droppable.isEnabled;
  }).filter(function (droppable) {
    var clippedPageMarginBox = droppable.viewport.clippedPageMarginBox;

    if (!clippedPageMarginBox) {
      return false;
    }

    return isPartiallyVisibleThroughFrame(viewport.subject)(clippedPageMarginBox);
  }).filter(function (droppable) {
    var targetClipped = getSafeClipped(droppable);

    if (isMovingForward) {
      return sourceClipped[axis.crossAxisEnd] <= targetClipped[axis.crossAxisStart];
    }

    return targetClipped[axis.crossAxisEnd] <= sourceClipped[axis.crossAxisStart];
  }).filter(function (droppable) {
    var targetClipped = getSafeClipped(droppable);

    var isBetweenDestinationClipped = isWithin(targetClipped[axis.start], targetClipped[axis.end]);

    return isBetweenSourceClipped(targetClipped[axis.start]) || isBetweenSourceClipped(targetClipped[axis.end]) || isBetweenDestinationClipped(sourceClipped[axis.start]) || isBetweenDestinationClipped(sourceClipped[axis.end]);
  }).sort(function (a, b) {
    var first = getSafeClipped(a)[axis.crossAxisStart];
    var second = getSafeClipped(b)[axis.crossAxisStart];

    if (isMovingForward) {
      return first - second;
    }
    return second - first;
  }).filter(function (droppable, index, array) {
    return getSafeClipped(droppable)[axis.crossAxisStart] === getSafeClipped(array[0])[axis.crossAxisStart];
  });

  if (!candidates.length) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  var contains = candidates.filter(function (droppable) {
    var isWithinDroppable = isWithin(getSafeClipped(droppable)[axis.start], getSafeClipped(droppable)[axis.end]);
    return isWithinDroppable(pageBorderBoxCenter[axis.line]);
  });

  if (contains.length === 1) {
    return contains[0];
  }

  if (contains.length > 1) {
    return contains.sort(function (a, b) {
      return getSafeClipped(a)[axis.start] - getSafeClipped(b)[axis.start];
    })[0];
  }

  return candidates.sort(function (a, b) {
    var first = closest(pageBorderBoxCenter, getCorners(getSafeClipped(a)));
    var second = closest(pageBorderBoxCenter, getCorners(getSafeClipped(b)));

    if (first !== second) {
      return first - second;
    }

    return getSafeClipped(a)[axis.start] - getSafeClipped(b)[axis.start];
  })[0];
});