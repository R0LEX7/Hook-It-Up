
import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import MessageActionSheet from './MessageActionSheet';

registerSheet('message-options', MessageActionSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'message-options': SheetDefinition;
  }
}

export { };

