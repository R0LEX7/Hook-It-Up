import { FONT } from '@/constants/fonts.constant';
import { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
    ActionSheetRef,
    SheetManager,
} from 'react-native-actions-sheet';

type Props = {
  sheetId: string;
  payload: {
    onEdit: () => void;
    onDelete: () => void;
    onCopy: () => void;
  };
};

const options = [
  { label: 'Edit', key: 'edit', color: '#007AFF' },
  { label: 'Delete', key: 'delete', color: '#FF3B30' },
  { label: 'Copy', key: 'copy', color: '#4CD964' },
];

const MessageActionSheet = forwardRef<ActionSheetRef, Props>(
  ({ payload }, ref) => {
    const { onEdit, onDelete, onCopy } = payload;

    const handlers = {
      edit: onEdit,
      delete: onDelete,
      copy: onCopy,
    };

    return (
      <ActionSheet
        ref={ref}
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#E5E5E5',
        }}
      >
        <View
          style={{
            backgroundColor: '#E5E5E5',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
            paddingVertical: 15,
            marginBottom: 20,
          }}
        >
          {options.map((opt, idx) => (
            <Pressable
              key={opt.key}
              onPress={async () => {
                await SheetManager.hide('message-options');
                handlers[opt.key as keyof typeof handlers]();
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#2a2a2a' : '#1e1e1e',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderTopWidth: idx !== 0 ? 1 : 0,
                borderColor: '#333',
              })}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: opt.color,
                  textAlign: 'center',
                  fontFamily: FONT.medium,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ActionSheet>
    );
  },
);

MessageActionSheet.displayName = 'MessageActionSheet';

export default MessageActionSheet;
