import styled from 'styled-components';

export function Text({
  className,
  children,
  style,
  lineHeight = '1.5',
  color = '#ccc',
  fontSize = '16px'
}) {
  return (
    <StyledText
      className={className}
      style={style}
      _color={color}
      _fontSize={fontSize}
      _lineHeight={lineHeight}
    >
      {children}
    </StyledText>
  );
}

const StyledText = styled.span`
  color: ${({ _color }) => _color};
  font-size: ${({ _fontSize }) => _fontSize};
  line-height: ${({ _lineHeight }) => _lineHeight};
`;
