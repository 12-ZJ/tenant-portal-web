import { StylesConfig } from 'react-select';

type OptionType = {
  value: string;
  label: string;
};

const selectStyle = <IsMulti extends boolean>(): StylesConfig<OptionType, IsMulti> => ({
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '4px',
    svg: {
      width: '13px',
      height: '13px',
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: '4px',
    svg: {
      width: '13px',
      height: '13px',
    },
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingTop: '4px',
    paddingBottom: '4px',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
});

export const singleSelectStyle = (hasError: boolean): StylesConfig<OptionType, false> => ({
  control: (provided) => ({
    ...provided,
    minHeight: '38px',
    maxHeight: '38px',
    borderRadius: '0.375rem',
    borderColor: hasError ? '#DD2626' : '#D9D9D9',
    boxShadow: 'none',
    '&:hover': {
      borderColor: hasError ? '#DD2626' : '#D9D9D9',
    },
    fontSize: '13px',
    fontWeight: '400',
    paddingLeft: '0.2rem',
    paddingRight: '0.2rem',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0rem 0.5rem',
    fontSize: '13px',
  }),
  input: (provided) => ({
    ...provided,
    fontSize: '13px',
    margin: '0px',
    padding: '0px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#878787',
    fontSize: '13px',
    margin: '0px',
    padding: '0px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '0px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 100,
    lineHeight: '1',
  }),
  option: (provided, state) => {
    let backgroundColor = "white";
    if (state.isSelected) {
      backgroundColor = "#455f7d";
    } else if (state.isFocused) {
      backgroundColor = "#f0f4f9";
    }
    return {
      ...provided,
      fontWeight: "400",
      backgroundColor,
      color: state.isSelected ? "white" : "#262626",
      "&:active": {
        backgroundColor: "#d5dee8",
        color: "#455f7d",
      },
    };
  },
  singleValue: (provided) => ({
    ...provided,
    fontSize: '13px',
    color: "#262626",
  }),
  ...selectStyle<false>()
});