import React from 'react';
import {Text} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';
import {  ActionsheetIcon, ActionsheetItem, ActionsheetItemText, Button, ButtonGroup, ButtonText, Center, Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel, CloseIcon, Heading, HStack, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, useToken } from '@gluestack-ui/themed';
import { LanguageContext } from '../../../context/initialContext';
import { freezeHold, freezeHolds } from '../../../util/accountActions';
import { getTermFromDictionary } from '../../../translations/TranslationService';

export const SelectThawDate = (props) => {
     const { freezingLabel, freezeLabel, label, libraryContext, onClose, freezeId, recordId, source, userId, resetGroup, showActionsheet, textColor, colorMode } = props;
     let data = props.data;
     const { language } = React.useContext(LanguageContext);
     const [loading, setLoading] = React.useState(false);

     let actionLabel = freezeLabel;
     if (label) {
          actionLabel = label;
     }

     const today = new Date();
     const [date, setDate] = React.useState(today);

     const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
     const [showIndefiniteWarning, setShowIndefiniteWarning] = React.useState(false);
     const [freezeIndefinite, setFreezeIndefinite] = React.useState(false);

     const showDatePicker = () => {
          if(libraryContext.reactivateDateNotRequired ?? false)
          {
               setShowIndefiniteWarning(true);
          }
          else
          {
               //setShowIndefiniteWarning(true);
               setDatePickerVisibility(true);
          }
          
     };

     const hideDatePicker = () => {
          setDatePickerVisibility(false);
          setShowIndefiniteWarning(false);
     };

     const onSelectDate = (date) => {
          hideDatePicker();
          setLoading(true);
          console.warn('A date has been picked: ', date);
          setDate(date);
          onClose();
          if (data) {
               freezeHolds(data, libraryContext.baseUrl, date, language, libraryContext.reactivateDateNotRequired ?? false).then((result) => {
                    setLoading(false);
                    resetGroup();
                    hideDatePicker();
               });
          } else {
               freezeHold(freezeId, recordId, source, libraryContext.baseUrl, userId, date, language, libraryContext.reactivateDateNotRequired ?? false).then((result) => {
                    setLoading(false);
                    resetGroup();
                    hideDatePicker();
               });
          }
     };

     return (
          <>
               <ActionsheetItem onPress={showDatePicker}>
                    {data ? null : <ActionsheetIcon>
                         <Icon as={MaterialIcons} name="pause" mr="$1" size="md"  color={textColor}/>
                    </ActionsheetIcon> }
                    <ActionsheetItemText color={textColor}>{actionLabel}</ActionsheetItemText>
               </ActionsheetItem>
               <Modal isOpen={showIndefiniteWarning} onClose={hideDatePicker}>
                    <ModalBackdrop/>
                    <ModalContent maxWidth="90%" bg="white" _dark={{ bg: 'coolGray.800' }}>
                         <ModalHeader>
                              <Heading size="md">{actionLabel}</Heading>
                              <ModalCloseButton hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                                   <Icon as={CloseIcon} color={textColor} />
                              </ModalCloseButton>
                         </ModalHeader>
                         <ModalBody>
                              <Text>{getTermFromDictionary("en", "freeze_indefinite_warning")}</Text>
                              <Checkbox onChange={(value) => setFreezeIndefinite(value)} defaultIsChecked={freezeIndefinite}>
                                   <CheckboxIndicator>
                                        <CheckboxIcon/>
                                   </CheckboxIndicator>
                                   <CheckboxLabel>{getTermFromDictionary("en", "freeze_indefinite_checkbox")}</CheckboxLabel>
                              </Checkbox>
                         </ModalBody>
                         <ModalFooter>
                         <ButtonGroup space={2} size="md">
                              <HStack >
                              <Button style={{margin:5}} onPress={hideDatePicker}>
                                   <ButtonText>{getTermFromDictionary("en", "cancel")}</ButtonText>
                              </Button>
                              <Button style={{margin:5}} onPress={() => {
                                   if(freezeIndefinite)
                                   {
                                        onSelectDate();
                                   } else 
                                   {
                                        setDatePickerVisibility(true);
                                   }
                              }}>
                                   <ButtonText>{freezeIndefinite ? getTermFromDictionary("en", "freeze_hold_without_reactivation"): getTermFromDictionary("en", "freeze_hold_choose_reactivation")}</ButtonText>
                              </Button>
                              </HStack>
                         </ButtonGroup>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
               <DateTimePickerModal isVisible={isDatePickerVisible} date={date} mode="date" onConfirm={onSelectDate} onCancel={hideDatePicker} isDarkModeEnabled={colorMode} minimumDate={today} textColor={textColor} confirmTextIOS={loading ? freezingLabel : actionLabel} />
          </>
     );
};