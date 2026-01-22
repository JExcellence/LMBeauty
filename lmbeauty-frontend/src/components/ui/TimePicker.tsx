'use client';

import { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import {
  Row,
  Column,
  Text,
  DropdownWrapper,
  Option
} from '@once-ui-system/core';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
  id: string;
  value: string; // Format: "HH:MM"
  onChange: (value: string) => void;
  label?: string;
  minHour?: number;
  maxHour?: number;
  minuteStep?: number;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export function TimePicker({
  id,
  value,
  onChange,
  label,
  minHour = 0,
  maxHour = 23,
  minuteStep = 15,
  disabled = false,
  error = false,
  errorMessage
}: TimePickerProps) {
  const [isHourOpen, setIsHourOpen] = useState(false);
  const [isMinuteOpen, setIsMinuteOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Parse current value
  const [currentHour, currentMinute] = useMemo(() => {
    const parts = value.split(':');
    return [
      parseInt(parts[0] || '9', 10),
      parseInt(parts[1] || '0', 10)
    ];
  }, [value]);

  const isFilled = value && value !== '';

  // Generate hour options
  const hourOptions = useMemo(() => {
    const options = [];
    for (let h = minHour; h <= maxHour; h++) {
      options.push({
        value: h.toString().padStart(2, '0'),
        label: h.toString().padStart(2, '0')
      });
    }
    return options;
  }, [minHour, maxHour]);

  // Generate minute options based on step
  const minuteOptions = useMemo(() => {
    const options = [];
    for (let m = 0; m < 60; m += minuteStep) {
      options.push({
        value: m.toString().padStart(2, '0'),
        label: m.toString().padStart(2, '0')
      });
    }
    return options;
  }, [minuteStep]);

  const handleHourChange = useCallback((hour: string) => {
    const newValue = `${hour}:${currentMinute.toString().padStart(2, '0')}`;
    onChange(newValue);
    setIsHourOpen(false);
  }, [currentMinute, onChange]);

  const handleMinuteChange = useCallback((minute: string) => {
    const newValue = `${currentHour.toString().padStart(2, '0')}:${minute}`;
    onChange(newValue);
    setIsMinuteOpen(false);
  }, [currentHour, onChange]);

  const formattedHour = currentHour.toString().padStart(2, '0');
  const formattedMinute = currentMinute.toString().padStart(2, '0');

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={styles.timePickerWrapper}>
      {label && (
        <Text className={styles.label}>
          {label}
        </Text>
      )}
      
      <div
        className={classNames(
          styles.timePicker,
          {
            [styles.focused]: isFocused || isHourOpen || isMinuteOpen,
            [styles.error]: error,
            [styles.disabled]: disabled,
          }
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {/* Hour Dropdown */}
        <DropdownWrapper
          isOpen={isHourOpen && !disabled}
          onOpenChange={setIsHourOpen}
          trigger={
            <button
              id={`${id}-hour`}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setIsHourOpen(!isHourOpen)}
              className={styles.timeButton}
            >
              {formattedHour}
            </button>
          }
          dropdown={
            <Column 
              padding="8" 
              gap="2" 
              background="surface" 
              radius="m" 
              border="neutral-alpha-weak"
              className={styles.dropdown}
            >
              {hourOptions.map((option) => (
                <Option
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  selected={option.value === formattedHour}
                  onClick={handleHourChange}
                />
              ))}
            </Column>
          }
        />

        <span className={styles.separator}>:</span>

        {/* Minute Dropdown */}
        <DropdownWrapper
          isOpen={isMinuteOpen && !disabled}
          onOpenChange={setIsMinuteOpen}
          trigger={
            <button
              id={`${id}-minute`}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setIsMinuteOpen(!isMinuteOpen)}
              className={styles.timeButton}
            >
              {formattedMinute}
            </button>
          }
          dropdown={
            <Column 
              padding="8" 
              gap="2" 
              background="surface" 
              radius="m" 
              border="neutral-alpha-weak"
              className={styles.dropdown}
            >
              {minuteOptions.map((option) => (
                <Option
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  selected={option.value === formattedMinute}
                  onClick={handleMinuteChange}
                />
              ))}
            </Column>
          }
        />

        <span className={styles.uhrLabel}>Uhr</span>
      </div>
      
      {error && errorMessage && (
        <Text className={styles.errorMessage}>
          {errorMessage}
        </Text>
      )}
    </div>
  );
}

export default TimePicker;
export type { TimePickerProps };
