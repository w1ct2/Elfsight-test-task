import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';

const BACKGROUND = '#263750';
const BACKGROUND_HOVER = '#334466';
const BORDER_COLOR = '#83BF46';
const TEXT_COLOR = '#f5f7fb';
const PLACEHOLDER_COLOR = '#b2bccd';
const MENU_BG = '#ffffff';
const OPTION_HOVER_BG = '#e3f1c9';
const OPTION_SELECTED_BG = '#f7f8fb';
const OPTION_TEXT_COLOR = '#1E1E1E';

const Root = styled.div`
  position: relative;
  width: 100%;
  max-width: 180px;
  font-family: inherit;
  font-size: 14px;

  @media (max-width: 530px) {
    max-width: 240px;
  }
`;

const Control = styled.button`
  width: 100%;
  min-height: 40px;
  padding: 0px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: ${TEXT_COLOR};
  background: ${BACKGROUND};
  border: 1px solid ${BORDER_COLOR};
  border-radius: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  text-align: left;
  font-weight: 500;

  &:hover,
  &:focus-visible {
    background: ${BACKGROUND_HOVER};
    outline: none;
  }

  &:focus-visible {
    border-color: rgba(131, 191, 70, 0.9);
    box-shadow: 0 0 0 3px rgba(131, 191, 70, 0.2);
  }
`;

const Value = styled.span`
  flex: 1;
  color: ${({ isPlaceholder }) =>
    isPlaceholder ? PLACEHOLDER_COLOR : TEXT_COLOR};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
`;

const ToggleIcon = styled(IconBox)`
  pointer-events: none;
`;

const ClearIconButton = styled(IconBox)`
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
  color: ${TEXT_COLOR};

  &:hover {
    background: rgba(131, 191, 70, 0.18);
    color: ${BORDER_COLOR};
  }
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  background: ${MENU_BG};
  border-radius: 12px;
  border: 1px solid #d8dce4;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.25);
  max-height: 220px;
  overflow-y: auto;
  z-index: 20;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f2f5;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cfd3dd;
    border-radius: 999px;
  }
`;

const OptionItem = styled.li`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
  color: ${OPTION_TEXT_COLOR};
  background: ${({ isSelected, isHighlighted }) =>
    isHighlighted
      ? OPTION_HOVER_BG
      : isSelected
      ? OPTION_SELECTED_BG
      : 'transparent'};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${OPTION_HOVER_BG};
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f2f5;
  }
`;

const ArrowIcon = ({ direction, ...props }) => {
  void direction;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3 5l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StyledArrowIcon = styled(ArrowIcon)`
  width: 14px;
  height: 14px;
  transform-origin: center;
  transform: ${({ direction }) =>
    direction === 'up' ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`;

const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    aria-hidden="true"
  >
    <path
      d="M4 4l6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10 4l-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const AppSelect = forwardRef(
  (
    {
      options = [],
      value,
      defaultValue,
      placeholder = 'Select',
      onChange,
      className,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const listId = useId();
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? ''
    );
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(null);

    const currentValue = isControlled ? value ?? '' : uncontrolledValue;

    const selectedOption = useMemo(() => {
      return options.find((option) => option.value === currentValue) ?? null;
    }, [options, currentValue]);

    const displayText = selectedOption ? selectedOption.label : placeholder;
    const isPlaceholder = !selectedOption;
    const hasValue = Boolean(selectedOption);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          containerRef.current.contains(event.target)
        ) {
          return;
        }
        setIsOpen(false);
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, []);

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const handleSelect = useCallback(
      (option, event) => {
        event.stopPropagation();
        if (!isControlled) {
          setUncontrolledValue(option.value);
        }

        onChange?.(option);

        setIsOpen(false);
        setHighlightedIndex(null);
      },
      [isControlled, onChange]
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setUncontrolledValue('');
      }

      onChange?.(null);

      setIsOpen(false);
    }, [isControlled, onChange]);

    const handleClearClick = useCallback(
      (event) => {
        event.stopPropagation();
        handleClear();
      },
      [handleClear]
    );

    const handleOptionMouseEnter = useCallback((event) => {
      const optionIndex = Number(event.currentTarget.dataset.index);

      setHighlightedIndex(Number.isNaN(optionIndex) ? null : optionIndex);
    }, []);

    const handleOptionMouseLeave = useCallback(() => {
      setHighlightedIndex(null);
    }, []);

    const handleOptionClick = useCallback(
      (event) => {
        const optionIndex = Number(event.currentTarget.dataset.index);
        const option = options[optionIndex];

        if (!option) {
          return;
        }

        handleSelect(option, event);
      },
      [handleSelect, options]
    );

    const handleKeyDown = useCallback((event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);

        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }, []);

    return (
      <Root ref={ref} className={className} {...rest}>
        <Control
          ref={containerRef}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listId}
        >
          <Value isPlaceholder={isPlaceholder}>{displayText}</Value>
          {isOpen ? (
            <ToggleIcon>
              <StyledArrowIcon direction="up" />
            </ToggleIcon>
          ) : hasValue ? (
            <ClearIconButton
              role="button"
              aria-label="Очистить выбор"
              onClick={handleClearClick}
            >
              <CrossIcon />
            </ClearIconButton>
          ) : (
            <ToggleIcon>
              <StyledArrowIcon direction="down" />
            </ToggleIcon>
          )}
        </Control>

        {isOpen && options.length > 0 && (
          <Menu id={listId} role="listbox">
            {options.map((option, optionIndex) => {
              const isSelected = selectedOption?.value === option.value;

              return (
                <OptionItem
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  isSelected={isSelected}
                  isHighlighted={highlightedIndex === optionIndex}
                  data-index={optionIndex}
                  onMouseEnter={handleOptionMouseEnter}
                  onMouseLeave={handleOptionMouseLeave}
                  onClick={handleOptionClick}
                >
                  {option.label}
                </OptionItem>
              );
            })}
          </Menu>
        )}
      </Root>
    );
  }
);
