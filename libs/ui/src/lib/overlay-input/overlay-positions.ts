import { ConnectionPositionPair } from '@angular/cdk/overlay';

export enum ConnectionPosition {
  Top = 'Top',
  TopRight = 'TopRight',
  BottomLeft = 'BottomLeft',
  Bottom = 'Bottom',
  BottomRight = 'BottomRight',
  Right = 'Right',
  Left = 'Left',
  TopLeft = 'TopLeft',
}

export type ConnectionPositions = {
  [key in ConnectionPosition]: ConnectionPositionPair;
};

// tslint:disable-next-line:variable-name
export const ConnectionPositions: ConnectionPositions = {
  Top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
  },
  TopRight: {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
  },
  Right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
  },
  BottomRight: {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  },
  Bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  BottomLeft: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  Left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
  },
  TopLeft: {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: 3
  },
};
